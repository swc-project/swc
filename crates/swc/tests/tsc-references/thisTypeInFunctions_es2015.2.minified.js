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
function implicitThis(n) {
    return this.m + n + 12;
}
let impl = {
    a: 12,
    explicitVoid2: ()=>this.a,
    explicitVoid1: ()=>12,
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
}, impl.explicitVoid2 = ()=>12, impl.explicitStructural = function() {
    return this.a;
}, impl.explicitInterface = function() {
    return this.a;
}, impl.explicitStructural = ()=>12, impl.explicitInterface = ()=>12, impl.explicitThis = function() {
    return this.a;
}, ({
    y: 12,
    f: function(x) {
        return x + this.y;
    }
}).f(13), implicitThis(12), ({
    notSpecified: 12,
    f: implicitThis
}).f(12);
let c = new C(), d = new class extends C {
}();
c.explicitC, c.explicitC(12), c.explicitProperty(12), c.explicitThis(12), d.explicitC(12), d.explicitProperty(12), d.explicitThis(12);
let reconstructed = {
    n: 12,
    explicitThis: c.explicitThis,
    explicitC: c.explicitC,
    explicitProperty: c.explicitProperty,
    explicitVoid: c.explicitVoid
};
reconstructed.explicitThis(10), reconstructed.explicitProperty(11), (0, reconstructed.explicitVoid)(12);
let explicitCFunction, explicitPropertyFunction;
c.explicitC = explicitCFunction, c.explicitC = function(m) {
    return this.n + m;
}, c.explicitProperty = explicitPropertyFunction, c.explicitProperty = function(m) {
    return this.n + m;
}, c.explicitProperty = reconstructed.explicitProperty, c.explicitC = (m)=>m, c.explicitThis = (m)=>m, c.explicitProperty = (m)=>m, c.explicitC = (m)=>m + this.n, c.explicitThis = (m)=>m + this.n, c.explicitProperty = (m)=>m + this.n, c.explicitThis = explicitCFunction, c.explicitThis = function(m) {
    return this.n + m;
}, c.explicitC = function(m) {
    return this.n + m;
}, c.explicitProperty = function(m) {
    return this.n + m;
}, c.explicitThis = function(m) {
    return this.n + m;
}, c.explicitThis = function(m) {
    return this.n + m;
}, c.explicitC = function(m) {
    return this.n + m;
}, c.explicitVoid = (n)=>n;
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
class Base2 {
    polymorphic() {
        return this.y;
    }
    explicit() {
        return this.x;
    }
}
let b1 = new Base1(), b2 = new Base2(), d1 = new class extends Base1 {
}(), d2 = new class extends Base2 {
}();
d2.polymorphic = d1.polymorphic, d1.polymorphic = d2.polymorphic, d1.polymorphic = b2.polymorphic, d2.polymorphic = d1.explicit, b1.polymorphic = d2.polymorphic, b1.explicit = d2.polymorphic, new function() {
    this.a = 12;
}(), new function() {
    this.x = "ok";
}(), new function() {
    this.x = "ok";
}(), f.call(12);
