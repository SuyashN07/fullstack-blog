const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect('mongodb+srv://suyashgnaman07:DmfbzOi6Nf5bcyZz@blog-api.uwhkmaj.mongodb.net/blog-api?retryWrites=true&w=majority&appName=Blog-API'
    ,{ useNewUrlParser:true, useUnifiedTopology: true})
    .then( async() => {
        const result = await Post.deleteMany({
            $or: [
                { author: { $type: 'string'}},
                { author: { $exists: false}},
                { author: null}

            ]
        });
        console.log(`Deleted ${result.deletedCount} post with invalid (string) authors`);
        mongoose.disconnect();
    })
    .catch (err => console.log(err));
