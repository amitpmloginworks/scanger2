const mongoose = require('mongoose');

const path = require('path');
const Request = require('request');
const User = require('../api/models/user');
const Qrcode = require('../models/qrcodegenerator');
var helpers = require('../api/middleware/common-function');
var cloudinary = require('cloudinary');
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ReedemCard=require('../api/models/reedemcard')
const fs=require('fs')
const qrcode = require('qrcode');
var Rx=require('rxjs')
// const router = express.Router();
cloudinary.config({ 
  cloud_name: 'loginworks', 
  api_key: '997132329892941', 
  api_secret: 'fvafZdi9NYhHZVIHLaqittfpIgs' 
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "demo",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
  });
  var parser = multer({ storage: storage });
// Get All Order
exports.login_page = (req,res,next) => {
    res.render("login");
    // res.sendFile(path.join(__dirname, "../views/login.html"));
  // res.sendFile(path.join (__filename + "../views/login.html"));
}
exports.loginRedirect = (req,res,next) => {
  email = req.body.email;
  password = req.body.password;

   if(email == ''){
     res.status(400).send("Email is Required");
     return;
   }
   if(password == ''){
    res.status(400).send("Password is Required");
    return;
  }
  Request.post({
    "headers": {
        "content-type": "application/json",  
    },
    // "url": "https://secure-escarpment-31573.herokuapp.com/user/login",
     "url":"https://scvanger2app.herokuapp.com/user/login",
  //  "url":"http://localhost:3000/user/login",
    "body": JSON.stringify({
            "email" : email,
            "password" : password
    })
}, (err, response, body) => {
      console.log('body',err);
      console.log(response);
      console.log(body);
      
    data = JSON.parse(body);
    if(response.statusCode == 200 && data.message == "Auth Successful"){
      sess = req.session;
      sess.email= data.data.email;
      res.redirect("/qrcodegenerator");
    }else{
      const msg = "Failed Login";
      res.render("login", {msg:"Please Try Again"});
      //res.redirect("/?" + msg );
    }
  });
  //res.sendFile(path.join(__dirname, "../views/login.html"));
  // res.sendFile(path.join (__filename + "../views/login.html"));
}

exports.dashboard = (req, res, next) => {
  sess = req.session;
  if(sess.email){
 // res.locals.user = req.session.user;
  const user_email = sess.email;
  res.render("dashboard",{user_email: user_email})
  }else{
      res.render("login", {msg:"Session Log Out"});
  }
}



// qrcodegenerator

exports.qrcodegenerator = (req,res,next) => {

  sess = req.session;
  if(sess.email){
  const user_email = sess.email;
  if(req.query.id){
    Qrcode.findById(req.query.id)
    .then(result=>{
      res.render("qrcodegenerator",{user_email: sess.email,data:result});
    }).catch(err=>console.log(err));
  }else{
  res.render("qrcodegenerator",{user_email: sess.email});
console.log('image')   



  }
  }else{
    res.render("login", {msg:"Session Log Out"});
  }
}
  app.post('/Upload',(req,res)=>{
    res.send('test')
    })

// List Qrcode

