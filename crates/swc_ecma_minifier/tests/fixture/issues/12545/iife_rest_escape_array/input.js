var h = () => 0;
var g = (function (...a) {
    return function () {
        return [a, h()][0].push(0);
    };
})(1);
console.log(g(), g());
