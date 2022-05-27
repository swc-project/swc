var a = console;
console.log((function(a) {
    return {
        x: a.a,
        y: a.b
    };
})(a));
