require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./models/person')
const mongoose = require('mongoose')
const app = express()

const PORT = process.env.PORT
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] :data /// :response-time ms"))
app.use(cors())
app.use(express.static("dist"))

morgan.token("data", (req, res) => {
	if (req.method === "POST") return JSON.stringify(req.body)
})

app.get("/info", (req, res) => {
	res.send(
		`<p>Phonebook has info of ${people.length} people</p>
								<p>${Date()}</p>`
	)
})

app.get("/api/persons", (req, res) => {
	console.log("Getting all persons");
	Person.find({}).then(persons => { res.json(persons)}).catch(error => res.status(401).json(error))
})

app.get("/api/persons/:id", (req, res) => {
	const id = req.params.id
	Person.findById(id)
		.then(person => res.json(person))
		.catch(error => res.status(404).json(error))
})

app.post("/api/persons", (req, res) => {
	console.log("Adding new person");
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "Name or number data is missing",
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedContact => 	res.json(savedContact))
})

app.delete("/api/persons/:id", (req, res) => {
	const id = req.params.id
	Person.findByIdAndRemove(id).then(val => {
		console.log(val);
		res.status(204).end();
	}).catch(error => res.json(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
	console.log(`🔥 Server running on port ${PORT}`)
})
