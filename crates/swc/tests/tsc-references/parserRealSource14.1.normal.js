//// [parserRealSource14.ts]
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(TypeScript) {
    function lastOf(items) {
        return items === null || items.length === 0 ? null : items[items.length - 1];
    }
    TypeScript.lastOf = lastOf;
    function max(a, b) {
        return a >= b ? a : b;
    }
    TypeScript.max = max;
    function min(a, b) {
        return a <= b ? a : b;
    }
    TypeScript.min = min;
    var AstPath = /*#__PURE__*/ function() {
        "use strict";
        function AstPath() {
            _class_call_check(this, AstPath);
            this.asts = [];
            this.top = -1;
        }
        var _proto = AstPath.prototype;
        _proto.clone = function clone() {
            var clone = new AstPath();
            clone.asts = this.asts.map(function(value) {
                return value;
            });
            clone.top = this.top;
            return clone;
        };
        _proto.pop = function pop() {
            var head = this.ast();
            this.up();
            while(this.asts.length > this.count()){
                this.asts.pop();
            }
            return head;
        };
        _proto.push = function push(ast) {
            while(this.asts.length > this.count()){
                this.asts.pop();
            }
            this.top = this.asts.length;
            this.asts.push(ast);
        };
        _proto.up = function up() {
            if (this.top <= -1) throw new Error("Invalid call to 'up'");
            this.top--;
        };
        _proto.down = function down() {
            if (this.top == this.ast.length - 1) throw new Error("Invalid call to 'down'");
            this.top++;
        };
        _proto.nodeType = function nodeType() {
            if (this.ast() == null) return TypeScript.NodeType.None;
            return this.ast().nodeType;
        };
        _proto.ast = function ast() {
            return AstPath.reverseIndexOf(this.asts, this.asts.length - (this.top + 1));
        };
        _proto.parent = function parent() {
            return AstPath.reverseIndexOf(this.asts, this.asts.length - this.top);
        };
        _proto.count = function count() {
            return this.top + 1;
        };
        _proto.get = function get(index) {
            return this.asts[index];
        };
        _proto.isNameOfClass = function isNameOfClass() {
            if (this.ast() === null || this.parent() === null) return false;
            return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ClassDeclaration && this.parent().name === this.ast();
        };
        _proto.isNameOfInterface = function isNameOfInterface() {
            if (this.ast() === null || this.parent() === null) return false;
            return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.InterfaceDeclaration && this.parent().name === this.ast();
        };
        _proto.isNameOfArgument = function isNameOfArgument() {
            if (this.ast() === null || this.parent() === null) return false;
            return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ArgDecl && this.parent().id === this.ast();
        };
        _proto.isNameOfVariable = function isNameOfVariable() {
            if (this.ast() === null || this.parent() === null) return false;
            return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.VarDecl && this.parent().id === this.ast();
        };
        _proto.isNameOfModule = function isNameOfModule() {
            if (this.ast() === null || this.parent() === null) return false;
            return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ModuleDeclaration && this.parent().name === this.ast();
        };
        _proto.isNameOfFunction = function isNameOfFunction() {
            if (this.ast() === null || this.parent() === null) return false;
            return this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.FuncDecl && this.parent().name === this.ast();
        };
        _proto.isChildOfScript = function isChildOfScript() {
            var ast = lastOf(this.asts);
            return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Script;
        };
        _proto.isChildOfModule = function isChildOfModule() {
            var ast = lastOf(this.asts);
            return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ModuleDeclaration;
        };
        _proto.isChildOfClass = function isChildOfClass() {
            var ast = lastOf(this.asts);
            return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ClassDeclaration;
        };
        _proto.isArgumentOfClassConstructor = function isArgumentOfClassConstructor() {
            var ast = lastOf(this.asts);
            return this.count() >= 5 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 3].nodeType === TypeScript.NodeType.List && this.asts[this.top - 4].nodeType === TypeScript.NodeType.ClassDeclaration && this.asts[this.top - 2].isConstructor && this.asts[this.top - 2].arguments === this.asts[this.top - 1] && this.asts[this.top - 4].constructorDecl === this.asts[this.top - 2];
        };
        _proto.isChildOfInterface = function isChildOfInterface() {
            var ast = lastOf(this.asts);
            return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.InterfaceDeclaration;
        };
        _proto.isTopLevelImplicitModule = function isTopLevelImplicitModule() {
            return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript.NodeType.ModuleDeclaration && TypeScript.hasFlag(this.asts[this.top].modFlags, TypeScript.ModuleFlags.IsWholeFile);
        };
        _proto.isBodyOfTopLevelImplicitModule = function isBodyOfTopLevelImplicitModule() {
            return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0] && TypeScript.hasFlag(this.asts[this.top - 1].modFlags, TypeScript.ModuleFlags.IsWholeFile);
        };
        _proto.isBodyOfScript = function isBodyOfScript() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Script && this.asts[this.top - 1].bod == this.asts[this.top - 0];
        };
        _proto.isBodyOfSwitch = function isBodyOfSwitch() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].caseList == this.asts[this.top - 0];
        };
        _proto.isBodyOfModule = function isBodyOfModule() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
        };
        _proto.isBodyOfClass = function isBodyOfClass() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ClassDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
        };
        _proto.isBodyOfFunction = function isBodyOfFunction() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 1].bod == this.asts[this.top - 0];
        };
        _proto.isBodyOfInterface = function isBodyOfInterface() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.InterfaceDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
        };
        _proto.isBodyOfBlock = function isBodyOfBlock() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Block && this.asts[this.top - 1].statements == this.asts[this.top - 0];
        };
        _proto.isBodyOfFor = function isBodyOfFor() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.For && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isBodyOfCase = function isBodyOfCase() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Case && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isBodyOfTry = function isBodyOfTry() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Try && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isBodyOfCatch = function isBodyOfCatch() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Catch && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isBodyOfDoWhile = function isBodyOfDoWhile() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.DoWhile && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isBodyOfWhile = function isBodyOfWhile() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.While && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isBodyOfForIn = function isBodyOfForIn() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ForIn && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isBodyOfWith = function isBodyOfWith() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.With && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isBodyOfFinally = function isBodyOfFinally() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Finally && this.asts[this.top - 1].body == this.asts[this.top - 0];
        };
        _proto.isCaseOfSwitch = function isCaseOfSwitch() {
            return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1];
        };
        _proto.isDefaultCaseOfSwitch = function isDefaultCaseOfSwitch() {
            return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1] && this.asts[this.top - 2].defaultCase == this.asts[this.top - 0];
        };
        _proto.isListOfObjectLit = function isListOfObjectLit() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
        };
        _proto.isBodyOfObjectLit = function isBodyOfObjectLit() {
            return this.isListOfObjectLit();
        };
        _proto.isEmptyListOfObjectLit = function isEmptyListOfObjectLit() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0] && this.asts[this.top - 0].members.length == 0;
        };
        _proto.isMemberOfObjectLit = function isMemberOfObjectLit() {
            return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 2].operand == this.asts[this.top - 1];
        };
        _proto.isNameOfMemberOfObjectLit = function isNameOfMemberOfObjectLit() {
            return this.count() >= 4 && this.asts[this.top - 3].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 2].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Name && this.asts[this.top - 3].operand == this.asts[this.top - 2];
        };
        _proto.isListOfArrayLit = function isListOfArrayLit() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ArrayLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
        };
        _proto.isTargetOfMember = function isTargetOfMember() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 1].operand1 === this.asts[this.top - 0];
        };
        _proto.isMemberOfMember = function isMemberOfMember() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 1].operand2 === this.asts[this.top - 0];
        };
        _proto.isItemOfList = function isItemOfList() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List;
        //(<Tools.ASTList>this.asts[this.top - 1]).operand2 === this.asts[this.top - 0];
        };
        _proto.isThenOfIf = function isThenOfIf() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.If && this.asts[this.top - 1].thenBod == this.asts[this.top - 0];
        };
        _proto.isElseOfIf = function isElseOfIf() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.If && this.asts[this.top - 1].elseBod == this.asts[this.top - 0];
        };
        _proto.isBodyOfDefaultCase = function isBodyOfDefaultCase() {
            return this.isBodyOfCase();
        };
        _proto.isSingleStatementList = function isSingleStatementList() {
            return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript.NodeType.List && this.asts[this.top].members.length === 1;
        };
        _proto.isArgumentListOfFunction = function isArgumentListOfFunction() {
            return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
        };
        _proto.isArgumentOfFunction = function isArgumentOfFunction() {
            return this.count() >= 3 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 2].arguments === this.asts[this.top - 1];
        };
        _proto.isArgumentListOfCall = function isArgumentListOfCall() {
            return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Call && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
        };
        _proto.isArgumentListOfNew = function isArgumentListOfNew() {
            return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.New && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
        };
        _proto.isSynthesizedBlock = function isSynthesizedBlock() {
            return this.count() >= 1 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Block && this.asts[this.top - 0].isStatementBlock === false;
        };
        AstPath.reverseIndexOf = function reverseIndexOf(items, index) {
            return items === null || items.length <= index ? null : items[items.length - index - 1];
        };
        return AstPath;
    }();
    //
    // Helper class representing a path from a root ast node to a (grand)child ast node.
    // This is helpful as our tree don't have parents.
    //
    TypeScript.AstPath = AstPath;
    function isValidAstNode(ast) {
        if (ast === null) return false;
        if (ast.minChar === -1 || ast.limChar === -1) return false;
        return true;
    }
    TypeScript.isValidAstNode = isValidAstNode;
    var AstPathContext = function AstPathContext() {
        "use strict";
        _class_call_check(this, AstPathContext);
        this.path = new TypeScript.AstPath();
    };
    TypeScript.AstPathContext = AstPathContext;
    (function(GetAstPathOptions) {
        GetAstPathOptions[GetAstPathOptions["Default"] = 0] = "Default";
        GetAstPathOptions[GetAstPathOptions["EdgeInclusive"] = 1] = "EdgeInclusive";
        //We need this options dealing with an AST coming from an incomplete AST. For example:
        //     class foo { // r
        // If we ask for the AST at the position after the "r" character, we won't see we are 
        // inside a comment, because the "class" AST node has a limChar corresponding to the position of 
        // the "{" character, meaning we don't traverse the tree down to the stmt list of the class, meaning
        // we don't find the "precomment" attached to the errorneous empty stmt.
        //TODO: It would be nice to be able to get rid of this.
        GetAstPathOptions[GetAstPathOptions["DontPruneSearchBasedOnPosition"] = 2] = "DontPruneSearchBasedOnPosition";
    })(TypeScript.GetAstPathOptions || (TypeScript.GetAstPathOptions = {}));
    function getAstPathToPosition(script, pos) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
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
                var inclusive = hasFlag(options, 1) || cur.nodeType === TypeScript.NodeType.Name || pos === script.limChar; // Special "EOF" case
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
                if (!hasFlag(options, 2)) {
                    // Don't go further down the tree if pos is outside of [minChar, limChar]
                    walker.options.goChildren = minChar <= pos && pos <= limChar;
                }
            }
            return cur;
        };
        var ctx = new AstPathContext();
        TypeScript.getAstWalkerFactory().walk(script, pre, null, null, ctx);
        return ctx.path;
    }
    ///
    /// Return the stack of AST nodes containing "position"
    ///
    TypeScript.getAstPathToPosition = getAstPathToPosition;
    function getTokenizationOffset(script, position) {
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
    }
    //
    // Find a source text offset that is safe for lexing tokens at the given position.
    // This is used when "position" might be inside a comment or string, etc.
    //
    TypeScript.getTokenizationOffset = getTokenizationOffset;
    function walkAST(ast, callback) {
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
        var path = new AstPath();
        TypeScript.getAstWalkerFactory().walk(ast, pre, post, null, path);
    }
    ///
    /// Simple function to Walk an AST using a simple callback function.
    ///
    TypeScript.walkAST = walkAST;
})(TypeScript || (TypeScript = {}));
var TypeScript;
