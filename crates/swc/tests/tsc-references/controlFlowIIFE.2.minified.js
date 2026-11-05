//// [controlFlowIIFE.ts]
let maybeNumber;
throw maybeNumber = 1, ++maybeNumber, maybeNumber++, Error('Test is not defined');
