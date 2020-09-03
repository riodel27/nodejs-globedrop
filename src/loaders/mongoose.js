const mongoose = require('mongoose')

module.exports = async (url) => {
   try {
      const connection = await mongoose.connect(url, {
         useFindAndModify: false,
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })

      return connection.connection.db
   } catch (error) {
      throw new Error(error)
   }
}
