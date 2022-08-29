//// [objectTypeWithStringAndNumberIndexSignatureToAny.ts]
// When checking compatibility between two types,
// TypeScript should not require an index signature if
// the target side index signature maps to `any` *and*
// the target side has *any* string index signature to `any`.
//
// So an index signature like in
//
//  { [x: number]: any }
//
// is still required of a source type, but neither index signature in
//
//  { [x: number]: any, [x: string]: any; }
//
// should be required; *however*, the number index signature in
//
//  { [x: number]: number, [x: string]: any; }
//
// should always be required.
function f1(sToAny, nToAny, bothToAny, someObj) {
    sToAny = nToAny;
    sToAny = bothToAny;
    sToAny = someObj;
    nToAny = sToAny;
    nToAny = bothToAny;
    nToAny = someObj;
    bothToAny = sToAny;
    bothToAny = nToAny;
    bothToAny = someObj;
    someObj = sToAny;
    someObj = nToAny;
    someObj = bothToAny;
}
function f2(sToAny, nToAny, bothToAny, someObj) {
    sToAny = nToAny;
    sToAny = bothToAny;
    sToAny = someObj;
    nToAny = sToAny;
    nToAny = bothToAny;
    nToAny = someObj;
    bothToAny = sToAny;
    bothToAny = nToAny;
    bothToAny = someObj;
    someObj = sToAny;
    someObj = nToAny;
    someObj = bothToAny;
}
function f3(sToAny, nToNumber, strToAnyNumToNum, someObj) {
    sToAny = nToNumber;
    sToAny = strToAnyNumToNum;
    sToAny = someObj;
    nToNumber = sToAny;
    nToNumber = strToAnyNumToNum;
    nToNumber = someObj;
    strToAnyNumToNum = sToAny;
    strToAnyNumToNum = nToNumber;
    strToAnyNumToNum = someObj;
    someObj = sToAny;
    someObj = nToNumber;
    someObj = someObj;
}
