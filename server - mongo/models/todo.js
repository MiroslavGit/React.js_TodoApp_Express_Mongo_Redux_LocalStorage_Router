const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  state: {
    type: Number,
    min: 0,
    max: 2,
    default: 0,
  },
  userId: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Todo', todoSchema);