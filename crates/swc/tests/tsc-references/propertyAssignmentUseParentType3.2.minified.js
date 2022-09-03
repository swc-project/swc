//// [propertyAssignmentUseParentType3.ts]
function foo1() {
    return 123;
}
function foo2() {
    return [];
}
function foo3() {
    return "";
}
function foo4() {
    return {
        x: 123
    };
}
foo1.toFixed = "", foo2.join = "", foo3.trim = "", foo4.x = "456";
