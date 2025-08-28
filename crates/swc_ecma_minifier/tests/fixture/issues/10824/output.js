class A {
    b;
    constructor(b){
        this.b = b;
    }
    c = (i = 1)=>{
        this.b += i;
    };
}
let a1 = new A(1), a2 = new A(2);
a1.c(), console.assert(2 === a1.b), console.assert(2 === a2.b);
export { };
