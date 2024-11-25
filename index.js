const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// JSON-PARSER to hablder HTTP POST requests
app.use(cors())
app.use(express.json())
// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
// }
// app.use(unknownEndpoint)

morgan.token('body', function getBody(req){
    return JSON.stringify(req.body)
})
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
    // const maxId = persons.length > 0
    //     ? Math.max(...persons.map(n => Number(n.id)))
    //     : 0
    // return String(maxId + 1)
    return String(Math.random()*500)
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} <br/> ${new Date().toString()}</div>`)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    const person = persons.find(persons => persons.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.number || !body.name) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }
    
    if (persons.filter(person => person.name === body.name).length > 0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})