// @lib: es5
var id = 1e4;
var name = "my name";
var person = {
    name: name,
    id: id
};
function foo(obj) {}
function bar(name1, id1) {
    return {
        name: name1,
        id: id1
    };
}
function bar1(name2, id) {
    return {
        name: name2
    };
}
function baz(name3, id2) {
    return {
        name: name3,
        id: id2
    };
}
foo(person);
var person1 = bar("Hello", 5);
var person2 = bar("Hello", 5);
var person3 = bar("Hello", 5);
