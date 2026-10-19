var g = function(...a) {
    return function() {
        return a.push(0);
    };
}(1);
console.log(g(), g());
