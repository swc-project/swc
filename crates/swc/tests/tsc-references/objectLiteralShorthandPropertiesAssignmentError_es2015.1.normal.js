// @lib: es5
var id = 10000;
var name = "my name";
var person = {
    name,
    id
}; // error
var person1; // ok
function foo(name1, id1) {
    return {
        name: name1,
        id: id1
    };
} // error
function bar(obj) {}
bar({
    name,
    id
}); // error
