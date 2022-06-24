let express = require('express');
let categoryRouter = express.Router();
let mongodb = require('mongodb').MongoClient;
let url = process.env.mongoUrl;


function router(menu){

    categoryRouter.route('/')
        .get(function(req,res){
            mongodb.connect(url, function(err,dc){
                if(err){
                    res.status(500).send('Error While connecting')
                }else{
                    let dbObj = dc.db('june8');
                    dbObj.collection('category').find().toArray(function(err,result){
                        if(err){
                            res.status(203).send('Error While Fetching')
                        }else{
                            res.render('category',{title:'Category Page',data:result,menu})
                        }
                    })
                }
            })

        //res.send(category)
       
    })

    categoryRouter.route('/details')
        .get(function(req,res){
        res.send('Category Details')
    })

    return categoryRouter
}


module.exports = router;