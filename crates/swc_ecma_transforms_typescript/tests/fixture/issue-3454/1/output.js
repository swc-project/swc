export var a;
(function(a) {
    let b;
    (function(b) {
        let e;
        (function(e) {
            e["FOO"] = "BAR";
        })(e = b.e || (b.e = {}));
    })(b = a.b || (a.b = {}));
})(a || (a = {}));
