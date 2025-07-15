const express = require('express')
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000

app.use(cors());

app.use(express.json());

const postRoutes = require('./routes/posts');
app.use('/api/posts',postRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users',userRoutes);

const commentRoutes = require('./routes/comments');
app.use('/api/comments',commentRoutes);

app.use('/uploads',express.static('uploads'));

app.get('/',(req,res) => {
    res.send('App is running...');
});

app.use(errorHandler);

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});