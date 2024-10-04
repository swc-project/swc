//// [parserRealSource13.ts]
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
(function(TypeScript) {
    (function(AstWalkerWithDetailCallback) {
        function walk(script, callback) {
            var pre = function(cur, parent) {
                walker.options.goChildren = AstWalkerCallback(true, cur, callback);
                return cur;
            };
            var post = function(cur, parent) {
                AstWalkerCallback(false, cur, callback);
                return cur;
            };
            var walker = TypeScript.getAstWalkerFactory().getWalker(pre, post);
            walker.walk(script, null);
        }
        AstWalkerWithDetailCallback.walk = walk;
        function AstWalkerCallback(pre, ast, callback) {
            // See if the Callback needs to be handled using specific one or default one
            var nodeType = ast.nodeType;
            var callbackString = NodeType._map[nodeType] + "Callback";
            if (callback[callbackString]) {
                return callback[callbackString](pre, ast);
            }
            if (callback.DefaultCallback) {
                return callback.DefaultCallback(pre, ast);
            }
            return true;
        }
    })(TypeScript.AstWalkerWithDetailCallback || (TypeScript.AstWalkerWithDetailCallback = {}));
})(TypeScript || (TypeScript = {}));
var TypeScript;
