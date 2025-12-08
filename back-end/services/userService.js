const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {

    async create({name,email,password},role) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            return  await User.create({
                name,
                email,
                password: hashedPassword,
                role: role
            });
        } catch (err) {
           console.error(err);
            throw new Error(err.message);
        }
    }
}