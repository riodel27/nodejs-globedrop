const mongoose = require('mongoose')

module.exports = async (url) => {
   const connection = await mongoose.connect(url, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })

   return connection.connection.db
}
