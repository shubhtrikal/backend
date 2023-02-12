const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requestSchema = new Schema({
    message : {
        type : String,
        required : true
    },
    photoUrl : {
        type : String,
        required : true
    },
    latitude : {
        type : Number,
        required : true
    },
    longitude : {
        type : Number,
        required : true
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'user',
    },
    status : {
        type : String,
        default : 'pending' // pending accepted completed rejected
    },
    approveTime : {
        type : Date,
        default : null
    },
    wasteType : {
        type : String,
        required : true
    },
    collector : {
        type : Schema.Types.ObjectId,
        ref : 'user',
    }
}, {
    timestamps : true
})

module.exports = mongoose.model('request', requestSchema)