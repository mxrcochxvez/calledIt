//VALIDATION
const Joi = require('joi');

//REGISTER VALIDATION
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(3).required()
    });

    return schema.validate(data);
}

module.exports = {
    registerValidation,
    loginValidation
}