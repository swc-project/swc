function directiveProbe() {
    do {
        "use strict";
        break;
    }while (false)
    return void 0 === this;
}
function mixedDirectiveProbe() {
    do {
        "use strict";
        console.log("body");
        continue;
    }while (false)
    return void 0 === this;
}
function lexicalClosure() {
    var value = "outer";
    var read;
    do {
        let value = "inner";
        read = function() {
            return value;
        };
        break;
    }while (false)
    return read() + "|" + value;
}
function nestedFunction() {
    var events = [];
    do {
        events.push(function() {
            for(var i = 0; i < 2 && 0 === i; i++);
            return "function";
        }());
        continue;
    }while (false)
    events.push("tail");
    return events.join("|");
}
console.log(directiveProbe());
console.log(mixedDirectiveProbe());
console.log(lexicalClosure());
console.log(nestedFunction());
