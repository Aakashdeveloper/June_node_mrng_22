let express = require('express');
let productRouter = express.Router();
let mongodb = require('mongodb').MongoClient;
let url = process.env.mongoUrl;

function router(menu){
    productRouter.route('/')
        .get(function(req,res){
        mongodb.connect(url,function(err,dc){
            if(err){
                res.status(500).send('Error While Connecting')
            }else{
                let dbObj = dc.db('june8');
                dbObj.collection('products').find().toArray(function(err,products){
                    if(err){
                        res.send('Error While Fetching')
                    }else{
                        res.render('product',{title:'Product Page',products,menu})
                    }
                })
            }
        })
        
    })

    productRouter.route('/category/:id')
        .get(function(req,res){
        //let id = req.params.id;
        let {id} = req.params
        mongodb.connect(url,function(err,dc){
            if(err){
                res.status(500).send('Error While Connecting')
            }else{
                let dbObj = dc.db('june8');
                dbObj.collection('products').find({'category_id':Number(id)}).toArray(function(err,products){
                    if(err){
                        res.send('Error While Fetching')
                    }else{
                        res.render('product',{title:'Product Category Page',products,menu})
                    }
                })
            }
        })
    })

    productRouter.route('/details')
        .get(function(req,res){
        
        res.send('Products Details')
    })

    return productRouter;
}


module.exports = router;