const authService = require('../services/authService');


module.exports = {

    async login(req, res) {

        try {
            const { existingUser, tokens } = await authService.login(req.body);

            res.cookie('jwt', tokens.refreshToken, {
                httpOnly: true,
                sameSite: 'None', secure: true,
                maxAge: 24 * 60 * 60 * 1000 * 7
            });

            res.json({
                token: tokens.accessToken,
                user: { id: existingUser._id,name:existingUser.name, email: existingUser.email,role:existingUser.role }
            }
            );

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async register(req, res) {
        try {
            let role;
            if(req.body.role)  {
                role= req.body.role
            }else {
                role = 'Driver'
            }

            const { user, tokens } = await authService.register(req.body,"Driver");

            res.cookie('jwt', tokens.refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            res.status(201).json({
                token: tokens.accessToken,
                user: { id: user._id,name:user.name, email: user.email,role:user.role }
            });

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },



    async logout(req, res) {
        try {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            });

            res.status(200).json({ message: "Logged out successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message});
        }
    }




}