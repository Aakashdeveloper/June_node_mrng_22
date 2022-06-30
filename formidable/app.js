const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs')
const app = express();
const port = 9870;

//static file path
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

///middleware
app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.render('index')
})

app.post('/profile',(req,res) => {
    let form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
        let oldpath = files.yourImage.filepath;
        let newpath = `${__dirname}/public/images/${files.yourImage.originalFilename}`;
        console.log(">>>>oldpath>>>",oldpath)
        console.log(">>>>newpath>>>",newpath)
        fs.rename(oldpath,newpath,(err)=>{
            res.send('File Uploded')
        });
    })
})


app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})

