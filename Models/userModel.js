import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        birthday:Date,
        gender:Boolean,
        isAdmin: {
            type: Boolean,
            default: false,
        },
        avatar: String,
        background: String,
        describe: String,
        livein: String,
        worksAt: String,
        relationship: String,
        friends: [],
    }, { timestamps: true }
)

const UserModel = mongoose.model("Users", UserSchema)

export default UserModel