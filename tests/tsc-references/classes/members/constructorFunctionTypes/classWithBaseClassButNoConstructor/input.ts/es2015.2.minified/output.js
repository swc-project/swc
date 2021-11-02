class Base {
    constructor(x){
    }
}
class C extends Base {
}
new C(), new C(1);
class Base2 {
    constructor(x1){
    }
}
class D extends Base2 {
}
new D(), new D(1), new D(), new D(1), new D(), new D(1);
