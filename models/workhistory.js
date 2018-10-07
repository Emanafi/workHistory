const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workSchema = new Schema({
  type: String,
  name: String,
});

const Work = mongoose.model('Work', workSchema);

module.exports = Work;
