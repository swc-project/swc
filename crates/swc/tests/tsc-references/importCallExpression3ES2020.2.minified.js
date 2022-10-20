//// [0.ts]
export class B {
    print() {
        return "I am B";
    }
}
//// [2.ts]
!async function() {
    class C extends (await import("./0")).B {
    }
    new C().print();
}();
