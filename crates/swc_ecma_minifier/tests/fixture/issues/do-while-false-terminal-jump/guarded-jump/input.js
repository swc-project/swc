function guardedBreak(value) {
    var events = [];
    try {
        do {
            if ((events.push("guard"), value == null))
                throw (events.push("throw value"), "null");
            events.push("work:" + value);
            break;
        } while (false);
        events.push("tail");
    } catch (error) {
        events.push("caught:" + error);
    }
    return events.join("|");
}

function guardedContinue(value) {
    var events = [];
    try {
        do {
            if ((events.push("guard"), value == null))
                throw (events.push("throw value"), "null");
            events.push("work:" + value);
            continue;
        } while (false);
        events.push("tail");
    } catch (error) {
        events.push("caught:" + error);
    }
    return events.join("|");
}

function throwingCondition() {
    var events = [];
    function check() {
        events.push("check");
        throw "condition";
    }
    try {
        do {
            if (check()) throw "wrong throw value";
            events.push("wrong body");
            break;
        } while (false);
        events.push("wrong tail");
    } catch (error) {
        events.push("caught:" + error);
    }
    return events.join("|");
}

console.log(guardedBreak("ok"));
console.log(guardedBreak(null));
console.log(guardedContinue("ok"));
console.log(guardedContinue(null));
console.log(throwingCondition());
