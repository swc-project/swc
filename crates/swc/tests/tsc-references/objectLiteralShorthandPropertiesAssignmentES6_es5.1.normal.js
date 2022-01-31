// @lib: es5
// @target: es6
var id = 10000;
var name = "my name";
var person = {
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
var person1 = bar("Hello", 5);
var person2 = bar("Hello", 5);
var person3 = bar("Hello", 5);
