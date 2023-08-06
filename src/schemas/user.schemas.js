import Joi from "joi"

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
});

export const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
})