export class B {
    print() {
        return "I am B";
    }
}
!function(x) {
    x.then((value)=>{
        new value.B().print();
    });
}(import("./0"));
