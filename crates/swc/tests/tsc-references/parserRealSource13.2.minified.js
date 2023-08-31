//// [parserRealSource13.ts]
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
var TypeScript, TypeScript1;
!function(AstWalkerWithDetailCallback) {
    function AstWalkerCallback(pre, ast, callback) {
        // See if the Callback needs to be handled using specific one or default one
        var nodeType = ast.nodeType, callbackString = NodeType._map[nodeType] + "Callback";
        return callback[callbackString] ? callback[callbackString](pre, ast) : !callback.DefaultCallback || callback.DefaultCallback(pre, ast);
    }
    AstWalkerWithDetailCallback.walk = function(script, callback) {
        var walker = TypeScript.getAstWalkerFactory().getWalker(function(cur, parent) {
            return walker.options.goChildren = AstWalkerCallback(!0, cur, callback), cur;
        }, function(cur, parent) {
            return AstWalkerCallback(!1, cur, callback), cur;
        });
        walker.walk(script, null);
    };
}((TypeScript1 = TypeScript || (TypeScript = {})).AstWalkerWithDetailCallback || (TypeScript1.AstWalkerWithDetailCallback = {}));
