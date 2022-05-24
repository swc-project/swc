class Base {
}
(class extends Base {
    constructor(...args){
        super(...args), this.bing = ()=>Base.foo;
    }
}).bar = Base.foo;
