var a = {
    x: 1,
    y: 2
};
var b = {
    x: 3,
    z: 4
};
var c = {
    ...a
};
var d = {
    ...a,
    ...b
};
console.log(c, d);
