const express = require("express");
const router = express.Router();
const FuzzySearch = require("fuzzy-search");

const User = require('../models/UserModel');
const Applicant = require('../models/ApplicantModel');
const Recruiter = require('../models/RecruiterModel');
const Job = require('../models/JobModel');
const Application = require('../models/ApplicationModel');
const { application } = require("express");

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
    console.log('hi')
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

router.post('/applyForJob', (req, res) => {
    console.log(req.body)
    var jobData = req.body.job;
    console.log(jobData)
    var email = req.body.email;
    var SOP = req.body.SOP;
    User.findOne({ email: email }).then(user => {
        if (!user) return res.status(400).json({ msg: 'userEmail not in db' })
        console.log(user);
        Applicant.findOne({ user }).then(applicant => {
            if (!applicant) { return res.status(400).json({ msg: 'user not in applicants' }) }
            console.log(applicant);
            Job.findOne({ _id: jobData._id }).then(job => {
                if (!job) return res.status(400).json({ msg: 'job not in database' });
                const newApplication = new Application({
                    applicant: applicant,
                    job: job,
                    SOP: SOP,
                    status: 'applied',
                })
                Application.findOne({ job: job, applicant: applicant }).then(application => {
                    console.log(`application: ${application}`);
                    if (application) {
                        console.log('only one per person per job')
                        return res.status(400).json({ msg: 'Uve already applied for this job' });
                    }
                    newApplication.save().then(application => {
                        console.log(application);
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
        }).catch(err => { console.log(err); return res.status(400).json({ err }) })
    }).catch(err => { return res.status(400).json({ err }) })
})

router.post('/listApplications', (req, res) => {
    var userEmail = req.body.userEmail;
    User.findOne({ email: userEmail })
        .then(user => {
            Applicant.findOne({ user: user._id }).then(applicant => {
                Application.find({ applicant: applicant }).then(applications => {
                    return res.status(200).json(applications);
                }).catch(err => { return res.status(400).json(err) })
            }).catch(err => { return res.status(400).json(err) })
        }).catch(err => { return res.status(400).json(err) })
})

router.post('/getJobFromApplication', (req, res) => {
    var jobId = req.body.jobId;
    Job.findOne({ _id: jobId })
        .then(job => {
            console.log(job)
            return res.status(200).json(job);
        }).catch(err => {
            console.log(err)
            return res.status(400).json(err);
        })
})

router.post('/jobSearch', (req, res) => {

})

module.exports = router;