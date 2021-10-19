class C {
    constructor(){
        this.x = 1, this.y = "hello";
    }
}
new C(), new C(null);
class D {
    constructor(){
        this.x = 2, this.y = null;
    }
}
new D(), new D(null);
