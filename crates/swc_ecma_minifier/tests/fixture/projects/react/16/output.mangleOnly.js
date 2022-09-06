function e(e) {
    var u = peek(timerQueue);
    while(u !== null){
        if (u.callback === null) {
            pop(timerQueue);
        } else if (u.startTime <= e) {
            pop(timerQueue);
            u.sortIndex = u.expirationTime;
            push(taskQueue, u);
        } else {
            return;
        }
        u = peek(timerQueue);
    }
}
