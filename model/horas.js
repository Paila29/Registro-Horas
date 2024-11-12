const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
EstSchema = new mongoose.Schema({
    _id: Number,
    carnet: String,
    name: String,
    date: String,
    eTime: String,
    dTime: String,
    cantHor: Number, 
    description: String
}, {
    versionKey: false
})
module.exports = mongoose.model('registroHoras', EstSchema, 'registroHoras')