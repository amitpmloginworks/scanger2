const mongoose=require('mongoose');

const reedemSchema=mongoose.Schema({
   _id:mongoose.Schema.Types.ObjectId,
   latlng:{ type : Array , "default" : []},
   userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true   
   },
   listplaces:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Qrcode",
       required:true
   },
   Points:{type:String,required:true} 



})
module.exports=mongoose.model('Reedemcard',reedemSchema);