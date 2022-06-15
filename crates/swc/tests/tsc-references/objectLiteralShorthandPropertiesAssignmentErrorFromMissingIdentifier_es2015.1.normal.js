// @lib: es5
var id = 10000;
var name = "my name";
var person = {
    name,
    id
}; // error
function bar(name, id) {
    return {
        name,
        id
    };
} // error
function foo(name, id) {
    return {
        name,
        id
    };
} // error
var person1; // ok
var person2 = bar("hello", 5);
