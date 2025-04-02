const mongoose = require("mongoose")

const data = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    } , 
      username:{
        type:String,
        required:true
    },
       password:{
        type:String,
        required:true
    }
})

const login = mongoose.model("users",data)

module.exports = login;