//// [emitExponentiationOperator4.ts]
var temp;
Math.pow(temp, 3);
Math.pow(--temp, 3);
Math.pow(++temp, 3);
Math.pow(temp--, 3);
Math.pow(temp++, 3);
Math.pow(1, Math.pow(--temp, 3));
Math.pow(1, Math.pow(++temp, 3));
Math.pow(1, Math.pow(temp--, 3));
Math.pow(1, Math.pow(temp++, 3));
Math.pow(void --temp, 3);
Math.pow(void temp--, 3);
Math.pow(void 3, 4);
Math.pow(void temp++, 4);
Math.pow(void temp--, 4);
Math.pow(1, Math.pow(void --temp, 3));
Math.pow(1, Math.pow(void temp--, 3));
Math.pow(1, Math.pow(void 3, 4));
Math.pow(1, Math.pow(void temp++, 4));
Math.pow(1, Math.pow(void temp--, 4));
Math.pow(~--temp, 3);
Math.pow(~temp--, 3);
Math.pow(~3, 4);
Math.pow(~temp++, 4);
Math.pow(~temp--, 4);
Math.pow(1, Math.pow(~--temp, 3));
Math.pow(1, Math.pow(~temp--, 3));
Math.pow(1, Math.pow(~3, 4));
Math.pow(1, Math.pow(~temp++, 4));
Math.pow(1, Math.pow(~temp--, 4));
