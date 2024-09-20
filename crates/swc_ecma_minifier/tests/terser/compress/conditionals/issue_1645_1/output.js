var a = 100, b = 10;
(b = a) ? (a++, b += a, b += a) : b ^= a;
console.log(a, b);
