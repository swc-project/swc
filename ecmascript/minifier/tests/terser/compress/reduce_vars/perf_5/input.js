function indirect_foo(x, y, z) {
    function foo(x, y, z) {
        return x < y ? x * y + z : x * z - y;
    }
    return foo(x, y, z);
}
var sum = 0;
for (var i = 0; i < 100; ++i) {
    sum += indirect_foo(i, i + 1, 3 * i);
}
console.log(sum);
