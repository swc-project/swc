export let a;
(function(a) {
    (function(b) {
        let e;
        (function(e) {
            e["FOO"] = "BAR";
        })(e = b.e || (b.e = {}));
    })(a.b || (a.b = {}));
})(a || (a = {}));
