function lazyInitializer(payload) {
    if (-1 === payload._status) {
        var thenable = (0, payload._result)(), pending = payload;
        pending._status = 0, pending._result = thenable, thenable.then(function(moduleObject) {
            if (0 === payload._status) {
                var defaultExport = moduleObject.default;
                void 0 === defaultExport && error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
                var resolved = payload;
                resolved._status = 1, resolved._result = defaultExport;
            }
        }, function(error1) {
            if (0 === payload._status) {
                var rejected = payload;
                rejected._status = 2, rejected._result = error1;
            }
        });
    }
    if (1 === payload._status) return payload._result;
    throw payload._result;
}
