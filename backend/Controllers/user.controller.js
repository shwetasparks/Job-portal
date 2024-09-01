//register
import { User } from '../models/user.model.js'
import bcrypt from "bcryptjs";

//register
export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        //all field are required
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        };

        //email: check if user already existed 
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'user already exists',
                success: false,
            })

        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,

        });
        return res.status(201).json({
            message: 'user created successfully',
            success: true
        })
    } catch (error) {
        console.log(error)

    }
}

//login
export const login = async (req, res) => {

    try {
        //check if all input given in sign in
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        };

        // single document that matches the query
        let user = await User.findOne({ email });

        //check if user is logged in
        if (!user) {
            return res.status(400).json({
                message: 'user does not exist',
                success: false,
            })
        }

        //match password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        //if not match
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "incorrect email or password",
                success: false
            })
        };

        //check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "incorrect role provided",
                success: false
            })
        }

        //GENERATE TOKEN
        /**
         * jwt token: header,payload,signature
         */
        const tokenData = {
            userId: user._id  //provides the unique identifier : user across different sessions and requests.
        }

        //generate using jwt
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user={
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
            
        }



        return res.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullName}`,
            success: true,
        })


    } catch (error) {
        console.log('error occured');
    }


