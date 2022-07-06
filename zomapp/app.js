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