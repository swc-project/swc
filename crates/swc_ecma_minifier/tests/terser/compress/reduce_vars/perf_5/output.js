var sum = 0;
for(var i = 0; i < 100; ++i)sum += function(x, y, z) {
    return function(x, y, z) {
        return x < y ? x * y + z : x * z - y;
    }(x, y, z);
}(i, i + 1, 3 * i);
console.log(sum);
