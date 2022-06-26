let validate = (x)=>x === 'yes' || x === 'no' ? x : 'idk'; // No error
const u = undefined;
if (u === 5) {
    const y = u.toString(10);
}
if (u === true || u === false) {
    const someBool = u;
}
if (u === undefined) {
    const undef = u;
}
if (u === null) {
    const someNull = u;
}
if (u === symb) {
    const symbolAlias = u;
}
if (!(u === 42)) {}
if (u !== 42) {}
if (u == 42) {}
if (u == true) {}
if (u == Object) {}
if (u === aString) {
    let uString = u;
}
if (u === aBoolean) {
    let uString1 = u;
}
if (u === aNumber) {
    let uNumber = u;
}
if (u === anObject) {
    let uObject = u;
}
if (u === anObjectLiteral) {
    let uObjectLiteral = u;
}
if (u === aUnion) {}
if (u === anIntersection) {}
if (u === aFunction) {
    let uFunction = u;
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
    let enumObj = u;
}
if (u === NumberEnum.A) {
    let a = u;
}
if (u === StringEnum.B) {
    let b = u;
}
function switchTestEnum(x) {
    switch(x){
        case StringEnum.A:
            const a = x;
            break;
        case StringEnum.B:
            const b = x;
            break;
        case StringEnum.C:
            const c = x;
            break;
    }
}
function switchTestCollectEnum(x) {
    switch(x){
        case StringEnum.A:
            const a = x;
        case StringEnum.B:
            const b = x;
        case StringEnum.C:
            const c = x;
            const all = x;
            return;
    }
}
function switchTestLiterals(x) {
    switch(x){
        case 1:
            const one = x;
            break;
        case 2:
            const two = x;
            break;
        case 3:
            const three = x;
            break;
        case true:
            const t = x;
            break;
        case false:
            const f = x;
            break;
        case "A":
            const a = x;
            break;
        case undefined:
            const undef = x;
            break;
        case null:
            const llun = x;
            break;
        case symb:
            const anotherSymbol = x;
            break;
        case symbNonUnique:
            const nonUniqueSymbol = x;
            break;
    }
}
function switchTestObjects(x, y, z) {
    switch(x){
        case true:
        case false:
            const bool = x;
            break;
        case y:
            const obj1 = x;
            break;
        case z:
            const obj2 = x;
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
    if (u !== NumberEnum) {} else {
        const o = u;
    }
    if (u !== NumberEnum.A) {} else {
        const a = u;
    }
    if (u !== NumberEnum.A && u !== NumberEnum.B && u !== StringEnum.A) {} else {
        const aOrB = u;
    }
    // equivalent to
    if (!(u === NumberEnum.A || u === NumberEnum.B || u === StringEnum.A)) {} else {
        const aOrB1 = u;
    }
}
