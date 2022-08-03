export var Test;
(function(t) {
    let e;
    (function(e) {
        e["Test"] = "1";
        e["Test2"] = "2";
        e["Test3"] = "3";
    })(e = t.testEnum || (t.testEnum = {}));
    let n;
    (function(n) {
        n["Test"] = "1";
        n["Test2"] = "2";
        n["Test3"] = "3";
    })(n = t.testEnum2 || (t.testEnum2 = {}));
})(Test || (Test = {}));
