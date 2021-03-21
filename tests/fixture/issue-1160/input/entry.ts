enum MyEnum {
    x = "xxx",
    y = "yyy"
}

class Xpto {
    @Decorator()
    value!: MyEnum;
}

function Decorator() {
    return function (...args) { };
}
