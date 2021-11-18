const jwt = require('jsonwebtoken');

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

module.exports = { requireAuth };