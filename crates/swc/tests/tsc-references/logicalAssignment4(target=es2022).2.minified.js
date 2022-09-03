//// [logicalAssignment4.ts]
function foo1(results) {
    (results ||= []).push(100);
}
function foo2(results) {
    (results ??= []).push(100);
}
function foo3(results) {
    (results ||= []).push(100);
}
function foo4(results) {
    (results ??= []).push(100);
}
function doSomethingWithAlias(thing, defaultValue) {
    1 === v ? (thing &&= thing.original) && thing.name : 2 === v ? (thing &&= defaultValue) && (thing.name, defaultValue.name) : 3 === v ? (thing ||= defaultValue) && (thing.name, defaultValue.name) : (thing ??= defaultValue) && (thing.name, defaultValue.name);
}
