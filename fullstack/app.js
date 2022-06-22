let express = require('express');
let app = express();
let dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 8790;

let menu = [
    {link:'/',name:'Home'},
    {link:'/category',name:'Category'},
    {link:'/products',name:'Products'}
]

let categoryRouter = require('./src/router/categoryRouter')(menu)
let productRouter = require('./src/router/productRouter.js')(menu);

//middleware
// Static File Path
app.use(express.static(__dirname+'/public'));
// html file path
app.set('views','./src/views');
// view engine name
app.set('view engine','ejs')

//routes
app.get('/',function(req,res){
    //res.send("<h1>Hii From Default Route</h1>")
    res.render('index',{title:'Home Page',menu})
})

app.use('/category', categoryRouter);
app.use('/products', productRouter);

// created server
app.listen(port,function(err){
    if(err) throw err;
    console.log("listening on port "+port)
})