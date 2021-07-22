function lazyInitializer(payload) {
    var Uninitialized = -1;
    var Pending = 0;
    var Resolved = 1;
    var Rejected = 2;

    if (payload._status === Uninitialized) {
        var ctor = payload._result;
        var thenable = ctor(); // Transition to the next state.

        var pending = payload;
        pending._status = Pending;
        pending._result = thenable;
        thenable.then(function (moduleObject) {
            if (payload._status === Pending) {
                var defaultExport = moduleObject.default;

                {
                    if (defaultExport === undefined) {
                        error('lazy: Expected the result of a dynamic import() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
                            'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
                    }
                } // Transition to the next state.


                var resolved = payload;
                resolved._status = Resolved;
                resolved._result = defaultExport;
            }
        }, function (error) {
            if (payload._status === Pending) {
                // Transition to the next state.
                var rejected = payload;
                rejected._status = Rejected;
                rejected._result = error;
            }
        });
    }

    if (payload._status === Resolved) {
        return payload._result;
    } else {
        throw payload._result;
    }
}