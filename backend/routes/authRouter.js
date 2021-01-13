const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');


//user model
const User = require('../models/UserModel');
const Applicant = require('../models/ApplicantModel');
const Recruiter = require('../models/RecruiterModel');
//for finding all users
// / is at auth/

router.post('/test', (req, res) => {
    console.log("wow");
    res.send('connected!');
})

router.post('/register', (req, res) => {
    const { name, email, password, password_confirm, type } = req.body;
    if (!name || !email || !password || !password_confirm || !type) {
        console.log('1')
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
            password,
            type
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
    console.log(req.body);
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);
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
                            type: user.type,
                        },
                        msg: "sent"
                    })
                }
            )
        });
    })
})


router.post('/register/applicant', (req, res) => {
    const { email, education, skills } = req.body;
    console.log('hey');
    if (!email) {
        console.log('1')
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email }).then(user => {
        if (!user) return res.status(400).json({ msg: 'email doesnt exsit in database' });

        if (user.type != 'applicant') return res.status(200).json({ msg: 'not applicant' })
        const newApplicant = new Applicant({
            user,
            education,
            skills
        });

        newAplicant.save().then(user => {
            res.json({ data: newApplicant, msg: 'success' });
        })
    })
})

router.post('/register/recruiter', (req, res) => {
    const { email, contactNumber, Bio } = req.body;
    console.log('hey');
    if (!email) {
        console.log('1')
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email }).then(user => {
        if (!user) return res.status(400).json({ msg: 'email doesnt exsit in database' });

        if (user.type != 'recruiter') return res.status(200).json({ msg: 'not recruiter' })
        const newRecruiter = new Recruiter({
            user,
            contactNumber,
            Bio
        });

        newRecruiter.save().then(user => {
            res.json({ data: newRecruiter, msg: 'success' })
        })
    })
})


module.exports = router;
