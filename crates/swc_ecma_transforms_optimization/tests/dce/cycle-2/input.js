


function foo() {
    bar()
    baz()
}

function bar() {
    foo()
}

function baz() {
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


bar()