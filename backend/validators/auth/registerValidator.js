const Validator = require('validator');
const isEmpty = require('is-empty');

function registerValidate(data) {
    var errors = {};
    if (isEmpty(data.name)) { data.name = '', errors.name = 'please enter your name' };

    if (isEmpty(data.email)) { data.email = ''; errors.email = 'please enter your email' }
    else if (!Validator.isEmail(data.email)) { errors.email = 'please enter valid email id' }

    if (isEmpty(data.password)) { data.password = ''; errors.password = 'please enter a password' }
    if (isEmpty(data.password_confirm)) { data.password_confirm = ''; errors.password_confirm = 'please confirm your password' }

    else if (!Validator.equals(data.password, data.password_confirm)) {
        errors.password_confirm = "passwords have to match!";
    }

    return {
        errors, isValid: isEmpty(errors)
    };
};

module.exports = registerValidate;