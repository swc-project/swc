// @declaration: true

class C {
    private constructor() { }
}

var c = new C(); // error C is private
var r             = c.constructor;

class C2 {
    private constructor(x        );
    private constructor(x     ) { }
}

var c2 = new C2(); // error C2 is private
var r2                      = c2.constructor;