const mongoose = require('mongoose')
EstSchema = new mongoose.Schema({
    _id: String,
    name: String,
    secondName: String,
    assignedHours: Number,
    hoursReal: Number,
    rol: Number,
    password: String,
    contrato1: String,
    contrato2: String,
    contrato3: String
}, {
    versionKey: false
})
module.exports = mongoose.model('users', EstSchema, 'users')