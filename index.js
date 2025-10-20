const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

app.get('/info', (req, res) => {
    const now = new Date();
    const count = persons.length;
    const infotext = `
        <html lang="en">
            <body>
                <p>Phonebook ha info for ${count} people</p><br /><p>${now}</p>
            </body>
        </html>
    `;
    res.send(infotext);
})

app.get('/api/persons/', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.statusMessage = 'Person not found'
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name and number is required' })
    }
    if (persons.some(person => person.name === body.name) ) {
        return response.status(400).json({ error: 'name is already in use' })
    }
    const person = {
        name: body.name,
        number: body.number || '',
        id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})