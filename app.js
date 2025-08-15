const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = 7000;

app.use(express.json());

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydatabaseGrazac");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};


const userSchema =  new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  disbursedAmount: Number,   
  reasonForLoan: String,
  loanStatus: Boolean,
  loanAmount: Number,
  guarantorName: String,
}, {
  timestamps: true,
  versionKey: false
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post('/apply', async (req, res) => {
  const {name, email, address, reasonForLoan, loanAmount, guarantorName} = req.body;
  if(!name || !email || !address || !reasonForLoan || !loanAmount || !guarantorName){
    return res.status(400).json({message: "All fields are required"})
  } 
try{
 const newUser = new User({
  name,
  email,
  address,
  reasonForLoan,
  loanAmount,
  guarantorName,
 })
 await newUser.save();
 return res.status(201).json({message: "You have successfully Applied For The Loan"})
}catch (error){
  console.log(error)
  return res.status(500).json({message: 'Failed To Apply For Loan'})
}
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve users' });
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve user' });
  }
});

app.get('/search', async (req, res) => {
  const { name } = req.query;
  try {
    const users = await User.find({ name: name });
    console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to search users' });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, address, disbursedAmount, reasonForLoan, loanStatus, loanAmount, guarantorName } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, {
      name,
      email,
      address,
      disbursedAmount,
      reasonForLoan,
      loanStatus,
      loanAmount,
      guarantorName
    }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
});

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const loanStatus = true;
  try {
    const user = await User.findByIdAndUpdate(id, { loanStatus }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User Loan approved successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update user' });
  }
});

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});

// Asynchronous And Synchronous Functions
// What are Asynchronous Functions?
// Asynchronous functions are functions that allow the program to continue executing other code while waiting for a task to complete. They are non-blocking, meaning they do not stop the execution of the program while waiting for a response or result. This is particularly useful in scenarios like network requests, file I/O, or database operations where waiting for a response can take time.
// Asynchronous functions can be implemented using callbacks, promises, or async/await syntax in JavaScript. They help improve the performance and responsiveness of applications by allowing other tasks to run while waiting for long-running operations to complete.
