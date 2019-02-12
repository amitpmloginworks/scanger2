const Reedemcard=require('../models/reedemcard');
const getlatlngplace=require('../../models/qrcodegenerator')
const mongoose=require('mongoose');
const Qrcode = require('../../models/qrcodegenerator');
 exports.getreedempoints=(req,res,next)=>{


  var id = req.body.listplaces;
var query = {_id:id};
var update = {
    status: 0
}
Qrcode.findOneAndUpdate(query,update)
.exec()
.then(result=>(result=>{
})).catch(err=>console.log(err));


const reedemcard=new Reedemcard({
    _id:mongoose.Types.ObjectId(),
    latlng:req.body.latlng,
    userid:req.body.userid,
    listplaces:req.body.listplaces,
    Points:req.body.Points 
})
reedemcard.save().then(result=>{
    res.status(200).json({
       message:'User Created' 
    })
}).catch(err=>{
    res.status(500).json({
       error:err 
    })
})




 }
 exports.scanreedempoints=(req,res,next)=>{
   var code=req.body.Points
   console.log(code)
   getlatlngplace.find({qrcode:code})
    .exec()
    .then(data=>{
        return res.status(200).json({
            data:data
        })
    }) 
 }
