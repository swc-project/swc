export class B {
    print() {
        return "I am B";
    }
}
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
let specify = bar() ? "./0" : void 0;
import(specify), import(void 0), import(bar() ? "./1" : null), import(null);
