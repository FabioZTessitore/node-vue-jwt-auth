const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client-vue/dist/index.html')
});