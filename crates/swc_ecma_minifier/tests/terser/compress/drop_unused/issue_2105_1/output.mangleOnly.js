!(function(n) {
    n();
})(function() {
    return (function(n) {
        n()().prop();
    })(function() {
        function n() {
            var o = function() {
                console.log("PASS");
            }, n = function() {
                console.log;
                o();
            };
            return {
                prop: n
            };
        }
        return n;
    });
});
