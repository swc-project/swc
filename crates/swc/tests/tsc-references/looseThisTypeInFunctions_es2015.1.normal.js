// @noImplicitAny: true
// @noImplicitThis: true
class C {
    explicitThis(m) {
        return this.n + m;
    }
    implicitThis(m) {
        return this.n + m;
    }
    explicitVoid(m) {
        return m + 1;
    }
}
let c = new C();
c.explicitVoid = c.explicitThis; // error, 'void' is missing everything
let o = {
    n: 101,
    explicitThis: function(m) {
        return m + this.n.length; // error, 'length' does not exist on 'number'
    },
    implicitThis (m) {
        return m;
    }
};
let i = o;
let o2 = {
    n: 1001,
    explicitThis: function(m) {
        return m + this.n.length; // error, this.n: number, no member 'length'
    }
};
let x = i.explicitThis;
let n = x(12); // callee:void doesn't match this:I
let u;
let y = u.implicitNoThis;
n = y(12); // ok, callee:void matches this:any
c.explicitVoid = c.implicitThis // ok, implicitThis(this:any)
;
o.implicitThis = c.implicitThis; // ok, implicitThis(this:any)
o.implicitThis = c.explicitThis; // ok, implicitThis(this:any) is assignable to explicitThis(this: this)
o.implicitThis = i.explicitThis;
i.explicitThis = function(m) {
    return this.n.length; // error, this.n: number
};
