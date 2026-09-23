function disabledLoops() {
    var events = [];
    do {
        events.push("break");
        break;
    } while (false);
    events.push("first tail");
    do {
        events.push("continue");
        continue;
    } while (false);
    events.push("second tail");
    return events.join("|");
}

console.log(disabledLoops());
