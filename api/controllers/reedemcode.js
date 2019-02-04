const Reedemcard=require('../models/reedemcard');
const getlatlngplace=require('../../models/qrcodegenerator')
const mongoose=require('mongoose');
 exports.getreedempoints=(req,res,next)=>{
   //  req.body.listplaces

// getlatlngplace.find({_id:req.body.listplaces})
// .exec()
// .then(qrdata=>{
//     console.log('data',qrdata[0].location)
   



// })



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