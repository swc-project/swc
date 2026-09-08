function returnBeforeFinally() {
    var value = 1;
    try {
        throw 0;
    } catch (error) {
        return value;
    } finally{
        value = 2;
    }
    return value;
}
function sideEffectBeforeFinally() {
    var effects = [];
    try {
        throw 0;
    } catch (error) {
        return effects.push("catch");
    } finally{
        effects.push("finally");
    }
    return effects.push("tail");
}
function sideEffect() {
    return console.log("side effect"), 1;
}
function sideEffectWithoutFinally() {
    try {
        throw 0;
    } catch (error) {
        return sideEffect();
    }
    return sideEffect();
}
function safeWithoutFinally() {
    try {
        throw 0;
    } catch (error) {}
    return 1;
}
console.log(returnBeforeFinally()), console.log(sideEffectBeforeFinally()), console.log(sideEffectWithoutFinally()), console.log(safeWithoutFinally());
