const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    role: {
        type: String,
        unique: true,
        required: true
    },
    permission: [{
        type: String
    }]
})

module.exports = mongoose.model('Role', roleSchema);