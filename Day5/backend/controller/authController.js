import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" }); 
    } catch (err) {
        console.error("Registration Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login attempt for username:", username);
        const user = await User.findOne({ username, password });
        console.log("User found:", user);
        if (!user) {
            return res.status(401).json({
                success: false,
                 message: "Invalid credentials" 
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "SECRET_KEY",
            { expiresIn: "1h" }
        );

        //const token = process.env.JWT_SECRET || "dummy-token";
        res.status(200).json({ message: "Login successful", token, success: true ,user: user});
    } catch (err) {
        console.error("Login Error", err);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        });
    }  
};  
