const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

const PORT = process.env.PORT || 3001
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] :data /// :response-time ms"))
app.use(cors())

morgan.token("data", (req, res) => {
	if (req.method === "POST") return JSON.stringify(req.body)
})

let people = [
	{
		name: "Arto Hellas",
		number: "040-1231244",
		id: 1,
	},
	{
		name: "Brock",
		number: "041-5555555",
		id: 3,
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 4,
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 5,
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 6,
	},
	{
		name: "Matti Meikäläinen",
		number: "123-4567890",
		id: 7,
	},
	{
		name: "Henri Väisänen",
		number: "044-040404",
		id: 8,
	},
]

const randomId = () => {
	const { max, min } = { max: 10000, min: 10 }

	return Math.floor(Math.random() * (max - min) + min)
}

app.get("/info", (req, res) => {
	res.send(
		`<p>Phonebook has info of ${people.length} people</p>
        <p>${Date()}</p>`
	)
})

app.get("/api/persons", (req, res) => {
	res.json(people)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = people.find(p => p.id === id)

	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.post("/api/persons", (req, res) => {
	const personData = req.body

	if (!personData.name || !personData.number) {
		return res.status(400).json({
			error: "Name or number data is missing",
		})
	}

	if (people.some(p => p.name === personData.name)) {
		return res.status(400).json({
			error: `${personData.name} is already in the phonebook`,
		})
	}

	const person = {
		name: personData.name,
		number: personData.number,
		id: randomId(),
	}

	people = people.concat(person)

	res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	people = people.filter(person => person.id !== id)

	res.status(204).end()
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
