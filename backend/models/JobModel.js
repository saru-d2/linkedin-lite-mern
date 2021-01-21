const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobRatingSchema = Schema({
    rating: {
        type: Number, min: 0, max: 5, required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'applications', required: true
    }
});

const JobSchema = new Schema({
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'applications', required: true
        }
    ],
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recruiters', required: true
    },
    jobType: {
        type: String,
    },
    salary: {
        type: Number
    },
    duration: {
        type: Number
    },
    deadline: {
        type: Date,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
    jobTitle: {
        type: String,
        required: true
    },
    maxApplicants: {
        type: Number,
        required: true,
    },
    maxPositions: {
        type: Number,
        required: true
    },
    ratings: {
        type: [jobRatingSchema],
    },
    skills :[{
        lang : { type: String, required: true },   
    }],
})

module.exports = Job = mongoose.model('Jobs', JobSchema);