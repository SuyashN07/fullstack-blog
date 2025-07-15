const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const upload = require('../middlewares/upload');
const {body, validationResult} = require('express-validator');

//Post
router.post('/', authMiddleware, 
    upload.single('image'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('content').notEmpty().withMessage('Content is required'),
        //body('author').notEmpty().withMessage('Author is required')
    ],
    async(req,res) => {
    try{
        const error = validationResult(req);

        if(!error.isEmpty()) {
            return res.status(400).json({message:"Validation failed",errors: error.array()});
        }

        const {title,content} = req.body;
        const author = req.user.userId;

        const imagePath = req.file? `/uploads/${req.file.filename}` : null;
        
        const newPost = new Post({title,content,author,image:imagePath});
        const savedPost = await newPost.save();

        res.status(201).json(savedPost);
    } catch(err) {
        res.status(500).json({message: 'Error saving post',error: err.message});
    }
});


//Read
router.get('/',  async(req,res) => {
    try{
        const { author,page = 1,limit = 10,search,sort = "new" } = req.query;

        let sortCriteria;
        if (sort === 'popular') {
            sortCriteria = {views: -1};
        } else if (sort === 'trending') {
            sortCriteria = {updatedAt: -1};
        } else {
            sortCriteria = {createdAt: -1};
        }

        const filter = {};
        if(author) {
            filter.author = author;
        }

        if(search) {
            filter.$or = [
                {title:{$regex: search, $options: 'i'}},
                {content:{$regex: search, $options: 'i'}}
            ];
        }

        const posts = await Post.find(filter)
            .populate('author','username')
            .sort(sortCriteria)
            .skip((page-1) * limit)
            .limit(parseInt(limit));
        const total = await Post.countDocuments(filter);

        res.status(200).json({
            totalPosts: total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total/limit),
            posts
        });

    } catch(err){
        res.status(500).json({message:"Error fetching posts", error: err.message});
    }
}); 



//Read by id
router.get('/:id', async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        .populate('author','username')
        .populate('likes','username');

        if(!post) {
            return res.status(404).json({message:"Post not found"});
        }

        res.json(post);
    } catch(err) {
        res.status(500).json({message:"Error showing post:", error:err.message});
    }
});

//Update
router.put('/:id', authMiddleware, 
    [
        body('title').optional().notEmpty().withMessage('Title cannot be Empty'),
        body('content').optional().notEmpty().withMessage('Content cannot be Empty')
    ],
    async(req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message:'Validation failed',error: errors.array()});
        }

        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({message:"Post not found"});
        }

        if(post.author.toString() !== req.user.userId){
            return res.status(403).json({message:"Unauthorised user"});
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        res.json(updatedPost);
    } catch(err) {
        res.status(500).json({message: "Error updating post ",error:err.message});
    }
});



//Delete
router.delete('/:id', authMiddleware, /*checkRole('admin'),*/ async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message:"Post not found"});
        
        if(post.author.toString() !== req.user.userId) return res.status(403).json({message:"Unauthorised user"});

        await Post.findByIdAndDelete(req.params.id);

        res.json({message:'Post deleted successfully'});

    } catch(err){
        console.error("Delete error: ",err);
        res.status(500).json({message: "Error deleting post",error:err.message});
    }
});

//Increment View count
router.patch('/:id/view', async(req,res) => {
    try{
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { views:1 } },
            { new:true }
        );
        if(!post) {
            return res.status(404).json({message:"Post not found"});
        }
        res.json(post);
    } catch(err) {
        res.status(500).json({message:"Error incrementing views",error:err.message});
    }
});

//Increment likes
router.patch('/:id/like', authMiddleware,async(req,res) => {
    try {

        const post  = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message:"Post not found."});

        const userId = req.user.userId;
        const index = post.likes.findIndex(id => id.toString() === userId); 

        if(index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index,1);
        }

        post.markModified('likes');
        const updatedPost = await post.save();

        res.json(updatedPost);
    } catch(err) {
        console.log("Like toggling error: ",err);
        res.status(500).json({message:"Error updating likes ",error:err.message});
    }
});

module.exports = router;    