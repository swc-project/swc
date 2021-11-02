class Base {
    constructor(x){
        this.a = 1, this.a = x;
    }
}
class Derived extends Base {
    constructor(...args){
        super(...args), this.x = 1, this.y = "hello";
    }
}
new Derived(), new Derived(1);
class Base2 {
    constructor(x1){
        this.a = x1;
    }
}
class D extends Base2 {
    constructor(...args1){
        super(...args1), this.x = 2, this.y = null;
    }
}
new D(), new D(new Date());
