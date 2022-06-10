function fun(...rest) {
    return undefined;
}
var a = fun((x)=>{
    x(undefined);
    return x;
}, 10);
var b = fun((x)=>{
    x(undefined);
    return x;
}, 10);
var c = fun((x)=>{
    x(undefined);
    return x;
}, 10);
var d = fun((x)=>{
    x(undefined);
    return x;
}, 10);
var e = fun((x)=>{
    x(undefined);
    return x;
}, (x)=>{
    x(undefined);
    return x;
}, 10);
var f = fun((x)=>{
    x(undefined);
    return x;
}, (x)=>{
    x(undefined);
    return x;
}, 10);
var g = fun((x)=>{
    x(undefined);
    return x;
}, (x)=>{
    x(undefined);
    return x;
}, 10);
var h = fun((x)=>{
    x(undefined);
    return x;
}, (x)=>{
    x(undefined);
    return x;
}, 10);
// Ternaries in parens
var i = fun(Math.random() < 0.5 ? (x)=>{
    x(undefined);
    return x;
} : (x)=>undefined, 10);
var j = fun(Math.random() < 0.5 ? (x)=>{
    x(undefined);
    return x;
} : (x)=>undefined, 10);
var k = fun(Math.random() < 0.5 ? (x)=>{
    x(undefined);
    return x;
} : (x)=>undefined, (x)=>{
    x(undefined);
    return x;
}, 10);
var l = fun(Math.random() < 0.5 ? (x)=>{
    x(undefined);
    return x;
} : (x)=>undefined, (x)=>{
    x(undefined);
    return x;
}, 10);
var lambda1 = (x)=>{
    x(undefined);
    return x;
};
var lambda2 = (x)=>{
    x(undefined);
    return x;
};
var obj1 = {
    x: (x)=>(x, undefined),
    y: (y)=>(y, undefined)
};
var obj2 = {
    x: (x)=>(x, undefined),
    y: (y)=>(y, undefined)
};
