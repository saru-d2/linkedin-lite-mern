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
    User.findOne({ email })
        .then(user => Recruiter.findOne({ user }).lean()
            .then(recruiter => {
                Job.find({ recruiter, deadline: { $gt: curDate } }).then(jobs => {
                    return res.json(jobs);
                }).catch(err => {
                    console.log(err);
                    res.status(400).json({ msg: 'some niche error in recruitRouter.js' });
                })

            })
            .catch(e => { return res.status(400).json({ msg: 'user not found with email' }) })).catch(err => { console.log(err); return res.status(400).json(err) })
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
        Application.find({ job }).populate({
            path: 'applicant',
            populate: {
                path: 'user'
            }
        }).then(applications => {
            console.log(applications);
            return res.status(200).json(applications);
        }).catch(err => { return res.status(400).json(err) })
    }).catch(err => { return res.status(400).json(err) })
}))

router.post('/getAccForRec', authMiddleware((req, res, midRes) => {
    console.log('getaccforRec');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var userId = midRes.id;
    Recruiter.findOne({ user: userId }).then(recruiter => {
        console.log(userId)
        Application.find({ recruiter: recruiter, status: 'accepted' }).populate('job').populate({
            path: 'applicant',
            populate: {
                path: 'user'
            }
        }).then(applications => {
            console.log(applications);
            return res.json(applications)
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

router.post('/rejectApplicant', authMiddleware((req, res, midRes) => {
    console.log('rejectapplicant');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var applicationId = req.body.applicationId;
    Application.findOne({ _id: applicationId }).then(application => {
        application.status = 'rejected';
        application.save();
        return res.status(200).json(application)
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    })
}))

router.post('/shortlistApplicant', authMiddleware((req, res, midRes) => {
    console.log('shortlistapplicant');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var applicationId = req.body.applicationId;
    Application.findOne({ _id: applicationId }).then(application => {
        application.status = 'shortlisted';
        application.save();
        return res.status(200).json(application)
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    })
}))

router.post('/acceptApplicant', authMiddleware((req, res, midRes) => {
    console.log('acceptapplicant');
    if (midRes.type !== 'recruiter') {
        console.log('not recruiter')
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var applicationId = req.body.applicationId;
    Application.findOne({ _id: applicationId }).then(application => {
        application.status = 'accepted';
        application.save();
        console.log(application)
        Application.find({ applicant: { $ne: application.applicant } }).exec((err, doc) => {
            console.log('hi')
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            }
            console.log(doc);
            if (doc._id !== applicationId) {
                doc.status = 'rejected'
            }
            Job.findOne({ _id: application.job }).then(job => {
                job.numAccepted = job.numAccepted + 1;
                job.save();
                return res.json(application);
            })
        })
    }).catch(e => { return res.status(400).json(e) })
}))

router.post('/editJob', authMiddleware((req, res, midRes) => {
    console.log('editjob');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    var j = req.body;
    console.log(req.body);
    Job.findOne({ _id: req.body._id }).then(job => {
        job.jobTitle = j.jobTitle;
        job.maxApplicants = j.maxApplicants;
        job.maxPositions = j.maxPositions;
        job.deadline = j.deadline;
        job.jobType = j.jobType;
        job.deadline = j.deadline;
        job.salary = j.salary;
        job.skills = j.skills;
        job.duration = j.duration

        job.save();
        return res.status(200).json(job);
    })
}))

router.post('/deleteJob', authMiddleware((req, res, midRes) => {
    console.log('deletejob');
    if (midRes.type !== 'recruiter') {
        return res.status(500).json({ msg: 'not an recruiter' })
    }
    Job.deleteOne({ _id: req.body._id }).then(job => {
        console.log(job);
        Application.deleteMany({ job: req.body._id }).then(applications => {
            console.log(applications);
            return res.status(200).json(job);
        })
    })
}))

module.exports = router;
