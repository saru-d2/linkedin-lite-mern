const express = require("express");
const router = express.Router();

const User = require('../models/UserModel');
const Applicant = require('../models/ApplicantModel');
const Recruiter = require('../models/RecruiterModel');
const Job = require('../models/JobModel');
const Application = require('../models/ApplicationModel');


//validators
const addJobValidator = require('../validators/recruiter/addJobValidator');
const { application } = require("express");

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
                    res.status(400).json({ msg: 'some niche error in recruitRouter.js' });
                })

            })
            .catch(e => { return res.status(400).json({ msg: 'user not found with email' }) }))
        .catch(e => { return res.status(400).json({ msg: 'user not found with email' }) })
})

router.post('/getJobDetails', (req, res) => {
    var _id = req.body.jobId;
    // console.log(req.body);
    Job.findOne({ _id }).then(job => {
        // console.log(job);
        res.status(200).json(job);
    }).catch(err => {
        console.log(err)
        return res.status(400).json({ msg: 'some niche error in recruiterRouter.js' });
    })
})

router.post('/getAppsForjobs', (req, res) => {
    var _id = req.body.jobId;
    Job.findOne({ _id }).then(job => {
        Application.find({ job }).then(applications => {
            console.log(applications);
            return res.status(200).json(applications);
        }).catch(err => { return res.status(400).json(err) })
    }).catch(err => { return res.status(400).json(err) })
})

//this bloody thing doesnt bloody work so help me god idek why but its like ooooooooooo im not working fuuuuuck you so fuck this
//on second thought its prolly because theres no waiting for previous thing to finish, but still FUUUUCK THIS
router.post('/getApplicantAndUser', (req, res) => {
    var applicantId = req.body.applicantId;
    console.log(applicantId);
    resData = {}
    Applicant.findOne({ _id: applicantId }).then(app => {
        console.log(app)
        resData.applicant = app;
        User.findOne({ _id: app.user }).then(user => {
            resData.user = user;
            console.log(`resdata: ${resData.applicant}`);
            return res.status(200).json(resData);
        }).catch(err => { return res.status(400).json(err) })
    }).catch(err => { return res.status(400).json(err) })
})

router.post('/getUserFromId', (req, res) => {
    var userId = req.body.userId;
    User.findOne({ _id: userId }).then(user => {
        res.status(200).json(user);
    }).catch(err => res.status(400).json(err));
})


router.post('/getApplicantFromId', (req, res) => {
    console.log('hey')
    var applicantId = req.body.applicantId;
    Applicant.findOne({ _id: applicantId }).then(user => {
        res.status(200).json(user);
    }).catch(err => res.status(400).json(err));
})

router.post('/rejectApplicant', (req, res) => {
    console.log('hey');
    var applicationId = req.body.applicationId;
    Application.findOne({_id: applicationId}).then(application => {
        application.status = 'rejected';
        application.save();
        return res.status(200).json(application)
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    })
})

router.post('/shortlistApplicant', (req, res) => {
    console.log('hey');
    var applicationId = req.body.applicationId;
    Application.findOne({_id: applicationId}).then(application => {
        application.status = 'shortlisted';
        application.save();
        return res.status(200).json(application)
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    })
})

router.post('/acceptApplicant', (req, res) => {
    console.log('hey');
    var applicationId = req.body.applicationId;
    Application.findOne({_id: applicationId}).then(application => {
        application.status = 'accepted';
        application.save();
        return res.status(200).json(application)
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    })
})

module.exports = router;