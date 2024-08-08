// public is allowed on a constructor but is not meaningful

class C {
    public constructor() { }
}

var c = new C();
var r             = c.constructor;

class C2 {
    public constructor(x        );
    public constructor(x     ) { }
}

var c2 = new C2();
var r2                      = c2.constructor;