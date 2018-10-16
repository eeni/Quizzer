module.exports = (mongoose) => {
  let quizModel = mongoose.models.quizzes

  if(!quizModel) {
    const ObjectId = mongoose.Schema.Types.ObjectId

    const quizSchema = mongoose.Schema({
      quizName: {type: String, required: true},
      topics: {type: [String]},
      subtopics: {type: [String]},
      difficulty: {type: Number},
      status: {type: String},
      userId: {type: ObjectId},
      slug:{type: String, required: true, unique: true}
    })

    quizModel = mongoose.model('quizzes', quizSchema)
  }

  return quizModel
}