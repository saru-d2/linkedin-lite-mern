const Validator = require('validator');
const isEmpty = require('is-empty');


function editRecValidator(data) {
    var errors = {}
    if (isEmpty(data.name)) { data.email = ''; errors.name = 'please enter your email' }

    if (isEmpty(data.contactNumber)) {
        errors.contactNumber = 'please enter a number';
    } else if (!Validator.isMobilePhone(data.contactNumber, "en-IN", {strictMode: true})) {
        errors.contactNumber = "please provide number as +91__________"
    }

    if (isEmpty(data.Bio)) { data.Bio = ''; errors.Bio = 'please enter your Bio' }


    console.log(errors)
    return { errors, isValid: isEmpty(errors) };
}

module.exports = editRecValidator;