var a = 100, b = 10;
(b = a) ? (a++, b += a + a) : b ^= a;
console.log(a, b);
