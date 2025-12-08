const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
module.exports = {


    create(user) {

        try {

            const accessToken = jwt.sign({
                username: user.name,
                email: user.email
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1m'
            });

            const refreshToken = jwt.sign({
                username: user.name,
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

            return { accessToken, refreshToken };

        } catch (err) {
            console.log(err);
            throw new Error("something went wrong, please try agian later");
        }
    },

    refresh(user) {

        try {
            if (!req.cookies?.jwt) {

            }
            const refreshToken = req.cookies.jwt;

            let isRight = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            if (!isRight) {
                return { isauthorized: false }
            }
            
            const accessToken = jwt.sign({
                username: user.email,
                email: user.email
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1m'
            });
           
            return { accessToken };

        } catch (err){
            console.log(error)
            throw new Error('somthing went wrong, please try agin later')
        }
    }
}


