class Base {
}
class Derived extends Base {
    constructor(...args){
        super(...args);
        this.bing = ()=>Base.foo // error
        ;
    }
}
Derived.bar = Base.foo // error
;
