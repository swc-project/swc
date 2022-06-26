var validate = function(x) {
    return x === "yes" || x === "no" ? x : "idk";
}; // No error
var u = undefined;
if (u === 5) {
    var y = u.toString(10);
}
if (u === true || u === false) {
    var someBool = u;
}
if (u === undefined) {
    var undef = u;
}
if (u === null) {
    var someNull = u;
}
if (u === symb) {
    var symbolAlias = u;
}
if (!(u === 42)) {}
if (u !== 42) {}
if (u == 42) {}
if (u == true) {}
if (u == Object) {}
if (u === aString) {
    var uString = u;
}
if (u === aBoolean) {
    var uString1 = u;
}
if (u === aNumber) {
    var uNumber = u;
}
if (u === anObject) {
    var uObject = u;
}
if (u === anObjectLiteral) {
    var uObjectLiteral = u;
}
if (u === aUnion) {}
if (u === anIntersection) {}
if (u === aFunction) {
    var uFunction = u;
}
var NumberEnum;
(function(NumberEnum) {
    NumberEnum[NumberEnum["A"] = 0] = "A";
    NumberEnum[NumberEnum["B"] = 1] = "B";
    NumberEnum[NumberEnum["C"] = 2] = "C";
})(NumberEnum || (NumberEnum = {}));
var StringEnum;
(function(StringEnum) {
    StringEnum["A"] = "A";
    StringEnum["B"] = "B";
    StringEnum["C"] = "C";
})(StringEnum || (StringEnum = {}));
if (u === NumberEnum || u === StringEnum) {
    var enumObj = u;
}
if (u === NumberEnum.A) {
    var a = u;
}
if (u === StringEnum.B) {
    var b = u;
}
function switchTestEnum(x) {
    switch(x){
        case StringEnum.A:
            var a = x;
            break;
        case StringEnum.B:
            var b = x;
            break;
        case StringEnum.C:
            var c = x;
            break;
    }
}
function switchTestCollectEnum(x) {
    switch(x){
        case StringEnum.A:
            var a = x;
        case StringEnum.B:
            var b = x;
        case StringEnum.C:
            var c = x;
            var all = x;
            return;
    }
}
function switchTestLiterals(x) {
    switch(x){
        case 1:
            var one = x;
            break;
        case 2:
            var two = x;
            break;
        case 3:
            var three = x;
            break;
        case true:
            var t = x;
            break;
        case false:
            var f = x;
            break;
        case "A":
            var a = x;
            break;
        case undefined:
            var undef = x;
            break;
        case null:
            var llun = x;
            break;
        case symb:
            var anotherSymbol = x;
            break;
        case symbNonUnique:
            var nonUniqueSymbol = x;
            break;
    }
}
function switchTestObjects(x, y, z) {
    switch(x){
        case true:
        case false:
            var bool = x;
            break;
        case y:
            var obj1 = x;
            break;
        case z:
            var obj2 = x;
            break;
    }
}
function switchResponse(x) {
    switch(x){
        case "yes":
        case "no":
        case "idk":
            return x;
        default:
            throw new Error("unknown response");
    }
}
function switchResponseWrong(x) {
    switch(x){
        case "yes":
        case "no":
        case "maybe":
            return x; // error
        default:
            throw new Error("Can you repeat the question?");
    }
}
// Repro from #33483
function f2(x) {
    if (x !== undefined && typeof x !== "string") {
        throw new Error();
    }
    return x;
}
function notNotEquals(u) {
    if (u !== NumberEnum) {} else {
        var o = u;
    }
    if (u !== NumberEnum.A) {} else {
        var a = u;
    }
    if (u !== NumberEnum.A && u !== NumberEnum.B && u !== StringEnum.A) {} else {
        var aOrB = u;
    }
    // equivalent to
    if (!(u === NumberEnum.A || u === NumberEnum.B || u === StringEnum.A)) {} else {
        var aOrB1 = u;
    }
}
