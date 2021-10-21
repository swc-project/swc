// @lib: es5
var id1 = 10000;
var name1 = "my name";
var person = {
    name: name1,
    id: id1
};
function foo(obj) {
}
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
