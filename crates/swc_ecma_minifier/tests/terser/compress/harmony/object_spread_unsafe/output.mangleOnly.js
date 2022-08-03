var a = {
    x: 1,
    y: 2
};
var r = {
    x: 3,
    z: 4
};
var v = {
    ...a
};
var x = {
    ...a,
    ...r
};
console.log(v, x);
