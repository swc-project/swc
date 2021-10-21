function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
var TypeScript;
(function(TypeScript1) {
    var lastOf = function lastOf(items) {
        return items === null || items.length === 0 ? null : items[items.length - 1];
    };
    var max = function max(a, b) {
        return a >= b ? a : b;
    };
    var min = function min(a, b) {
        return a <= b ? a : b;
    };
    var isValidAstNode = function isValidAstNode(ast) {
        if (ast === null) return false;
        if (ast.minChar === -1 || ast.limChar === -1) return false;
        return true;
    };
    var getAstPathToPosition = function getAstPathToPosition(script, pos, param) {
        var options = param === void 0 ? GetAstPathOptions1.Default : param;
        var lookInComments = function(comments) {
            if (comments && comments.length > 0) {
                for(var i = 0; i < comments.length; i++){
                    var minChar = comments[i].minChar;
                    var limChar = comments[i].limChar;
                    if (!comments[i].isBlockComment) {
                        limChar++; // For single line comments, include 1 more character (for the newline)
                    }
                    if (pos >= minChar && pos < limChar) {
                        ctx.path.push(comments[i]);
                    }
                }
            }
        };
        var pre = function pre(cur, parent, walker) {
            if (isValidAstNode(cur)) {
                // Add "cur" to the stack if it contains our position
                // For "identifier" nodes, we need a special case: A position equal to "limChar" is
                // valid, since the position corresponds to a caret position (in between characters)
                // For example:
                //  bar
                //  0123
                // If "position == 3", the caret is at the "right" of the "r" character, which should be considered valid
                var inclusive = hasFlag(options, GetAstPathOptions1.EdgeInclusive) || cur.nodeType === TypeScript.NodeType.Name || pos === script.limChar; // Special "EOF" case
                var minChar = cur.minChar;
                var limChar = cur.limChar + (inclusive ? 1 : 0);
                if (pos >= minChar && pos < limChar) {
                    // TODO: Since AST is sometimes not correct wrt to position, only add "cur" if it's better
                    //       than top of the stack.
                    var previous = ctx.path.ast();
                    if (previous == null || cur.minChar >= previous.minChar && cur.limChar <= previous.limChar) {
                        ctx.path.push(cur);
                    } else {
                    //logger.log("TODO: Ignoring node because minChar, limChar not better than previous node in stack");
                    }
                }
                // The AST walker skips comments, but we might be in one, so check the pre/post comments for this node manually
                if (pos < limChar) {
                    lookInComments(cur.preComments);
                }
                if (pos >= minChar) {
                    lookInComments(cur.postComments);
                }
                if (!hasFlag(options, GetAstPathOptions1.DontPruneSearchBasedOnPosition)) {
                    // Don't go further down the tree if pos is outside of [minChar, limChar]
                    walker.options.goChildren = minChar <= pos && pos <= limChar;
                }
            }
            return cur;
        };
        var ctx = new AstPathContext();
        TypeScript.getAstWalkerFactory().walk(script, pre, null, null, ctx);
        return ctx.path;
    };
    var getTokenizationOffset = function getTokenizationOffset(script, position) {
        var bestOffset = 0;
        var pre = function(cur, parent, walker) {
            if (TypeScript.isValidAstNode(cur)) {
                // Did we find a closer offset?
                if (cur.minChar <= position) {
                    bestOffset = max(bestOffset, cur.minChar);
                }
                // Stop the walk if this node is not related to "minChar"
                if (cur.minChar > position || cur.limChar < bestOffset) {
                    walker.options.goChildren = false;
                }
            }
            return cur;
        };
        TypeScript.getAstWalkerFactory().walk(script, pre);
        return bestOffset;
    };
    var walkAST = function walkAST(ast, callback) {
        var pre = function pre(cur, parent, walker) {
            var path = walker.state;
            path.push(cur);
            callback(path, walker);
            return cur;
        };
        var post = function post(cur, parent, walker) {
            var path = walker.state;
            path.pop();
            return cur;
        };
        var path1 = new AstPath();
        TypeScript.getAstWalkerFactory().walk(ast, pre, post, null, path1);
    };
    TypeScript1.lastOf = lastOf;
    TypeScript1.max = max;
    TypeScript1.min = min;
    var AstPath = /*#__PURE__*/ function() {
        "use strict";
        function AstPath() {
            _classCallCheck(this, AstPath);
            this.asts = [];
            this.top = -1;
        }
        _createClass(AstPath, [
            {
                key: "clone",
                value: function clone() {
                    var clone1 = new AstPath();
                    clone1.asts = this.asts.map(function(value) {
                        return value;
                    });
                    clone1.top = this.top;
                    return clone1;
                }
            },
            {
                key: "pop",
                value: function pop() {
                    var head = this.ast();
                    this.up();
                    while(this.asts.length > this.count()){
                        this.asts.pop();
                    }
                    return head;
                }
            },
            {
                key: "push",
                value: function push(ast) {
                    while(this.asts.length > this.count()){
                        this.asts.pop();
                    }
                    this.top = this.asts.length;
                    this.asts.push(ast);
                }
            },
            {
                key: "up",
                value: function up() {
                    if (this.top <= -1) throw new Error("Invalid call to 'up'");
                    this.top--;
                }
            },
            {
                key: "down",
                value: function down() {
                    if (this.top == this.ast.length - 1) throw new Error("Invalid call to 'down'");
                    this.top++;
                }
            },
            {
                key: "nodeType",
                value: function nodeType() {
                    if (this.ast() == null) return TypeScript.NodeType.None;
                    return this.ast().nodeType;
                }
            },
            {
                key: "ast",
                value: function ast() {
                    return AstPath.reverseIndexOf(this.asts, this.asts.length - (this.top + 1));
                }
            },
            {
                key: "parent",
                value: function parent() {
                    return AstPath.reverseIndexOf(this.asts, this.asts.length - this.top);
                }
            },
            {
                key: "count",
                value: function count() {
                    return this.top + 1;
                }
            },
            {
                key: "get",
                value: function get(index) {
                    return this.asts[index];
                }
            },
            {
                key: "isNameOfClass",
                value: function isNameOfClass() {
                    if (this.ast() === null || this.parent() === null) return false;
                    return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ClassDeclaration && this.parent().name === this.ast();
                }
            },
            {
                key: "isNameOfInterface",
                value: function isNameOfInterface() {
                    if (this.ast() === null || this.parent() === null) return false;
                    return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.InterfaceDeclaration && this.parent().name === this.ast();
                }
            },
            {
                key: "isNameOfArgument",
                value: function isNameOfArgument() {
                    if (this.ast() === null || this.parent() === null) return false;
                    return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ArgDecl && this.parent().id === this.ast();
                }
            },
            {
                key: "isNameOfVariable",
                value: function isNameOfVariable() {
                    if (this.ast() === null || this.parent() === null) return false;
                    return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.VarDecl && this.parent().id === this.ast();
                }
            },
            {
                key: "isNameOfModule",
                value: function isNameOfModule() {
                    if (this.ast() === null || this.parent() === null) return false;
                    return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ModuleDeclaration && this.parent().name === this.ast();
                }
            },
            {
                key: "isNameOfFunction",
                value: function isNameOfFunction() {
                    if (this.ast() === null || this.parent() === null) return false;
                    return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.FuncDecl && this.parent().name === this.ast();
                }
            },
            {
                key: "isChildOfScript",
                value: function isChildOfScript() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Script;
                }
            },
            {
                key: "isChildOfModule",
                value: function isChildOfModule() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ModuleDeclaration;
                }
            },
            {
                key: "isChildOfClass",
                value: function isChildOfClass() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ClassDeclaration;
                }
            },
            {
                key: "isArgumentOfClassConstructor",
                value: function isArgumentOfClassConstructor() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 5 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 3].nodeType === TypeScript.NodeType.List && this.asts[this.top - 4].nodeType === TypeScript.NodeType.ClassDeclaration && this.asts[this.top - 2].isConstructor && this.asts[this.top - 2].arguments === this.asts[this.top - 1] && this.asts[this.top - 4].constructorDecl === this.asts[this.top - 2];
                }
            },
            {
                key: "isChildOfInterface",
                value: function isChildOfInterface() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.InterfaceDeclaration;
                }
            },
            {
                key: "isTopLevelImplicitModule",
                value: function isTopLevelImplicitModule() {
                    return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript.NodeType.ModuleDeclaration && TypeScript.hasFlag(this.asts[this.top].modFlags, TypeScript.ModuleFlags.IsWholeFile);
                }
            },
            {
                key: "isBodyOfTopLevelImplicitModule",
                value: function isBodyOfTopLevelImplicitModule() {
                    return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0] && TypeScript.hasFlag(this.asts[this.top - 1].modFlags, TypeScript.ModuleFlags.IsWholeFile);
                }
            },
            {
                key: "isBodyOfScript",
                value: function isBodyOfScript() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Script && this.asts[this.top - 1].bod == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfSwitch",
                value: function isBodyOfSwitch() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].caseList == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfModule",
                value: function isBodyOfModule() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfClass",
                value: function isBodyOfClass() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ClassDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfFunction",
                value: function isBodyOfFunction() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 1].bod == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfInterface",
                value: function isBodyOfInterface() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.InterfaceDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfBlock",
                value: function isBodyOfBlock() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Block && this.asts[this.top - 1].statements == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfFor",
                value: function isBodyOfFor() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.For && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfCase",
                value: function isBodyOfCase() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Case && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfTry",
                value: function isBodyOfTry() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Try && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfCatch",
                value: function isBodyOfCatch() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Catch && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfDoWhile",
                value: function isBodyOfDoWhile() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.DoWhile && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfWhile",
                value: function isBodyOfWhile() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.While && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfForIn",
                value: function isBodyOfForIn() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ForIn && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfWith",
                value: function isBodyOfWith() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.With && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfFinally",
                value: function isBodyOfFinally() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Finally && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isCaseOfSwitch",
                value: function isCaseOfSwitch() {
                    return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1];
                }
            },
            {
                key: "isDefaultCaseOfSwitch",
                value: function isDefaultCaseOfSwitch() {
                    return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1] && this.asts[this.top - 2].defaultCase == this.asts[this.top - 0];
                }
            },
            {
                key: "isListOfObjectLit",
                value: function isListOfObjectLit() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfObjectLit",
                value: function isBodyOfObjectLit() {
                    return this.isListOfObjectLit();
                }
            },
            {
                key: "isEmptyListOfObjectLit",
                value: function isEmptyListOfObjectLit() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0] && this.asts[this.top - 0].members.length == 0;
                }
            },
            {
                key: "isMemberOfObjectLit",
                value: function isMemberOfObjectLit() {
                    return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 2].operand == this.asts[this.top - 1];
                }
            },
            {
                key: "isNameOfMemberOfObjectLit",
                value: function isNameOfMemberOfObjectLit() {
                    return this.count() >= 4 && this.asts[this.top - 3].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 2].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Name && this.asts[this.top - 3].operand == this.asts[this.top - 2];
                }
            },
            {
                key: "isListOfArrayLit",
                value: function isListOfArrayLit() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ArrayLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
                }
            },
            {
                key: "isTargetOfMember",
                value: function isTargetOfMember() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 1].operand1 === this.asts[this.top - 0];
                }
            },
            {
                key: "isMemberOfMember",
                value: function isMemberOfMember() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 1].operand2 === this.asts[this.top - 0];
                }
            },
            {
                key: "isItemOfList",
                value: function isItemOfList() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List;
                //(<Tools.ASTList>this.asts[this.top - 1]).operand2 === this.asts[this.top - 0];
                }
            },
            {
                key: "isThenOfIf",
                value: function isThenOfIf() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.If && this.asts[this.top - 1].thenBod == this.asts[this.top - 0];
                }
            },
            {
                key: "isElseOfIf",
                value: function isElseOfIf() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.If && this.asts[this.top - 1].elseBod == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfDefaultCase",
                value: function isBodyOfDefaultCase() {
                    return this.isBodyOfCase();
                }
            },
            {
                key: "isSingleStatementList",
                value: function isSingleStatementList() {
                    return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript.NodeType.List && this.asts[this.top].members.length === 1;
                }
            },
            {
                key: "isArgumentListOfFunction",
                value: function isArgumentListOfFunction() {
                    return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
                }
            },
            {
                key: "isArgumentOfFunction",
                value: function isArgumentOfFunction() {
                    return this.count() >= 3 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 2].arguments === this.asts[this.top - 1];
                }
            },
            {
                key: "isArgumentListOfCall",
                value: function isArgumentListOfCall() {
                    return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Call && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
                }
            },
            {
                key: "isArgumentListOfNew",
                value: function isArgumentListOfNew() {
                    return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.New && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
                }
            },
            {
                key: "isSynthesizedBlock",
                value: function isSynthesizedBlock() {
                    return this.count() >= 1 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Block && this.asts[this.top - 0].isStatementBlock === false;
                }
            }
        ], [
            {
                key: "reverseIndexOf",
                value: function reverseIndexOf(items, index) {
                    return items === null || items.length <= index ? null : items[items.length - index - 1];
                }
            }
        ]);
        return AstPath;
    }();
    TypeScript1.AstPath = AstPath;
    TypeScript1.isValidAstNode = isValidAstNode;
    var AstPathContext = function AstPathContext() {
        "use strict";
        _classCallCheck(this, AstPathContext);
        this.path = new TypeScript.AstPath();
    };
    TypeScript1.AstPathContext = AstPathContext;
    var GetAstPathOptions1;
    (function(GetAstPathOptions) {
        GetAstPathOptions[GetAstPathOptions["Default"] = 0] = "Default";
        GetAstPathOptions[GetAstPathOptions["EdgeInclusive"] = 1] = "EdgeInclusive";
        GetAstPathOptions[GetAstPathOptions[//We need this options dealing with an AST coming from an incomplete AST. For example:
        //     class foo { // r
        // If we ask for the AST at the position after the "r" character, we won't see we are 
        // inside a comment, because the "class" AST node has a limChar corresponding to the position of 
        // the "{" character, meaning we don't traverse the tree down to the stmt list of the class, meaning
        // we don't find the "precomment" attached to the errorneous empty stmt.
        //TODO: It would be nice to be able to get rid of this.
        "DontPruneSearchBasedOnPosition"] = 2] = "DontPruneSearchBasedOnPosition";
    })(GetAstPathOptions1 || (GetAstPathOptions1 = {
    }));
    TypeScript1.getAstPathToPosition = getAstPathToPosition;
    TypeScript1.getTokenizationOffset = getTokenizationOffset;
    TypeScript1.walkAST = walkAST;
    TypeScript1.GetAstPathOptions = GetAstPathOptions1;
})(TypeScript || (TypeScript = {
}));
