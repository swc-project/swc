//// [parserArrowFunctionExpression10.ts]
//// [fileJs.js]
a ? (b)=>d : (e)=>f // Not legal JS; "Unexpected token ':'" at last colon
     // Not legal JS; "Unexpected token ':'" at last colon
;
//// [fileTs.ts]
a ? (b)=>d : (e)=>f;
