let http = require('http');

// req > what we send to server (params, queryParams,body)
// res > what server will respond

let server = http.createServer(function(req, res){
    res.write('<h1>Hiii From Node Server</h1>');
    res.end();
})

server .listen(9700)