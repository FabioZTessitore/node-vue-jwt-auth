const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const config = require('../config');

const User = require('../models/user');

router.post('/signup', function (req, res) {
    const email = req.body.email;
    const password  = req.body.password;

    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({ auth: false, msg: 'Cannot register the user.' });
            return;
        }
  
        if (user) {
            console.log('user already in db');
            res.status(500);
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
            const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 3600 /* 1h */ });
            res.status(200).json({ auth: true, token: token, user: user });
        });
    });
});

module.exports = router;