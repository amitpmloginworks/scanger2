
const Reedemcard=require('../models/reedemcard');
const getlatlngplace=require('../../models/qrcodegenerator')
const mongoose=require('mongoose');
const Qrcode = require('../../models/qrcodegenerator');
 const iddata=[]
const User = require('../models/user');
const userdata=[]
 exports.getreedempoints=(req,res,next)=>{





// Reedemcard.findOne({listplaces:req.body.listplaces})
// .select('Value')
// .exec('userid','')
// .then(result=>{
//     res.status(200).json({
//         result
//     })
// })



Qrcode.find({_id:req.body.listplaces})
.select('Value')
.exec()
.then(user=>{
    console.log(user[0].Value)

  


  if(user[0].Value==1)
  {
    var points=(req.body.Points/100*25)
const reedemcard=new Reedemcard({
    _id:mongoose.Types.ObjectId(),
    latlng:req.body.latlng,
    userid:req.body.userid,
    listplaces:req.body.listplaces,
    Points:points
})
reedemcard.save().then(result=>{
    res.status(200).json({
       message:'User Earned 25%' 
    })

}).catch(err=>{
    res.status(500).json({
       error:err 
    })
})
  }
  else{
      console.log('hi')
       var id = req.body.listplaces;
var query = {_id:id};
var update = {
    Value:1
}
Qrcode.findOneAndUpdate(query,update)
.exec()
.then(result=>(result=>{

})).catch(err=>console.log(err))

const reedemcard=new Reedemcard({
    _id:mongoose.Types.ObjectId(),
    latlng:req.body.latlng,
    userid:req.body.userid,
    listplaces:req.body.listplaces,
    Points:req.body.Points
})
reedemcard.save().then(result=>{
    res.status(200).json({
       message:'User Earned 100%' 
    })

}).catch(err=>{
    res.status(500).json({
       error:err 
    })
})
  }
}
)




//   var id = req.body.listplaces;
// var query = {_id:id};
// var update = {
//     Value:1
// }
// Qrcode.findOneAndUpdate(query,update)
// .exec()
// .then(result=>(result=>{
// })).catch(err=>console.log(err));


// const reedemcard=new Reedemcard({
//     _id:mongoose.Types.ObjectId(),
//     latlng:req.body.latlng,
//     userid:req.body.userid,
//     listplaces:req.body.listplaces,
//     Points:req.body.Points
// })
// reedemcard.save().then(result=>{
//     res.status(200).json({
//        message:'User Created' 
//     })

// }).catch(err=>{
//     res.status(500).json({
//        error:err 
//     })
// })




 }
 exports.scanreedempoints=(req,res,next)=>{
   var code=req.body.Points
  
   console.log(code)
   Reedemcard.find().then(matchdata=>{
   getlatlngplace.find({qrcode:code})
    .exec()
    .then(data=>{
        return res.status(200).json({
            data:data,
            matchdata:matchdata
        })
    }) 
})
 }
 exports.getmyranking=(req,res,next)=>{
   

   Reedemcard.aggregate(
[{
    $group:{
      _id:"$userid",
      totalpoints:{$sum:"$Points"},
      count:{$sum:1} 
   
    },
    

},
{$sort: {totalpoints: -1}},
{
    $lookup:
    {
    from: "users",
    localField: "_id",
    foreignField: "_id",
    as: "user"
    }
    }]


   )
   .exec()
     .then(data=>{
      return res.status(200).json({
         data:data  
      })
// for(var i=0;i<data.length;i++)
// {
//     console.log('totalpoints'+data[i].totalpoints)
//   userdata.push({totalpoints:data[i].totalpoints})

// }


//       for(var i=0;i<data.length;i++)
//       {
//           console.log('userid',data[i]._id.userid)
//         User.findOne({ _id:data[i]._id.userid})
//         .exec()
//         .then(user => {
            
            
         
//            iddata.push({user:user})
//            console.log('data',iddata)
//            console.log(data.length,'kkkkk',iddata.length)
//            if(data.length==iddata.length)
//            {
//               console.log('userdata'+userdata)
//                return res.status(200).json({
//                 data:iddata,
//                 totalpoints:userdata
//               })
//            }
//         })   
     
//       }
    
    
   
     }) 

    

   

    }

exports.getuserhuntcategory=(req,res,next)=>{
    Reedemcard.find({userid:req.body.userid})
    .populate('listplaces')
    .select('location listplaces')
    .then(data=>{
        return res.status(200).json({
            data:data
        })
    })
}


 

 

