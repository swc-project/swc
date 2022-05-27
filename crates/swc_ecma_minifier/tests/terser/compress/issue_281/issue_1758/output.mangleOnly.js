console.log((function(a) {
    var b = 42;
    return (function() {
        a--;
        a--, a.toString();
        return;
    })();
})());
