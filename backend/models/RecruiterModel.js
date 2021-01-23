const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RecruiterSchema = new Schema({
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', required: true
    },
	contactNumber :{
        type: String,
        required: true,
        default: 0
    },
    Bio :{
        type: String,
        required: true
    }
});

module.exports = Recruiter = mongoose.model("Recruiters", RecruiterSchema);
