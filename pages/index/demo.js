var fs = require("fs");

// 同步读取
var data = fs.readFileSync('index.wxss');
var pall = /[0-9]{0,1}\.?\d{0,6}rem/ig;

var str = data.toString().replace(pall,'123456789') 

console.log("同步读取: " + str);


console.log("程序执行完毕。");