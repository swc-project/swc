function preservedLabels() {
    var events = [];
    first: do {
        events.push("break");
        break first;
    } while (false);
    events.push("first tail");
    second: do {
        events.push("continue");
        continue second;
    } while (false);
    events.push("second tail");
    return events.join("|");
}

console.log(preservedLabels());
