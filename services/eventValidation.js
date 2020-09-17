//VALIDATION
const Joi = require('joi');

//REGISTER VALIDATION
const postValidation = (data) => {
    const schema = Joi.object({
        name: Joi.required(),
        date: Joi.date()
    });

    return schema.validate(data);
}

module.exports = postValidation;