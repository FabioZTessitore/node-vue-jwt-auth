const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 3000;

const userRoutes = require('./app/routes/user');

const app = express();

app.use( express.static( path.join(__dirname, 'client-vue', 'dist' ) ) );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

app.use( userRoutes );

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
        return;
    }

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client-vue', 'dist', 'index.html'));
});