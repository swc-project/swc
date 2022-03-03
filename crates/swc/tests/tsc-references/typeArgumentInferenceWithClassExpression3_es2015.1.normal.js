function foo(x = class {
}) {
    return undefined;
}
foo(class {
    constructor(){
        this.prop = "hello";
    }
}).length;
