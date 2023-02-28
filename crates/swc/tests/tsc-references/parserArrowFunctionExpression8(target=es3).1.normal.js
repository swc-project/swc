//// [parserArrowFunctionExpression8.ts]
//// [fileJs.js]
x ? function(y) {
    return {
        y: y
    };
} : function(z) {
    return {
        z: z
    } // Legal JS
     // Legal JS
    ;
};
//// [fileTs.ts]
x ? function(y) {
    return {
        y: y
    };
} : function(z) {
    return {
        z: z
    };
};
