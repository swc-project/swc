function advanceTimers(currentTime) {
    for(var timer = peek(timerQueue); null !== timer;){
        if (null === timer.callback) pop(timerQueue);
        else {
            if (!(timer.startTime <= currentTime)) return;
            pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
        }
        timer = peek(timerQueue);
    }
}
