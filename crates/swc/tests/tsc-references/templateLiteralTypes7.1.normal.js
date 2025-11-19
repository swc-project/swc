//// [templateLiteralTypes7.ts]
// https://github.com/microsoft/TypeScript/issues/57807
const g1 = g; // ok
const g2 = g; // error
const g3 = g; // ok
