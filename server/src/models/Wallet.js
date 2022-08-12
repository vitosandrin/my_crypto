const mongoose = require('../db/conn')
const { Schema } = mongoose

const Wallet = mongoose.model(
    'Wallet',
    new Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        storage: {
            type: Array
        },
        user: Object
    },
        { timestamps: true }
    )
)

module.exports = Wallet