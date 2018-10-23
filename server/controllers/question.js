const mongoose = require('mongoose')
const Question = require('../models/question')(mongoose)
const Quiz = require('../models/quiz')(mongoose)
const httpStatus = require('../enums/http-status')

class QuestionController {

  async create (req,res) {

    const questionCreate = async (data) => {
      if(Array.isArray(data)){
        for (let i = 0; i < data.length; i++)
          await questionSave(data[i])
      }
      else {
        await questionSave (data)
      }
    }

    const questionSave = async (questionData) => { 
      //TODO answers length should be more than 3
      try {
        const question = questionData.question
        const answers = questionData.answers
        const correctAnswer = questionData.correct_answer
        const quiz_id = questionData.quiz_id

      const quiz = await Quiz.findOne({
        _id: quiz_id,
      })

      if (!quiz) 
        return res.status(httpStatus.unprocessable_entity).send({error: 'This quiz does not exists'})
        
      // if(quiz.userId != req.user.id) 
      //   return res.status(httpStatus.forbidden).send({error: 'You cant add questions for this quiz'})
        
      const existingQuestion = await Question.findOne({
        question: question,
        quizId: quiz_id
      })

      if (existingQuestion)
        return res.status(httpStatus.unprocessable_entity).send({error: 'This question already exists in thie quiz'})
        
      let savedQuestion = new Question({
        question: question,
        answers: answers,
        correctAnswer: correctAnswer,
        quizId: quiz_id,
        createdAt: new Date()
      })  

      savedQuestion = await savedQuestion.save()

      } catch (error) {
        console.log(error.message)
        return res.status(httpStatus.internal_server_error).send({error: error.message})
      }
    }
  
    await questionCreate (req.body.questions)

    return res.send({status: 'Questions added'})

  }
}

module.exports = QuestionController