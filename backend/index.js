var GoogleStrategy = require("passport-google-oauth20").Strategy;
const express=require("express")
const app=express()
const passport=require("passport")
const {connection}=require("./config/db")
 const {userModel}=require("./model/userModel")
const jwt=require("jsonwebtoken")



 app.get("/",async(req,res)=>{
    let data=await userModel.find()
    
    res.send({msg:"helllo",data})
    })


    const { v4: uuidv4 } = require("uuid");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
    },
    async function (accessToken, refreshToken, profile, cb) {
    //   await redisclient.SET("tokens", JSON.stringify({"token":accessToken}));
    let avatar =profile._json.picture 
    let Email = profile._json.email;
      let udata = await userModel.findOne({ Email });
      if (udata) {
        return cb(null, udata);
      }
      let Username = profile._json.name;
    
      const user = new userModel({
        Username,
        Email,
        Password: uuidv4(),
        avatar
      });
    //   console.log(user)
      await user.save();
      return cb(null, user);
    }
  )
);



app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/google/login",
      session: false,
    }),
    function (req, res) {
      let user = req.user;
       var token = jwt.sign({userID:user._id,email:user.Email}, process.env.SECREP_KEY);
 
       res.redirect(`http://127.0.0.1:5500/frontend/chat.html?token=${token}&userID=${user._id}`);
    }
  );


    app.listen(process.env.PORT,async ()=>{
        try{
            await connection
            console.log(`connected to port at ${process.env.PORT}`);
        }catch(err){
    
            console.log("its working")
            console.log(err)
        }
    })