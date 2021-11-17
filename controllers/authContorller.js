const User = require('../models/User');

// handle errors
// within this function, err.code
// will only be defined for unique property
const handleErrors = (err) => {
    console.log(err.message, err.code);
    const errors = { email: '', password: ''};
    
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
        const errors = handleErrors(err);
        res.status(409).json({ errors });
    } 
    res.send('new signup');
}

module.exports.login_post = (req, res) => {
    res.send('user login');
}