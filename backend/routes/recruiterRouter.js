const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const User = require('../models/UserModel');
const Applicant = require('../models/ApplicantModel');
const Recruiter = require('../models/RecruiterModel');
const Job = require('../models/JobModel');
const Application = require('../models/ApplicationModel');


//validators
const addJobValidator = require('../validators/recruiter/addJobValidator');

router.post('/', authMiddleware((req, res, midRes) => {
    console.log('conected');
    console.log(midRes)
    return res.json('connected');
}));

router.post('/addJob', authMiddleware((req, res, midRes) => {
    console.log('addjob');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    const { errors, isValid } = addJobValidator(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    Recruiter.findOne({}).populate({
        path: 'user',
        match: { email: email },
    }).then(recruiter => {
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
}))

router.post('/listJobs', authMiddleware((req, res, midRes) => {
    console.log('listjobs');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var curDate = new Date();
    const email = req.body.email;
    console.log(email);
    Recruiter.find({}).populate({
        path: 'user',
        match: { email: { $eq : email} },
    }).then(recruiter => {
        console.log(recruiter);
        Job.find({ recruiter, deadline: { $gt: curDate } }).then(jobs => {
            return res.json(jobs);
        }).catch(err => {
            console.log(err);
            res.status(400).json({ msg: 'some niche error in recruitRouter.js' });
        })
    }).catch(err => { console.log(err); return res.status(400).json(err) })
}))

router.post('/getJobDetails', authMiddleware((req, res, midRes) => {
    console.log('getjobdetails');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var _id = req.body.jobId;
    // console.log(req.body);
    Job.findOne({ _id }).then(job => {
        // console.log(job);
        res.status(200).json(job);
    }).catch(err => {
        console.log(err)
        return res.status(400).json({ msg: 'some niche error in recruiterRouter.js' });
    })
}))

router.post('/getAppsForJobs', authMiddleware((req, res, midRes) => {
    console.log('getappsforjobs');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var _id = req.body.jobId;
    Job.findOne({ _id }).then(job => {
        Application.find({ job }).then(applications => {
            console.log(applications);
            return res.status(200).json(applications);
        }).catch(err => { return res.status(400).json(err) })
    }).catch(err => { return res.status(400).json(err) })
}))

router.post('/getApplicantAndUser', authMiddleware((req, res, midRes) => {
    console.log('getapplicantanduser');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var applicantId = req.body.applicantId;
    console.log(applicantId);
    Applicant.findOne({ _id: applicantId }).populate('user').then(applicant => {
        return res.status(200).json(applicant);
    }).catch(e => { return res.status(400).json(e) })
}))

module.exports = router;
