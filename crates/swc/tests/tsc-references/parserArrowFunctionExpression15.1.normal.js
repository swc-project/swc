//// [parserArrowFunctionExpression15.ts]
//// [fileJs.js]
false ? (param)=>param : null // Not legal JS; "Unexpected token ':'" at last colon
;
//// [fileTs.ts]
false ? (param)=>param : null;
