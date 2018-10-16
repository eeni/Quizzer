const Validator = require('../base/validator')

class QuizCreateValidator extends Validator {
  data(joi) {
    return {
      quiz_name: joi.string().min(3).required().required(),
      topics: joi.array().strict().items(joi.string()).required(),
      subtopics: joi.array().strict().items(joi.string()).required(),
      difficulty: joi.number().min(1).max(5).required(),
    }
  }
}

module.exports = QuizCreateValidator