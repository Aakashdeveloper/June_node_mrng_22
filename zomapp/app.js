let express = require('express');
let app = express();
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let dotenv = require('dotenv');
dotenv.config();
let mongoUrl = process.env.mongoLiveUrl;
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


MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log(`Error while connecting to Mongo`)
    db = client.db('augintern');
    app.listen(port,() => {
        console.log(`Listen on port ${port}`)
    })
})