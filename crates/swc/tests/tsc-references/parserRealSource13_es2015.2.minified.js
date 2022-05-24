var TypeScript;
!function(TypeScript1) {
    !function(AstWalkerWithDetailCallback) {
        function AstWalkerCallback(pre, ast, callback) {
            var nodeType = ast.nodeType, callbackString = NodeType._map[nodeType] + "Callback";
            return callback[callbackString] ? callback[callbackString](pre, ast) : !callback.DefaultCallback || callback.DefaultCallback(pre, ast);
        }
        AstWalkerWithDetailCallback.walk = function(script, callback) {
            var pre = (cur, parent)=>(walker.options.goChildren = AstWalkerCallback(!0, cur, callback), cur), post = (cur, parent)=>(AstWalkerCallback(!1, cur, callback), cur), walker = TypeScript.getAstWalkerFactory().getWalker(pre, post);
            walker.walk(script, null);
        };
    }(TypeScript1.AstWalkerWithDetailCallback || (TypeScript1.AstWalkerWithDetailCallback = {}));
}(TypeScript || (TypeScript = {}));
