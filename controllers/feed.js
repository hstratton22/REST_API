const { validationResult } = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

//async await
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            //.populate(creator)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200)
            .json({
                message: 'Fetched posts successfully.',
                posts: posts,
                totalItems: totalItems
            });
    } catch
    (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);

    }


    // .catch(err => {
    //     if (!err.statusCode) {
    //         err.statusCode = 500
    //     }
    //     next(err);
    // });
};
// exports.getPosts = (req, res, next) => {
//     const currentPage = req.query.page || 1;
//     const perPage = 2;
//     let totalItems;
//     Post.find()
//         .countDocuments()
//         .then(count => {
//             totalItems = count;
//             return Post.find()
//                 .skip((currentPage - 1) * perPage)
//                 .limit(perPage);
//         })
//         .then(posts => {
//             res
//                 .status(200)
//                 .json({
//                     message: 'Fetched posts successfully.',
//                     posts: posts,
//                     totalItems: totalItems
//                 });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500
//             }
//             next(err);
//         });
// };
//)
// .catch(err => {
//     if (!err.statusCode) {
//         err.statusCode = 500
//     }
//     next(err);
// })

// res.status(200).json({
//     posts: [
//         {
//             _id: '1',
//             title: "First Post",
//             content: "This is the first post!",
//             imageUrl: 'images/sunflower.jpeg',
//             creator: {
//                 name: 'H'
//             },
//             createdAt: new Date()
//         }
//     ]
// });
// };
// exports.createPost = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed; entered data is incorrect.');
//         error.statusCode = 422;
//         throw error;
//         // return res.status(422)
//         //     .json({
//         //         message: "Validation failed. Entered data is incorrect.",
//         //         errors: errors.array()
//         //     });
//     }
//     if (!req.file) {
//         const error = new Error('No image provided.');
//         error.statusCode = 422;
//         throw error;
//     }
//     const imageUrl = req.file.path;
//     const title = req.body.title;
//     const content = req.body.content;
//     let creator;
//     //console.log('userId', req.userId);
//     //create post in db
//     const post = new Post({
//         title: title,
//         content: content,
//         imageUrl: imageUrl,//'images/sunflower.jpeg',
//         creator: req.userId//working{ name: 'HS' }//req.userId
//     });
//     post
//         .save()
//         //working
//         // .then(result => {
//         //     res.status(201).json({
//         //         message: 'Post created successfully!',
//         //         post: result//post,
//         //         //creator: { _id: creator._id, name: creator.name }
//         //     });
//         // }
//         // )//to here
//         .then(result => {
//             return User.findById(req.userId);
//         })
//         .then(user => {
//             creator = user;
//             user.posts.push(post);
//             return user.save();
//         })
//         .then(result => {
//             //console.log(result);
//             res.status(201).json({
//                 message: 'Post created successfully!',
//                 post: post,
//                 creator: { _id: creator._id, name: creator.name }
//             });
//         })
//         //good after this
//         .catch(err => {
//             // console.log(err);
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });


//     // console.log(title, content);
//     // res.status(201).json({ //success resource created
//     //     message: "Post created succesfully!",
//     //     post: {
//     //         _id: new Date().toISOString(),
//     //         title: title,
//     //         content: content,
//     //         creator: { name: "HStrat" },
//     //         createAt: new Date()
//     //     }
//     // });
// };
//async await
exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed; entered data is incorrect.');
        error.statusCode = 422;
        throw error;
        // return res.status(422)
        //     .json({
        //         message: "Validation failed. Entered data is incorrect.",
        //         errors: errors.array()
        //     });
    }
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    //console.log('userId', req.userId);
    //create post in db
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,//'images/sunflower.jpeg',
        creator: req.userId//working{ name: 'HS' }//req.userId
    });
    try {
        await post.save()
        const user = await User.findById(req.userId);
        user.posts.push(post);
        const savedUser = await user.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: { _id: user._id, name: user.name }
        });
        return savedUser;
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
//async await
exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
    try {
        if (!post) {
            const error = new Error('Could not find post.')
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Post fetched.', post: post });
    }

    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};
// exports.getPost = (req, res, next) => {
//     const postId = req.params.postId;
//     Post.findById(postId)
//         .then(post => {
//             if (!post) {
//                 const error = new Error('Could not find post.')
//                 error.statusCode = 404;
//                 throw error;
//             }
//             res.status(200).json({ message: 'Post fetched.', post: post });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };
// exports.updatePost = (req, res, next) => {
//     const postId = req.params.postId;

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed; entered data is incorrect.');
//         error.statusCode = 422;
//         throw error;
//     }
//     const title = req.body.title;
//     const content = req.body.content;
//     let imageUrl = req.body.image;
//     if (req.file) {
//         imageUrl = req.file.path;
//     }
//     if (!imageUrl) {
//         const error = new Error('No file picked.');
//         statusCode = 422;
//         throw error;
//     }
//     Post.findById(postId)
//         .then(post => {
//             if (!post) {
//                 const error = new Error('Could not find post.')
//                 error.statusCode = 404;
//                 throw error;
//             }
//             if (imageUrl !== post.imageUrl) {
//                 clearImage(post.imageUrl);
//             }
//             post.title = title;
//             post.imageUrl = imageUrl;
//             post.content = content;
//             return post.save();
//         })
//         .then(result => {
//             res.status(200).json({ message: 'Post updated', post: result });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });

// };
//async await
exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed; entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No file picked.');
        statusCode = 422;
        throw error;
    }
    try {
        const post = await
            Post.findById(postId)

        if (!post) {
            const error = new Error('Could not find post.')
            error.statusCode = 404;
            throw error;
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        const result = await post.save();
        res.status(200).json({ message: 'Post updated', post: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};
// exports.deletePost = (req, res, next) => {
//     const postId = req.params.postId;
//     Post.findById(postId)
//         .then(post => {
//             if (!post) {
//                 const error = new Error('Could not find post.')
//                 error.statusCode = 404;
//                 throw error;
//             }
//             //check logged in user
//             clearImage(post.imageUrl);
//             return Post.findByIdAndRemove(postId);
//         })
//         .then(result => {
//             console.log(result);
//             res.status(200).json({ message: 'Deleted post.' });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// };
// const clearImage = filePath => {
//     filePath = path.join(__dirname, '..', filePath);
//     fs.unlink(filePath, err =>
//         console.log(err));
// }
//async await
exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId)

        if (!post) {
            const error = new Error('Could not find post.')
            error.statusCode = 404;
            throw error;
        }
        //check logged in user
        clearImage(post.imageUrl);
        await Post.findByIdAndRemove(postId);


        console.log(result);
        res.status(200).json({ message: 'Deleted post.' });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err =>
        console.log(err));
}