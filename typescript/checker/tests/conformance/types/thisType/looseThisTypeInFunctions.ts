// @noImplicitAny: true
// @noImplicitThis: true

interface I {
    n: number;
    explicitThis(this: this, m: number): number;
}
interface Unused {
    implicitNoThis(m: number): number;
}
class C implements I {
    n: number;
    explicitThis(this: this, m: number): number {
        return this.n + m;
    }
    implicitThis(m: number): number {
        return this.n + m;
    }
    explicitVoid(this: void, m: number): number {
        return m + 1;
    }
}
let c = new C();
c.explicitVoid = c.explicitThis; // error, 'void' is missing everything
let o = {
    n: 101,
    explicitThis: function (m: number) {
        return m + this.n.length; // error, 'length' does not exist on 'number'
    },
    implicitThis(m: number): number { return m; }
};
let i: I = o;
let o2: I = {
    n: 1001,
    explicitThis: function (m) {
         return m + this.n.length;  // error, this.n: number, no member 'length'
    },
}
let x = i.explicitThis;
let n = x(12); // callee:void doesn't match this:I
let u: Unused;
let y = u.implicitNoThis;
n = y(12); // ok, callee:void matches this:any
c.explicitVoid = c.implicitThis // ok, implicitThis(this:any)
o.implicitThis = c.implicitThis; // ok, implicitThis(this:any)
o.implicitThis = c.explicitThis; // ok, implicitThis(this:any) is assignable to explicitThis(this: this)
o.implicitThis = i.explicitThis;
i.explicitThis = function(m) {
     return this.n.length;  // error, this.n: number
}
