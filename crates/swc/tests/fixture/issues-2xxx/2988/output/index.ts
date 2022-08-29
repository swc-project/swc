export var Test;
(function(t) {
    let e;
    (function(e) {
        e["Test"] = "1";
        e["Test2"] = "2";
        e["Test3"] = "3";
    })(e = t.testEnum || (t.testEnum = {}));
    let s;
    (function(s) {
        s["Test"] = "1";
        s["Test2"] = "2";
        s["Test3"] = "3";
    })(s = t.testEnum2 || (t.testEnum2 = {}));
})(Test || (Test = {}));
