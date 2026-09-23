function alternateBranch(stop) {
    var events = [];
    try {
        do {
            if (stop) throw "stop";
            else events.push("alternate");
            events.push("body");
            break;
        }while (false)
        events.push("tail");
    } catch (error) {
        events.push("caught:" + error);
    }
    return events.join("|");
}
console.log(alternateBranch(false));
console.log(alternateBranch(true));
