let os = require('os');
console.log(os.platform())
console.log(os.arch())
console.log(os.cpus().length+" core")
console.log(os.version())
console.log(os.uptime())
console.log(os.freemem())

/*
darwin
x64
4 core
Darwin Kernel Version 20.1.0: Sat Oct 31 00:07:11 PDT 2020; root:xnu-7195.50.7~2/RELEASE_X86_64
347570
818589696
*/