
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";






// #################### REGISTER #####################
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        //if anything is not available

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json
                ({
                    message: "Please fill all the fields",
                    success: false
                })
        };


        //check if already register
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "user with this Email already exist",
                success: false
            })
        }

        //hashed the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        await User.create({
            fullname,
            email,
            phoneNumber,
            role,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User created successfully",
            success: true
        });

    } catch (error) {
        console.log("error in register", error)

    }
}

// ################### LOGIN ####################
export const login = async (req, res) => {
    try {
        const { email, role, password, fullname } = req.body;

        //if any data missing
        if (!email || !password || !role) {
            return res.status(400).json
                ({
                    message: "Please fill all the fields",
                    success: false
                })
        };

        //if user already available check it using email

        const user = await User.findOne({ email });

        //if not found user
        if (!user) {
            return res.status(400).json({
                message: "incorrect email or password",
                success: false
            })
        }

        //match it with password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        //if password not match
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password",
                success: false
            });
        }


        //if role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: 'account not exist with current role',
                success: false
            })
        }


        // ########## TOKEN ##############

        const tokenData = {
            userId: user._id
        }

        //using jwt token
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })

        //creating  USER

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }



        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true,
        })

    } catch (error) {
        console.log('error in login', error)

    }
}

//################### LOGOUT ################################
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully",
            success: true
        })

    } catch (error) {
        console.log("error in logout", error)

    }
}


// ########################### update profile ######################
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, skills, bio } = req.body;

        //if anything missing
        if (!fullname || !email || !phoneNumber || !password || !bio || !skills) {
            return res.status(400).json
                ({
                    message: "Please fill all the fields",
                    success: false
                })
        };

        //#################### CLOUDINARY ################################





        //skills from string to array
        const skillsArray = skills.split(",");

        //authentiated (middleware auth)
        const userId = req.id;

        let user = await User.findById(userId);


        // if user not found
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        user.fullname = fullname,
            user.email = email,
            user.phoneNumber = phoneNumber,
            user.skills = skillsArray,
            user.profile.bio = bio,
            user.password = password;
        user.profile.skills = skillsArray


        // ########################## resume here ########################


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: 'Profile update',
            user,
            success: true
        })

    } catch (error) {
        console.log("error in update profile", error)
    }
}