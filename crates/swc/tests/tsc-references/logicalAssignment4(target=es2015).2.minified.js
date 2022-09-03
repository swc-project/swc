//// [logicalAssignment4.ts]
function foo1(results) {
    (results || (results = [])).push(100);
}
function foo2(results) {
    (null != results ? results : results = []).push(100);
}
function foo3(results) {
    results || (results = []), results.push(100);
}
function foo4(results) {
    null != results || (results = []), results.push(100);
}
function doSomethingWithAlias(thing, defaultValue) {
    1 === v ? thing && (thing = thing.original) && thing.name : 2 === v ? thing && (thing = defaultValue) && (thing.name, defaultValue.name) : 3 === v ? (thing || (thing = defaultValue)) && (thing.name, defaultValue.name) : (null != thing ? thing : thing = defaultValue) && (thing.name, defaultValue.name);
}
