let express = require('express');
let redis = require('redis');
let mongodb = require('mongodb').MongoClient;
let mongourl = "mongodb://localhost:27017";
let port = process.env.PORT || 7680;
let app = express();
let client = redis.createClient({
    host:'localhost',
    port:6379
});

app.get('/data',(req,res) => {
    const userInput = (req.query.color).trim();
    return client.get(`${userInput}`,(err,result) => {
        //if data is in redis
        if(result){
            const output = JSON.parse(result)
            res.send(output);
        }else{
            // as data is not in redis get from mongodb
            mongodb.connect(mongourl,function(err,dc){
                if(err){
                    res.send(`Error while connecting`)
                }else{
                    let dbObj = dc.db('june8');
                    dbObj.collection('products').find({'Color':userInput}).toArray((err,result) => {
                        client.setex(`${userInput}`,3600, JSON.stringify({source:'Redis Cache',result}))
                        res.status(200).send({source:'Mongodb',result})
                    })
                }
            })
        }
    })
})

app.listen(port,(err) => {
    console.log(`Server is running on port ${port}`)
})