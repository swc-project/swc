export class A {
    get x() {
        return 12;
    }
}
export class B {
    set x(_arg) {}
}
export class C {
    get x() {
        return 12;
    }
    set x(_arg) {}
}
export class D {
}
Object.defineProperty(D.prototype, "x", {
    get: ()=>12
});
export class E {
}
Object.defineProperty(E.prototype, "x", {
    set (_arg) {}
});
export class F {
}
Object.defineProperty(F.prototype, "x", {
    get: ()=>12,
    set (_arg) {}
});
