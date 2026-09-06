function returnBeforeFinally() {
    var value = 1;
    try {
        throw 0;
    } catch (error) {
        return value;
    } finally {
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
    } finally {
        effects.push("finally");
    }
    return effects.push("tail");
}

function sideEffect() {
    console.log("side effect");
    return 1;
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
    var value = 1;
    try {
        throw 0;
    } catch (error) {
        return value;
    }
    return value;
}

console.log(returnBeforeFinally());
console.log(sideEffectBeforeFinally());
console.log(sideEffectWithoutFinally());
console.log(safeWithoutFinally());
