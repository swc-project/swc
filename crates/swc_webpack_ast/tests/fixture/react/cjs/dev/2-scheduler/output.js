if (process.env.NODE_ENV !== "production") {
    var DEFAULT_THREAD_ID; // Counters used to generate unique IDs.
    var interactionIDCounter;
    var threadIDCounter; // Set of currently traced interactions.
    // Interactions "stack"–
    // Meaning that newly traced interactions are appended to the previously active set.
    // When an interaction goes out of scope, the previous set (if any) is restored.
    exports.__interactionsRef = null; // Listener(s) to notify when interactions begin and end.
    exports.__subscriberRef = null;
    exports.__interactionsRef = null;
    exports.__subscriberRef = null;
    var prevInteractions = exports.__interactionsRef.current;
    exports.__interactionsRef.current = null;
    exports.__interactionsRef.current = null;
    exports.__interactionsRef.current;
    var threadID;
    var interaction;
    var prevInteractions1 = exports.__interactionsRef.current; // Traced interactions should stack/accumulate.
    // To do that, clone the current interactions.
    // The previous set will be restored upon completion.
    var interactions;
    exports.__interactionsRef.current = null;
    var subscriber = exports.__subscriberRef.current;
    var returnValue;
    exports.__interactionsRef.current = null;
    var threadID1;
    var wrappedInteractions = exports.__interactionsRef.current;
    var subscriber1 = exports.__subscriberRef.current;
    var hasRun;
    var prevInteractions2 = exports.__interactionsRef.current;
    exports.__interactionsRef.current = null;
    exports.__subscriberRef.current;
    var returnValue1;
    exports.__interactionsRef.current = null;
    (function cancel() {
        exports.__subscriberRef.current;
    });
    var subscribers;
    exports.__subscriberRef.current = null;
    exports.__subscriberRef.current = null;
    var didCatchError;
    var caughtError;
    var didCatchError1;
    var caughtError1;
    var didCatchError2;
    var caughtError2;
    var didCatchError3;
    var caughtError3;
    var didCatchError4;
    var caughtError4;
    var didCatchError5;
    var caughtError5;
    exports.unstable_clear = null;
    exports.unstable_getCurrent = null;
    exports.unstable_getThreadID = null;
    exports.unstable_subscribe = null;
    exports.unstable_trace = null;
    exports.unstable_unsubscribe = null;
    exports.unstable_wrap = null;
}
