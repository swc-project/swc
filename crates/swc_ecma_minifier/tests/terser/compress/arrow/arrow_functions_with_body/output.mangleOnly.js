var r = ()=>{
    var r = 42 * Math.random();
    return r;
};
var a = (r)=>{
    var a = Math.random() * r;
    return a;
};
var v = (r)=>{
    var a = Math.random() * r;
    return a;
};
var n = (...r)=>{
    var a = Math.random() * r;
    return a;
};
var t = (r, a)=>{
    var v = r * a + r / a;
    return v;
};
var e = (r, ...v)=>{
    var a = r;
    for(var n = 0; n < v.length; n++)a += v[n];
    return a;
};
var o = (...r)=>{
    r.join();
};
