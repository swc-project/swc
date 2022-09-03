//// [classStaticBlock18.ts]
function foo() {
    return class {
        static foo = 1;
        static{}
    };
}
