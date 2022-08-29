//// [lateBoundClassMemberAssignmentJS.js]
const _sym = Symbol("_sym");
export class MyClass {
    method() {
        var self = this;
        self[_sym] = "yep";
        const x = self[_sym];
    }
    constructor(){
        var self = this;
        self[_sym] = "ok";
    }
}
