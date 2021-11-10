function foo(x = class {
}) {
    return undefined;
}
foo(class _class {
    constructor(){
        this.prop = "hello";
    }
}).length;
