function lazyInitializer(payload) {
    if (-1 === payload._status) {
        var thenable = (0, payload._result)(); // Transition to the next state.
        payload._status = 0, payload._result = thenable, thenable.then(function(moduleObject) {
            if (0 === payload._status) {
                var defaultExport = moduleObject.default;
                void 0 === defaultExport && error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject), payload._status = 1, payload._result = defaultExport;
            }
        }, function(error1) {
            0 === payload._status && (payload._status = 2, payload._result = error1);
        });
    }
    if (1 === payload._status) return payload._result;
    throw payload._result;
}
