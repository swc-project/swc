a = "FAIL";
console.log({
    a: "PASS",
    b: function() {
        return (function(b) {
            return b.a;
        })((String, Object, (()=>this)()));
    }
}.b());
