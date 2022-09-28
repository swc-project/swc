var n = {};
n[Infinity] = 1;
n[1 / 0] = 2;
n[-Infinity] = 3;
n[-1 / 0] = 4;
console.log(n[Infinity], n[1 / 0], n[-Infinity], n[-1 / 0]);
