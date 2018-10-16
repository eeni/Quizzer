const Validator = require('../base/validator')

class QuestionValidator extends Validator {
  data(joi) {
    return {
      question: joi.string().min(3).required().required(),
      answers: joi.array().strict().items(joi.string().trim().min(3)).required(),
      correct_answer: joi.string().min(3).trim(),
      quiz_id: joi.string().alphanum().min(3).max(30).required().required(),
    }
  }
}

module.exports = QuestionValidator