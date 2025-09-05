const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const User = require('./models/user'); 
const app = express();

app.use(express.json());
app.use(cors());

// Fix mongoose connection
mongoose.connect(process.env.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Express and mongodb is Working ");
});

//  Test route
app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // fetch all users
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Create user route
app.post("/users", async (req, res) => {
    try {
        const user = new User(req.body); // create user
        await user.save(); // save to DB
        res.status(201).json(user); // return created user
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
