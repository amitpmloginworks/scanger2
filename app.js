const express = require('express');
const app = express();
const morgan = require('morgan');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');


app.use(session({secret:"ssa453sdfs",resave:false,saveUninitialized:true }));


app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'assets')));
//app.set("views", path.join(__dirname,'views'));

// mongoose.connect('mongodb://arvind_node_admin:'+ process.env.MONGO_ATLAS_PW + '@cluster0-shard-00-00-6htzz.mongodb.net:27017,cluster0-shard-00-01-6htzz.mongodb.net:27017,cluster0-shard-00-02-6htzz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{ useNewUrlParser: true },function(error){
//     if(error) console.log(error);
//     console.log("connection successful");
// });

const dba = 'mongodb://yatash:yatash1@ds113169.mlab.com:13169/scvanger';
// const dba='mongodb://localhost/BBM'
mongoose.connect(dba,{ useNewUrlParser: true },function(error){
    if(error) console.log(error);
    console.log("connection successful");
})
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    );
    if(req.method ===   'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

const productRoutes = require('./api/routes/products');
app.use('/products',productRoutes);

const orderRoutes = require('./api/routes/orders');
app.use('/orders',orderRoutes);

console.log('user')
const userRoutes = require('./routes/user');
//Routes which handle requests
app.use('/user',userRoutes);

// Routes which handle admin requests
const adminRoutes = require('./routes/admin');
app.use('/',adminRoutes);
app.use('*',(req,res)=>{
    res.redirect("/login",{msg:"Please login to access dashboard."})
});

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});
module.exports = app;
