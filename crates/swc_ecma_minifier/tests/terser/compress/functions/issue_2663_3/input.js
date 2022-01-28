(function () {
    var outputs = [
        { type: 0, target: null, eventName: "ngSubmit", propName: null },
        { type: 0, target: null, eventName: "submit", propName: null },
        { type: 0, target: null, eventName: "reset", propName: null },
    ];
    function listenToElementOutputs(outputs) {
        var handlers = [];
        for (var i = 0; i < outputs.length; i++) {
            var output = outputs[i];
            var handleEventClosure = renderEventHandlerClosure(
                output.eventName
            );
            handlers.push(handleEventClosure);
        }
        var target, name;
        return handlers;
    }
    function renderEventHandlerClosure(eventName) {
        return function () {
            return console.log(eventName);
        };
    }
    listenToElementOutputs(outputs).forEach(function (handler) {
        return handler();
    });
})();
