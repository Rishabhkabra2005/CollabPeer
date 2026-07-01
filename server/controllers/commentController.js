const express = require('express');
const router = express.Router();
const Comment = require('../models/Comments');

// like a comment : PUT
const likeComment = async (req,res) => {
    const commentId = req.params.commentId;
    try{
        const comment = await Comment.findById(commentId);
        if (comment.likes.includes(req.user)){
            comment.likes.pull(req.user);
        }
        else if (comment.dislikes.includes(req.user)){
            comment.dislikes.pull(req.user);
            comment.likes.push(req.user);
        }
        else{
            comment.likes.push(req.user);
        }
        await comment.save();
        res.status(200).json(comment);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

// dislike a comment : PUT
const dislikeComment = async (req,res) => {
    const commentId = req.params.commentId;
    try{
        const comment = await Comment.findById(commentId);
        if (comment.dislikes.includes(req.user)){
            comment.dislikes.pull(req.user);
        }
        else if (comment.likes.includes(req.user)){
            comment.likes.pull(req.user);
            comment.dislikes.push(req.user);
        }
        else{
            comment.dislikes.push(req.user);
        }
        await comment.save();
        res.status(200).json(comment);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

const getComment = async (req,res) => {
    const commentId = req.params.commentId;
    try{
        const comment = await Comment.findById(commentId);
        res.status(200).json(comment);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

module.exports = { likeComment, dislikeComment, getComment };