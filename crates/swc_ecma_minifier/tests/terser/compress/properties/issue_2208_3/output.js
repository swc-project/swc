a = 42;
console.log(
    (function () {
        return this.a;
    })()
);
