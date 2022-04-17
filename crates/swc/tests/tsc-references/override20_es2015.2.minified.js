let Foo = class {
    m1() {}
    m2() {}
};
export class Bar extends Foo {
    m1() {
        super.m1();
    }
    m2() {
        super.m2();
    }
}
