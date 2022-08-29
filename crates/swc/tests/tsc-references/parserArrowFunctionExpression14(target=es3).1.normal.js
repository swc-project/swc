//// [parserArrowFunctionExpression14.ts]
//// [fileJs.js]
a() ? function(b, c) {
    return d();
} : e; // Not legal JS; "Unexpected token ':'" at first colon
//// [fileTs.ts]
a() ? function(b, c) {
    return d();
} : e;
