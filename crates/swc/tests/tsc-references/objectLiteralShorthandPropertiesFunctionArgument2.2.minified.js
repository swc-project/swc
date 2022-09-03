//// [objectLiteralShorthandPropertiesFunctionArgument2.ts]
var id = 10000, name = "my name", person = {
    name: name,
    id: id
};
function foo(p) {}
foo(person);
