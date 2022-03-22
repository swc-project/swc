class Base {
    constructor(x){
        this.a = 1, this.a = x;
    }
}
class Derived extends Base {
    constructor(...args){
        super(...args), this.x = 1, this.y = 'hello';
    }
}
new Derived(), new Derived(1), new Derived(1, 2), new Derived(1, 2, 3);
class Base2 {
    constructor(x){
        this.a = x;
    }
}
class D extends Base2 {
    constructor(...args){
        super(...args), this.x = 2, this.y = null;
    }
}
new D(), new D(new Date()), new D(new Date(), new Date()), new D(new Date(), new Date(), new Date());
