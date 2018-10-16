const mongoose = require('mongoose');
const Quiz = require('../models/quiz')(mongoose)
const Question = require('../models/question')(mongoose)
const httpStatus = require('../enums/http-status')
const slugify = require('slugify')
const uniqueSlug = require('../helpers/unique-slag')
const quizStatus = require('../enums/quiz-status')
const minimumQuestionNumber = 10

//TODO difficulty is between 1-5
//TODO check quiz status
//TODO topics and subtopics are arrays
class QuizController {
  async create (req, res) {
    try {
      const name = req.body.quiz_name
      const topics = req.body.topics
      const subtopics = req.body.subtopics
      const difficulty = req.body.difficulty
      const status = quizStatus.inactive
      let slug = slugify(name, { lower: true })

      const existing = await Quiz.findOne({slug: slug})

      if (existing)
        slug = await uniqueSlug(slug, Quiz)
      
      let savedQuiz = new Quiz({
        quizName: name,
        topics: topics,
        subtopics: subtopics,
        difficulty: difficulty,
        slug: slug,
        status: status,
        userId: req.user.id
      })

      savedQuiz = await savedQuiz.save()
      
      return res.send(savedQuiz)
    } catch (error) {
      console.log(error.message);
      return res.status(httpStatus.internal_server_error).send({error: error.message})
    }
  }

  async index (req, res) {
    try {
      const status = quizStatus.active

      const query = {
        status: status
      }  

      if (req.query.name)
        query['quizName'] = `/.*${req.query.name}.*/`

      if (req.query.subtopic)
        query['subtopics'] = req.query.subtopic
        
      const quizzes = await Quiz.find(query)
      
      return res.send({quizzes: quizzes})

    } catch (error) {
      console.log(error.message);
      return res.status(httpStatus.internal_server_error).send({error: error.message})
    }
  }

  async show (req, res) {
    try {
      let quiz = await Quiz.findOne({
        $or: [
          {slug: req.params.property},
          {_id: req.params.property}
        ]
      })

      if(!quiz)
        return res.status(httpStatus.not_found).send({error: 'Quiz not found'})
  
      let questions = []  

      questions = await Question.find({
        'quizId': quiz._id
      })  

      quiz = quiz.toObject()

      quiz['questions'] = questions

      return res.send({quiz: quiz})
    } catch (error) {
      console.log(error.message);
      return res.status(httpStatus.internal_server_error).send({error: error.message})
    }
  }

  async publishQuiz(req,res) {
    try {
      const quiz = await Quiz.findOne({
        $or: [
          {slug: req.params.property},
          {_id: req.params.property}
        ]
      })

      if (!quiz)
        return res.status(httpStatus.not_found).send({error: 'This quiz does not exists'})

      const questions = await Question.find({
        'quizId': quiz._id
      })  

      if (questions && questions.length < minimumQuestionNumber)
        return res.status(httpStatus.unprocessable_entity).send({error: `Quiz should have ${minimumQuestionNumber} or more questions to be published`})

      quiz.status = quizStatus.active
      
      const savedQuiz = await quiz.save()

      return res.send({quiz: savedQuiz})
    } catch (error) {
      console.log(error.message)
      return res.status(httpStatus.internal_server_error).send(error.message)
    }
  }
}

module.exports = QuizController;