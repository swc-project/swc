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
import(bar() ? "./0" : void 0), import(void 0), import(bar() ? "./1" : null), import(null);
