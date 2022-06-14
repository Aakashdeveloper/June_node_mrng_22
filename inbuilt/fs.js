let fs = require('fs');

//create file
// fs.writeFile('mytext.txt','Second Time Testing',function(){
//     console.log('Task Done')
// })
var a = [
    {"name":"John"},
    {"name":"Amit"}
]
///append file
fs.appendFile('mycode.json',JSON.stringify(a),function(err){
    if(err) throw err;
    console.log('File Appended')
})