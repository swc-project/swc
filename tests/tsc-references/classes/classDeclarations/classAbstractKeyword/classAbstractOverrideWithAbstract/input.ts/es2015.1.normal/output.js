class A {
    foo() {
    }
}
class B extends A {
}
class AA {
    foo() {
    }
}
class BB extends AA {
    bar() {
    }
}
class CC extends BB {
} // error
class DD extends BB {
    foo() {
    }
}
