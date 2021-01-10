const express = require("express");

const router = express.Router();

const User = require('../models/UserModel');

//for finding all users
router.get('/', function (req, res) {
    User.find(function (err, users) {
        if (err) {
            console.log("***ERROR***");
            console.log(`error in backend/routes/Users.js get ${err}`);
        }
        else {
            res.json(users);
        }
    });
});

//for putting new user
router.post('/',  (req, res) => {
    console.log(req.body);
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        date: req.body.date
    });
    console.log(newUser.name);
    newUser.save()
        .then(user => { res.status(200).json(user); })
        .catch(err => {
            console.log("***ERROR***");
            console.log(`error in backend/routes/Users.js post ${err}`);
            res.status(400).send(err);
        });
});

module.exports = router;
