// @lib: es5
var id1 = 10000;
var name1 = "my name";
var person = {
    name: name1,
    id: id1
}; // error
function bar(name, id) {
    return {
        name: name,
        id: id
    };
} // error
function foo(name, id) {
    return {
        name: name,
        id: id
    };
} // error
var person1; // ok
var person2 = bar("hello", 5);
