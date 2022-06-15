var a = function(a, b, c) {
    var d = function(a, b, c) {
        return a < b ? a * b + c : a * c - b;
    };
    return d(a, b, c);
};
var b = 0;
for(var c = 0; c < 100; ++c)b += a(c, c + 1, 3 * c);
console.log(b);
