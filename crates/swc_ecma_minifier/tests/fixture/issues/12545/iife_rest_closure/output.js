var g = function(...args) {
    return function() {
        return args.push(0);
    };
}(1);
console.log(g(), g());
