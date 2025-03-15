//// [controlFlowIIFE.ts]
let maybeNumber, test;
if (maybeNumber = 1, void 0 !== ++maybeNumber && maybeNumber++, !test) throw Error('Test is not defined');
test.slice(1);
