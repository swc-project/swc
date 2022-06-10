var a, c;
console.log((function(e) {
    return function() {
        if (a) return b;
        if (c) return d;
    };
})()());
