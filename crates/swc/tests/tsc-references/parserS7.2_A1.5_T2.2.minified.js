//// [parserS7.2_A1.5_T2.ts]
eval("\xa0var x\xa0= 1\xa0"), 1 !== x && $ERROR('#1: eval("\\u00A0var x\\u00A0= 1\\u00A0"); x === 1. Actual: ' + x);
var x = 1;
1 !== x && $ERROR("#2: \xa0var x\xa0= 1\xa0; x === 1. Actual: " + x);
