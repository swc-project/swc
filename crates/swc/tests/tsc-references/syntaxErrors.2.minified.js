//// [syntaxErrors.ts]
//// [dummyType.d.ts]
//// [badTypeArguments.js]
/** @param {C.<>} x */ /** @param {C.<number,>} y */ // @ts-ignore
/** @param {C.<number,>} skipped */ 
