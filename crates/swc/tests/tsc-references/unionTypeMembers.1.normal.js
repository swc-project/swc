//// [unionTypeMembers.ts]
// a union type U has those members that are present in every one of its constituent types, 
// with types that are unions of the respective members in the constituent types
var x;
var str;
var num;
var strOrNum;
// If each type in U has a property P, U has a property P of a union type of the types of P from each type in U.
str = x.commonPropertyType; // string
str = x.commonMethodType(str); // (a: string) => string so result should be string
strOrNum = x.commonPropertyDifferenType;
strOrNum = x.commonMethodDifferentReturnType(str); // string | union
x.commonMethodDifferentParameterType; // No error - property exists
x.commonMethodDifferentParameterType(strOrNum); // error - no call signatures because the type of this property is ((a: string) => string) | (a: number) => number
// and the call signatures arent identical
num = x.commonMethodWithTypeParameter(num);
num = x.commonMethodWithOwnTypeParameter(num);
str = x.commonMethodWithOwnTypeParameter(str);
strOrNum = x.commonMethodWithOwnTypeParameter(strOrNum);
x.propertyOnlyInI1; // error
x.propertyOnlyInI2; // error
x.methodOnlyInI1("hello"); // error
x.methodOnlyInI2(10); // error
