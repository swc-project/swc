//// [parserArrowFunctionExpression10.ts]
//// [fileJs.js]
a || ((e)=>f // Not legal JS; "Unexpected token ':'" at last colon
     // Not legal JS; "Unexpected token ':'" at last colon
);
//// [fileTs.ts]
a || ((e)=>f);
