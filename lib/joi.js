
// Joi Validation Errors
module.exports = {
  abortEarly: false,
  convert: true,
  allowUnknown: true,
  stripUnknown: true,
  skipFunctions: true,
  language: {
    any: {
      required: '{{key}} is required.',
      empty: '{{key}} is required.',
    },
    string: {
      'min': '{{key}} is invalid.'
    }
  }
};

