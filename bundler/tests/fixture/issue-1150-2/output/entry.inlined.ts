function a() {
    console.log("a");
}
var O1;
(function(O1) {
    O1[O1["A"] = 0] = "A";
    O1[O1["B"] = 1] = "B";
    O1[O1["C"] = 2] = "C";
})(O1 || (O1 = {
}));
export { O1 as O };
class A {
    #a;
    #c;
    constructor(o = {
    }){
        const { a: a1 = a , c ,  } = o;
        this.#a = a1;
        this.#c = c;
    }
    a() {
        this.#a();
    }
    c() {
        console.log(this.#c);
    }
}
let a2 = new A();
a2.a();
a2.c();
