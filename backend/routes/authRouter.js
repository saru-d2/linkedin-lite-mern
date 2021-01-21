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

//validators
const registerValidate = require('../validators/auth/registerValidator')
const applicantValidate = require('../validators/auth/applicantValidator')
const recruiterValidate = require('../validators/auth/recruiterValidator')

router.post('/test', (req, res) => {
    console.log("wow");
    res.send('connected!');
})

router.post('/register', (req, res) => {
    var {errors, isValid} = registerValidate(req.body);
    if (!isValid){
        return res.status(400).json(errors)
    }
    email = req.body.email;

    User.findOne({ email }).then(user => {
        if (user) return res.status(400).json({ msg: 'email exsits in database' });

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type
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
    }).catch(e => console.log(e));
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
                { id: user.id, name: user.name, email: user.email, type: user.type },
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
    console.log(req.body);
    const {errors, isValid} = applicantValidate(req.body);
    if (!isValid){
        return res.status(400).json(errors)
    }
    User.findOne({ email }).then(user => {
        if (!user) return res.status(400).json({ msg: 'email doesnt exsit in database' });

        if (user.type != 'applicant') return res.status(200).json({ msg: 'not applicant' })
        const newApplicant = new Applicant({
            user,
            education,
            skills,
            // image,
            // resume
        });

        newApplicant.save().then(user => {
            res.json({ data: newApplicant, msg: 'success' });
        })
    })
})

router.post('/register/recruiter', (req, res) => {


    const { email, contactNumber, Bio } = req.body;
    console.log(req.body);
    console.log('recrioter reg');

    const {errors, isValid} = recruiterValidate(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

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
