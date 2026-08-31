function unlabeledBreak() {
    var result = [];
    for(var i = 0; i < 2; i++){
        do {
            result.push("body" + i);
            break;
        }while (false)
        result.push("tail" + i);
    }
    return result.join(",");
}
function labeledBreak() {
    var result = [];
    for(var i = 0; i < 2; i++){
        do {
            result.push("body" + i);
            break;
        }while (false)
        result.push("tail" + i);
    }
    return result.join(",");
}
function unlabeledContinue() {
    var result = [];
    for(var i = 0; i < 2; i++){
        do {
            result.push("body" + i);
            continue;
        }while (false)
        result.push("tail" + i);
    }
    return result.join(",");
}
function labeledContinue() {
    var result = [];
    for(var i = 0; i < 2; i++){
        do {
            result.push("body" + i);
            continue;
        }while (false)
        result.push("tail" + i);
    }
    return result.join(",");
}
function hoistAfterBreak() {
    do {
        var hoisted;
        break;
    }while (false)
    return typeof hoisted;
}
console.log("unlabeled break", unlabeledBreak());
console.log("labeled break", labeledBreak());
console.log("unlabeled continue", unlabeledContinue());
console.log("labeled continue", labeledContinue());
console.log("hoist after break", hoistAfterBreak());
