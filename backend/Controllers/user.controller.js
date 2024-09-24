//register
import { User } from '../models/user.model.js'
import bcrypt from "bcryptjs";

//################################# REGISTER #########################
// STEP 1 : Export the register function that handles the registration process
export const register = async (req, res) => {
    try {
        // STEP 2 : Extract User details from the request body (fullName, email, phoneNumber, password, role)
        const { fullName, email, phoneNumber, password, role } = req.body;

        // STEP 3 : Validate if any field is missing. If so, send a 400 response with an error message.
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // STEP 4 : Check if a User with the provided email already exists in the database.
        const User = await User.findOne({ email });
        if (User) {
            return res.status(400).json({
                message: 'User already exists',
                success: false,
            });
        }

        // STEP 5 : Hash the password using bcrypt to securely store it in the database.
        const hashedPassword = await bcrypt.hash(password, 10);

        // STEP 6 : Create a new User with the hashed password and other provided details.
        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,  // Store the hashed password
            role,
        });

        // STEP 7 : Send a success response after successfully creating the User.
        return res.status(201).json({
            message: 'User created successfully',
            success: true
        });

    } catch (error) {

        // STEP 8 : Catch and log any errors that occur during the process.
        console.log(error);
    }
};





// ############################# LOGIN ###########################################

export const login = async (req, res) => {
    try {

        // STEP 1: Extract the User input (email, password, role) from the request body
        const { email, password, role } = req.body;

        // STEP 2: Check if all required fields (email, password, role) are provided
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // STEP 3: Find a User by their email in the database

        let User = await User.findOne({ email });

        // STEP 4: Check if the User exists in the database
        if (!User) {
            return res.status(400).json({
                message: 'User does not exist',
                success: false,
            });
        }

        // STEP 5: Compare the input password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, User.password);

        // STEP 6: If the password doesn't match, return an error
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        // STEP 7: Check if the role provided matches the User's role
        if (role !== User.role) {
            return res.status(400).json({
                message: "Incorrect role provided",
                success: false
            });
        }

        // STEP 8: If everything is correct, proceed with login (JWT generation, session creation, etc.)
        // This part of the code is missing, where typically a token is generated and sent to the client.

    } catch (error) {
        // STEP 9: Catch and log any errors that occur during the process
        console.log(error);
        // Optionally, you can send a server error response back to the client
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


// ################################# GENERATE TOKEN ##########################

// Step for JWT token generation and response handling

    /**
     * STEP 9: jwt token: consists of three parts: header, payload, and signature
     * - Header: Contains metadata like the signing algorithm used (e.g., HS256).
     * - Payload: Contains the data/claims (e.g., UserId).
     * - Signature: Created by signing the header and payload with the secret key.
     */
    
    // STEP 10: Create token data with the User's unique identifier (UserId)
    const tokenData = {
        UserId: User._id  // Provides a unique identifier for the User across sessions
    };

    // STEP 11: Generate the JWT using the token data, secret key, and expiration time of 1 day
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    // STEP 12: Prepare the User object excluding sensitive data (e.g., password)
    User = {
        _id: User._id,
        fullName: User.fullName,
        email: User.email,
        phoneNumber: User.phoneNumber,
        role: User.role,
        profile: User.profile  // Optional: Add profile details if available
    };

    // STEP 13: Send the generated JWT as a cookie in the response
    return res.status(200)
        .cookie('token', token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,  // 1 day in milliseconds
            httpOnly: true,  // Ensures the cookie is only accessible by the server (prevents JavaScript access)
            sameSite: 'strict'  // Protects against CSRF attacks by only allowing the cookie to be sent from the same site
        })
        .json({
            message: `Welcome back ${User.fullName}`,  // Personalized success message
            success: true,  // Indicates that the login was successful
        });

} catch (error) {
    // STEP 14: Handle any errors that occur during the process
    console.log('Error occurred:', error);
    return res.status(500).json({
        message: "An error occurred while processing your request.",
        success: false
    });
}






      
// ############################## logout controller ########################
export const logout=async(req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message: "logged out successfully",
            success: true,
        })
    } catch (error) {
        console.log(error)
        
    }
}

//update 

