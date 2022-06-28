const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const port = 9870;


app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})