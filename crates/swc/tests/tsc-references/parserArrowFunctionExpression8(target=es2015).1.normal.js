//// [parserArrowFunctionExpression8.ts]
//// [fileJs.js]
x ? (y)=>({
        y
    }) : (z)=>({
        z
    } // Legal JS
     // Legal JS
    );
//// [fileTs.ts]
x ? (y)=>({
        y
    }) : (z)=>({
        z
    });
