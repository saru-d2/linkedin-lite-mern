const Validator = require('validator');
const isEmpty = require('is-empty');


function editAppValidator(data) {
    var errors = {}
    if (isEmpty(data.name)) { data.email = ''; errors.name = 'please enter your email' }

    if (!data.education) {
        errors.education = 'some education?'
    }
    data.education.map((edu, idx) => {
        console.log(edu);
        if (isEmpty(edu.instiName) || isEmpty(edu.startYear)) errors.education = 'only end year is optional, fill the rest';
        else if (!Validator.isDecimal(edu.startYear) || (!isEmpty(edu.endYear) && !Validator.isDecimal(edu.endYear))) errors.education = 'years are numbers'
    })

    if (!data.skills || isEmpty(data.skills)) {
        errors.skills = 'cmon no skills?'
    }

    console.log(errors)
    return { errors, isValid: isEmpty(errors) };
}

module.exports = editAppValidator;