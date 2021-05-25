(function () {
    function renderEventHandlerClosure(eventName) {
        return function () {
            return console.log(eventName);
        };
    }
    (function (outputs) {
        var handlers = [];
        for (var i = 0; i < outputs.length; i++) {
            var output = outputs[i];
            var handleEventClosure = renderEventHandlerClosure(
                output.eventName
            );
            handlers.push(handleEventClosure);
        }
        return handlers;
    })([
        { type: 0, target: null, eventName: "ngSubmit", propName: null },
        { type: 0, target: null, eventName: "submit", propName: null },
        { type: 0, target: null, eventName: "reset", propName: null },
    ]).forEach(function (handler) {
        return handler();
    });
})();
