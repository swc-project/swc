class C {
    a() {
        throw new Error('Unimplemented');
    }
    b() {
        return new B();
    }
}
class B extends C {
    a() {
        return new A();
    }
}
class A extends B {
}
console.log(A, 'Loaded!');
