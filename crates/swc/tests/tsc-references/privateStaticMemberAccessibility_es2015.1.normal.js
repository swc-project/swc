class Base {
}
class Derived extends Base {
    constructor(...args){
        super(...args);
        this.bing // error
         = ()=>Base.foo
        ;
    }
}
Derived.bar = Base.foo;
