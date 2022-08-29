//// [0.ts]
export class B {
    print() {
        return "I am B";
    }
}
//// [2.ts]
!function(x) {
    x.then((value)=>{
        new value.B().print();
    });
}(import("./0"));
