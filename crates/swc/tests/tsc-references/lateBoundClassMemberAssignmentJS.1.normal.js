//// [lateBoundClassMemberAssignmentJS.js]
const _sym = Symbol("_sym");
export class MyClass {
    method() {
        this[_sym] = "yep";
        const x = this[_sym];
    }
    constructor(){
        this[_sym] = "ok";
    }
}
