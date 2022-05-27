var a = ()=>42;
var b = (a)=>a;
var c = (a)=>a;
var d = (...a)=>a;
var e = (a, b)=>a + b;
var f = (a, ...b)=>a + b[0];
var g = (...a)=>a.join();
