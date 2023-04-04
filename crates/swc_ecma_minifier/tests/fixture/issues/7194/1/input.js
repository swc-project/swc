function example() {
    var MyEnum = /*#__PURE__*/function (MyEnum) {
        MyEnum["First"] = "first";
        MyEnum["Second"] = "second";
        return MyEnum;
    }(MyEnum || {});

    return MyEnum
}

example()