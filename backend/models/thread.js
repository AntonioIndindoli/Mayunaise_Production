const mongoose = require('mongoose');

const Schema = mongoose.Schema; let threadSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
})

module.exports = mongoose.model('Thread', threadSchema);