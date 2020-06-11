const jwt = require('jsonwebtoken');
const config = require('./config');

const checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.startsWith('Token ')) {
        token = token.slice(6, token.length);
    }

    if (!token) {
        res.status(401);
        return  res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        } else {
            req.decoded = decoded;
            next();
        }
    });
};

module.exports = {
    checkToken: checkToken
};