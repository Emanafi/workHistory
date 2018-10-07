const mongoose = require("mongoose");
const workModel = require("./workhistory.js");

mongoose.connect("mongodb://localhost/personal-api", { useNewUrlParser: true })
  .then(() => console.log('Mongodb connected on port 27017...'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`))

module.exports = {
  workHistory: workModel,
}