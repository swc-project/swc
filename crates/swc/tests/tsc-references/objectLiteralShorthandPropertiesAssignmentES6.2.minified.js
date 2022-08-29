//// [objectLiteralShorthandPropertiesAssignmentES6.ts]
function bar(name, id) {
    return {
        name,
        id
    };
}
bar("Hello", 5), bar("Hello", 5), bar("Hello", 5);
