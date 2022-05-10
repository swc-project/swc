function foo(scope) {
    var startOperation = function startOperation1(operation) {
        scope.agentOperation = operation;
    };
    scope.startOperation = startOperation;
}
