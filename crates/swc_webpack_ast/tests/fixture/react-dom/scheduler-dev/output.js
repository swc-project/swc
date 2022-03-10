if (process.env.NODE_ENV !== "production") {
    var enableSchedulerDebugging;
    var enableProfiling;
    var requestHostCallback;
    var requestHostTimeout;
    var cancelHostTimeout;
    var requestPaint;
    var hasPerformanceNow;
    var localPerformance;
    exports.unstable_now = null;
    var localDate;
    var initialTime;
    exports.unstable_now = null;
    // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
    // fallback to a naive implementation.
    var _callback;
    var _timeoutID;
    var _flushCallback = function() {
        var currentTime = exports.unstable_now();
        var hasRemainingTime;
    };
    exports.unstable_shouldYield = null;
    exports.unstable_forceFrameRate = null;
    // Capture local references to native APIs, in case a polyfill overrides them.
    var _setTimeout;
    var _clearTimeout;
    // TODO: Scheduler no longer requires these methods to be polyfilled. But
    // maybe we want to continue warning if they don't exist, to preserve the
    // option to rely on it in the future?
    var requestAnimationFrame;
    var cancelAnimationFrame;
    var isMessageLoopRunning;
    var scheduledHostCallback;
    var taskTimeoutID; // Scheduler periodically yields in case there is other work on the main
    // thread, like user events. By default, it yields multiple times per frame.
    // It does not attempt to align with frame boundaries, since most tasks don't
    // need to be frame aligned; for those that do, use requestAnimationFrame.
    var yieldInterval;
    var deadline; // TODO: Make this configurable
    // `isInputPending` is not available. Since we have no way of knowing if
    // there's pending input, always yield at the end of the frame.
    exports.unstable_shouldYield = function() {
        exports.unstable_now();
    }; // Since we yield every frame regardless, `requestPaint` has no effect.
    exports.unstable_forceFrameRate = null;
    var performWorkUntilDeadline = function() {
        var currentTime = exports.unstable_now(); // Yield after `yieldInterval` ms, regardless of where we are in the vsync
        var hasTimeRemaining;
        var hasMoreWork;
    };
    var channel;
    var port;
    (function() {
        (function() {
            exports.unstable_now();
        });
    });
    var index;
    var first;
    var first1;
    var last;
    var index1;
    var parentIndex;
    var parent;
    var index2;
    var length;
    var leftIndex;
    var left;
    var rightIndex;
    var right; // If the left or right node is smaller, swap with the smaller of those.
    // Compare sort index first, then task id.
    var diff;
    // TODO: Use symbols?
    var ImmediatePriority;
    var UserBlockingPriority;
    var NormalPriority;
    var LowPriority;
    var IdlePriority;
    /* eslint-disable no-var */ // Math.pow(2, 30) - 1
    // 0b111111111111111111111111111111
    var maxSigned31BitInt; // Times out immediately
    var IMMEDIATE_PRIORITY_TIMEOUT; // Eventually times out
    var USER_BLOCKING_PRIORITY_TIMEOUT;
    var NORMAL_PRIORITY_TIMEOUT;
    var LOW_PRIORITY_TIMEOUT; // Never times out
    var IDLE_PRIORITY_TIMEOUT; // Tasks are stored on a min heap
    var taskQueue;
    var timerQueue; // Incrementing id counter. Used to maintain insertion order.
    var taskIdCounter; // Pausing the scheduler is useful for debugging.
    var currentTask;
    var currentPriorityLevel; // This is set while performing work, to prevent re-entrancy.
    var isPerformingWork;
    var isHostCallbackScheduled;
    var isHostTimeoutScheduled;
    // Check for tasks that are no longer delayed and add them to the queue.
    var timer;
    var firstTimer;
    var previousPriorityLevel;
    var currentTime = exports.unstable_now();
    var currentTime1;
    exports.unstable_shouldYield();
    var callback;
    var didUserCallbackTimeout;
    var continuationCallback;
    exports.unstable_now();
    var firstTimer1;
    var previousPriorityLevel1;
    var priorityLevel;
    var previousPriorityLevel2;
    var parentPriorityLevel;
    (function() {
        // This is a fork of runWithPriority, inlined for performance.
        var previousPriorityLevel;
    });
    var currentTime2 = exports.unstable_now();
    var startTime;
    var delay;
    var timeout;
    var expirationTime;
    var newTask;
    var unstable_requestPaint;
    var unstable_Profiling;
    exports.unstable_IdlePriority = null;
    exports.unstable_ImmediatePriority = null;
    exports.unstable_LowPriority = null;
    exports.unstable_NormalPriority = null;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = null;
    exports.unstable_cancelCallback = null;
    exports.unstable_continueExecution = null;
    exports.unstable_getCurrentPriorityLevel = null;
    exports.unstable_getFirstCallbackNode = null;
    exports.unstable_next = null;
    exports.unstable_pauseExecution = null;
    exports.unstable_requestPaint = null;
    exports.unstable_runWithPriority = null;
    exports.unstable_scheduleCallback = null;
    exports.unstable_wrapCallback = null;
}
