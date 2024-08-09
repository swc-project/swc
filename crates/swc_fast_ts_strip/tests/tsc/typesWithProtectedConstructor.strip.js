// @declaration: true

class C {
    protected constructor() { }
}

var c = new C(); // error C is protected
var r             = c.constructor;

class C2 {
    protected constructor(x        );
    protected constructor(x     ) { }
}

var c2 = new C2(); // error C2 is protected
var r2                      = c2.constructor;