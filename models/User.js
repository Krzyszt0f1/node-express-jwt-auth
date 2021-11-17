const mongoose = require('mongoose');
const { isEmail } = require('validator');

// the second values in the arrays of required
// are for creating custom error messages 
// validate in the email is a custom validation
// to check if it is an email
// for some reason, unique has to be handled differently
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password has to be at least 6 characters long']
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;