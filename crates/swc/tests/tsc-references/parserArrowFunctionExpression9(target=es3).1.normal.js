//// [parserArrowFunctionExpression9.ts]
//// [fileJs.js]
b ? c : function(d) {
    return e // Legal JS
     // Legal JS
    ;
};
//// [fileTs.ts]
b ? c : function(d) {
    return e;
};
