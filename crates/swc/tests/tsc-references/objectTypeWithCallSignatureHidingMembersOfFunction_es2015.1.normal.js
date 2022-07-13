// object types with call signatures can override members of Function
// no errors expected below 
var i;
var r1 = i.apply;
var r1b = i.call;
var r1c = i.arguments;
var x;
var r2 = x.apply;
var r2b = x.call;
var r2c = x.arguments;
