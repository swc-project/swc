function advanceTimers(currentTime) {
    for(var timer = peek(timerQueue); null !== timer;)null === timer.callback ? pop(timerQueue) : timer.startTime <= currentTime && (pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer)), timer = peek(timerQueue);
}
