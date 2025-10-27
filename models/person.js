const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
        .then(result => {
            console.log('connected to MongoDB')
        })
        .catch(error => {
            console.log('error connecting to MongoDB:', error.message)
        })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name muss mindestens 3 Zeichen lang sein.'],
        required: [true, 'Name ist erforderlich.'],
    },
    number: {
        type: String,
        required: [true, 'Nummer ist erforderlich.'],
        validate: {
            validator: function (v) {
                // 🔹 Muster:
                // 2–3 Ziffern, dann '-', dann 5+ Ziffern
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props =>
                `${props.value} ist keine gültige Telefonnummer! Format: XX-XXXXXXX oder XXX-XXXXXXXX`,
        },
    },
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)