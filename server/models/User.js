const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
    },
    program: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: " "
    },
    profilePic: {
        type: String,
        default : ""
    },
    techStacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skills'
    }],
    rating: {
        type: Number,
        default: 0
    },
    discussions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion'
    }],
    courses: [{
        course:{
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Course'
            },
        isSelected: {
            type: Boolean,
            default: false
    }}],
    projects: [{
        project:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
            },
        isSelected: {
            type: Boolean,
            default: false
    }}],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    favPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    views: {
        type: Number,
        default: 0,
    },
    portfolio: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
