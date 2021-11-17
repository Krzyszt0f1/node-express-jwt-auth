const User = require('../models/User');

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUser = await User.create({email, password});
        res.status(201).json(newUser)
    } catch(err) {
        console.log(err);
        res.status(409).json({
            message: err.message
        });
    } 
    res.send('new signup');
}

module.exports.login_post = (req, res) => {
    res.send('user login');
}