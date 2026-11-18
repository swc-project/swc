function isModuleWrapper(node) {
    return (
        // It's an anonymous function expression that wraps module
        (node.type === 'FunctionExpression' && !node.id) ||
        node.type === 'ArrowFunctionExpression' ||
        isModuleId(node) ||
        (node.type === 'ArrayExpression' && node.elements.length > 1 && isModuleId(node.elements[0]))
    )
}