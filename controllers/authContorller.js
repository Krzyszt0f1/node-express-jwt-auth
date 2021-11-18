const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
// within this function, err.code
// will only be defined for unique property
const handleErrors = (err) => {
    console.log(err.message, err.code);
    const errors = { email: '', password: ''};
    
    // incorrect login details
    if (err.message.includes('incorrect email') || err.message.includes('incorrect password')) {
        errors.email = 'Provided credentials are incorrect';
        errors.password = 'Provided credentials are incorrect';
    }
    
    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'Email already in use';
    }
    
    // validation errors
     if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// constant for max age of valid jwt 
const maxAge = 24 * 60 * 60; // day in seconds, not milliseconds

// create token function
const createToken = (id) => {
    return jwt.sign({ id }, 'here you should have a secret string that never gets published, otherwise, everything gets compromised',
        {
            expiresIn: maxAge
        });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUser = await User.create({email, password});
        const token = createToken(newUser._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: newUser._id });
    } catch(err) {
        const errors = handleErrors(err);
        res.status(409).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch(err) {
        const errors = handleErrors(err);
        res.status(409).json({ errors });
    }
}
