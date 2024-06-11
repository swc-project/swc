//// [parserRealSource13.ts]
var TypeScript, TypeScript1;
!function(AstWalkerWithDetailCallback) {
    function AstWalkerCallback(pre, ast, callback) {
        var nodeType = ast.nodeType, callbackString = NodeType._map[nodeType] + "Callback";
        return callback[callbackString] ? callback[callbackString](pre, ast) : !callback.DefaultCallback || callback.DefaultCallback(pre, ast);
    }
    AstWalkerWithDetailCallback.walk = function(script, callback) {
        var walker = TypeScript1.getAstWalkerFactory().getWalker(function(cur, parent) {
            return walker.options.goChildren = AstWalkerCallback(!0, cur, callback), cur;
        }, function(cur, parent) {
            return AstWalkerCallback(!1, cur, callback), cur;
        });
        walker.walk(script, null);
    };
}((TypeScript1 = TypeScript || (TypeScript = {})).AstWalkerWithDetailCallback || (TypeScript1.AstWalkerWithDetailCallback = {}));
