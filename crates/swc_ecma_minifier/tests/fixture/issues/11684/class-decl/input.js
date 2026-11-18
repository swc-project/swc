class A {
    constructor() {}
}

console.log(new A(1, 2, 3), new A(4, 5, 6));

class B {}

console.log(new B(1, 2, 3), new B(4, 5, 6));

class C extends G {}

console.log(new C(1, 2, 3), new C(4, 5, 6));
