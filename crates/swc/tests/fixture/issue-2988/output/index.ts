export var Test;
(function(a) {
    let b;
    (function(b) {
        b["Test"] = "1";
        b["Test2"] = "2";
        b["Test3"] = "3";
    })(b = a.testEnum || (a.testEnum = {}));
    let c;
    (function(c) {
        c["Test"] = "1";
        c["Test2"] = "2";
        c["Test3"] = "3";
    })(c = a.testEnum2 || (a.testEnum2 = {}));
})(Test || (Test = {}));
