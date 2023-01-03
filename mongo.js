require('dotenv').config()
const mongoose = require("mongoose")

// usage: node mongo.js Anna 040-1234556

const url = process.env.MONGODB_URI

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 2) {
	console.log("Fetching phonebook data...")
	Person.find({}).then(result => {
		console.log("Results:")
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
} else if (process.argv.length === 4) {
	const [, , name, number] = process.argv

	const person = new Person({
		name: name,
		number: number,
	})

	person.save().then(result => {
		console.log("Added", name + "'s number", number, "to phonebook!\n")
		mongoose.connection.close()
	})
} else {
	console.log("You didn't pass any arguments\n", process.argv)
	process.exit(1)
}
