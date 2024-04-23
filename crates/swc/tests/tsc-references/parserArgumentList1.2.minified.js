//// [parserArgumentList1.ts]
export function removeClass(node, className) {
    node.className = node.className.replace(_classNameRegexp(className), function(everything, leftDelimiter, name, rightDelimiter) {
        return leftDelimiter.length + rightDelimiter.length === 2 ? ' ' : '';
    });
}
