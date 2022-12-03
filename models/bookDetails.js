const mongoose = require('mongoose')

const Bookschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    isbn:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    publisher:{
        type:String,
        required:true
    }
},
{
    collection:"Bookdetails"
})

module.exports = mongoose.model("Bookdetails",Bookschema);