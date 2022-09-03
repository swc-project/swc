//// [assignmentGenericLookupTypeNarrowing.ts]
var mappedObject = {
    foo: {
        x: "hello"
    }
};
function bar(key) {
    var element = foo(mappedObject[key]);
    null != element && element.x;
}
