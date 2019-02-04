const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : { type: String,required:true, minlength: 3, maxlength: 15 ,trim: true},
    name : { type: String,required:true , minlength: 3, maxlength: 15,trim: true},
    surname : { type: String,required:true , minlength: 3, maxlength: 15,trim: true},
    email:{ 
        type: String,
        required:true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        trim: true
    },
    password:{ type: String,required:true },
    profile_pic: { type: String},
    token_key:{type: String},
    token_expire:{type: String},
    create_date:{
        type:Date,
        default: Date.now
    },
    status:{type:Number,default:1}
});

module.exports = mongoose.model('User',userSchema);