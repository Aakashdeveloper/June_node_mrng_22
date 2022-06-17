let express = require('express');
let app = express();
let port = 8790;

//routes
app.get('/',function(req,res){
    res.send("Hii From Default Route")
})

app.get('/location',function(req,res){
    res.send('This is location route')
})


// created server
app.listen(port,function(err){
    if(err) throw err;
    console.log("listening on port "+port)
})