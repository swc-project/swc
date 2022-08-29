//// [parserArrowFunctionExpression17.ts]
//// [fileJs.js]
a ? b : (c)=>e // Not legal JS; "Unexpected token ':'" at last colon
;
//// [fileTs.ts]
a ? b : (c)=>e;
