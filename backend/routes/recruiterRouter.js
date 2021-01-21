const express = require("express");
const router = express.Router();

const User = require('../models/UserModel');
const Applicant = require('../models/ApplicantModel');
const Recruiter = require('../models/RecruiterModel');
const Job = require('../models/JobModel');
const Application = require('../models/ApplicationModel');


//validators
const addJobValidator = require('../validators/recruiter/addJobValidator')

//maps from /recruiter
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

router.post('/addJob', (req, res) => {
    const { errors, isValid } = addJobValidator(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    console.log(`email: ${email}`)
    User.findOne({ email }).then(user => {
        console.log(user)
        Recruiter.findOne({ user }).then(recruiter => {

            if (!recruiter) {
                res.status(400).json({ msg: 'cant find user in recruiters...' });
            }
            console.log(req.body)
            const newJob = new Job({
                recruiter: recruiter,
                jobType: req.body.jobType,
                salary: req.body.salary,
                deadline: req.body.deadline,
                duration: req.body.duration,
                skills: req.body.skills,
                maxPositions: req.body.maxPositions,
                maxApplicants: req.body.maxApplicants,
                jobTitle: req.body.title
            })
            newJob.save().then(job => {
                res.status(200).json({ data: job, msg: 'sent' });
            })
        })
    })
})


router.post('/listJobs', (req, res) => {
    const email = req.body.email;
    User.findOne({ email })
        .then(user => Recruiter.findOne({ user }).lean()
            .then(recruiter => {
                Job.find({ recruiter }).then(jobs => {
                    return res.json(jobs);
                }).catch(err => {
                    console.log(err);
                    res.status(400).json({msg: 'some niche error in recruitRouter.js'});
                })
                
            })
    .catch(e => { return res.status(400).json({ msg: 'user not found with email' }) }))
        .catch (e => { return res.status(400).json({ msg: 'user not found with email' }) })
})



module.exports = router;