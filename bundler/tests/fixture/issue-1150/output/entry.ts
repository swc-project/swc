function a() {
    console.log("a");
}
var O2;
(function(O1) {
    O1[O1["A"] = 0] = "A";
    O1[O1["B"] = 1] = "B";
    O1[O1["C"] = 2] = "C";
})(O2 || (O2 = {
}));
const a1 = a;
const O1 = O2;
export { O1 as O };
class A {
    #a;
    #c;
    constructor(o = {
    }){
        const { a: a2 = a1 , c ,  } = o;
        this.#a = a2;
        this.#c = c;
    }
    a() {
        this.#a();
    }
    c() {
        console.log(this.#c);
    }
}
let a3 = new A();
a3.a();
a3.c();
