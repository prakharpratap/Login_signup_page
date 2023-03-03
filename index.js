const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcrypt')
const cookieParser=require('cookie-parser')
const mongoose = require('mongoose')
const userModel = require('./schema.js')
const {createToken,validateToken}=require('./jwt.js')
const app = express()
require('dotenv').config()
require('./connection.js')
// app.use(bodyParser.json())
// app.set("view engine","pug")
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './login.html'))
})
app.post('/login',async(req,res)=>{
    console.log(req.body)
    let data=await userModel.findOne({username:req.body.username})
    if(!data)
    {
        res.status(404).send("USER NOT FOUND")
    }
    else 
    {   
        // console.log(req.body.password)
        // console.log(data.password)
        let result= await bcrypt.compare(req.body.password,data.password)
        if(result==true)
        {
            // console.log(data)
            const token=createToken(data)
            console.log(token)
            res.cookie('accessToken',token)
            res.send(`Hi ${data.username}`)
            
        }
        else
        {
            res.send("Password is wrong")
        }
    }
    
})
app.get('/register', async (req, res) => {
    res.sendFile(path.resolve(__dirname, './register.html'))
})
app.post('/register', async (req, res) => {
    const pwd=await bcrypt.hash(req.body.password,10)
    let data = new userModel({
        username:req.body.username,
        email:req.body.email,
        password:pwd
    })
    let result = await data.save()
    console.log(result)

})
app.get('/posts',validateToken,(req,res)=>{
    res.send("Posts")
})





app.listen(process.env.PORT, () => {
    console.log(`server is listening at port number ` + process.env.PORT)
})