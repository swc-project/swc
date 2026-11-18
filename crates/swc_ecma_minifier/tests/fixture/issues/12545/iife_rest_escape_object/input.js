var g = (function (...a) {
    return function () {
        return { length: a }.length;
    };
})(1);
console.log(g() === g());
