const mongoose = require("mongoose");


const user = new mongoose.Schema({
    name:String,
    password:String,
})


const userModel = mongoose.model("userModel", user);

module.exports= userModel;