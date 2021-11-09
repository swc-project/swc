// @lib: es5
var id1 = 10000;
var name1 = "my name";
var person = {
    name: name1,
    id: id1
}; // error
var person1; // ok
function foo(name, id) {
    return {
        name,
        id
    };
} // error
function bar(obj) {
}
bar({
    name: name1,
    id: id1
}); // error
