class C__2 {
}
class A__2 extends C__2 {
    constructor(){
        super();
        class B__3 extends C__2 {
            constructor(){
                super();
            }
        }
        new B__3();
    }
}