exports.listqrcode = (req,res,next) => {
  console.log('tap')
  sess = req.session;

  if (req.query.action) {

    var delid = req.query.id;
    var delquery = { _id: delid };
    Qrcode.deleteOne(delquery)
      .exec()
      .then(result => (result => {
      })).catch(err => console.log(err));
  }
  if (req.query.id) {
    var id = req.query.id;
    var status = req.query.status;
    var query = { _id: id };
    if (status == 1) {
      status = 0;
    } else {
      status = 1;
    }
    var update = {
      status: status
    }
    Qrcode.findOneAndUpdate(query, update)
      .exec()
      .then(result => (result => {
      })).catch(err => console.log(err));
  }

  // console.log('page',req.params.page)


  var perPage = 9
  var page = req.params.page || 1

  Qrcode.find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      Qrcode.count().exec(function (err, count) {
        if (err) return next(err)

        res.render('listqrcode', {
          user_email: sess.email,
          data: products,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })



  // Qrcode.find()
  // .then(result=>{
  //     res.render("listqrcode",{user_email: sess.email,data:result});
  // }).catch(err=>console.log(err));
}

//upload image
     function readURL(input) {
       alert('hi')
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            }
         
        }

// Insert Qrcode



exports.insert_qrcode = (req,res,next) => {
  var qrcodeurlgen
  console.log('file', req.file.url)

  // console.log('req',req.files)
  sess = req.session;
  if (req.body.update_id) {
    const id = req.body.update_id;
    var query = { _id: id };
    var update = {
      location: req.body.location,
      name: req.body.name,
      points: req.body.points,
      qrcode: req.body.qr_code,
      PlaceType: req.body.PlaceType,
      ImageUrl: req.file.url
    }
    Qrcode.findOneAndUpdate(query, update)
      .exec()
      .then(result => {
        // res.redirect('/qrcodegenerator?id='+id);
        res.redirect('/listqrcode/1');
      }).catch(err => console.log(err));
  } else {
    var sub = Rx.Observable.create(observer => {

      qrcode.toDataURL(req.body.qr_code, function (err, url) {
        observer.next(url)
        // cloudinary.v2.uploader.upload(url, 
        // function(error, result) {
        //   console.log('hope',result, error);
        // observer.next(result)
        //  qrcodeurlgen=result
        //  });
      })

    })

    sub.subscribe((x) => {
      //  qrcodeurlgen=x.secure_url
      qrcodeurlgen = x
      console.log('xxxxx', qrcodeurlgen)
      const qrcodes = new Qrcode({
        _id: new mongoose.Types.ObjectId(),
        location: req.body.location,
        name: req.body.name,
        points: req.body.points,
        qrcode: req.body.qr_code,
        PlaceType: req.body.PlaceType,
        ImageUrl: req.file.url,
        qrcodeurl: qrcodeurlgen
      });
      qrcodes.save().then(result => {

        res.redirect('/listqrcode/1');
      }).catch(err => console.log(err));
    }
    )


  }
}

// Passsword Change

exports.password_reset = (req,res,next) => {
    User.findOne({ _id: req.query.id , token_key: req.query.key })
    .exec()
    .then( result => {
        if(result){
          var curr_date = new Date();
          
          timeDiff = Math.floor( (Date.parse(curr_date) - Date.parse(result.token_expire)) / (1000*60) % 60);
          if(timeDiff < 30){
          res.render('password_reset',{msg: "Password Reset, Please Login in Mobile Application"});
          }else{
            res.render('password_reset',{user_msg: "Link Expire"});
          }
        }else{
          res.render('password_reset',{user_msg: "Invalid Token"});
        }
    }).catch(err=>{
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
}
// Password Matching
exports.password_match = (req,res,next) => {
  console.log('enter')
  User.findOne({ _id: req.body.object_id , token_key: req.body.key })
  .exec()
  .then( result => {
      if(result){
          var encrypted = helpers.passwordEncrypted(req.body.password);
          var query = {_id:result._id};
          var update = {
          password: encrypted,
          token_key: '',
          token_expire:'' 
          }
          User.findOneAndUpdate(query,update)
          .exec()
          .then(result=>{
            console.log('password reset')
            res.render('password_reset',{user_msg: "Password Reset, Please Login in Mobile Application"});
          }).catch(err=>console.log(err));
      }else{
        res.render('password_reset',{user_msg: "U can't be smart"});
      }
})
}


// LOgout

exports.logout = (req,res,next) => {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
}

exports.activeusers=(req,res,next)=>{
  console.log('sess',req.session)
  var perPage = 9
  var page = req.params.page || 1

  User.find({status:1})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      User.count().exec(function (err, count) {
        if (err) return next(err)

        res.render('active_user', {
          user_email: sess.email,
          data: products,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })

// User.find({status:1}).exec().then(result=>{
//   console.log('res',result)
// res.render("active_user",{user_email:sess.email,data:result})
// }).catch(err=>console.log(err))

}

exports.printqr=(req,res,next)=>{
 sess=req.session;
 var perPage = 9
  var page = req.params.page || 1

  Qrcode.find({status:1})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      Qrcode.count().exec(function (err, count) {
        if (err) return next(err)

        res.render('getandprint', {
          user_email: sess.email,
          data: products,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })

}

exports.printpdf=(req,res,next)=>{
  console.log('hhiii')
}
exports.getgainpoints=(req,res,next)=>{
  sess = req.session
  var perPage = 9
  var page = req.params.page || 1

  ReedemCard.find().populate('userid listplaces').select('location listplaces Points userid')
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      ReedemCard.count().exec(function (err, count) {
        if (err) return next(err)

        res.render('getpointse', {
          user_email: sess.email,
          data: products,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
  // sess = req.session;
  //  ReedemCard.find()
  //  .populate('userid listplaces').select('location listplaces Points userid')
  //  .then(data=>{
   
    
  //    res.render("getpointse",{user_email:sess.email,data:data})
  //  }).catch(err=>console.log(err))
   
 
 
 }
 exports.getgainranking=(req,res,next)=>{
 
   sess = req.session;
   var perPage = 9
   var page = req.params.page || 1
 
   ReedemCard.aggregate(
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
     .skip((perPage * page) - perPage)
     .limit(perPage)
     .exec(function (err, products) {
       ReedemCard.count().exec(function (err, count) {
         if (err) return next(err)
  console.log(count)
         res.render('getranking', {
           user_email: sess.email,
           data: products,
           current: page,
           pages: Math.ceil(count / perPage)
         })
       })
     })
  //  ReedemCard.aggregate(
  //    [{
  //        $group:{
  //          _id:"$userid",
  //          totalpoints:{$sum:"$Points"},
  //          count:{$sum:1} 
        
  //        },
         
     
  //    },
  //    {$sort: {totalpoints: -1}},
  //    {
  //        $lookup:
  //        {
  //        from: "users",
  //        localField: "_id",
  //        foreignField: "_id",
  //        as: "user"
  //        }
  //        }]
     
     
  //       )
  //       .exec()
  //       .then(data=>{
   
    
  //        res.render("getranking",{user_email:sess.email,data:data})
  //      }).catch(err=>console.log(err))
     
         
    
  
  
  }
// module.exports = router;
