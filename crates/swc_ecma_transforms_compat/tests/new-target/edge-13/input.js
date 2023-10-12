class A {
    foo() {
        return () => new.target
    }

    constructor() {
        () => new.target
    }
}