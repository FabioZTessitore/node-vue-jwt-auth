const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const config = require('../config');

const middleware = require('../middleware');

const User = require('../models/user');

const timeUnit = 3600;                  // 1h
const expiresIn = timeUnit;             // 1h
const refreshExpiresIn = timeUnit * 5;  // 5h

router.post('/signup', function (req, res) {
    const email = req.body.email;
    const password  = req.body.password;

    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({ auth: false, msg: 'Cannot register the user.' });
            return;
        }

        if (user) {
            console.log('user already in db');
            res.status(401);
            res.json({ auth: false, msg: 'Email already in db.' });
            return;
        }

        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
  
        newUser.save(function(err, user) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({ auth: false, msg: 'Error registering the user.' });
                return;
            }
  
            console.log(user);
            const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: expiresIn });
            const refreshToken = jwt.sign({ id: user._id }, config.secret, { expiresIn: refreshExpiresIn });
            res.status(200).json({ auth: true, token: token, refreshToken: refreshToken, expiresIn: expiresIn, user: { id: user._id, email: user.email } });
        });
    });
});

router.post('/login', function (req, res) {
    const email = req.body.email;
    const password  = req.body.password;
    
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({ auth: false, msg: 'Server Error' });
            return;
        }

        if (!user) {
            console.log('user not found');
            res.status(404);
            res.json({ auth: false, msg: 'Cannot find user' });
            return;
        }

        let passwordIsValid = user.validPassword(password);
        if (!passwordIsValid) {
            console.log('password not valid');
            res.status(401);
            res.json({ auth: false, msg: 'Invalid password' });
            return;
        }

        console.log(user);
        const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: expiresIn });
        const refreshToken = jwt.sign({ id: user._id }, config.secret, { expiresIn: refreshExpiresIn });
        console.log(new Date(), 'refresh token generated with ', refreshExpiresIn);
        res.status(200).json({ auth: true, token: token, refreshToken: refreshToken, expiresIn: expiresIn, user: { id: user._id, email: user.email } });
    });
});

router.post('/refresh-token', function (req, res) {
    console.log(new Date(), ' /refresh-token');

    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        res.status(401);
        return  res.json({
            auth: false,
            message: 'Auth token is not supplied'
        });
    }
    
    jwt.verify(refreshToken, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                auth: false,
                message: 'Token is not valid'
            });
        } else {
            const userId = decoded.id;

            const token = jwt.sign({ id: userId }, config.secret, { expiresIn: expiresIn });
            res.json({ auth: true, token: token });
        }
    });
});

router.get('/userdata', middleware.checkToken, function (req, res) {
    const userId = req.decoded.id;
    console.log(userId)

    User.findById(userId, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({ success: false, msg: 'Server Error' });
            return;
        }

        if (!user) {
            console.log('user not found');
            res.status(404);
            res.json({ success: false, msg: 'Cannot find user' });
            return;
        }

        console.log(user);
        res.status(200).json({ success: true, user: { id: user._id, email: user.email } });
    });
});

let counter = 0;
router.get('/secure-data', middleware.checkToken, function (req, res) {
    counter++;
    res.status(200).json({ counter });
});


module.exports = router;