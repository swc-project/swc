//// [parserArrowFunctionExpression17.ts]
//// [fileJs.js]
a ? b : function(c) {
    return e // Not legal JS; "Unexpected token ':'" at last colon
    ;
};
//// [fileTs.ts]
a ? b : function(c) {
    return e;
};
