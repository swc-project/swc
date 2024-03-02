//// [unionTypeMembers.ts]
var x, str, num, strOrNum;
str = x.commonPropertyType, str = x.commonMethodType(str), strOrNum = x.commonPropertyDifferenType, strOrNum = x.commonMethodDifferentReturnType(str), x.commonMethodDifferentParameterType, x.commonMethodDifferentParameterType(strOrNum), num = x.commonMethodWithTypeParameter(num), num = x.commonMethodWithOwnTypeParameter(num), str = x.commonMethodWithOwnTypeParameter(str), strOrNum = x.commonMethodWithOwnTypeParameter(strOrNum), x.propertyOnlyInI1, x.propertyOnlyInI2, x.methodOnlyInI1("hello"), x.methodOnlyInI2(10);
