const mongoose = require("mongoose");

const user_Schema = new mongoose.Schema({
    userName:{
        type:String,
        require:true,
        unique:true
    },
    phoneNumber:{
        type:Number,
        require: true
    },
    email:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    }
},{timestamps:true});

module.exports = mongoose.model("User", user_Schema);