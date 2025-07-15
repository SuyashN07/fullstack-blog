const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth');
const {body, validationResult} = require('express-validator');

router.post('/register', 
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').notEmpty().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password must be atleast 6 characters')
    ],    
    async(req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({message:"Validation failed",errors: error.array()});
        }

        const {username,email,password} = req.body;

        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({message:"User already exists with this email."});
        }

        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({message:"User already exists with this username."});
        }

        const hashedpass = await bcrypt.hash(password,10);

        const newUser = new User({
            username,email,
            password: hashedpass
        });

        const savedUser = await newUser.save();
        res.status(201).json({message:"User created", userId:savedUser._id});
    } catch(err){
            res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});


router.post('/login', async(req,res) => {
    try{
        const {email,password} = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"No details found."});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Incorrect password"});
        }

        const userId = user._id;
        const token = jwt.sign(
            {userId:userId},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );

        res.json({message:"Loginned successfully", token});
    } catch(err){
        res.json({message:"Error logging in"});
    }

});


router.get('/profile', authMiddleware, async(req,res) => {
    try{
        const user = await User.findById(req.user.userId).select('-password');
        //const posts = await Post.find({});
        const posts = await Post.find({author: req.user.userId});
        
        res.status(200).json({user,posts});
    }catch(err){
        console.error("profile error: ",err);
        res.status(500).json({message:"Error fetching profile",error:err.message});
    }
});

router.get('/', async(req,res) => {
    try {
        const authorIds = await Post.distinct('author');

        const users = await User.find({ _id:{ $in: authorIds }},'username _id');
        res.json(users);
    } catch (err) {
        res.status(500).json({message:"Error fetching posts ",error:err.message});
    }
});

router.get('/:id', async(req,res) => {
    try{
        const user = await User.findById(req.params.id).select('username email bio');
        
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const posts = await Post.find({author: req.params.id}).sort({createdAt: -1});

        res.status(200).json({
            user,
            posts
        })
    } catch(err) {
        res.status(500).json({message: 'Error fetching profile', error: err.message});
    }
});


module.exports = router;
