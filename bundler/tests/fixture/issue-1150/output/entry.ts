function a() {
    console.log("a");
}
const a1 = a;
const a2 = a1;
var O3;
const O1 = O3;
(function(O2) {
    O2[O2["A"] = 0] = "A";
    O2[O2["B"] = 1] = "B";
    O2[O2["C"] = 2] = "C";
})(O3 || (O3 = {
}));
const O2 = O1;
const defaultA = a2;
export { O2 as O };
class A {
    #a;
    #c;
    constructor(o = {
    }){
        const { a: a3 = defaultA , c ,  } = o;
        this.#a = a3;
        this.#c = c;
    }
    a() {
        this.#a();
    }
    c() {
        console.log(this.#c);
    }
}
let a4 = new A();
a4.a();
a4.c();
