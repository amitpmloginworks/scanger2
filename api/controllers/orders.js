const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

// Get All Orders
exports.orders_get_all = (req,res,next) => {
    Order.find()
    .select('quantity product _id')
    .populate('product','name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity:doc.quantity,
                    request:{
                        type: "GET",
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            errror: err
        });
    });
}
// Create Order
exports.orders_create_order = (req,res,next) => {
    console.log(req.body.productID);
    Product.findById(req.body.productID)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product: req.body.productID
        });
        return order.save();
    }).then(result => {
      //  console.log(result);
        res.status(200).json({
            message: 'Order Stored',
            createdOrder:{
                _id : result._id,
                product : result.product,
                quantity : result.quantity
            },
            request:{
                type : 'POST',
                url: 'http://localhost:3000/orders/'
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            errror: err
        });
    });
}

// Get Order
exports.orders_get_order = (req,res,next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .select('quantity product _id')
    .populate('product')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            order:order,
            request:{
                type:'GET',
                url:'http:localhost:3000/orders/' + id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            errror: err
        });
    });

};

// Delete Order

exports.delete_order =  (req,res,next) => {
    const id = req.params.orderId;
    Order.deleteOne({ _id : id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request:{
                type: "GET",
                url: 'http:localhost:3000/orders/' + id,
                body: { productID : 'ID', quantity:'Number'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

// Update Order
exports.update_order = (req,res,next) => {
const id = req.params.orderId;

var query = {_id:id};
var update = {
    product: req.body.product,
    quantity:req.body.quantity
}
Order.findOneAndUpdate(query,update)
.exec()
.then(result=>{
    res.status(200).json({
        message: 'Order Updated',
        result});        
})
.catch(err => { 
    console.log(err);
    res.status(500).json({
        error: err
    });
});
}