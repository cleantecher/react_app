const { application } = require("express")
const express =require("express")
const mongoose=require("mongoose")
const path = require("path")
const session=require("express-session")

// const methodOverride =require("method-override");
const jwt = require("jsonwebtoken")
const userModel = require("./models/mongooseModel")
const { db } = require("./models/mongooseModel")
const app=express()
const bcrypt=require("bcrypt")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
// app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/views'));

app.use(
    session({
        key: "userId",
        secret:"subscribe",
        resave:false,
        saveUninitialized: false,
        cookie:{
            expires:60*60*24
        }
    })
)

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/portfolio')//wanted the actual address localhost didnt work
    //database name is crudApp for future refrence
    .then(()=> {
      console.log("Mongo->Connection from node.js open, portfolio db should be created")
    })
    .catch(err=> {
      console.log(" Mongo-> the following error occured from the node.js file.")
      console.log(err)
      console.log("Mongo-> check if your running the mongod in the powershell")
    })
    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
  }

const verifyJWT=(req,res,next)=>{
    const token=req.headers["x-access-token"]
    if(!token){
        res.send("a json web token was not created. need this to proceede")
    } else {
        jwt.verify(token,"jwtsecret", (err,decoded)=>{
            if(err){
                res.json({auth:false, message:"authentication failed"})
            } else {
                req.userId= decoded.id;
                next();
            }
        })
    }
}

app.get("/", async(req,res)=>{
    res.render("login")
})

app.get("/register", async(req,res)=>{
    res.render("register")
})

app.post("/register", (req, res)=>{
    console.log("the following information is being posted from the input form");
    console.log(req.body)
    const newUser = new userModel(req.body)
    newUser.save()
    res.send("user created");
})

app.post("/",  (req, res)=>{
    const username=req.body.name;
    console.log(username)
    const password = req.body.password;
    console.log("in the login post function")

    userModel.find({name:username},(err, result)=>{
        if(err){
            res.send(err)
        } 
        if(result.length > 0){
            // super stupid way to compare the passwords. need to figure out
            // a more encrypted way to do this. perhaps use bcrypt
            if(password==result[0].password){
                console.log("password matches")
                const id = result[0].id
            // jwt secret should go in a .env file but i dont know how to do that yet
                const token =jwt.sign({id},"jwtsecret",{
                    // token expires in 300/60 = 5 min. you can change this if u want
                    expiresIn: 300,
                })
                req.session.user=result;

                console.log(`session created for ${req.session.user}`)
                res.json({
                    auth:true, 
                    token:token, 
                    result:result[0].name
                })
            } else {
                res.json({
                    auth:false, 
                    message:"wrong user name and password combination"
                });
            }
        }else {
            res.json({
                auth:false, 
                message:"no user exists"
            });
        }
    }) 
    })
  
    // for(user in users){
    //     console.log(users[user].name)
    //     if(username==users[user].name){
    //         res.send("user found")
    //     } else {
    //         res.send("something went wrong")
    //     }
    // }



app.listen(3000,()=>{
    console.log("Listening on port 3000")
})
