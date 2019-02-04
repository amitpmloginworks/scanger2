const mongoose = require('mongoose');

const qrSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name:{ type: String,required:true},
    location:{ type:String,required:true },
    qrcode:{type:String,required:true,maxlength: 5},
    points: {type:Number,required:true},
    PlaceType:{type:String,required:true},
    ImageUrl:{type:String,required:true},
    create_date:{
        type:Date,
        default: Date.now
    },
    status:{type:Number,default:1}
});

module.exports = mongoose.model('Qrcode',qrSchema);