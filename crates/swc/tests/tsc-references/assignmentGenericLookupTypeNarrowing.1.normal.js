//// [assignmentGenericLookupTypeNarrowing.ts]
// Repro from #26130
var mappedObject = {
    foo: {
        x: "hello"
    }
};
function bar(key) {
    var element = foo(mappedObject[key]);
    if (element == null) return;
    var x = element.x;
}
