require('dotenv').config()
const mongoose = require('mongoose')

// usage: node mongo.js Anna 040-1234556

const url = process.env.MONGODB_URI

const initPeople = [
  {
    name: 'Arto Hellas',
    number: '040-1231244',
  },
  {
    name: 'Brock',
    number: '041-5555555',
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
  {
    name: 'Matti Meikäläinen',
    number: '123-4567890',
  },
  {
    name: 'Ash Ketchum',
    number: '044-12345679'
  },
  {
    name: 'Henri Väisänen',
    number: '044-040404',
  },
]

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

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 2) {
  console.log('Fetching phonebook data...')
  Person.find({}).then(result => {
    console.log('Results:')
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

  person.save().then(_ => {
    console.log('Added', name + '\'s number', number, 'to phonebook!\n')
    mongoose.connection.close()
  })
} else if (process.argv.length === 3 && process.argv[2] === 'init') {
  console.log(process.argv)
  initPeople.forEach(person => {
    new Person({ name: person.name, number: person.number }).save().then(_ => {
      console.log('Added', person.name + '\'s number', person.number, 'to phonebook!\n')
    })
  })
  mongoose.connection.close
  process.exit(0)
} else {
  console.log('You didn\'t pass any arguments\n', process.argv)
  process.exit(1)
}
