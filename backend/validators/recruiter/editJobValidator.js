const Validator = require('validator');
const isEmpty = require('is-empty');

function editJobValidator(data){
    var errors = {};
    console.log(data)
    

    if (isEmpty(data.salary)){
        errors.salary = 'please enter salary'
    } else if (!Validator.isDecimal(String(data.salary))) {
        errors.salary = 'salary is an integer'
    }


    if (isEmpty(data.maxApplicants)){
        errors.maxApplicants = 'please enter maxApplicants'
    } else if (!Validator.isDecimal(String(data.maxApplicants))) {
        errors.maxApplicants = 'maxApplicants is an integer'
    }


    if (isEmpty(data.maxPositions)){
        errors.maxPositions = 'please enter maxPositions'
    } else if (!Validator.isDecimal(String(data.maxPositions))) {
        errors.maxPositions = 'salary is an integer'
    }


    if (isEmpty(data.duration)){
        errors.duration = 'please enter duration'
    } else if (!Validator.isDecimal(String(data.duration))) {
        errors.duration = 'duration is an integer'
    } else if (data.duration < 0 || data.duration > 6) {
        errors.duration = 'duration is from 0-6'
    }

    if (isEmpty(data.deadline)){
        errors.deadline = 'please enter deadline'
    } 

    if (isEmpty(data.skills)){
        errors.skills = 'have higher standards'
    }

    if (isEmpty(data.jobTitle)){
        errors.title = 'pls give title'
    }

    console.log(errors)
    return { errors, isValid: isEmpty(errors) };
}

module.exports = editJobValidator;