let express = require('express');
let app = express();
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let dotenv = require('dotenv');
dotenv.config();
let mongoUrl = process.env.mongoUrl;
let bodyParser = require('body-parser');
let cors = require('cors');
let port = process.env.PORT || 7100;
let db;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let authKey = process.env.authKey
function auth(key){
    if(key === authKey){
        return true
    }else{
        return false
    }
}

//get heart beat
app.get('/',(req,res) => {
    res.status(200).send('Health Ok')
})

//location
app.get('/location',(req,res) => {
    let key = req.header('x-basic-token') 
    if(auth(key)){
        db.collection('location').find().toArray((err,data) => {
            if(err) throw err;
            res.status(200).send(data)
        })
    }else{
        res.send('Unauthenticated User')
    }    
})

//Restaurants
app.get('/restaurants',(req,res) => {
    let query = {};
    let stateId = Number(req.query.stateId)
    let mealId = Number(req.query.mealId)
    if(mealId && stateId){
        query = {'mealTypes.mealtype_id':mealId,'state_id':stateId}
    }
    if(mealId){
        query = {'mealTypes.mealtype_id':mealId}
    }
    if(stateId){
        query = {'state_id':stateId}
    }
    db.collection('restaurants').find(query).toArray((err,data) => {
        if(err) throw err;
        res.status(200).send(data)
    })  
})

//filters
app.get('/filter/:mealId',(req,res) => {
    let sort = {cost:1}
    let query = {};
    let skip = 0;
    let limit = 100000000;
    let mealId = Number(req.params.mealId);
    let cuisineId = Number(req.query.cuisine);
    let hcost = Number(req.query.hcost);
    let lcost = Number(req.query.lcost);
    if(req.query.sort){
        sort={cost:req.query.sort}
    }
    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip);
        limit = Number(req.query.limit);
    }
    if(lcost && hcost & cuisineId){
        query={
            "mealTypes.mealtype_id":mealId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}],
            "cuisines.cuisine_id":cuisineId
        }
    }
    else if(lcost && hcost){
        query={
            "mealTypes.mealtype_id":mealId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(cuisineId){
        query={
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId
        }
    }
    db.collection('restaurants').find(query).sort(sort).skip(skip).limit(limit).toArray((err,data) => {
        if(err) throw err;
        res.status(200).send(data)
    })  
})

// restaurantDetails
app.get('/details/:id',(req,res) => {
    //let id = Number(req.params.id)
    let _id = mongo.ObjectId(req.params.id)
    db.collection('restaurants').find({_id:_id}).toArray((err,data) => {
        if(err) throw err;
        res.status(200).send(data)
    })  
})

app.get('/menu/:id',(req,res) => {
    let id = Number(req.params.id)
    db.collection('menu').find({restaurant_id:id}).toArray((err,data) => {
        if(err) throw err;
        res.status(200).send(data)
    })  
})

//MealType
app.get('/mealType',(req,res) => {
    db.collection('mealType').find().toArray((err,data) => {
        if(err) throw err;
        res.status(200).send(data)
    })  
})

//menu wrt to ids {"id":[8,4,9]}
app.post('/menuItem',(req,res) => {
    console.log(req.body);
    if(Array.isArray(req.body.id)){
        db.collection('menu').find({menu_id:{$in:req.body.id}}).toArray((err,data) => {
            if(err) throw err;
            res.send(data)
        })
    }else{
        res.send('Please pass the array')
    }
})

//Place Order
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insert(req.body,(err) => {
        if(err) throw err;
        res.send('Order Placed')
    })
})

//Place Order
app.get('/orders',(req,res) => {
    let query = {}
    let email =req.query.email
    if(email){
        query = {email:req.query.email}
    }
    db.collection('orders').find(query).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//updateOrder
app.put('/updateOrder',(req,res) => {
    db.collection('orders').updateOne(
        {_id:mongo.ObjectId(req.body._id)},
        {
            $set:{
                "status":req.body.status
            }
        },(err,result) => {
            if(err) throw err;
            res.status(200).send('Status Updated successfully')
        }
    )
})

//Delete order
app.delete('/removeOrder',(req,res) => {
    let id = mongo.ObjectId(req.body._id)
   db.collection('orders').find({_id:id}).toArray((err,result) => {
       if(result.length !== 0){
           db.collection('orders').deleteOne({_id:id},(err,result) => {
               if(err) throw err;
               res.send('Order Deleted')
           })
       }else{
           res.send('No Order Found')
       }
   })
})


MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log(`Error while connecting to Mongo`)
    db = client.db('internfeb');
    app.listen(port,() => {
        console.log(`Listen on port ${port}`)
    })
})