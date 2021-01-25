const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiters', required: true
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
    numApplicants: {
        type: Number,
        required: true,
        default: 0,
    },
    numAccepted: {
        type: Number,
        required: true,
        default: 0,
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