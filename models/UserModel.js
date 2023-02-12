const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    role : {
        type : String,
        required : true, // user collector
    },
    status : {
        type : String,
        default : 'unverified' // unverified verified rejected
    },
    credit : {
        type : Number,
        default : 0
    },
    requests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'request',
        },
    ]
})

module.exports = mongoose.model('user', userSchema)


