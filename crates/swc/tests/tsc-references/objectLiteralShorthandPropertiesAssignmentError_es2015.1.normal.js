// @lib: es5
var id = 10000;
var name = "my name";
var person = {
    name,
    id
}; // error
var person1; // ok
function foo(name, id) {
    return {
        name,
        id
    };
} // error
function bar(obj) {}
bar({
    name,
    id
}); // error
