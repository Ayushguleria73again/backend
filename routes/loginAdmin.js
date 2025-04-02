const express = require("express");
const bcrypt = require("bcryptjs");
const app = express.Router();
const User = require("../schema/login");
const jwt = require("jsonwebtoken")

app.use(express.json());

app.post('/user', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields",
        });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email or username already exists. Please use a different one.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                username: savedUser.username,
                email: savedUser.email,
            },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message,
        });
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide both email and password.",
        });
    }
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.TOKEN,
            { expiresIn: "1h" }
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }
        res.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login.",
            error: error.message,
        });
    }
});
module.exports = app;
