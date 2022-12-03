const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ddfaiusgiugiuGIUgIUGVDUIkNDikhuhihih^%^67UYDG*(6UIH";


app.listen(5000,()=>{
    console.log("Server started on port 5000")
})


mongoose.connect("mongodb+srv://root:root@cluster0.ommx479.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology:true}, (err)=>{
    if(!err){
        console.log("Connected to DB")
    }else{
        console.log("Something went wrong")
    }
})

require("./models/bookDetails");
const Book = mongoose.model("Bookdetails")

require("./models/userDetails");
const User = mongoose.model("UserInfo")

app.post("/signup",async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const encryptedPassword = await bcrypt.hash(password, 8);
    try {
        const existing = await User.findOne({email});
        if(existing){
            return  res.send({status:"User already exists"})
        }
        await User.create({
            email:email,
            password:encryptedPassword
        })
        return res.send({status:"User Created"})
    }catch(error){
        res.send({status:"error",error})
    }
})

app.post("/login", async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User Not found" });
    }
    if(await bcrypt.compare(password,user.password)){
        const token=jwt.sign({data:user._id,exp:Math.floor(Date.now()/1000)+60*60}, JWT_SECRET);
        if(res.status(201)){
            return res.json({ status:"ok", token,user })
        }else{
            return res.json({ error:"error" })
        }
    }
    res.json({status:"error", error:"Invalid password" })
});

app.post("/addbook",async(req,res)=>{
    const title = req.body.title
    const isbn = req.body.isbn
    const author = req.body.author
    const description = req.body.description
    const date = req.body.date
    const publisher = req.body.publisher
    try {
        await Book.create({
            title:title,
            isbn:isbn,
            author:author,
            description:description,
            date:date,
            publisher:publisher
        })
        return res.send({status:"Book Added"})
    }catch(error){
        res.send({status:"error",error})
    }
})

app.get("/getbooks",async(req,res)=>{
    try {
        const results = await Book.find({});
       return res.send(results)
      } catch (err) {
        console.log(err)
        res.send({error:err})
      }
})

app.put("/editbook/:id",async(req,res)=>{
    let id = req.params.id
    const title = req.body.title
    const isbn = req.body.isbn
    const author = req.body.author
    const description = req.body.description
    const date = req.body.date
    const publisher = req.body.publisher
    try{
        const update = await Book.findByIdAndUpdate({_id:id},
            {title:title,
            isbn:isbn,
            author:author,
            description:description,
            date:date,
            publisher:publisher
        })
        res.send("done")
    }catch(err){
        console.log(err)
        res.send({error:err})
    }
})

app.delete("/deletebook/:id",async(req,res)=>{
    let id = req.params.id
    try{
        const remove = await Book.findByIdAndDelete({_id:id})
        res.send("deleted")
    }catch(err){
        console.log(err)
        res.send({error:err})
    }
})



