module.exports = (mongoose) => {
  let quizModel = mongoose.models.quizzes

  if(!quizModel) {
    const ObjectId = mongoose.Schema.Types.ObjectId

    const quizSchema = mongoose.Schema({
      quizName: {type: String},
      topics: {type: [String]},
      subtopics: {type: [String]},
      difficulty: {type: Number},
      status: {type: String},
      userId: {type: ObjectId},
      slug:{type: String, unique: true},
      cover: {type: String}
    })

    quizModel = mongoose.model('quizzes', quizSchema)
  }

  return quizModel
}