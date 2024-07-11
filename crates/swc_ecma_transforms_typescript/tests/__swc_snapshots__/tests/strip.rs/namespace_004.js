let MyNamespace;
(function(MyNamespace) {
    let MyEnum;
    (function(MyEnum) {
        MyEnum[MyEnum["A"] = 1] = "A";
    })(MyEnum = MyNamespace.MyEnum || (MyNamespace.MyEnum = {}));
    let MyInnerNamespace;
    (function(MyInnerNamespace) {
        let MyEnum;
        (function(MyEnum) {
            MyEnum[MyEnum["A"] = 1] = "A";
        })(MyEnum = MyInnerNamespace.MyEnum || (MyInnerNamespace.MyEnum = {}));
    })(MyInnerNamespace = MyNamespace.MyInnerNamespace || (MyNamespace.MyInnerNamespace = {}));
})(MyNamespace || (MyNamespace = {}));
(function(MyNamespace) {
    let MyEnum;
    (function(MyEnum) {
        MyEnum[MyEnum["B"] = 1] = "B";
    })(MyEnum = MyNamespace.MyEnum || (MyNamespace.MyEnum = {}));
    let MyInnerNamespace;
    (function(MyInnerNamespace) {
        MyInnerNamespace.Dec2 = 2;
    })(MyInnerNamespace = MyNamespace.MyInnerNamespace || (MyNamespace.MyInnerNamespace = {}));
})(MyNamespace || (MyNamespace = {}));
(function(MyNamespace) {
    let MyEnum;
    (function(MyEnum) {
        MyEnum[MyEnum["A"] = 2] = "A";
    })(MyEnum || (MyEnum = {}));
})(MyNamespace || (MyNamespace = {}));
