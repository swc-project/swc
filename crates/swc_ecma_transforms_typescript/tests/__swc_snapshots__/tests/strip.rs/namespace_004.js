(function(MyNamespace) {
    var MyEnum = /*#__PURE__*/ function(MyEnum) {
        MyEnum[MyEnum["A"] = 1] = "A";
        return MyEnum;
    }(MyEnum || {});
    MyNamespace.MyEnum = MyEnum;
    (function(MyInnerNamespace) {
        var MyEnum = /*#__PURE__*/ function(MyEnum) {
            MyEnum[MyEnum["A"] = 1] = "A";
            return MyEnum;
        }(MyEnum || {});
        MyInnerNamespace.MyEnum = MyEnum;
    })(MyInnerNamespace || (MyInnerNamespace = {}));
    MyNamespace.MyInnerNamespace = MyInnerNamespace;
})(MyNamespace || (MyNamespace = {}));
(function(MyNamespace) {
    var MyEnum = /*#__PURE__*/ function(MyEnum) {
        MyEnum[MyEnum["B"] = 1] = "B";
        return MyEnum;
    }(MyEnum || {});
    MyNamespace.MyEnum = MyEnum;
    (function(MyInnerNamespace) {
        MyInnerNamespace.Dec2 = 2;
    })(MyInnerNamespace || (MyInnerNamespace = {}));
    MyNamespace.MyInnerNamespace = MyInnerNamespace;
})(MyNamespace || (MyNamespace = {}));
(function(MyNamespace) {
    var MyEnum = /*#__PURE__*/ function(MyEnum) {
        MyEnum[MyEnum["A"] = 2] = "A";
        return MyEnum;
    }(MyEnum || {});
})(MyNamespace || (MyNamespace = {}));
