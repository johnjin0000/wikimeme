const mongoose = require('mongoose');

//User Schema
const MemeSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  img:{
     type: String
  },
  year:{
    type: Number,
    required: true
  },
  youtube:{
    type: String
  }
});

const Meme = module.exports = mongoose.model('Meme', MemeSchema);
