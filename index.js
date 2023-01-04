require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./models/person')
const app = express()

const PORT = process.env.PORT
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] :data /// :response-time ms"))
app.use(cors())
app.use(express.static("dist"))

morgan.token("data", (req) => {
	if (req.method === "POST") return JSON.stringify(req.body)
})

app.get("/info", (req, res) => {
	Person.find({}).then(people => {
		res.send(
			`<p>Phonebook has info of ${people.length} people</p>
									<p>${Date()}</p>`
		)
	})
})

app.get("/api/persons", (req, res, next) => {
	Person.find({}).then(persons => { res.json(persons)}).catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
	const id = req.params.id
	Person.findById(id)
		.then(person => res.json(person))
		.catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
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

	person.save().then(savedContact => 	res.json(savedContact)).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	const person = {
		name: req.body.name,
		number: req.body.number
	}
	Person.findByIdAndUpdate(id, person, {returnDocument: 'after'}).then(updatedPerson => {
		res.json(updatedPerson).end()
	}).catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
	const id = req.params.id
	Person.findByIdAndRemove(id).then(_ => {
		res.status(204).end()
	}).catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.name, error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`🔥 Server running on port ${PORT}`)
})
