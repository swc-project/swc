//// [parserArrowFunctionExpression13.ts]
//// [fileJs.js]
a ? function() {
    return a();
} : function() {
    return null;
}; // Not legal JS; "Unexpected token ')'" at last paren
//// [fileTs.ts]
a ? function() {
    return a();
} : function() {
    return null;
};
