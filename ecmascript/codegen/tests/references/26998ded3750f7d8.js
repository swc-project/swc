// To avoid JSC bug, we don't distinguish FunctionExpression name scope and it's function scope
(function a() {
    var b = 1; // Don't rename this variable to a name that is the same to function's name
    c(b);
}());
