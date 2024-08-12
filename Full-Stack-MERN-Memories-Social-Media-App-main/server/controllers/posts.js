// This file will contain all the logic for routes relating to posts
import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8; // # of posts per page
        const startIndex = (Number(page) - 1) * LIMIT; // Get start index of past on every page
        const total = await PostMessage.countDocuments({}); // Total # of posts

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        // Access to db takes time, so needs to be defined as an async action
        const postMessages = await PostMessage.find();

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        // Use Regex for easier searching in mongodb and i param to ignore case
        const title = new RegExp(searchQuery, 'i');

        // Search on db, searaching for title or tags, and each tag in tags
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(",") } } ]});

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post  = req.body;

    const newPostMessage = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});

    try {
        await newPostMessage.save();
        
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send("No post with that id: " + id);
    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, { ...post, id }, { new: true });

    res.json(updatedPost);
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send("No post with that id: " + id);
    
    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
    const { id } = req.params;

    // Check if middleware was able to authenticate user
    if(!req.userId) return res.json({ message: 'Unauthenticated' });

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send("No post with that id: " + id);

    // Get post from database using the id
    const post = await PostMessage.findById(id);

    // Each like will have an id associated with it, use this to prevent user from liking multiple times
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1) {
        // Like post
        post.likes.push(req.userId);
    } else {
        // Dislike post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    // Update post
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
    
    res.json(updatedPost);
};