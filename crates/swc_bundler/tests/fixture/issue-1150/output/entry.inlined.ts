function a() {
    console.log("a");
}
var O;
(function(O1) {
    O1[O1["A"] = 0] = "A";
    O1[O1["B"] = 1] = "B";
    O1[O1["C"] = 2] = "C";
})(O || (O = {}));
export { O as O };
class A {
    #a;
    #c;
    constructor(o = {}){
        const { a: a2 = a , c  } = o;
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
let a1 = new A();
a1.a();
a1.c();
