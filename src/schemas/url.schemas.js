import Joi from "joi"

export const urlSchema = Joi.object({
    urlOriginal: Joi.string().uri().required()
})