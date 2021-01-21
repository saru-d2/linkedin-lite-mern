const express = require("express");
const router = express.Router();

const User = require('../models/UserModel');
const Applicant = require('../models/ApplicantModel');
const Recruiter = require('../models/RecruiterModel');
const Job = require('../models/JobModel');
const Application = require('../models/ApplicationModel');

router.get('/', (req, res) => {
    console.log('coneected');
    res.send('connected');
})

router.get('/listUsersTest', (req, res) => {
    console.log('test');
    Applicant.find().then((userList) => {
        console.log('here');
        res.status(200).json(userList)
    }).catch(err => {
        console.log(err)
        res.status(400).res(err);
    })
})

router.post('/viewjobs', (req, res) => {
    Job.find({}).then(jobs => {
        return res.status(200).json(jobs);
    }).catch(err => {
        console.log(err);
        res.status(400).json({ msg: 'some niche error in applicantRouter.js' });
    })
})

router.post('/getRecruiterUser', (req, res) => {
    var _id = req.body.recId;
    console.log(req.body);
    console.log(`appgetrecruiter ${_id}`);
    Recruiter.findOne({ _id }).then(recruiter => {
        User.findOne({ '_id': recruiter.user }).then(user => {
            console.log(user);
            return res.status(200).json(user);
        }).catch(err => {
            console.log(err)
            return res.status(400).json({ msg: 'couldnt get user' })
        })
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ msg: 'some niche error in applicantRouter.js' });
    })
})

router.post('/getJobDetails', (req, res) => {
    var _id = req.body.jobId;
    console.log(req.body);
    Job.findOne({ _id }).then(job => {
        // console.log(job);
        res.status(200).json(job);
    }).catch(err => {
        console.log(err)
        return res.status(400).json({ msg: 'some niche error in applicantRouter.js' });
    })
})

router.post('applyForJob', (req, res) => {
    var jobData = req.body.job;
    var email = req.body.email;
    User.findOne({email}).then(user => {
        Applicant.findOne({user}).then( applicant => {
            console.log(applicant);
            
        })
        .catch()
    })
    console.log(jobData)
    console.log(applicantData)
})

module.exports = router;