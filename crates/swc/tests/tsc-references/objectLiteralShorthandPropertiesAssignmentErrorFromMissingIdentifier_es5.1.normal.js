// @lib: es5
var id = 10000;
var name = "my name";
var person = {
    name: name,
    id: id
}; // error
function bar(name1, id1) {
    return {
        name: name1,
        id: id1
    };
} // error
function foo(name2, id2) {
    return {
        name: name2,
        id: id2
    };
} // error
var person1; // ok
var person2 = bar("hello", 5);
