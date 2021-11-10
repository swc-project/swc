a = {};
console.log(
    (function () {
        return this.a;
    })() === a
);
