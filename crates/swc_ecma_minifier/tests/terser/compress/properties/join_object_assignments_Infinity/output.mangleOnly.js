var a = {};
a[Infinity] = 1;
a[1 / 0] = 2;
a[-Infinity] = 3;
a[-1 / 0] = 4;
console.log(a[Infinity], a[1 / 0], a[-Infinity], a[-1 / 0]);
