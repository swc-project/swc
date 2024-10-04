(function(MyNamespace) {
    (function(MyEnum) {
        MyEnum[MyEnum["A"] = 1] = "A";
    })(MyNamespace.MyEnum || (MyNamespace.MyEnum = {}));
    (function(MyInnerNamespace) {
        (function(MyEnum) {
            MyEnum[MyEnum["A"] = 1] = "A";
        })(MyInnerNamespace.MyEnum || (MyInnerNamespace.MyEnum = {}));
    })(MyNamespace.MyInnerNamespace || (MyNamespace.MyInnerNamespace = {}));
})(MyNamespace || (MyNamespace = {}));
(function(MyNamespace) {
    (function(MyEnum) {
        MyEnum[MyEnum["B"] = 1] = "B";
    })(MyNamespace.MyEnum || (MyNamespace.MyEnum = {}));
    (function(MyInnerNamespace) {
        MyInnerNamespace.Dec2 = 2;
    })(MyNamespace.MyInnerNamespace || (MyNamespace.MyInnerNamespace = {}));
})(MyNamespace || (MyNamespace = {}));
(function(MyNamespace) {
    let MyEnum = /*#__PURE__*/ function(MyEnum) {
        MyEnum[MyEnum["A"] = 2] = "A";
        return MyEnum;
    }({});
})(MyNamespace || (MyNamespace = {}));
var MyNamespace;
