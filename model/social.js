const mongoose = require('mongoose')

const SocialSchema = new mongoose.Schema({
  type: {type: String, required: [true, 'Social type missing']},
  identifier: {type: String, required: [true, 'Social identifier missing']},
  extraData: Array
}, { timestamps: true })
const UserModel = mongoose.model(UserSchema)

module.exports = UserModel