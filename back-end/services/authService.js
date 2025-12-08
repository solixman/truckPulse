const User = require('../models/User');
const jwtService = require('./jwtService');
const bcrypt = require('bcrypt');
const userService = require('./userService');
module.exports = {

    async login({ email, password }) {

        if (!email || !password) {
            throw new Error("password and email riquired");
        }

        try {
            const existingUser = await User.findOne({ email: email });
            if (!existingUser) {
                throw new Error("there's no account with this email");
            }

            const isRight = await bcrypt.compare(password, existingUser.password);
            if (!isRight) {
                throw new Error("wrong email or password, please try again");
            }

            let tokens = jwtService.create(existingUser);

            return { existingUser, tokens }

        } catch (err) {
            console.log(err)
            throw new Error("Something went wrong, try again later");
        }
    },

    
    async register({ name, email, password },role) {
        try {
        if (!name || !email || !password) {
            throw new Error("Name, email, and password are required");
        }
        
         const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("An account with this email already exists");
            }

         const newUser = await userService.create({name,email,password},role);

            const tokens = jwtService.create(newUser);

            return { user: newUser, tokens };

        } catch (err) {
            console.error(err);
            throw new Error(err.message);
        }
    }

}