//// [propertyAssignmentUseParentType3.ts]
// don't use the parent type if it's a function declaration (#33741)
function foo1() {
    return 123;
}
foo1.toFixed = "";
function foo2() {
    return [];
}
foo2.join = "";
function foo3() {
    return "";
}
foo3.trim = "";
function foo4() {
    return {
        x: 123
    };
}
foo4.x = "456";
