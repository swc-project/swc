//// [parserArrowFunctionExpression10.ts]
//// [fileJs.js]
a ? function(b) {
    return d;
} : function(e) {
    return f // Not legal JS; "Unexpected token ':'" at last colon
     // Not legal JS; "Unexpected token ':'" at last colon
    ;
};
//// [fileTs.ts]
a ? function(b) {
    return d;
} : function(e) {
    return f;
};
