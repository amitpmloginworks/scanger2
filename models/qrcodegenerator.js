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
     qrcodeurl:{type:String,required:false},
    status:{type:Number,default:1},
     Value:{type:Number,default:0}
});

module.exports = mongoose.model('Qrcode',qrSchema);
