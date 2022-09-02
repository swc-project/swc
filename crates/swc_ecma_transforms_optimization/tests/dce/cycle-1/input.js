


function foo() {
    bar()
}

function bar() {
    foo()
}

class A {
    b() {
        new B()
    }
}

class B {
    a() {
        new A()
    }
}