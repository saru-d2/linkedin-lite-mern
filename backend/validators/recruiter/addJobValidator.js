const Validator = require('validator');
const isEmpty = require('is-empty');
const { default: validator } = require('validator');

function addJobValidator(data){
    var errors = {};
    console.log(data)
    if (isEmpty(data.email)) { data.email = ''; errors.email = 'please enter your email' }
    else if (!Validator.isEmail(data.email)) { errors.email = 'please enter valid email id' }

    if (isEmpty(data.salary)){
        errors.salary = 'please enter salary'
    } else if (!Validator.isDecimal(data.salary)) {
        errors.salary = 'salary is an integer'
    }


    if (isEmpty(data.maxApplicants)){
        errors.maxApplicants = 'please enter maxApplicants'
    } else if (!Validator.isDecimal(data.maxApplicants)) {
        errors.maxApplicants = 'maxApplicants is an integer'
    }


    if (isEmpty(data.maxPositions)){
        errors.maxPositions = 'please enter maxPositions'
    } else if (!Validator.isDecimal(data.maxPositions)) {
        errors.maxPositions = 'salary is an integer'
    }


    if (isEmpty(data.duration)){
        errors.duration = 'please enter duration'
    } else if (!Validator.isDecimal(data.duration)) {
        errors.duration = 'duration is an integer'
    }

    if (isEmpty(data.deadline)){
        errors.deadline = 'please enter deadline'
    } 

    if (isEmpty(data.skills)){
        errors.skills = 'have higher standards'
    }

    if (isEmpty(data.title)){
        errors.title = 'pls give title'
    }

    console.log(errors)
    return { errors, isValid: isEmpty(errors) };
}

module.exports = addJobValidator;