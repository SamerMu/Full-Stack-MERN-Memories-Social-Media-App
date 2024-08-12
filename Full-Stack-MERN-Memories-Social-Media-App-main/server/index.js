import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"; // Cross Origin Resource Sharing (CORS) is a W3C standard that allows a server to relax the same-origin policy
import dotenv from "dotenv";
import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';

// Express setup
const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true})); // Limits size since we have images
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true})); // Limits size since we have images
app.use(cors()); // Needs to be before routes

app.use('/posts', postRoutes); // Every route is posts will be prepended with /posts
app.use('/user', userRoutes); // Every route is posts will be prepended with /user

const PORT = process.env.PORT || 5000;

// Connect with mongoose and set promises for success and failure
// Helps prevents warnings in console
mongoose.connect(process.env.CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log("Server running on port: " + PORT)))
    .catch((error) => console.log(error.message));
