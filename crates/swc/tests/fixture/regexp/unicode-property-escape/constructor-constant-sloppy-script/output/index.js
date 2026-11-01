const pattern = "\\p{ASCII}";
function withScope(scope) {
    with (scope){
        return new RegExp(pattern, "u");
    }
}
function afterEval(code) {
    eval(code);
    return new RegExp(pattern, "u");
}
var literal = new RegExp("[\\u0000-\\u007F]", "u");
