const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String,
        unique: true,
        required:true
    },
    adhaar_number:{
        type:String
    },
    profile_img:{
        type:String
    },
    password:{
        type:String,
        default:null
    },
    isverified:{
        type: Boolean,
        default: false
    },
    isAdharVerified:{
        type: Boolean,
        default: false
    },
}, {timestamsps: true});

const User = mongoose.model("user", userSchema);
module.exports = User;