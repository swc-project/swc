//// [commaOperatorsMultipleOperators.ts]
var ANY, BOOLEAN, NUMBER, STRING, OBJECT, resultIsAny1 = ANY, resultIsBoolean1 = BOOLEAN, resultIsNumber1 = NUMBER, resultIsString1 = STRING, resultIsObject1 = OBJECT;
++NUMBER, STRING.charAt(0);
var resultIsNumber2 = 1, resultIsObject2 = (++NUMBER, STRING.charAt(0), {});
