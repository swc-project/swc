function a(b) {
    var a = peek(timerQueue);
    while(a !== null){
        if (a.callback === null) {
            pop(timerQueue);
        } else if (a.startTime <= b) {
            pop(timerQueue);
            a.sortIndex = a.expirationTime;
            push(taskQueue, a);
        } else {
            return;
        }
        a = peek(timerQueue);
    }
}
