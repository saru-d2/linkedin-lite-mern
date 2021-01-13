const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RecruiterSchema = new Schema({
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', required: true
    },
	contactNumber :{
        type: Number,
        required: true,
        default: 0
    },
    Bio :{
        type: String,
        required: true
    }
});

module.exports = Recruiter = mongoose.model("Recruiters", RecruiterSchema);
