var b = 1;
console.log(
    (function (a) {
        return a && ++b;
    })(b--)
);
