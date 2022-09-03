//// [objectLiteralShorthandPropertiesAssignmentErrorFromMissingIdentifier.ts]
var person1, id = 10000, name = "my name", person = {
    name: name,
    id: id
};
function bar(name, id) {
    return {
        name: name,
        id: id
    };
}
function foo(name, id) {
    return {
        name: name,
        id: id
    };
}
var person2 = bar("hello", 5);
