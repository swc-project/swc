!(function(n) {
    n();
})(function() {
    return (function(n) {
        n()().prop();
    })(function() {
        function n() {
            var n = function() {
                console.log("PASS");
            }, o = function() {
                console.log;
                n();
            };
            return {
                prop: o
            };
        }
        return n;
    });
});
