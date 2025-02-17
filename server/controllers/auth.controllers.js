import { generateToken } from "../lib/utils.js";
import { User } from "../models/auth.model.js";
import bcrypt from 'bcrypt';


export const register = async (req,res) => {
    try {
        const {username, email, password} = req.body;
        if(!username) return res.status(401).json({message: 'Username is required'})
        if(!email) return res.status(401).json({message: 'Email is required'})
        if(!password) return res.status(401).json({message: 'Password is required'})
        const regExp = /^\w+@\w{4,}.\w{2,}/gi;
        if(!regExp.test(email)) return res.status(401).json({message: 'Invalid email'})
        if(password.length < 6) return res.status(401).json({message: 'Password must be at least 6 characters'})
        const user = await User.findOne({email});
        if(user) return res.status(401).json({message: 'Email already exists'})
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, email, password: hashedPassword});
        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json(
                {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                    appointments: newUser.appointments,
                    scanResults: newUser.scanResults
                }
            )
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const login = async (req, res) => {
    try {
        const {email, password}= req.body;
        if(!email) return res.status(401).json({message: 'Email is required'})
        if(!password) return res.status(401).json({message: 'Password is required'})
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message: 'Invalid credentials'})
        const match = await bcrypt.compare(password,user.password);
        if(match){
            generateToken(user._id,res);
            res.status(200).json(
                {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    appointments: user.appointments,
                    scanResults: user.scanResults
                }
            )
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const bookAppointment = async (req,res) => {
    try {
        const {date, description} = req.body;
        if(!date) return res.status(401).json({message: 'Date is required'})
        if(!description) return res.status(401).json({message: 'Description is required'})
        const user = await User.findById(req.user._id);
        if(user) {
            user.appointments.push({date, description});
            await user.save();
            res.status(201).json(user.appointments)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const getScanResults = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        if(user) {
            res.status(200).json(user.scanResults)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const addScanResults = async (req,res) => {
    try {
        const {date, result, aiAnalysis} = req.body;
        if(!date) return res.status(401).json({message: 'Date is required'})
        if(!result) return res.status(401).json({message: 'Result is required'})
        if(!aiAnalysis) return res.status(401).json({message: 'AI Analysis is required'})
        const user = await User.findByIdAndUpdate(req.user._id, {
            $push: {scanResults: {date, result, aiAnalysis}}
        }, {new: true});
        if(user) {
            res.status(201).json(user.scanResults)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0,
        });
        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const check = (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}