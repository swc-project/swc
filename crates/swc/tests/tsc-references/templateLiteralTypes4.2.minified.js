//// [templateLiteralTypes4.ts]
// infer from number
var // infer from literal enums
StringLiteralEnum, NumberLiteralEnum, // infer from non-literal enums
NonLiteralEnum, StringLiteralEnum1, NumberLiteralEnum1, NonLiteralEnum1;
(StringLiteralEnum1 = StringLiteralEnum || (StringLiteralEnum = {})).Zero = "0", StringLiteralEnum1.True = "true", StringLiteralEnum1.False = "false", StringLiteralEnum1.Undefined = "undefined", StringLiteralEnum1.Null = "null", (NumberLiteralEnum1 = NumberLiteralEnum || (NumberLiteralEnum = {}))[NumberLiteralEnum1.Zero = 0] = "Zero", NumberLiteralEnum1[NumberLiteralEnum1.One = 1] = "One", (NonLiteralEnum1 = NonLiteralEnum || (NonLiteralEnum = {}))[NonLiteralEnum1.Zero = 0] = "Zero", NonLiteralEnum1[NonLiteralEnum1.One = 1] = "One", p.getIndex(0), p.getIndex(1), p.getIndex(2), p.setIndex(0, 0), p.setIndex(1, 0), p.setIndex(2, 3), f1("**123**"), f2("**123**"), f3("**123**"), f4("**true**"), f4("**false**");
 // false | "false"
