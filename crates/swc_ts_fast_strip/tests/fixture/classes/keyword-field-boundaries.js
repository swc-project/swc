class GetOptionalStringMethod {
    get;
    "foo"() {}
}

class SetOptionalNumericMethod {
    set;
    1() {}
}

class StaticOptionalComputedMethod {
    static;
    ["foo"]() {}
}

class GetOptionalGenerator {
    get;
    *foo() {}
}

class SetOptionalGenerator {
    set;
    *foo() {}
}

class StaticOptionalGenerator {
    static;
    *foo() {}
}

class StaticOptionalConstructor {
    static;
    constructor() { globalThis.constructed = true; }
}

class StaticOptionalPrivateMethod {
    static;
    #foo() {}
}

class StaticOptionalStaticBlock {
    static;
    static {}
}

class GetDefiniteComputedMethod {
    get ;        
    ["foo"]() {}
}

class SetDefiniteComputedMethod {
    set ;        
    ["foo"]() {}
}

class StaticDefiniteComputedMethod {
    static ;        
    ["foo"]() {}
}
