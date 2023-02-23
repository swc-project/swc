//// [parserArrowFunctionExpression12.ts]
//// [fileJs.js]
a ? function(b) {
    return c;
} : function(d) {
    return e // Legal JS
     // Legal JS
    ;
};
//// [fileTs.ts]
a ? function(b) {
    return c;
} : function(d) {
    return e;
};
