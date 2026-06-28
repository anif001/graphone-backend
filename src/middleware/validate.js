const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(v => v.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(e => e.msg);
      throw new ApiError(400, messages.join('; '));
    }

    next();
  };
};

module.exports = validate;
