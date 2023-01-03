require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})
    .then(_result => console.log('✅ Connected to  MongoDB\n'))
    .catch((error) => { console.log('🛑 Error connecting to MongoDB:\n', error.message)})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)
