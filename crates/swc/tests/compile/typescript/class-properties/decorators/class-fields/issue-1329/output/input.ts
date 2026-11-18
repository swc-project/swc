(function(Test) {
    (function(DummyValues) {
        DummyValues["A"] = "A";
        DummyValues["B"] = "B";
    })(Test.DummyValues || (Test.DummyValues = {}));
})(Test || (Test = {}));
console("A");
var Test;
