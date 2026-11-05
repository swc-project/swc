function normalizedLabels() {
    var events = [];
    for (var i = 0; i < 2; i++) {
        first: do {
            events.push("break" + i);
            break first;
        } while (false);
        events.push("first tail" + i);
        second: do {
            events.push("continue" + i);
            continue second;
        } while (false);
        events.push("second tail" + i);
    }
    return events.join("|");
}

function outerTargets() {
    var events = [];
    outer: for (var i = 0; i < 3; i++) {
        do {
            events.push("body" + i);
            if (i === 0) continue outer;
            break outer;
        } while (false);
        events.push("unreachable");
    }
    events.push("after outer");
    return events.join("|");
}

console.log(normalizedLabels());
console.log(outerTargets());
