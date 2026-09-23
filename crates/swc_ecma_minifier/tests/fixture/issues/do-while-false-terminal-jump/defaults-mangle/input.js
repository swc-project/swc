function stateMachine() {
    var state = 0;
    var events = [];
    dispatch: for (;;) {
        switch (state) {
            case 0:
                first: do {
                    events.push("start");
                    break first;
                } while (false);
                events.push("after first");
                state = 1;
                continue dispatch;
            case 1:
                second: do {
                    events.push("resume");
                    continue second;
                } while (false);
                events.push("after second");
                state = 2;
                continue dispatch;
            case 2:
                events.push("complete");
                return events.join("|");
        }
    }
}

console.log(stateMachine());
