a = "PASS";
console.log({
    a: "FAIL",
    b: function() {
        return (function(n) {
            return n.a;
        })((String, Object, (function() {
            return this;
        })()));
    }
}.b());
