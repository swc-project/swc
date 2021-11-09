// type parameters are not assignable to one another unless directly or indirectly constrained to one another
class Foo {
}
function foo(t, u) {
    var a;
    var b;
    t = a; // ok
    a = t; // ok
    b = u; // ok
    u = b; // ok
    t = u; // error
    u = t; // error
}
class C {
    constructor(){
        this.r = ()=>{
            this.t = this.u; // error
            this.u = this.t; // error
        };
    }
}
