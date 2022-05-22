const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const recordingSchema = new Schema({
    username: { type: String, required: true },
    description: { type: String, required: true }, 
    rating: { type: Number, required: true }, 
    date: { type: Date, required: true },
}, {
    timestamps: true,
})

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;