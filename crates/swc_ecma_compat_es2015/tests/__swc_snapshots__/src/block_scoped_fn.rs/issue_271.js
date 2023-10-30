function foo(scope) {
    scope.startOperation = startOperation;
    function startOperation(operation) {
        scope.agentOperation = operation;
    }
}
