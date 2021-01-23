const express = require("express");
const router = express.Router();
const FuzzySearch = require("fuzzy-search");
const isEmpty = require('is-empty')
const User = require('../models/UserModel');
const Applicant = require('../models/ApplicantModel');
const Recruiter = require('../models/RecruiterModel');
const Job = require('../models/JobModel');
const Application = require('../models/ApplicationModel');

const authMiddleware = require('../middleware/authMiddleware');
const { application } = require("express");

router.post('/', authMiddleware((req, res, midRes) => {
    console.log('conected');
    console.log(midRes)
    return res.json('connected');
}));


router.post('/viewjobs', authMiddleware((req, res, midRes) => {
    console.log('viewJobs');
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    var curDate = new Date();
    Job.find({deadline: {$gt : curDate}}).then(jobs => {
        // console.log(req.body.search);

        if (req.body.search && !isEmpty(req.body.search)) {
            console.log('searching for ' + req.body.search)
            const searcher = new FuzzySearch(jobs, ['jobTitle'], { caseSensitive: false, sort: true, });
            jobs = searcher.search(req.body.search);
        }

        return res.json(jobs);
    }).catch(err => { return res.status(400).json(err) });
}))


router.post('/getRecruiterUser', authMiddleware((req, res, midRes) => {
    console.log('getRecruiterUser');
    
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    var _id = req.body.recId;
    Recruiter.findOne({ _id }).populate('user').then(recruiter => {
        // console.log(recruiter);
        res.json(recruiter);
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    })
}))

router.post('/getJobDetails', authMiddleware((req, res, midRes) => {
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    var _id = req.body.jobId;
    // console.log(req.body);
    // console.log('hi');
    Job.findOne({ _id }).populate({
        path: 'recruiter',
        populate: {
            path: 'user',
            model: 'Users'
        }
    }).then(job => {
        // console.log(job)
        return res.status(200).json(job);
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    })
}))

router.post('/applyForJob', authMiddleware((req, res, midRes) => {
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    // console.log(req.body)
    var jobData = req.body.job;
    // console.log(jobData)
    var email = req.body.email;
    var SOP = req.body.SOP;
    // console.log(midRes)
    Applicant.findOne({}).populate({
        path: 'user',
        match: { email: email },
    }).then(applicant => {
        if (!applicant) { return res.status(400).json({ msg: 'user not in applicants' }) }
        // console.log(applicant);
        Job.findOne({ _id: jobData._id }).then(job => {
            if (!job) return res.status(400).json({ msg: 'job not in database' });
            const newApplication = new Application({
                applicant: applicant,
                job: job,
                SOP: SOP,
                status: 'applied',
            })
            Application.findOne({ job: job, applicant: applicant }).then(application => {
                // console.log(`application: ${application}`);
                if (application) {
                    console.log('only one per person per job')
                    return res.status(400).json({ msg: 'Uve already applied for this job' });
                }
                newApplication.save().then(application => {
                    // console.log(application);
                    var jobApplicantsList = job.applications;
                    jobApplicantsList = [...jobApplicantsList, application];
                    job.applications = jobApplicantsList;
                    job.save();
                    res.status(200).json(application);
                }).catch(err => { console.log(err); return res.status(400).json(err) })
            }).catch(err => {
                console.log(err);
                return res.status(400).json({ msg: 'something weird' })
            });
        }).catch(err => { return res.status(400).json(err) })
    }).catch(err => { console.log(err); return res.status(400).json(err) })
}))

router.post('/listApplications', authMiddleware((req, res, midRes) => {
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    var userEmail = req.body.userEmail;
    // console.log(userEmail)
    Applicant.findOne({}).populate({
        path: 'user',
        match: { email: userEmail },
    }).then(applicant => {
        Application.find({ applicant: applicant }).then(applications => {
            return res.status(200).json(applications);
        }).catch(err => { return res.status(400).json(err) })
    }).catch(err => { return res.status(400).json(err) })
}))

router.post('/getJobFromApplication', authMiddleware((req, res, midRes) => {
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    var jobId = req.body.jobId;
    Job.findOne({ _id: jobId })
        .then(job => {
            // console.log(job)
            return res.status(200).json(job);
        }).catch(err => {
            console.log(err)
            return res.status(400).json(err);
        })
}))

module.exports = router;