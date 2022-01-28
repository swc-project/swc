for (var sum = 0, i = 0; i < 10; i++)
    sum += ((x = i), (y = i + 1), (z = 3 * i), x < y ? x * y + z : x * z - y);
var x, y, z;
console.log(sum);
