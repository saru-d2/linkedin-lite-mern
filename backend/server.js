const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// for localhost 
MONGO_URL = 'mongodb://localhost:27017/'
MONGO_DB = 'test'
PORT = 5000

mongoose.connect(MONGO_URL + MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then( () => console.log('connected to mongoDB')).catch(err => console.log('err'));
mongoose.connection.once('open', () => console.log('connected'))
.on('error', (error) => {
    console.log("mongodb failed to connect :'(");
    console.log(error);
});
console.log(`mongoose status:${mongoose.STATES[mongoose.connection.readyState]}`);
const authRouter = require('./routes/authRouter')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//api routes
app.use('/auth', authRouter);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});