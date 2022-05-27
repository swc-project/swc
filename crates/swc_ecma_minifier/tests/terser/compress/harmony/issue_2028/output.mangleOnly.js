var a = {};
(function(a) {
    a.X = function() {
        return b;
    };
    class b {
        static hello() {
            console.log("hello");
        }
    }
})(a);
a.X().hello();
