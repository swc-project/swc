var shared = "outer";

function directReadAfterBreak() {
    do {
        break;
        var local = "unreachable";
    } while (false);
    return local;
}

function shadowAfterContinue() {
    do {
        continue;
        var shared = "unreachable";
    } while (false);
    return shared;
}

function capturedBinding() {
    var read = function () {
        return shared;
    };
    do {
        break;
        var shared = "unreachable";
    } while (false);
    return read;
}

console.log(directReadAfterBreak() === undefined);
console.log(shadowAfterContinue() === undefined);
console.log(capturedBinding()() === undefined);
console.log(shared);
