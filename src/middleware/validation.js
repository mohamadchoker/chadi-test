const Joi = require("joi")

// Validation schemas
const registrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const profileUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).optional(),
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
})

const locationUpdateSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  accuracy: Joi.number().positive().optional(),
})

// Validation middleware functions
const validateRegistration = (req, res, next) => {
  const { error } = registrationSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details[0].message,
    })
  }

  next()
}

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details[0].message,
    })
  }

  next()
}

const validateProfileUpdate = (req, res, next) => {
  const { error } = profileUpdateSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details[0].message,
    })
  }

  next()
}

const validateLocationUpdate = (req, res, next) => {
  const { error } = locationUpdateSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details[0].message,
    })
  }

  next()
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateLocationUpdate,
}
