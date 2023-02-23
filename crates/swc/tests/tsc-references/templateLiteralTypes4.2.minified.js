//// [templateLiteralTypes4.ts]
var StringLiteralEnum, NumberLiteralEnum, NonLiteralEnum;
!function(StringLiteralEnum) {
    StringLiteralEnum.Zero = "0", StringLiteralEnum.True = "true", StringLiteralEnum.False = "false", StringLiteralEnum.Undefined = "undefined", StringLiteralEnum.Null = "null";
}(StringLiteralEnum || (StringLiteralEnum = {})), function(NumberLiteralEnum) {
    NumberLiteralEnum[NumberLiteralEnum.Zero = 0] = "Zero", NumberLiteralEnum[NumberLiteralEnum.One = 1] = "One";
}(NumberLiteralEnum || (NumberLiteralEnum = {})), function(NonLiteralEnum) {
    NonLiteralEnum[NonLiteralEnum.Zero = 0] = "Zero", NonLiteralEnum[NonLiteralEnum.One = 1] = "One";
}(NonLiteralEnum || (NonLiteralEnum = {})), p.getIndex(0), p.getIndex(1), p.getIndex(2), p.setIndex(0, 0), p.setIndex(1, 0), p.setIndex(2, 3), f1("**123**"), f2("**123**"), f3("**123**"), f4("**true**"), f4("**false**");
