if (process.env.NODE_ENV !== "production") {
    if (null) exports.unstable_now = null;
    else exports.unstable_now = null;
    if (null) {
        (function() {
            exports.unstable_now();
        });
        exports.unstable_shouldYield = null;
        exports.unstable_forceFrameRate = null;
    } else {
        exports.unstable_shouldYield = function() {
            exports.unstable_now();
        };
        exports.unstable_forceFrameRate = null;
        (function() {
            exports.unstable_now();
        });
        (function() {
            (function() {
                exports.unstable_now();
            });
        });
    }
    exports.unstable_now();
    exports.unstable_shouldYield();
    exports.unstable_now();
    exports.unstable_now();
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
