function conditional(stop) {
    var events = [];
    do {
        if (stop) break;
        events.push("work");
        continue;
    } while (false);
    events.push("tail");
    return events.join("|");
}

function unreachableTail() {
    var events = [];
    do {
        events.push("body");
        break;
        events.push("unreachable");
    } while (false);
    events.push("tail");
    return events.join("|");
}

function nestedTargets() {
    var events = [];
    do {
        switch (1) {
            case 1:
                events.push("switch");
                break;
        }
        for (var i = 0; i < 2; i++) {
            events.push("inner" + i);
            if (i === 0) continue;
            break;
        }
        events.push("outer body");
        break;
    } while (false);
    do {
        switch (1) {
            case 1:
                events.push("switch continue");
                continue;
        }
        events.push("unreachable");
    } while (false);
    events.push("tail");
    return events.join("|");
}

function finallyOverrides() {
    var events = [];
    do {
        try {
            events.push("try");
            break;
        } finally {
            events.push("finally");
            continue;
        }
        events.push("unreachable");
    } while ((events.push("condition"), false));
    events.push("tail");
    return events.join("|");
}

function declarationPrefix() {
    do {
        var value = "local";
        console.log(value);
        break;
    } while (false);
    return value;
}

console.log(conditional(true));
console.log(conditional(false));
console.log(unreachableTail());
console.log(nestedTargets());
console.log(finallyOverrides());
console.log(declarationPrefix());
