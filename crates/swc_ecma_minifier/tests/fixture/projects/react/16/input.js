function advanceTimers(currentTime) {
    // Check for tasks that are no longer delayed and add them to the queue.
    var timer = peek(timerQueue);

    while (timer !== null) {
        if (timer.callback === null) {
            // Timer was cancelled.
            pop(timerQueue);
        } else if (timer.startTime <= currentTime) {
            // Timer fired. Transfer to the task queue.
            pop(timerQueue);
            timer.sortIndex = timer.expirationTime;
            push(taskQueue, timer);
        } else {
            // Remaining timers are pending.
            return;
        }

        timer = peek(timerQueue);
    }
}
