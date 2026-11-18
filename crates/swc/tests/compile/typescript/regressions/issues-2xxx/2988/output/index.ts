(function(t) {
    (function(t) {
        t["Test"] = "1";
        t["Test2"] = "2";
        t["Test3"] = "3";
    })(t.testEnum || (t.testEnum = {}));
    (function(t) {
        t["Test"] = "1";
        t["Test2"] = "2";
        t["Test3"] = "3";
    })(t.testEnum2 || (t.testEnum2 = {}));
})(Test || (Test = {}));
export var Test;
