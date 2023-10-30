import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: String,
    like: [],
    // love: [],
    // lovely:[],
    // haha:[],
    // wow:[],
    // sad:[],
    // angry:[],
    image: String,
  },
  {timestamps: true}
);

var PostModel = mongoose.model("Posts", postSchema)

export default PostModel