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

const editAppValidator = require('../validators/applicant/editAppValidator')

router.post('/', authMiddleware((req, res, midRes) => {
    console.log('conected');
    console.log(midRes)
    console.log(req.headers.authtoken)
    return res.json('connected');
}));


router.post('/viewjobs', authMiddleware((req, res, midRes) => {
    console.log('viewJobs');
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    var curDate = new Date();
    Job.find({ deadline: { $gt: curDate } }).then(jobs => {
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
    console.log('apply')
    // console.log(req.body)
    var jobData = req.body.job;
    // console.log(jobData)
    var email = req.body.email;
    var SOP = req.body.SOP;
    // console.log(midRes)
    User.findOne({ email }).then(user => {
        Applicant.findOne({ user }).then(applicant => {
            if (!applicant) { return res.status(400).json({ msg: 'user not in applicants' }) }
            // console.log(applicant);
            Job.findOne({ _id: jobData._id }).then(job => {
                if (!job) return res.status(400).json({ msg: 'job not in database' });

                const newApplication = new Application({
                    applicant: applicant,
                    job: job,
                    SOP: SOP,
                    status: 'applied',
                    recruiter: job.recruiter,
                })
                Application.findOne({ job: job, applicant: applicant }).then(application => {
                    // console.log(`application: ${application}`);
                    if (application) {
                        console.log('only one per person per job')
                        return res.status(400).json({ msg: 'Uve already applied for this job' });
                    }
                    newApplication.save().then(application => {
                        job.numApplicants += 1;
                        job.save();
                        res.status(200).json(application);
                    }).catch(err => { console.log(err); return res.status(400).json(err) })
                }).catch(err => {
                    console.log(err);
                    return res.status(400).json({ msg: 'something weird' })
                });
            }).catch(err => { return res.status(400).json(err) })
        }).catch(err => { console.log(err); return res.status(400).json(err) })
    }).catch(err => { console.log(err); return res.status(400).json(err) })
}))

router.post('/listApplications', authMiddleware((req, res, midRes) => {
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    Applicant.findOne({ user: midRes.id }).then(applicant => {
        Application.find({ applicant }).populate('job').populate({
            path: 'recruiter',
            populate: {
                path: 'user',
                model: 'Users',
            },
        }).then(applications => {
            console.log(applications)
            return res.json(applications);
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

router.post('/getPrevApplications', authMiddleware((req, res, midRes) => {
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    var userId = midRes.id;
    console.log(userId)
    // console.log(midRes);
    Applicant.findOne({ user: userId }).then(applicant => {
        console.log(applicant)
        Application.find({ applicant: applicant, status: { $ne: 'rejected' } }).then(applications => {
            console.log(applications)
            return res.status(200).json(applications)
        }).catch(err => {
            console.log(err)
            return res.status(400).json(err);
        })
    }).catch(err => {
        console.log(err)
        return res.status(400).json(err);
    })
}))


router.post('/getAcceptedApp', authMiddleware((req, res, midRes) => {
    console.log('getApplicant')
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    var userId = midRes.id;
    Applicant.findOne({ user: userId }).then(applicant => {
        Application.findOne({ status: 'accepted', applicant: applicant }).then(accApp => {
            if (!accApp) return res.json(false);
            return res.json(true);
        })
    }).catch(err => {
        return res.status(400).json(err);
    })
}))

router.post('/rateJob', authMiddleware((req, res, midRes) => {
    console.log('rateJob')
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    Application.findOne({ _id: req.body.application._id }).then(application => {
        application.jobRated = true;
        application.save();
        Job.findOne({ _id: application.job }).then(job => {
            job.numRated += 1;
            job.totalRating += Number(req.body.rating);
            job.save();
            return res.json(job);
        }).catch(err => { console.log(err) })
    }).catch(err => { console.log(err) })
}))

router.post('/getApplicantUser', authMiddleware((req, res, midRes) => {
    console.log('getApplicantUser')
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    Applicant.findOne({ user: midRes.id }).populate('user').then(applicant => {
        return res.json(applicant)
    }).catch(err => { return res.status(400).json(err) })
}))

router.post('/editUser', authMiddleware((req, res, midRes) => {
    console.log('editUser');
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    console.log(req.body);
    const { errors, isValid } = editAppValidator(req.body);
    if (!isValid) {
        return res.status(400).json(errors)
    }
    Applicant.findOne({ user: midRes.id }).then(applicant => {
        applicant.education = req.body.education;
        applicant.skills = req.body.skills;
        applicant.save();

        User.findOne({ _id: midRes.id }).then(user => {
            user.name = req.body.name;
            user.save();
            return res.json(user);
        }).catch(err => { return res.status(400).json({ msg: err }) })
    }).catch(err => { return res.status(400).json({ msg: err }) })

}))


router.post('/addImg', authMiddleware((req, res, midRes) => {
    console.log('addImg');
    if (midRes.type !== 'applicant') {
        return res.status(500).json({ msg: 'not an applicant' })
    }
    console.log(req.body);
    Applicant.findOne({user: midRes.id}).then( applicant => {
        applicant.img = req.body.img;
        applicant.save();
        return res.json(applicant);
    })
}))


module.exports = router;