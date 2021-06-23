const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const PRIVATE = require('./private');
const app = express();
const MONGODB_URI = PRIVATE.dbURL;
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') 
        {
        cb(null, true);
    } else {
        cb(null, false)
    }
};
app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//lockdown to specific domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');// '*'
    // if ('OPTIONS' == req.method) {
    //     res.sendStatus(200);
    //     } else {
    //       next();
    //     }
    next();
});
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data =error.data;
    res.status(status).json({ message: message, data: data })
});
mongoose.connect(MONGODB_URI)
    .then(result => {
        const server = app.listen(8080);
        const io = require('socket.io')(server);
        io.on('connection', socket => {
            console.log('Client connected');
        })
    })
    .catch(err => console.log(err));