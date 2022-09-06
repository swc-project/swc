var n = 1;
console.log(
    (function (o) {
        return o && ++n;
    })(n--)
);
