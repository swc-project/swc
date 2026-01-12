(function(Test) {
    var DummyValues = /*#__PURE__*/ function(DummyValues) {
        DummyValues["A"] = "A";
        DummyValues["B"] = "B";
        return DummyValues;
    }(DummyValues || {});
    Test.DummyValues = DummyValues;
})(Test || (Test = {}));
console(Test.DummyValues.A);
