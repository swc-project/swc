function conditionEffects() {
    var events = [];
    do {
        events.push("break body");
        break;
    }while (events.push("wrong condition"), false)
    do {
        events.push("continue body");
        continue;
    }while (events.push("continue condition"), false)
    events.push("tail");
    return events.join("|");
}
function prefixThrows() {
    var events = [];
    function fail() {
        events.push("call");
        throw "failure";
    }
    try {
        do {
            fail();
            break;
        }while (false)
        events.push("wrong break tail");
    } catch (error) {
        events.push(error);
    }
    try {
        do {
            fail();
            continue;
        }while (false)
        events.push("wrong continue tail");
    } catch (error) {
        events.push(error);
    }
    return events.join("|");
}
function explicitThrow() {
    try {
        do {
            throw "explicit";
            break;
        }while (false)
    } catch (error) {
        return error;
    }
    return "wrong tail";
}
console.log(conditionEffects());
console.log(prefixThrows());
console.log(explicitThrow());
