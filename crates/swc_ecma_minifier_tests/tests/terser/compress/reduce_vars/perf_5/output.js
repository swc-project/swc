function indirect_foo(x1, y1, z1) {
    return (function(x, y, z) {
        return x < y ? x * y + z : x * z - y;
    })(x1, y1, z1);
}
var sum = 0;
for(var i = 0; i < 100; ++i)sum += indirect_foo(i, i + 1, 3 * i);
console.log(sum);
