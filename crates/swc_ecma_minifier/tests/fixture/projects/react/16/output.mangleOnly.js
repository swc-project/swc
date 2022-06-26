function a(a) {
    var b = peek(timerQueue);
    while(b !== null){
        if (b.callback === null) {
            pop(timerQueue);
        } else if (b.startTime <= a) {
            pop(timerQueue);
            b.sortIndex = b.expirationTime;
            push(taskQueue, b);
        } else {
            return;
        }
        b = peek(timerQueue);
    }
}
