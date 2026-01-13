//// [parserArrowFunctionExpression6.ts]
function foo(q, b) {
    return true ? q ? true : false : (b = q.length, function() {});
}
