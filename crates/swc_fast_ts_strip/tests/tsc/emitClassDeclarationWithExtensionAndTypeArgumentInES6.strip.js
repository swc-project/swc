// @target: es6
class B    {
    constructor(a   ) { }
}
class C extends B         { }
class D extends B         {
    constructor(a     )
    constructor(b        ) {
        super(b);
    }
}