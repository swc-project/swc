class SomeClass {
    constructor() {}
    foo() {}
}
class NoSemi {
    constructor(...args) {}
    foo() {}
}
class ChildClass extends SomeClass {}
var asExpression = class AsExpression {};
var nameless = class {};
