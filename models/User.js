const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

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

// fire function before doc saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static method to login user 
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
       const auth = await bcrypt.compare(password, user.password);
       if (auth) {
           return user;
       }
       throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;