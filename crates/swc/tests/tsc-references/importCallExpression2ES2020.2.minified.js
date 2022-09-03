//// [0.ts]
export class B {
    print() {
        return "I am B";
    }
}
//// [2.ts]
function foo(x) {
    x.then((value)=>{
        new value.B().print();
    });
}
foo(import("./0"));
