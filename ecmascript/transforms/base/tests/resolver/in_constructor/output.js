class C {
}
class A extends C {
    constructor(){
        super();
        class B__2 extends C {
            constructor(){
                super();
            }
        }
        new B__2();
    }
}
