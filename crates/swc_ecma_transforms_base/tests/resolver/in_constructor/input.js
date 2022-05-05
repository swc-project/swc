class C {}

class A extends C {
    constructor() {
        super();

        class B extends C {
            constructor() {
                super();
            }
        }

        new B();
    }
}
