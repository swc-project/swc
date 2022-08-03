console.log((function(n) {
    var r = 42;
    return (function() {
        n--;
        n--, n.toString();
        return;
    })();
})());
