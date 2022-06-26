!(function(a) {
    a();
})(function() {
    return (function(a) {
        a()().prop();
    })(function() {
        function a() {
            var a = function() {
                console.log("PASS");
            }, b = function() {
                console.log;
                a();
            };
            return {
                prop: b
            };
        }
        return a;
    });
});
