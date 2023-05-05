function example() {
    var MyEnum = function(MyEnumInner) {
        MyEnumInner["First"] = "first";
        MyEnumInner["Second"] = "second";
        return MyEnumInner;
    }(MyEnum || {});
    return MyEnum;
}
example();
