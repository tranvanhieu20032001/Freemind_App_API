import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//Register
export const registerUser = async (req, res) => {
    const { username, password, email, birthday, gender } = req.body;

    try {
        const isEmailRegistered = await UserModel.countDocuments({ email: email });
        if (isEmailRegistered) {
            res.status(400).json("Email is already registered");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new UserModel({ username, password: hashedPassword, email, birthday, gender });

            const user = await newUser.save();
            const token = jwt.sign({
                username: user.username, id: user._id
            }, process.env.JWT_KEY, { expiresIn: '1h' })

            res.status(200).json({ user, token });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//Login

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email: email })
        if (user) {
            const validity = await bcrypt.compare(password, user.password)
            if (!validity) {
                res.status(400).json("Wrong Password")
            } else {
                const token = jwt.sign({
                    username: user.username, id: user._id
                }, process.env.JWT_KEY, { expiresIn: '1h' })

                res.status(200).json({ user, token });
            }
        } else {
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}