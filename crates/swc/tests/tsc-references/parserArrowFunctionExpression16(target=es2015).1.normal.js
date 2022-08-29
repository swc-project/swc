//// [parserArrowFunctionExpression16.ts]
//// [fileJs.js]
true ? false ? (param)=>param : null : null // Not legal JS; "Unexpected token ':'" at last colon
;
//// [fileTs.ts]
true ? false ? (param)=>param : null : null;
