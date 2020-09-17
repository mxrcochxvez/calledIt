const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    user: {
        type: String,
        require: true
    },
    date: {
        type: String,
    }
});

module.exports = mongoose.model('Event', eventSchema);