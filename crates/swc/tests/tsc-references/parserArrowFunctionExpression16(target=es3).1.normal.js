//// [parserArrowFunctionExpression16.ts]
//// [fileJs.js]
true ? false ? function(param) {
    return param;
} : null : null // Not legal JS; "Unexpected token ':'" at last colon
;
//// [fileTs.ts]
true ? false ? function(param) {
    return param;
} : null : null;
