let Test;
(function(Test) {
    let DummyValues;
    (function(DummyValues) {
        DummyValues["A"] = "A";
        DummyValues["B"] = "B";
    })(DummyValues = Test.DummyValues || (Test.DummyValues = {}));
})(Test || (Test = {}));
console(Test.DummyValues.A);
