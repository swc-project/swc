function advanceTimers(currentTime) {
    for(// Check for tasks that are no longer delayed and add them to the queue.
    var timer = peek(timerQueue); null !== timer;){
        if (null === timer.callback) // Timer was cancelled.
        pop(timerQueue);
        else {
            if (!(timer.startTime <= currentTime)) // Remaining timers are pending.
            return;
            // Timer fired. Transfer to the task queue.
            pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
        }
        timer = peek(timerQueue);
    }
}
