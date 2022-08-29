//// [0.ts]
export class B {
    print() {
        return "I am B";
    }
}
//// [2.ts]
function foo(x) {
    x.then((value)=>{
        let b = new value.B();
        b.print();
    });
}
foo(import("./0"));
