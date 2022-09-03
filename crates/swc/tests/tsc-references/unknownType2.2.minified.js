//// [unknownType2.ts]
var NumberEnum, StringEnum, validate = function(x) {
    return "yes" === x || "no" === x ? x : "idk";
}, u = void 0;
if (5 === u) var y = u.toString(10);
if (!0 === u || !1 === u) var someBool = u;
if (void 0 === u) var undef = u;
if (null === u) var someNull = u;
if (u === symb) var symbolAlias = u;
if (u === aString) var uString = u;
if (u === aBoolean) var uString1 = u;
if (u === aNumber) var uNumber = u;
if (u === anObject) var uObject = u;
if (u === anObjectLiteral) var uObjectLiteral = u;
if (u === aFunction) var uFunction = u;
if (!function(NumberEnum) {
    NumberEnum[NumberEnum.A = 0] = "A", NumberEnum[NumberEnum.B = 1] = "B", NumberEnum[NumberEnum.C = 2] = "C";
}(NumberEnum || (NumberEnum = {})), !function(StringEnum) {
    StringEnum.A = "A", StringEnum.B = "B", StringEnum.C = "C";
}(StringEnum || (StringEnum = {})), u === NumberEnum || u === StringEnum) var enumObj = u;
if (u === NumberEnum.A) var a = u;
if (u === StringEnum.B) var b = u;
function switchTestEnum(x) {
    switch(x){
        case StringEnum.A:
        case StringEnum.B:
        case StringEnum.C:
    }
}
function switchTestCollectEnum(x) {
    switch(x){
        case StringEnum.A:
        case StringEnum.B:
        case StringEnum.C:
            return;
    }
}
function switchTestLiterals(x) {}
function switchTestObjects(x, y, z) {}
function switchResponse(x) {
    switch(x){
        case "yes":
        case "no":
        case "idk":
            return x;
        default:
            throw Error("unknown response");
    }
}
function switchResponseWrong(x) {
    switch(x){
        case "yes":
        case "no":
        case "maybe":
            return x;
        default:
            throw Error("Can you repeat the question?");
    }
}
function f2(x) {
    if (void 0 !== x && "string" != typeof x) throw Error();
    return x;
}
function notNotEquals(u) {
    NumberEnum.A, u !== NumberEnum.A && u !== NumberEnum.B && StringEnum.A, u === NumberEnum.A || u === NumberEnum.B || StringEnum.A;
}
