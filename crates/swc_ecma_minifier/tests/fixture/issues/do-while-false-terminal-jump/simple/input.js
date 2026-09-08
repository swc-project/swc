function simpleJumps() {
    var events = [];
    do {
        events.push("break");
        break;
    } while (false);
    events.push("after break");
    do {
        events.push("continue");
        continue;
    } while (0);
    events.push("after continue");
    do {
        ;
        events.push("debugger");
        debugger;
        continue;
    } while (!1);
    return events.join("|");
}

function outerFor() {
    var events = [];
    for (var i = 0; i < 2; i++) {
        do {
            events.push("break" + i);
            break;
        } while (false);
        events.push("first tail" + i);
        do {
            events.push("continue" + i);
            continue;
        } while (void 0);
        events.push("second tail" + i);
    }
    return events.join("|");
}

function outerSwitch(value) {
    var events = [];
    switch (value) {
        case 1:
            do {
                events.push("break");
                break;
            } while (false);
            events.push("switch tail");
            do {
                events.push("continue");
                continue;
            } while (false);
            events.push("case tail");
            break;
        default:
            events.push("wrong case");
    }
    return events.join("|");
}

function jumpOnly() {
    do break; while (false);
    do continue; while (false);
    do {
        break;
    } while (false);
    do {
        continue;
    } while (false);
    return "after empty loops";
}

console.log(simpleJumps());
console.log(outerFor());
console.log(outerSwitch(1));
console.log(jumpOnly());
