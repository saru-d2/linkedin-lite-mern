const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    
    numRated: {
        type: Number,
        required: true,
        default: 0
    },
    totalRating: {
        type: Number,
        required: true,
        default: 0
    },
    skills: [{
        lang: { type: String, required: true },
    }],
})

module.exports = Job = mongoose.model('Jobs', JobSchema);