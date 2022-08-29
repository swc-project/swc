//// [objectLiteralShorthandPropertiesFunctionArgument2.ts]
var id = 10000;
var name = "my name";
var person = {
    name: name,
    id: id
};
function foo(p) {}
foo(person); // error
