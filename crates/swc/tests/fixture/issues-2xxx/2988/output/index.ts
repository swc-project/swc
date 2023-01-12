export var Test;
(function(t) {
    let e;
    (function(t) {
        t["Test"] = "1";
        t["Test2"] = "2";
        t["Test3"] = "3";
    })(e = t.testEnum || (t.testEnum = {}));
    let s;
    (function(t) {
        t["Test"] = "1";
        t["Test2"] = "2";
        t["Test3"] = "3";
    })(s = t.testEnum2 || (t.testEnum2 = {}));
})(Test || (Test = {}));
