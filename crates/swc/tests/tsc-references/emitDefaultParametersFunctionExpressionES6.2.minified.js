//// [emitDefaultParametersFunctionExpressionES6.ts]
var lambda1 = (y = "hello")=>{}, lambda2 = (x, y = "hello")=>{}, lambda3 = (x, y = "hello", ...rest)=>{}, lambda4 = (y = "hello", ...rest)=>{}, x = function(str = "hello", ...rest) {}, y = function(num = 10, boo = !1, ...rest) {}(), z = function(num, boo = !1, ...rest) {}(10);
