//// [parserArrowFunctionExpression14.ts]
//// [fileJs.js]
a() ? (b, c)=>d() : e; // Not legal JS; "Unexpected token ':'" at first colon
//// [fileTs.ts]
a() ? (b, c)=>d() : e;
