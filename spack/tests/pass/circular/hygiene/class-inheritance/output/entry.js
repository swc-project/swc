class A extends B {
}
class B extends C {
    a() {
        return new A();
    }
}
class C {
    a() {
        throw new Error('Unimplemented');
    }
    b() {
        return new B();
    }
}
console.log(A, 'Loaded!');
