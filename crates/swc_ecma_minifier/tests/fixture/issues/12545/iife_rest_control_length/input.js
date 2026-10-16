var f = (function (...a) {
    return function () {
        return a.length;
    };
})(1, 2);
console.log(f(), f());
