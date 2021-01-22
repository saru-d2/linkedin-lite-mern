const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplicantSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', required: true
    },
    totalRating: {
        type: Number,
        required: true,
        default: 0
    },
    education: [{
        instiName: { type: String, required: true },
        startYear :  { type: String, required: true },
        endYear:  { type: String }
    }],
    skills :[{
        lang : { type: String, required: true },   
    }],
    numRated: {
        type: Number,
        required: true,
        default: 0
    },
    
});

module.exports = Applicant = mongoose.model('Applicants', ApplicantSchema);
