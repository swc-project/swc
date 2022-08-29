//// [lateBoundClassMemberAssignmentJS2.js]
const _sym = "my-fake-sym";
export class MyClass {
    method() {
        this[_sym] = "yep";
        const x = this[_sym];
    }
    constructor(){
        this[_sym] = "ok";
    }
}
