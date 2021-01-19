var a = 0,
    b = 1;
(a = b++), (b = +void 0);
a && a[a++];
console.log(a, b);
