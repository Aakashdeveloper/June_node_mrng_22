const express = require('express');
const app = express();
const port = process.env.PORT || 9700;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoUrl = "mongodb://localhost:27017";
let db;
let col_name = "dashboard";
let swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json')
let package = require('./package.json');

swaggerDocument.info.version = package.version;
app.use(`/api-doc`,swaggerUi.serve,swaggerUi.setup(swaggerDocument))

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+ '/public'));
app.set('views','./src/views');
app.set('view engine', 'ejs');
app.use(cors());

app.get('/health',(req,res) => {
    res.status(200).send('Health Check')
})

app.get('/',(req,res) => {
    db.collection(col_name).find({}).toArray((err,result) => {
        if(err) throw err;
        res.render('index',{data:result})
    })
})

app.get('/new',(req,res) => {
    res.render('forms')
})

//getUser
app.get('/users',(req,res) => {
    let query = {}
    if(req.query.role && req.query.city){
        query={role:req.query.role,city:req.query.city,isActive:true}
    }
    else if(req.query.city){
        query={city:req.query.city,isActive:true}
    }
    else if(req.query.role){
        query={role:req.query.role,isActive:true}
    }else if(req.query.isActive){
        let isActive = req.query.isActive;
        if(isActive == "false"){
            isActive = false
        }else{
            isActive = true
        }
        query={isActive}
    }
    else{
        query={isActive:true}
    }
    db.collection(col_name).find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//addUser
app.post('/addUser',(req,res) => {
    let data =  {
        name:req.body.name,
        city:req.body.city,
        phone:req.body.phone,
        role:req.body.role?req.body.role:'User',
        isActive:true
    }
    db.collection(col_name).insert(data,(err,result) => {
        if(err) throw err;
        //res.send('Data Added')
        res.redirect('/')
    })
})

//updateUser
app.put('/updateUser',(req,res) => {
    db.collection(col_name).updateOne(
        {_id:mongo.ObjectId(req.body._id)},
        {
            $set:{
                name:req.body.name,
                city:req.body.city,
                phone:req.body.phone,
                role:req.body.role,
                isActive:true
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Data Updated')
        }
    )
})

// hard delete
app.delete('/deleteUser',(req,res) => {
    db.collection(col_name).remove(
        {_id:mongo.ObjectId(req.body._id)},(err,result) => {
            if(err) throw err;
            res.send('User Deleted')
        }
    )
})

//softDelete (deactivate)
app.put('/deactivateUser',(req,res) => {
    db.collection(col_name).updateOne(
        {_id:mongo.ObjectId(req.body._id)},
        {
            $set:{
                isActive:false
            }
        },(err,result) => {
            if(err) throw err;
            res.send('User Deactivated')
        }
    )
})

//activate
app.put('/activateUser',(req,res) => {
    db.collection(col_name).updateOne(
        {_id:mongo.ObjectId(req.body._id)},
        {
            $set:{
                isActive:true
            }
        },(err,result) => {
            if(err) throw err;
            res.send('User Activated')
        }
    )
})

app.get('/user/:id',(req,res) => {
    let id = mongo.ObjectId(req.params.id);
    db.collection(col_name).find({_id:id}).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })
})

MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log(`Error While connecting`)
    db = client.db('internfeb');
    app.listen(port,(err) => {
        console.log(`Server is running on port ${port}`)
    })
})
