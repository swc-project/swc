//// [nullOrUndefinedTypeGuardIsOrderIndependent.ts]
function test(strOrNull, strOrUndefined) {
    var str = "original";
    var nil;
    if (null === strOrNull) {
        nil = strOrNull;
    } else {
        str = strOrNull;
    }
    if (undefined !== strOrUndefined) {
        str = strOrUndefined;
    }
}
