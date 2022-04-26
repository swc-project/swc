class C__1 {
}
class A__1 extends C__1 {
    constructor(){
        super();
        class B__2 extends C__1 {
            constructor(){
                super();
            }
        }
        new B__2();
    }
}
