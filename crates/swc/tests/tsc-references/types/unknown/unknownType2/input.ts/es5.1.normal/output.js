var validate = function(x) {
    return x === 'yes' || x === 'no' ? x : 'idk';
}; // No error
var u1 = undefined;
if (u1 === 5) {
    var y = u1.toString(10);
}
if (u1 === true || u1 === false) {
    var someBool = u1;
}
if (u1 === undefined) {
    var undef = u1;
}
if (u1 === null) {
    var someNull = u1;
}
if (u1 === symb) {
    var symbolAlias = u1;
}
if (!(u1 === 42)) {
}
if (u1 !== 42) {
}
if (u1 == 42) {
}
if (u1 == true) {
}
if (u1 == Object) {
}
if (u1 === aString) {
    var uString = u1;
}
if (u1 === aBoolean) {
    var uString1 = u1;
}
if (u1 === aNumber) {
    var uNumber = u1;
}
if (u1 === anObject) {
    var uObject = u1;
}
if (u1 === anObjectLiteral) {
    var uObjectLiteral = u1;
}
if (u1 === aUnion) {
}
if (u1 === anIntersection) {
}
if (u1 === aFunction) {
    var uFunction = u1;
}
var NumberEnum;
(function(NumberEnum) {
    NumberEnum[NumberEnum["A"] = 0] = "A";
    NumberEnum[NumberEnum["B"] = 1] = "B";
    NumberEnum[NumberEnum["C"] = 2] = "C";
})(NumberEnum || (NumberEnum = {
}));
var StringEnum;
(function(StringEnum) {
    StringEnum["A"] = "A";
    StringEnum["B"] = "B";
    StringEnum["C"] = "C";
})(StringEnum || (StringEnum = {
}));
if (u1 === NumberEnum || u1 === StringEnum) {
    var enumObj = u1;
}
if (u1 === NumberEnum.A) {
    var a = u1;
}
if (u1 === StringEnum.B) {
    var b = u1;
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
        case 'yes':
        case 'no':
        case 'idk':
            return x;
        default:
            throw new Error('unknown response');
    }
}
function switchResponseWrong(x) {
    switch(x){
        case 'yes':
        case 'no':
        case 'maybe':
            return x; // error
        default:
            throw new Error('Can you repeat the question?');
    }
}
// Repro from #33483
function f2(x) {
    if (x !== undefined && typeof x !== 'string') {
        throw new Error();
    }
    return x;
}
function notNotEquals(u) {
    if (u !== NumberEnum) {
    } else {
        var o = u;
    }
    if (u !== NumberEnum.A) {
    } else {
        var a = u;
    }
    if (u !== NumberEnum.A && u !== NumberEnum.B && u !== StringEnum.A) {
    } else {
        var aOrB = u;
    }
    // equivalent to
    if (!(u === NumberEnum.A || u === NumberEnum.B || u === StringEnum.A)) {
    } else {
        var aOrB1 = u;
    }
}
