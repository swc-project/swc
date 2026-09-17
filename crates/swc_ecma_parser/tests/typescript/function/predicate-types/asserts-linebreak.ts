type asserts = number;

interface I {
    method(): asserts
    property: number;
    receiver(): asserts
    this: number;
    commented(): asserts /*
    */ next: number;
}

declare function f(): asserts
type Next = number;

class C {
    f!: () => asserts
    p;
    hadP = Object.hasOwn(this, "p");
    constructor() { this.p = 1; }
    check(): asserts this {}
}

export default new C().hadP;
