var a = {};
a[NaN] = 1;
a[0 / 0] = 2;
console.log(a[NaN], a[NaN]);
