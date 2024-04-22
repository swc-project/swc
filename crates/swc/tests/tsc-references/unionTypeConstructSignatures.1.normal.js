//// [unionTypeConstructSignatures.ts]
var numOrDate;
var strOrBoolean;
var strOrNum;
// If each type in U has construct signatures and the sets of construct signatures are identical ignoring return types,
// U has the same set of construct signatures, but with return types that are unions of the return types of the respective construct signatures from each type in U.
var unionOfDifferentReturnType;
numOrDate = new unionOfDifferentReturnType(10);
strOrBoolean = new unionOfDifferentReturnType("hello"); // error
new unionOfDifferentReturnType1(true); // error in type of parameter
var unionOfDifferentReturnType1;
numOrDate = new unionOfDifferentReturnType1(10);
strOrBoolean = new unionOfDifferentReturnType1("hello");
new unionOfDifferentReturnType1(true); // error in type of parameter
new unionOfDifferentReturnType1(); // error missing parameter
var unionOfDifferentParameterTypes;
new unionOfDifferentParameterTypes(10); // error - no call signatures
new unionOfDifferentParameterTypes("hello"); // error - no call signatures
new unionOfDifferentParameterTypes(); // error - no call signatures
var unionOfDifferentNumberOfSignatures;
new unionOfDifferentNumberOfSignatures(); // error - no call signatures
new unionOfDifferentNumberOfSignatures(10); // error - no call signatures
new unionOfDifferentNumberOfSignatures("hello"); // error - no call signatures
var unionWithDifferentParameterCount;
new unionWithDifferentParameterCount(); // needs more args
new unionWithDifferentParameterCount("hello"); // needs more args
new unionWithDifferentParameterCount("hello", 10); // ok
var unionWithOptionalParameter1;
strOrNum = new unionWithOptionalParameter1('hello');
strOrNum = new unionWithOptionalParameter1('hello', 10);
strOrNum = new unionWithOptionalParameter1('hello', "hello"); // error in parameter type
strOrNum = new unionWithOptionalParameter1(); // error
var unionWithOptionalParameter2;
strOrNum = new unionWithOptionalParameter2('hello'); // error no call signature
strOrNum = new unionWithOptionalParameter2('hello', 10); // error no call signature
strOrNum = new unionWithOptionalParameter2('hello', "hello"); // error no call signature
strOrNum = new unionWithOptionalParameter2(); // error no call signature
var unionWithOptionalParameter3;
strOrNum = new unionWithOptionalParameter3('hello'); // error no call signature
strOrNum = new unionWithOptionalParameter3('hello', 10); // ok
strOrNum = new unionWithOptionalParameter3('hello', "hello"); // wrong type
strOrNum = new unionWithOptionalParameter3(); // error no call signature
var unionWithRestParameter1;
strOrNum = new unionWithRestParameter1('hello');
strOrNum = new unionWithRestParameter1('hello', 10);
strOrNum = new unionWithRestParameter1('hello', 10, 11);
strOrNum = new unionWithRestParameter1('hello', "hello"); // error in parameter type
strOrNum = new unionWithRestParameter1(); // error
var unionWithRestParameter2;
strOrNum = new unionWithRestParameter2('hello'); // error no call signature
strOrNum = new unionWithRestParameter2('hello', 10); // error no call signature
strOrNum = new unionWithRestParameter2('hello', 10, 11); // error no call signature
strOrNum = new unionWithRestParameter2('hello', "hello"); // error no call signature
strOrNum = new unionWithRestParameter2(); // error no call signature
var unionWithRestParameter3;
strOrNum = new unionWithRestParameter3('hello'); // error no call signature
strOrNum = new unionWithRestParameter3('hello', 10); // ok
strOrNum = new unionWithRestParameter3('hello', 10, 11); // ok
strOrNum = new unionWithRestParameter3('hello', "hello"); // wrong type
strOrNum = new unionWithRestParameter3(); // error no call signature
var unionWithAbstractSignature;
new unionWithAbstractSignature('hello');
