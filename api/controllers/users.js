const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var helpers = require('../middleware/common-function');
var qrcodegenrator=require('../../models/qrcodegenerator')
const Reedemcard=require('../models/reedemcard');
const Places=require('../../models/qrcodegenerator');
//const xoauth2 = require('xoauth2');

exports.user_signup = (req,res,next) => {
 
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if(user){
            return res.status(200).json({
                message:"Email ID exist"
            });
        }else{
                var encrypted = helpers.passwordEncrypted(req.body.password);
                if(encrypted.length < 20){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password: encrypted,
                        username:req.body.username,
                        name:req.body.name,
                        surname:req.body.surname,
                        profile_pic:req.body.profile_pic
                    });
                    user
                    .save().then(result => {
                       res.status(200).json({
                            message : 'User Created'
                       });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
        } 
    })

}
// Login
exports.user_login = (req,res,next) => {
    User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
        console.log('kichu')
        console.log(user)
        if(user){
            
            
            var decrypted = helpers.passwordDecrypted(user.password);
                    
                if(decrypted != req.body.password ) {
                    return res.status(200).json({
                        message: 'Auth Failed'
                    });
                }else{
                     console.log('decrypted',decrypted)
                    
                    console.log('email',user.email)
                    console.log('userid',user._id)
                    
                    
                    const token = jwt.sign(
                    {
                        email : user.email,
                        user_id: user._id,
                    },
                    process.env.JWT_KEY,{
                        expiresIn: "1h"
                    }
                    );
                    const data = { email : user.email,
                        image_url:user.profile_pic,
                        username:user.username          
                                   };
                return res.status(200).json({
                    message: 'Auth Successful',
                    data : data,
                    token :token,
                    user_id:user._id
                });
                }
                res.status(200).json({
                    message: 'Auth Failed'
                });
        }else{
            return res.status(200).json({
                message:'Email ID not exist'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

// User Password
exports.reset_password = (req, res, next) => {
   User.findOne({ email: req.body.email })
    .exec()
    .then( result => {
        if(result){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                   user: 'ytuxedo786@gmail.com',
                   pass: 'yashudievo'
               }
        });
       
        var chars_key = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var token = '';
        for (var i = 16; i > 0; --i) {
        token += chars_key[Math.round(Math.random() * (chars_key.length - 1))];
        }

        // create expiration date
        var content_body1 = '<p>We heard that you lost your Scavanger password,don’t worry! You can use the following link to reset your password.</p>';
         var content_body2  = '<p>If you don’t use this link within 3 hours, it will expire. To get a new password reset link, visit <a href="https://scvanger2app.herokuapp.com/password_reset?key='+token+'&id='+result._id+'">https://scvanger2app.herokuapp.com/password_reset</a></p><p>Thanks</p><p>Your friends at Scavanger</p>';
        // var content_body2  = '<p>If you don’t use this link within 3 hours, it will expire. To get a new password reset link, visit <a href="http://localhost:3000/password_reset?key='+token+'&id='+result._id+'">http://localhost:3000/password_reset</a></p><p>Thanks</p><p>Your friends at Scavanger</p>';
        var image='<img src="http://res.cloudinary.com/loginworks/image/upload/v1549534966/demo/rjvu3jriubagslie1qhz.jpg">'
         content_body = content_body1 + content_body2+image;
        var mailOptions = {
            from: 'scavanger@gmail.com',
            to: result.email,
            subject: 'Reset Password',
            text: 'That was easy!',
            html: content_body
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
                var curr_date = new Date();
                var update = {
                    token_key: token,
                    token_expire: curr_date
                }
                var query = {_id:result._id};
                User.findOneAndUpdate(query,update)
                .exec();
              console.log('Email sent: ' + info.response);
              return res.status(200).json({
                message:'Mail Sent Successfully'
            });
            }
          });
        }else{
            return res.status(200).json({
                message:'Email ID not exist'
            });
        }
       })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

// User Deletion
exports.user_delete = (req, res, next) => {
    User.remove({ _id : req.params.userID})
    .exec()
    .then( result => {
        res.status(200).json({
            message : 'User Deleted'
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}
exports.logout=(req,res,next)=>{

const id=req.body.userid;
var query={_id:id};
var update={
    status:0

}
User.findOneAndUpdate(query,update)
.exec()
.then(result=>{
res.status(200).json({
    message:'logout..'
})
}).catch(err=>{
    console.log(err);
    res.status(200).json({
        error:err
    })
})
}
exports.loginactive=(req,res,next)=>{
    const id=req.body.userid;
var query={_id:id};
var update={
    status:1

}
User.findOneAndUpdate(query,update)
.exec()
.then(result=>{
    console.log(result)
res.status(200).json({
    message:'login..'
})
})
.catch(err=>{
    console.log(err);
    res.status(200).json({
        error:err
    })
})
}
exports.update=(req,res,next)=>{
  
   
console.log('res',req.body.userid)
  var  password1=helpers.passwordEncrypted(req.body.password)
    console.log('password',password1)
    var query={_id:req.body.userid}
    var update={
        email:req.body.email,
        username:req.body.username,
        password:password1,
        profile_pic:req.body.profile_pic
    }
  User.findOneAndUpdate(query,update).exec()
  .then(result=>{
      res.status(200).json({
          data:result
      })
  })
   
 


}
exports.deleteaccount=(req,res,next)=>{
    console.log('userid')
    console.log(req.body.userid)
    var delid = req.body.userid;
    var delquery = { _id: delid };
    User.deleteOne(delquery)
      .exec()
      .then(result =>  {
        res.status(200).json({
            data:'message'
        })

      }).catch(err => console.log(err));
}
exports.homedetail=(req,res,next)=>{

console.log('hii')
  
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
             .then(ranking=>{
                qrcodegenrator.find().exec().then(result=>{
                    Places.find().then(qrcodeparam=>{
                        Reedemcard.find({userid:req.body.userid})
    .populate('listplaces')
    .select('location listplaces')
    .then(datahunt=>{
        return res.status(200).json({
            datahunt:datahunt,
            qrcodename:qrcodeparam,
            data:result,
          ranking:ranking
        })
    })
                //         console.log('name',qrcodeparam)
                //    return res.status(200).json({
                //         qrcodename:qrcodeparam,
                //         data:result,
                //       ranking:ranking
                //     })    
                    // })
                    // return res.status(200).json({
                    //        data:result,
                    //        ranking:ranking
                    //    })
                   })
    }) 


})
}
