import Joi from "joi";

export const createProductSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  color: Joi.string().required(),
  size: Joi.string().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(1).required(),
  image_path: Joi.string().uri().required(),
});

export const deleteProductSchema = Joi.object({
  id: Joi.number().required(),
});
