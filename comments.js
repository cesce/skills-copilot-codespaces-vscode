// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');

// Create comment
router.post('/posts/:id/comments', isLoggedIn, async (req, res) => {
    try {
        // Find post
        const post = await Post.findById(req.params.id);
        // Create comment
        const comment = new Comment(req.body.comment);
        // Add username and id to comment
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        // Save comment
        await comment.save();
        // Add comment to post
        post.comments.push(comment);
        // Save post
        await post.save();
        // Redirect to post
        req.flash('success', 'Successfully added comment');
        res.redirect(`/posts/${post._id}`);
    } catch (err) {
        console.log(err);
        req.flash('error', 'Something went wrong');
        res.redirect('back');
    }
});
