var r = [];
var a = 0;
r[a++] = function() {
    return 42;
};
var n = r[a++]();
console.log(n);
