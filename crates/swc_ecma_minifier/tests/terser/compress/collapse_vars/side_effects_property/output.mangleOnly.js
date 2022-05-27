var a = [];
var b = 0;
a[b++] = function() {
    return 42;
};
var c = a[b++]();
console.log(c);
