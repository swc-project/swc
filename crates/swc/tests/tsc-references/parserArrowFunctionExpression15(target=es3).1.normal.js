//// [parserArrowFunctionExpression15.ts]
//// [fileJs.js]
false ? function(param) {
    return param;
} : null // Not legal JS; "Unexpected token ':'" at last colon
;
//// [fileTs.ts]
false ? function(param) {
    return param;
} : null;
