var bit = 0;
var sum = 0;
sum += (bit ^= 1) ? 0 : 1;
sum += (bit ^= 1) ? 0 : 1;
console.log(sum);
