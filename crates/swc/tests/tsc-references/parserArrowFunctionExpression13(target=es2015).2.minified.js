//// [parserArrowFunctionExpression13.ts]
//// [fileJs.js]
a || (()=>null); // Not legal JS; "Unexpected token ')'" at last paren
//// [fileTs.ts]
a || (()=>null);
