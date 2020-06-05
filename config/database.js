const mongoose = require("mongoose");

function db() {
  mongoose
    .connect("mongodb://localhost/gitFinder", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => console.log("Couldn't connect to the database"));
}
module.exports = db;
