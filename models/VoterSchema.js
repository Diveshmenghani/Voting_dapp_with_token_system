const mongoose = require('mongoose')

const VoterSchema= new mongoose.Schema({
    accountAddress:{
        type:String,
        required:true
    },
    imageName:{
        type:String,
        required:true
    }
})
const VoterModel = mongoose.model("voters",VoterSchema)
module.exports= VoterModel;