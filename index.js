require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('api/info', (req, res) => {
    const people = Person.find({}).then(people => {
        res.json(people)
    })
    const now = new Date();
    const count = people.length;
    const infotext = `
        <html lang="en">
            <body>
                <p>Phonebook has info for ${count} people</p><br /><p>${now}</p>
            </body>
        </html>
    `;
    res.send(infotext);
})

app.get('/api/people/', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/people/:id', (request, response) => {
    Person.findById(request.params.id)
          .then(person => {
              if (person) {
                  response.json(person)
              } else {
                  response.status(404).end()
              }
          })
          .catch(error => next(error))
})

app.post('/api/people', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({error: 'name and number is required'})
    }
    // if (persons.some(person => person.name === body.name) ) {
    //     return response.status(400).json({ error: 'name is already in use' })
    // }
    const person = new Person({
        name: body.name,
        number: body.number || ''
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/people/:id', (request, response) => {
    const {name, number} = request.body
    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }
            person.name = name
            person.number = number
            person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
          .then(result => {
              response.status(204).end()
          })
          .catch(error => {
              next(error)
          })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})