var a = ()=>{
    var a = 42 * Math.random();
    return a;
};
var b = (a)=>{
    var b = Math.random() * a;
    return b;
};
var c = (a)=>{
    var b = Math.random() * a;
    return b;
};
var d = (...a)=>{
    var b = Math.random() * a;
    return b;
};
var e = (a, b)=>{
    var c = a * b + a / b;
    return c;
};
var f = (d, ...b)=>{
    var c = d;
    for(var a = 0; a < b.length; a++)c += b[a];
    return c;
};
var g = (...a)=>{
    a.join();
};
