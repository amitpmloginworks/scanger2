const Places=require('../../models/qrcodegenerator');

const qrcodelist=require('../../controllers/show_dashboard')
const Reedemcard=require('../models/reedemcard');
exports.listqrcode=(req,res,next)=>{
 Reedemcard.find().then(data=>{
    Places.find().then(qrcodeparam=>{
        console.log('name',qrcodeparam)
   return res.status(200).json({
        qrcodename:qrcodeparam,
        data:data
    })    
    })  
 })
  

 
}

