require('dotenv').config()
const express = require('express')
const person = require('./models/person')
const app = express()
app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = [
//     {
//         "id": "1",
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": "2",
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": "3",
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": "4",
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(n => Number(n.id)))
//         : 0
//     return String(maxId + 1)
// }

app.get('api/info', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
    const now = new Date();
    const count = people.length;
    const infotext = `
        <html lang="en">
            <body>
                <p>Phonebook ha info for ${count} people</p><br /><p>${now}</p>
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
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/people', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name and number is required' })
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

// app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id
//     persons = persons.filter(person => person.id !== id)
//
//     response.status(204).end()
// })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})