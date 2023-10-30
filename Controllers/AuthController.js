import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'

//Register
export const registerUser = async (req, res) => {
    const { username, password, email, birthday, gender } = req.body;

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    const newUser = new UserModel({ username, password: hashedPass, email, birthday, gender })

    try {
        await newUser.save()
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


//Login

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email: email })
        if (user) {
            const validity = await bcrypt.compare(password, user.password)

            validity ? res.status(200).json(user) : res.status(400).json("Wrong Password")
        } else {
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}