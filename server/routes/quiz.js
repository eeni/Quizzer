const QuizController = require('../controllers/quiz')
const QuizCreateValidator = require('../validators/quiz-validator')
const authenticate = require('../middleware/authenticate')

module.exports = (route) => {
  route.post('/api/v1/quizzes', [
    
    new QuizCreateValidator().middleware
  ], new QuizController().create)
  route.get('/api/v1/quizzes', new QuizController().index)
  route.get('/api/v1/quizzes/:property', new QuizController().show)
  route.get('/api/v1/quizzes/publish/:property', authenticate, new QuizController().publishQuiz)
}