//// [unknownType2.ts]
var NumberEnum, StringEnum, u = void 0;
5 === u && u.toString(10), function(NumberEnum) {
    NumberEnum[NumberEnum.A = 0] = "A", NumberEnum[NumberEnum.B = 1] = "B", NumberEnum[NumberEnum.C = 2] = "C";
}(NumberEnum || (NumberEnum = {})), function(StringEnum) {
    StringEnum.A = "A", StringEnum.B = "B", StringEnum.C = "C";
}(StringEnum || (StringEnum = {})), NumberEnum.A, StringEnum.B;
