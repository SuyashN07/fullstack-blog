const mongoose = require('mongoose');
const User = require('./User');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: 'Anonymous',
        required: true
    },
    image: {
        type: String,
        default: null
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps: true});

module.exports = mongoose.model('Post', postSchema);