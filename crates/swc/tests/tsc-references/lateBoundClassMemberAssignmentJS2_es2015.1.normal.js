// @allowJs: true
// @checkJs: true
// @emitDeclarationOnly: true
// @strict: true
// @target: es6
// @declaration: true
// @filename: lateBoundClassMemberAssignmentJS2.js
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
