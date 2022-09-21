//// [controlFlowIIFE.ts]
let maybeNumber, test;
if (maybeNumber = 1, ++maybeNumber, maybeNumber++, !test) throw Error('Test is not defined');
test.slice(1);
