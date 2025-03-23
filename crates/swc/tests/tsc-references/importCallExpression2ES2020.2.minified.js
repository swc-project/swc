//// [0.ts]
export class B {
    print() {
        return "I am B";
    }
}
//// [2.ts]
import("./0").then((value)=>{
    new value.B().print();
});
