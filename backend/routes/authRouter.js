const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');


//user model
const User = require('../models/UserModel');

//for finding all users
// / is at auth/

router.post('/test', (req, res) => {
    console.log("wow");
    res.send('connected!');
})

router.post('/register', (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    if (!name || !email || !password || !password_confirm) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (password != password_confirm) {
        return res.status(400).json({ msg: 'Passwords dont match' });
    }

    User.findOne({ email }).then(user => {
        if (user) return res.status(400).json({ msg: 'email exsits in database numbskull' });

        const newUser = new User({
            name,
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().then(user => {

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        {
                            expiresIn: 3600
                        },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token: token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                },
                                msg: "sent"
                            })
                        }
                    )
                });
            })
        })
    })
})


router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email }).then(user => {
        //no user
        if (!user)
            return res.status(400).json({ msg: "user doesnt exist in db" });

        //matching password
        bcrypt.compare(password, user.password).then(match => {
            if (!match)
                return res.status(400).json({ msg: "password is wrong" });

            jwt.sign(
                { id: user.id },
                config.get('jwtSecret'),
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token: token,
                        user: {
                            id: user.id,
                            name: user.name,
                        },
                        msg: "sent"
                    })
                }
            )
        });


    })
})



module.exports = router;



// router.get('/', function (req, res) {
//     User.find(function (err, users) {
//         if (err) {
//             console.log("***ERROR***");
//             console.log(`error in backend/routes/Users.js get ${err}`);
//         }
//         else {
//             res.json(users);
//         }
//     });
// });

//for adding new user
// router.post('/register',  (req, res) => {
//     console.log(req.body);
//     const newUser = new User({
//         name: req.body.name,
//         email: req.body.email,
//         date: req.body.date
//     });
//     console.log(newUser.name);
//     newUser.save()
//         .then(user => { res.status(200).json(user); })
//         .catch(err => {
//             console.log("***ERROR***");
//             console.log(`error in backend/routes/Users.js post ${err}`);
//             res.status(400).send(err);
//         });
// });