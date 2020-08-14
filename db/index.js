const mongoose = require("mongoose");

module.exports.connect = async (url) =>
  mongoose.connect(url, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
