!(function(a) {
    a();
})(function() {
    return (function(a) {
        a()().prop();
    })(function() {
        function a() {
            var b = function() {
                console.log("PASS");
            }, a = function() {
                console.log;
                b();
            };
            return {
                prop: a
            };
        }
        return a;
    });
});
