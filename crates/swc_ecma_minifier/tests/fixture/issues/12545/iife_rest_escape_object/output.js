var g = function(...a) {
    return function() {
        return a;
    };
}(1);
console.log(g() === g());
