const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, '/uploads');
    },
    filename: function(req,file,cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if(ext === '.jpg' || ext === '.jpeg' || ext === '.png'){
        cb(null,true);
    } else {
        cb(new Error('Only .jpg, .png, .jpeg files allowed'),false);
    }
};

const upload = multer({
    storage:storage,
    fileFilter:fileFilter
});

module.exports = upload;