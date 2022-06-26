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
var f = (a, ...b)=>{
    var c = a;
    for(var d = 0; d < b.length; d++)c += b[d];
    return c;
};
var g = (...a)=>{
    a.join();
};
