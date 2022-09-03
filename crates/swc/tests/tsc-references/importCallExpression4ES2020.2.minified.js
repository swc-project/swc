//// [0.ts]
export class B {
    print() {
        return "I am B";
    }
}
export function foo() {
    return "foo";
}
//// [1.ts]
export function backup() {
    return "backup";
}
//// [2.ts]
class C {
    method() {
        import("./0"), this.myModule.then((Zero)=>{
            console.log(Zero.foo());
        }, async (err)=>{
            console.log(err);
            let one = await import("./1");
            console.log(one.backup());
        });
    }
    constructor(){
        this.myModule = import("./0");
    }
}
