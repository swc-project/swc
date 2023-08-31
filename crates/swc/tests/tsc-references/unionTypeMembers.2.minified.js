//// [unionTypeMembers.ts]
var x, str, num, strOrNum;
// If each type in U has a property P, U has a property P of a union type of the types of P from each type in U.
str = x.commonPropertyType, str = x.commonMethodType(str), strOrNum = x.commonPropertyDifferenType, strOrNum = x.commonMethodDifferentReturnType(str), x.commonMethodDifferentParameterType, x.commonMethodDifferentParameterType(strOrNum), // and the call signatures arent identical
num = x.commonMethodWithTypeParameter(num), num = x.commonMethodWithOwnTypeParameter(num), str = x.commonMethodWithOwnTypeParameter(str), strOrNum = x.commonMethodWithOwnTypeParameter(strOrNum), x.propertyOnlyInI1, x.propertyOnlyInI2, x.methodOnlyInI1("hello"), x.methodOnlyInI2(10);
 // error
