const mongoose=require('mongoose')
const main=async()=>{
    await mongoose.connect("mongodb://localhost:27017/JWT_auth")
    console.log("database is connected")
}
main()