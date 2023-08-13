const mongoose=require("mongoose")

const msgSchema=mongoose.Schema({
    author:String,
    text:String,
})


const userSchema=mongoose.Schema({
    Username:{type:String, required:true},
    Email:{type:String, required:true,unique:true},
    Password:{type:String, required:true},
    avatar:{type:String,default:""}
   
})




const userModel=mongoose.model("user",userSchema)

module.exports={
    userModel
}