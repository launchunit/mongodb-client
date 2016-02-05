
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
      // allowOnly: 'Only specific values are allowed for {{key}}.'
    },
    string: {
      'min': '{{key}} is invalid.',
      'base': '{{key}} is invalid.'
      // 'guid': 'Only specific values are allowed for {{key}}.'
    },
    date: {
      base: '{{key}} is not a valid date.',
    }
  }
};
