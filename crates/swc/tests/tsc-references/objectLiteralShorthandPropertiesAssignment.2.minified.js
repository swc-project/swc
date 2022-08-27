//// [objectLiteralShorthandPropertiesAssignment.ts]
function bar(name, id) {
    return {
        name: name,
        id: id
    };
}
bar("Hello", 5), bar("Hello", 5), bar("Hello", 5);
