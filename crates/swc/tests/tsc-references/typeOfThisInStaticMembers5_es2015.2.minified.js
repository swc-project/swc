(class {
    constructor(foo){
        this.foo = foo;
    }
}).create = ()=>new this("yep")
;
