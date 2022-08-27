//// [emitDefaultParametersFunctionExpressionES6.ts]
var lambda1 = (y = "hello")=>{};
var lambda2 = (x, y = "hello")=>{};
var lambda3 = (x, y = "hello", ...rest)=>{};
var lambda4 = (y = "hello", ...rest)=>{};
var x = function(str = "hello", ...rest) {};
var y = function(num = 10, boo = false, ...rest) {}();
var z = function(num, boo = false, ...rest) {}(10);
