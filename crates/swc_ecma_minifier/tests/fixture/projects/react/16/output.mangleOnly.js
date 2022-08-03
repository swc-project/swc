function e(e) {
    var l = peek(timerQueue);
    while(l !== null){
        if (l.callback === null) {
            pop(timerQueue);
        } else if (l.startTime <= e) {
            pop(timerQueue);
            l.sortIndex = l.expirationTime;
            push(taskQueue, l);
        } else {
            return;
        }
        l = peek(timerQueue);
    }
}
