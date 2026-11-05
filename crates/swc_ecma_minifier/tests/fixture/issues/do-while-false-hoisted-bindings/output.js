var shared = "outer";
function directReadAfterBreak() {
    do {
        var local;
        break;
    }while (false)
    return local;
}
function shadowAfterContinue() {
    do {
        var shared;
        continue;
    }while (false)
    return shared;
}
function capturedBinding() {
    var read = function() {
        return shared;
    };
    do {
        var shared;
        break;
    }while (false)
    return read;
}
console.log(void 0 === directReadAfterBreak());
console.log(void 0 === shadowAfterContinue());
console.log(void 0 === capturedBinding()());
console.log(shared);
