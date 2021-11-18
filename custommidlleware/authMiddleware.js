const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; // jwt is the custom name of the cookie we made
    
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 
            'here you should have a secret string that never gets published, otherwise, everything gets compromised',
            (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
            });
    }  else {
        res.redirect('/login');
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token,
            'here you should have a secret string that never gets published, otherwise, everything gets compromised',
            async (err, decodedToken) => {
                if(err) {
                    console.log(err.message);
                    res.locals.user = null;
                    next();
                } else {
                    console.log(decodedToken);
                    // research that res.locals stuff
                    res.locals.user = await User.findById(decodedToken.id);
                    next();
                }
            });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };