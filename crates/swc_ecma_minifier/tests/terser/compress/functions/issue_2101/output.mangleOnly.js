a = {};
console.log((function() {
    return (function() {
        return this.a;
    })();
})() === (function() {
    return a;
})());
