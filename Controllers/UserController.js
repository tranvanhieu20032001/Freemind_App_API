import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

//get a User
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json("No such user exists");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

//update a User
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { curr_UserId, curr_Adminstatus, password } = req.body;

    if (id === curr_UserId || curr_Adminstatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access denied! You can't update profile");
    }
};

//delete user
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { curr_UserId, curr_Adminstatus, password } = req.body;

    if (id === curr_UserId || curr_Adminstatus) {
        try {
            const user = await UserModel.findById(id);
            const validity = await bcrypt.compare(password, user.password);
            if (validity) {
                const user = await UserModel.findByIdAndDelete(id, req.body, {
                    new: true,
                });
                res.status(200).json("User deleted successfully");
            } else {
                res.status(400).json("wrong password");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access denied! You can't delete profile");
    }
};

//add friend

export const addFriend = async (req, res) => {
    const id = req.params.id;
    const { curr_UserId } = req.body;
    if (id === curr_UserId) {
        res.status(403).json("Access denied! ");
    } else {
        try {
            const newfriend = await UserModel.findById(id);
            const curr_friend = await UserModel.findById(curr_UserId);

            if (!newfriend.friends.includes(curr_UserId)) {
                await newfriend.updateOne({ $push: { friends: curr_UserId } });
                await curr_friend.updateOne({ $push: { friends: id } });
                res.status(200).json("Add friend susseccfully");
            } else {
                res.status(403).json("Add friend faild");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

//unfriend
export const unFriend = async (req, res) => {
    const id = req.params.id;
    const { curr_UserId } = req.body;
    if (id === curr_UserId) {
        res.status(403).json("Access denied!");
    } else {
        try {
            const oldfriend = await UserModel.findById(id);
            const curr_friend = await UserModel.findById(curr_UserId);

            if (oldfriend.friends.includes(curr_UserId)) {
                await oldfriend.updateOne({ $pull: { friends: curr_UserId } });
                await curr_friend.updateOne({ $pull: { friends: id } });
                res.status(200).json("Unfriend susseccfully");
            } else {
                res.status(403).json("Unfriend faild");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
