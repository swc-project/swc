function example() {
    var MyEnum = /*#__PURE__*/ function(MyEnumInner) {
        MyEnumInner["First"] = "first";
        MyEnumInner["Second"] = "second";
        return MyEnumInner;
    }(MyEnum || {});
    return MyEnum;
}
example();
