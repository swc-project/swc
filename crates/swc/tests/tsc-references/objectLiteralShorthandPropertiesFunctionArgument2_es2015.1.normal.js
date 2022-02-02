// @lib: es5
var id = 1e4;
var name = "my name";
var person = {
    name,
    id
};
function foo(p) {}
foo(person); // error
