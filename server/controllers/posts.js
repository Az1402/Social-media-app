import Post from "../models/Post.js";
import User from "../models/User.js";


/* CREATE */
export const createPost = async (req, res) => {
    try {
      const { userId, description, picturePath } = req.body;
      const user = await User.findById(userId);
      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes: {},
        comments: [],
      });
      await newPost.save();
  
      const post = await Post.find();   //  retturning all the posts back to the frontend
      res.status(201).json(post);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };


  /* READ */
export const getFeedPosts = async (req, res) => {
    try {
      const post = await Post.find();   // to reading all the posts 
      res.status(200).json(post);         // passing all the posts back to frontend 
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  export const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await Post.find({ userId });     // reading the specific post of user 
      res.status(200).json(post);                   // sending the specific post back to the fontend
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };


  /* UPDATE */
export const likePost = async (req, res) => {
    try {
      const { id } = req.params;        // comes from the query string -> will be used to reconized the particular user
      const { userId } = req.body;      // comes from the body -> will be used for the likes recoginition
      const post = await Post.findById(id);
      const isLiked = post.likes.get(userId);
  
      // Check whether the post is liked or not 
      if (isLiked) {
        post.likes.delete(userId);    //  if the post is liked then delete that user id 
      } else {
        post.likes.set(userId, true);
      }
  
        // Here modifying the list of likes once u hit the like button 
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
      
      // Passing the updated post to fontend 
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };