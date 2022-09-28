console.log((function() {
    Function.prototype.bar = "PASS";
    return function() {};
})().bar);
