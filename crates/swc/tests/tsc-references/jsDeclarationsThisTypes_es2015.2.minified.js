export class A {
    method() {
        return this;
    }
}
class Base extends A {
    verify() {}
}
export { Base as default };
