const Validator = require('validator');
const isEmpty = require('is-empty');

function recruiterValidate(data) {
    var errors = {}
    if (isEmpty(data.email)) { data.email = ''; errors.email = 'please enter your email' }
    else if (!Validator.isEmail(data.email)) { errors.email = 'please enter valid email id' }

    if (isEmpty(data.contactNumber)) {
        errors.contactNumber = 'please enter a number';
    } else if (!Validator.isMobilePhone(data.contactNumber, "en-IN", {strictMode: true})) {
        errors.contactNumber = "please provide number as +91__________"
    }

    console.log(errors)
    return { errors, isValid: isEmpty(errors) };
}

module.exports = recruiterValidate;