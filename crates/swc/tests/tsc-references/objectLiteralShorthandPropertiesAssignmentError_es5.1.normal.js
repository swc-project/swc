// @lib: es5
var id = 10000;
var name = "my name";
var person = {
    name: name,
    id: id
}; // error
var person1; // ok
function foo(name, id) {
    return {
        name: name,
        id: id
    };
} // error
function bar(obj) {}
bar({
    name: name,
    id: id
}); // error
