var r = [];
var n = 0;
r[n++] = function () {
    return 42;
};
var o = r[n++]();
console.log(o);
