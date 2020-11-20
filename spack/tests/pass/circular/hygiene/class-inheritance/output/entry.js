class C {
    a() {
        throw new Error('Unimplemented');
    }
    b() {
        return new B2();
    }
}
const C1 = C;
const C2 = C1;
class B extends C2 {
    a() {
        return new A2();
    }
}
const B1 = B;
const B2 = B1;
const B3 = B1;
class A extends B3 {
}
const A1 = A;
const A2 = A1;
const A3 = A1;
console.log(A3, 'Loaded!');
