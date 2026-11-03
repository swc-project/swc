
class A {
    [console.log(123)] = 456
    constructor(public a = 1) {}
}

let b = class {
    [console.log(456)] = 123
    constructor(public a = 1) {}
}
