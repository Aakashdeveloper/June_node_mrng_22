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

//get heart beat
app.get('/',(req,res) => {
    res.status(200).send('Health Ok')
})

//list of city
app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err,data) => {
        if(err) throw err;
        res.status(200).send(data)
    })
})


MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log(`Error while connecting to Mongo`)
    db = client.db('internfeb');
    app.listen(port,() => {
        console.log(`Listen on port ${port}`)
    })
})