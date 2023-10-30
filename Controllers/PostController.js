import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

//Creat new post
export const createPost = async (req, res) => {
    const newpost = new PostModel(req.body);
    try {
        await newpost.save();
        res.status(200).json("Post Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
};


// Get a post
export const getPost = async (req, res) => {
    const id = req.params.id

    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        req.status(500).json(error)
    }
}

//update a post

export const updatePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(postId)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post Update successfully")
        } else {
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        req.status(500).json(error)
    }
}

//Delete a post

export const deletePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body;
    try {
        const post = await PostModel.findById(postId);
        if (post) {
            if (post.userId === userId) {
                await post.deleteOne();
                res.status(200).json("Post deleted successfully")

            } else {
                res.status(403).json("Action forbidden")
            }
        } else {
            res.status(403).json("The post does not exist")
        }
    } catch (error) {
        req.status(500).json(error)
    }
}

//like or dislike a post
export const likePost = async (req, res) => {
    const id = req.params.id
    const { userId } = req.body;
    try {
        const post = await PostModel.findById(id);
        if (!post.like.includes(userId)) {
            await post.updateOne({ $push: { like: userId } })
            res.status(200).json("Post liked")
        } else {
            await post.updateOne({ $pull: { like: userId } })
            res.status(200).json("Post unlike")
        }
    } catch (error) {
        req.status(500).json(error)
    }
}

export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const currentUserPosts = await PostModel.find({ userId: userId });
      const ListPosts = await UserModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "friends",
            foreignField: "userId",
            as: "ListPosts",
          },
        },
        {
          $project: {
            ListPosts: 1,
            _id: 0,
          },
        },
      ]);
  
      res
        .status(200)
        .json(currentUserPosts.concat(...ListPosts[0].ListPosts)
        .sort((prev,next)=>{
            return next.createdAt - prev.createdAt;
        })
        );
    } catch (error) {
      res.status(500).json(error);
    }
  };