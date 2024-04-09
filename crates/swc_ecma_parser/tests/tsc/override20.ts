// @target: esnext
// @noImplicitOverride: true

const Foo: C1 & C2 =
    class {
        m1() { }
        m2() { }
    }

interface I1 {
    m1(): void;
}

interface I2 {
    m1(): void;
    m2(): void;
}

interface C1 {
    new(...args: any[]): I1;
}

interface C2 {
    new(...args: any[]): I2;
}

export class Bar extends Foo {
    m1() {
        super.m1();
    }
    m2() {
        super.m2();
    }
}
