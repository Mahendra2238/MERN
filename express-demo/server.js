const express = require("express");
const app = express();
const PORT = 5001;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello, Express is working!");
});

app.get("/about", (req, res) => {
    res.json({message: "This is Express.js backend."});
});

// start server
app.listen(PORT, () => {
    console.log(`Server running on http://locolhost:${PORT}`);
});
