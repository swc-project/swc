function f(some) {
    some.thing = false;
}
console.log(
    (function () {
        var some = { thing: true };
        f(some);
        return some.thing;
    })()
);
