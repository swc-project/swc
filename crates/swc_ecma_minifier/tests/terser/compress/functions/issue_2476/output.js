for(var sum = 0, i = 0; i < 10; i++){
    var x, y, z;
    sum += (x = i, y = i + 1, z = 3 * i, x < y ? x * y + z : x * z - y);
}
console.log(sum);
