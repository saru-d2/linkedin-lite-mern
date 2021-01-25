const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
    applicant: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Applicants', required: true
    },
    recruiter: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Recruiters', required: true
    },
    SOP: {
        type: String
    },
    status: {
        type: String
    },
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Jobs', required:true
    },
    date : {
        type: Date,
        default: Date.now,
    }
})

module.exports = Application = mongoose.model("Applications", ApplicationSchema);
