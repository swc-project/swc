//// [objectLiteralShorthandPropertiesAssignment.ts]
var id = 10000, name = "my name", person = {
    name: name,
    id: id
};
function foo(obj) {}
function bar(name, id) {
    return {
        name: name,
        id: id
    };
}
function bar1(name, id) {
    return {
        name: name
    };
}
function baz(name, id) {
    return {
        name: name,
        id: id
    };
}
foo(person);
var person1 = bar("Hello", 5), person2 = bar("Hello", 5), person3 = bar("Hello", 5);
