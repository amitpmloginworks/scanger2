const Places=require('../../models/qrcodegenerator');

const qrcodelist=require('../../controllers/show_dashboard')

exports.listqrcode=(req,res,next)=>{
  
    Places.find().then(qrcodeparam=>{
        console.log('name',qrcodeparam)
   return res.status(200).json({
        qrcodename:qrcodeparam
    })    
    })
}

