//// [templateLiteralTypes4.ts]
// infer from number
var // infer from literal enums
StringLiteralEnum;
(function(StringLiteralEnum) {
    StringLiteralEnum["Zero"] = "0";
    StringLiteralEnum["True"] = "true";
    StringLiteralEnum["False"] = "false";
    StringLiteralEnum["Undefined"] = "undefined";
    StringLiteralEnum["Null"] = "null";
})(StringLiteralEnum || (StringLiteralEnum = {}));
var NumberLiteralEnum;
(function(NumberLiteralEnum) {
    NumberLiteralEnum[NumberLiteralEnum["Zero"] = 0] = "Zero";
    NumberLiteralEnum[NumberLiteralEnum["One"] = 1] = "One";
})(NumberLiteralEnum || (NumberLiteralEnum = {}));
var // infer from non-literal enums
NonLiteralEnum;
(function(NonLiteralEnum) {
    NonLiteralEnum[NonLiteralEnum["Zero"] = 0] = "Zero";
    NonLiteralEnum[NonLiteralEnum["One"] = 1] = "One";
})(NonLiteralEnum || (NonLiteralEnum = {}));
p.getIndex(0); // ok, 0 is a valid index
p.getIndex(1); // ok, 1 is a valid index
p.getIndex(2); // error, 2 is not a valid index
p.setIndex(0, 0); // ok, 0 is a valid index
p.setIndex(1, 0); // ok, 1 is a valid index
p.setIndex(2, 3); // error, 2 is not a valid index
f1("**123**"); // "123"
f2("**123**"); // 123
f3("**123**"); // 123n
f4("**true**"); // true | "true"
f4("**false**"); // false | "false"
