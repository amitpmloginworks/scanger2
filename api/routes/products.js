const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
//const upload = multer({dest: 'uploads/'});
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/');
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname);
    }
});
//reject file
const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb (null,true );
    }else{
        cb (null,false);
    }
}
const upload = multer({
    storage : storage,
    limits : {
        fileSize: 1024*1024 * 5
    },
    fileFilter: fileFilter
});
router.get('/',(req,res,next) => {
    Product.find()
    .select('name price productImage _id')
    .exec()
    .then(docs => {
        const response = {
            cont: docs.length,
            products:docs
        };
       // console.log(docs);
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({  
            error:err
        });
    })
});

router.post('/',checkAuth,upload.single('productImage'),(req,res,next) => {
  //  console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save().then(result=>{
        console.log(result);
    }).catch(err=>console.log(err));
    res.status(200).json({
        message: 'Handling POST Request to /products',
        createdProduct: product
    });
});

router.get('/:productId',(req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(400).json({message:"No valid entry found  for provided ID"});
        }
    })
    .catch(err => { 
    console.log(err);
    res.status(500).json({error: err});
    });
});

router.patch('/:productId',checkAuth,upload.single('productImage'),(req,res,next) => {
    //console.log(req);
    const id = req.params.productId;
    //const updateOps = {};
    var query = {_id:id};
    console.log(req.body.name);
    console.log(req.body.price);
    var update = {
        name: req.body.name,
        price:req.body.price
    }
    /*Genre.findOneAndUpdate(query,update,options,callback);
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }*/
    
    /*Product.findOneAndUpdate({_id:id},{ $set:{name : req.body.newName,price:req.body.newPrice} }). */
    Product.findOneAndUpdate(query,update)
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);        
    })
    .catch(err => { 
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
router.delete('/:productId',checkAuth,(req,res,next) => {
    const id = req.params.productId;
    Product.deleteOne({_id:id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    /*res.status(200).json({
        message: 'Deleted Product!',
    });*/
});

module.exports = router;