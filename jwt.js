const jwt=require('jsonwebtoken')
require('dotenv').config()
const createToken=(user)=>{
    const token=jwt.sign({username:user.username,email:user.email},process.env.secret)
    return token
}

function validateToken(req,res,next){
    const accessToken=req.cookies["accessToken"]

    if(!accessToken)
    {
        return res.status(400).send("User not authorized")
    }try{
        const validatToken=jwt.verify(accessToken,process.env.secret)
        if(validatToken)
        {
            req.authorized=true;
            return next();
        }
    }catch(err){
        return res.status(400).json({error:err})
    }
   
}
module.exports={createToken,validateToken}