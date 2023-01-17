const Joi = require("joi");

//npm install joi for install package

const userSchema = Joi.object({
  firstname: Joi.string()
    .pattern(/^[a-zA-ZàáâèéêëïôöûùçÀÂÈÉÊËÏÔÛÙÇ '-]+$/)
    .max(255)
    .required(),
  lastname: Joi.string()
    .pattern(/^[a-zA-ZàáâèéêëïôöûùçÀÂÈÉÊËÏÔÛÙÇ '-]+$/)
    .max(255)
    .required(),
  email: Joi.string().email().max(255).required(),
  city: Joi.string()
    .pattern(/^[a-zA-ZàáâèéêëïôöûùçÀÂÈÉÊËÏÔÛÙÇ '-]+$/)
    .max(255)
    .required(),
  language: Joi.string()
    .pattern(/^[a-zA-ZàáâèéêëïôöûùçÀÂÈÉÊËÏÔÛÙÇ '-]+$/)
    .max(255)
    .required(),
});

const validateUser = (req, res, next) => {
  const { firstname, lastname, email, city, language } = req.body;

  const { error } = userSchema.validate(
    { firstname, lastname, email, city, language },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = {
  validateUser,
};
