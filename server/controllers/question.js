const mongoose = require('mongoose')
const Question = require('../models/question')(mongoose)
const Quiz = require('../models/quiz')(mongoose)
const httpStatus = require('../enums/http-status')

class QuestionController {

  async create (req,res) {
    //TODO answers length should be more than 3
    try {
      const question = req.body.question
      const answers = req.body.answers
      const correctAnswer = req.body.correct_answer
      const quiz_id = req.body.quiz_id

      const quiz = await Quiz.findOne({
        _id: quiz_id,
      })

      if (!quiz) 
        return res.status(httpStatus.unprocessable_entity).send({error: 'This quiz does not exists'})

      if(quiz.userId != req.user.id) 
        return res.status(httpStatus.forbidden).send({error: 'You cant add questions for this quiz'})
        
      const existingQuestion = await Question.findOne({
        question: question
      })

      if (existingQuestion)
        return res.status(httpStatus.unprocessable_entity).send({error: 'This question already exists in thie quiz'})
        
      let savedQuestion = new Question({
        question: question,
        answers: answers,
        correctAnswer: correctAnswer,
        quizId: quiz_id
      })  

      savedQuestion = await savedQuestion.save()

      return res.send({question: savedQuestion})


    } catch (error) {
      console.log(error.message)
      return res.status(httpStatus.internal_server_error).send({error: error.message})
    }
  }
}

module.exports = QuestionController