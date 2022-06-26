// body checking
class B {
}
class C {
    explicitThis(m) {
        return this.n + m;
    }
    explicitC(m) {
        return this.n + m;
    }
    explicitProperty(m) {
        return this.n + m;
    }
    explicitVoid(m) {
        return m + 1;
    }
}
class D extends C {
}
function explicitStructural(x) {
    return x + this.y;
}
function justThis() {
    return this.y;
}
function implicitThis(n) {
    return this.m + n + 12;
}
let impl = {
    a: 12,
    explicitVoid2: ()=>this.a,
    explicitVoid1 () {
        return 12;
    },
    explicitStructural () {
        return this.a;
    },
    explicitInterface () {
        return this.a;
    },
    explicitThis () {
        return this.a;
    }
};
impl.explicitVoid1 = function() {
    return 12;
};
impl.explicitVoid2 = ()=>12;
impl.explicitStructural = function() {
    return this.a;
};
impl.explicitInterface = function() {
    return this.a;
};
impl.explicitStructural = ()=>12;
impl.explicitInterface = ()=>12;
impl.explicitThis = function() {
    return this.a;
};
// parameter checking
let ok = {
    y: 12,
    f: explicitStructural
};
let implicitAnyOk = {
    notSpecified: 12,
    f: implicitThis
};
ok.f(13);
implicitThis(12);
implicitAnyOk.f(12);
let c = new C();
let d = new D();
let ripped = c.explicitC;
c.explicitC(12);
c.explicitProperty(12);
c.explicitThis(12);
d.explicitC(12);
d.explicitProperty(12);
d.explicitThis(12);
let reconstructed = {
    n: 12,
    explicitThis: c.explicitThis,
    explicitC: c.explicitC,
    explicitProperty: c.explicitProperty,
    explicitVoid: c.explicitVoid
};
reconstructed.explicitThis(10);
reconstructed.explicitProperty(11);
let explicitVoid = reconstructed.explicitVoid;
explicitVoid(12);
// assignment checking
let unboundToSpecified = (x)=>x + this.y; // ok, this:any
let specifiedToSpecified = explicitStructural;
let anyToSpecified = function(x) {
    return x + 12;
};
let unspecifiedLambda = (x)=>x + 12;
let specifiedLambda = (x)=>x + 12;
let unspecifiedLambdaToSpecified = unspecifiedLambda;
let specifiedLambdaToSpecified = specifiedLambda;
let explicitCFunction;
let explicitPropertyFunction;
c.explicitC = explicitCFunction;
c.explicitC = function(m) {
    return this.n + m;
};
c.explicitProperty = explicitPropertyFunction;
c.explicitProperty = function(m) {
    return this.n + m;
};
c.explicitProperty = reconstructed.explicitProperty;
// lambdas are assignable to anything
c.explicitC = (m)=>m;
c.explicitThis = (m)=>m;
c.explicitProperty = (m)=>m;
// this inside lambdas refer to outer scope
// the outer-scoped lambda at top-level is still just `any`
c.explicitC = (m)=>m + this.n;
c.explicitThis = (m)=>m + this.n;
c.explicitProperty = (m)=>m + this.n;
//NOTE: this=C here, I guess?
c.explicitThis = explicitCFunction;
c.explicitThis = function(m) {
    return this.n + m;
};
// this:any compatibility
c.explicitC = function(m) {
    return this.n + m;
};
c.explicitProperty = function(m) {
    return this.n + m;
};
c.explicitThis = function(m) {
    return this.n + m;
};
// this: contextual typing
c.explicitThis = function(m) {
    return this.n + m;
};
// this: superclass compatibility
c.explicitC = function(m) {
    return this.n + m;
};
// this:void compatibility
c.explicitVoid = (n)=>n;
// class-based assignability
class Base1 {
    polymorphic() {
        return this.x;
    }
    explicit() {
        return this.x;
    }
    static explicitStatic() {
        return this.y;
    }
}
class Derived1 extends Base1 {
}
class Base2 {
    polymorphic() {
        return this.y;
    }
    explicit() {
        return this.x;
    }
}
class Derived2 extends Base2 {
}
let b1 = new Base1();
let b2 = new Base2();
let d1 = new Derived1();
let d2 = new Derived2();
d2.polymorphic = d1.polymorphic // ok, 'x' and 'y' in { x, y }
;
d1.polymorphic = d2.polymorphic // ok, 'x' and 'y' in { x, y }
;
// bivariance-allowed cases
d1.polymorphic = b2.polymorphic // ok, 'y' in D: { x, y }
;
d2.polymorphic = d1.explicit // ok, 'y' in { x, y }
;
b1.polymorphic = d2.polymorphic // ok, 'x' and 'y' not in Base1: { x }
;
b1.explicit = d2.polymorphic // ok, 'x' and 'y' not in Base1: { x }
;
////// use this-type for construction with new ////
function InterfaceThis() {
    this.a = 12;
}
function LiteralTypeThis() {
    this.x = "ok";
}
function AnyThis() {
    this.x = "ok";
}
let interfaceThis = new InterfaceThis();
let literalTypeThis = new LiteralTypeThis();
let anyThis = new AnyThis();
let n = f.call(12);
function missingTypeIsImplicitAny(a) {
    return this.anything + a;
}
