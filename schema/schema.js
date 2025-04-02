const mongoose = require("mongoose")

const data = mongoose.Schema({
   media:{
    type:String,
    require:true
   },
   title:{
     type:String,
     require:true
   },
   description:{
    type:String,
    require:true
   },
   price:{
    type:String,
    require:true
   },
   brand:{
    type:String,
    require:true
   },
   category:{
    type:String,
    require:true
   }
})
const product = mongoose.model("products",data)
module.exports = product;