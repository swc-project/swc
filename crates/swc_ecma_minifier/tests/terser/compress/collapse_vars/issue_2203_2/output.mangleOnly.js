a = "PASS";
console.log({
    a: "FAIL",
    b: function() {
        return (function(b) {
            return b.a;
        })((String, Object, (function() {
            return this;
        })()));
    }
}.b());
