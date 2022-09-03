//// [objectTypeWithStringAndNumberIndexSignatureToAny.ts]
function f1(sToAny, nToAny, bothToAny, someObj) {
    sToAny = nToAny, sToAny = bothToAny, nToAny = sToAny = someObj, nToAny = bothToAny, nToAny = someObj, bothToAny = sToAny, bothToAny = nToAny, bothToAny = someObj, someObj = sToAny, someObj = nToAny, someObj = bothToAny;
}
function f2(sToAny, nToAny, bothToAny, someObj) {
    sToAny = nToAny, sToAny = bothToAny, nToAny = sToAny = someObj, nToAny = bothToAny, nToAny = someObj, bothToAny = sToAny, bothToAny = nToAny, bothToAny = someObj, someObj = sToAny, someObj = nToAny, someObj = bothToAny;
}
function f3(sToAny, nToNumber, strToAnyNumToNum, someObj) {
    sToAny = nToNumber, sToAny = strToAnyNumToNum, nToNumber = sToAny = someObj, nToNumber = strToAnyNumToNum, nToNumber = someObj, strToAnyNumToNum = sToAny, strToAnyNumToNum = nToNumber, strToAnyNumToNum = someObj, someObj = sToAny, someObj = nToNumber;
}
