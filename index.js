const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const User = require('./app/models/user');

const config = require('./app/config');
const middleware = require('./app/middleware');

const userRoutes = require('./app/routes/user');

const app = express();

app.use( express.static( __dirname + '/client-vue/dist' ) )

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

app.use( userRoutes );

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    app.listen(process.env.PORT || 3000);
});



app.post('/login', function (req, res) {
    const email = req.body.email;
    const password  = req.body.password;
    
    User.findOne({ 'email': email }, function(err, user) {
        if (err) return res.status(500).send({ auth: false, token: null, message: 'Server Error' });

        if (!user) return res.status(404).send({ auth: false, token: null, message: 'Cannot find user' });

        let passwordIsValid = user.validPassword(password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null, message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 3600 /* 1h */ });
        res.status(200).send({ auth: true, token: token, user: user });
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client-vue/dist/index.html')
});

let counter = 0;
app.get('/secure-data', middleware.checkToken, function (req, res) {
    res.send({ message: 'User Home Page', counter });
    counter++;
});
