const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/auth');

router.post('/:postId', authMiddleware, async(req,res) => {
    try{
        const {text} = req.body;
        const comment = new Comment({
            post:req.params.postId,
            user:req.user.userId,
            text
        });

        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    }catch(err){
        res.status(500).json({message:"Error saving comment",error:err.message});
    }
});

router.get('/:postId',async(req,res) => {
    try{
        const comments = await Comment.find({post:req.params.postId}).populate('user','username');
        res.status(200).json(comments);
    } catch(err){
        res.status(500).json({message:"Error fetching comments",error:err.message});
    }
});

module.exports = router;