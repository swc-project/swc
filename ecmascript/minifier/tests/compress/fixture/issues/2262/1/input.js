(() => {
    "use strict";

    var commonjsGlobal = globalThis

    var index = somethingGlobal;

    const esm = index;

    var createNamedContext = function createNamedContext() {
        esm();
    };

    createNamedContext();
    createNamedContext();
})()

