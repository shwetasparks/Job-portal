import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        // getting token from req
        const token = req.cookies.token;

        // if  token not found
        if (!token) {
            return res.status(401).json({
                message: 'user not authenticated',
                success: false
            })
        }

        //if token exists then decode it
        const decode = await jwt.verify(token, process.env.SECRET_KEY);

        //if not able to decode
        if (!decode) {
            return res.status(401).json({
                message: 'invalid token',
                success: false
            })

        }

        //userid from decode to req.id
        req.id = decode.userId;
        next();


    } catch (error) {
        console.log(error)

    }
}
export default isAuthenticated;