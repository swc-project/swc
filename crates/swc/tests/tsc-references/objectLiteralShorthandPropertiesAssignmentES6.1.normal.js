//// [objectLiteralShorthandPropertiesAssignmentES6.ts]
var id = 10000;
var name = "my name";
var person = {
    name,
    id
};
function foo(obj) {}
function bar(name, id) {
    return {
        name,
        id
    };
}
function bar1(name, id) {
    return {
        name
    };
}
function baz(name, id) {
    return {
        name,
        id
    };
}
foo(person);
var person1 = bar("Hello", 5);
var person2 = bar("Hello", 5);
var person3 = bar("Hello", 5);
