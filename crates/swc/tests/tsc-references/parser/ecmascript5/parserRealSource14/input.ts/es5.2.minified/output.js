var TypeScript;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(TypeScript1) {
    var GetAstPathOptions, lastOf = function(items) {
        return null === items || 0 === items.length ? null : items[items.length - 1];
    }, max = function(a, b) {
        return a >= b ? a : b;
    }, isValidAstNode = function(ast) {
        return null !== ast && -1 !== ast.minChar && -1 !== ast.limChar;
    }, getAstPathToPosition = function(script, pos, param) {
        var options = void 0 === param ? GetAstPathOptions.Default : param, lookInComments = function(comments) {
            if (comments && comments.length > 0) for(var i = 0; i < comments.length; i++){
                var minChar = comments[i].minChar, limChar = comments[i].limChar;
                !comments[i].isBlockComment && limChar++, pos >= minChar && pos < limChar && ctx.path.push(comments[i]);
            }
        }, pre = function(cur, parent, walker) {
            if (isValidAstNode(cur)) {
                var inclusive = hasFlag(options, GetAstPathOptions.EdgeInclusive) || cur.nodeType === TypeScript.NodeType.Name || pos === script.limChar, minChar = cur.minChar, limChar = cur.limChar + (inclusive ? 1 : 0);
                if (pos >= minChar && pos < limChar) {
                    var previous = ctx.path.ast();
                    (null == previous || cur.minChar >= previous.minChar && cur.limChar <= previous.limChar) && ctx.path.push(cur);
                }
                pos < limChar && lookInComments(cur.preComments), pos >= minChar && lookInComments(cur.postComments), hasFlag(options, GetAstPathOptions.DontPruneSearchBasedOnPosition) || (walker.options.goChildren = minChar <= pos && pos <= limChar);
            }
            return cur;
        }, ctx = new AstPathContext();
        return TypeScript.getAstWalkerFactory().walk(script, pre, null, null, ctx), ctx.path;
    }, getTokenizationOffset = function(script, position) {
        var bestOffset = 0, pre = function(cur, parent, walker) {
            return TypeScript.isValidAstNode(cur) && (cur.minChar <= position && (bestOffset = max(bestOffset, cur.minChar)), (cur.minChar > position || cur.limChar < bestOffset) && (walker.options.goChildren = !1)), cur;
        };
        return TypeScript.getAstWalkerFactory().walk(script, pre), bestOffset;
    }, walkAST = function(ast, callback) {
        var pre = function(cur, parent, walker) {
            var path = walker.state;
            return path.push(cur), callback(path, walker), cur;
        }, post = function(cur, parent, walker) {
            return walker.state.pop(), cur;
        }, path1 = new AstPath();
        TypeScript.getAstWalkerFactory().walk(ast, pre, post, null, path1);
    };
    TypeScript1.lastOf = lastOf, TypeScript1.max = max, TypeScript1.min = function(a, b) {
        return a <= b ? a : b;
    };
    var AstPath = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function AstPath() {
            _classCallCheck(this, AstPath), this.asts = [], this.top = -1;
        }
        return Constructor = AstPath, protoProps = [
            {
                key: "clone",
                value: function() {
                    var clone = new AstPath();
                    return clone.asts = this.asts.map(function(value) {
                        return value;
                    }), clone.top = this.top, clone;
                }
            },
            {
                key: "pop",
                value: function() {
                    var head = this.ast();
                    for(this.up(); this.asts.length > this.count();)this.asts.pop();
                    return head;
                }
            },
            {
                key: "push",
                value: function(ast) {
                    for(; this.asts.length > this.count();)this.asts.pop();
                    this.top = this.asts.length, this.asts.push(ast);
                }
            },
            {
                key: "up",
                value: function() {
                    if (this.top <= -1) throw new Error("Invalid call to 'up'");
                    this.top--;
                }
            },
            {
                key: "down",
                value: function() {
                    if (this.top == this.ast.length - 1) throw new Error("Invalid call to 'down'");
                    this.top++;
                }
            },
            {
                key: "nodeType",
                value: function() {
                    return null == this.ast() ? TypeScript.NodeType.None : this.ast().nodeType;
                }
            },
            {
                key: "ast",
                value: function() {
                    return AstPath.reverseIndexOf(this.asts, this.asts.length - (this.top + 1));
                }
            },
            {
                key: "parent",
                value: function() {
                    return AstPath.reverseIndexOf(this.asts, this.asts.length - this.top);
                }
            },
            {
                key: "count",
                value: function() {
                    return this.top + 1;
                }
            },
            {
                key: "get",
                value: function(index) {
                    return this.asts[index];
                }
            },
            {
                key: "isNameOfClass",
                value: function() {
                    return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ClassDeclaration && this.parent().name === this.ast();
                }
            },
            {
                key: "isNameOfInterface",
                value: function() {
                    return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.InterfaceDeclaration && this.parent().name === this.ast();
                }
            },
            {
                key: "isNameOfArgument",
                value: function() {
                    return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ArgDecl && this.parent().id === this.ast();
                }
            },
            {
                key: "isNameOfVariable",
                value: function() {
                    return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.VarDecl && this.parent().id === this.ast();
                }
            },
            {
                key: "isNameOfModule",
                value: function() {
                    return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.ModuleDeclaration && this.parent().name === this.ast();
                }
            },
            {
                key: "isNameOfFunction",
                value: function() {
                    return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript.NodeType.Name && this.parent().nodeType === TypeScript.NodeType.FuncDecl && this.parent().name === this.ast();
                }
            },
            {
                key: "isChildOfScript",
                value: function() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Script;
                }
            },
            {
                key: "isChildOfModule",
                value: function() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ModuleDeclaration;
                }
            },
            {
                key: "isChildOfClass",
                value: function() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ClassDeclaration;
                }
            },
            {
                key: "isArgumentOfClassConstructor",
                value: function() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 5 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 3].nodeType === TypeScript.NodeType.List && this.asts[this.top - 4].nodeType === TypeScript.NodeType.ClassDeclaration && this.asts[this.top - 2].isConstructor && this.asts[this.top - 2].arguments === this.asts[this.top - 1] && this.asts[this.top - 4].constructorDecl === this.asts[this.top - 2];
                }
            },
            {
                key: "isChildOfInterface",
                value: function() {
                    var ast = lastOf(this.asts);
                    return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.InterfaceDeclaration;
                }
            },
            {
                key: "isTopLevelImplicitModule",
                value: function() {
                    return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript.NodeType.ModuleDeclaration && TypeScript.hasFlag(this.asts[this.top].modFlags, TypeScript.ModuleFlags.IsWholeFile);
                }
            },
            {
                key: "isBodyOfTopLevelImplicitModule",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0] && TypeScript.hasFlag(this.asts[this.top - 1].modFlags, TypeScript.ModuleFlags.IsWholeFile);
                }
            },
            {
                key: "isBodyOfScript",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Script && this.asts[this.top - 1].bod == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfSwitch",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].caseList == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfModule",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfClass",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ClassDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfFunction",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 1].bod == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfInterface",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.InterfaceDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfBlock",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Block && this.asts[this.top - 1].statements == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfFor",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.For && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfCase",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Case && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfTry",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Try && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfCatch",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Catch && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfDoWhile",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.DoWhile && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfWhile",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.While && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfForIn",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ForIn && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfWith",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.With && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfFinally",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Finally && this.asts[this.top - 1].body == this.asts[this.top - 0];
                }
            },
            {
                key: "isCaseOfSwitch",
                value: function() {
                    return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1];
                }
            },
            {
                key: "isDefaultCaseOfSwitch",
                value: function() {
                    return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1] && this.asts[this.top - 2].defaultCase == this.asts[this.top - 0];
                }
            },
            {
                key: "isListOfObjectLit",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfObjectLit",
                value: function() {
                    return this.isListOfObjectLit();
                }
            },
            {
                key: "isEmptyListOfObjectLit",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0] && 0 == this.asts[this.top - 0].members.length;
                }
            },
            {
                key: "isMemberOfObjectLit",
                value: function() {
                    return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 2].operand == this.asts[this.top - 1];
                }
            },
            {
                key: "isNameOfMemberOfObjectLit",
                value: function() {
                    return this.count() >= 4 && this.asts[this.top - 3].nodeType === TypeScript.NodeType.ObjectLit && this.asts[this.top - 2].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Name && this.asts[this.top - 3].operand == this.asts[this.top - 2];
                }
            },
            {
                key: "isListOfArrayLit",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.ArrayLit && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
                }
            },
            {
                key: "isTargetOfMember",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 1].operand1 === this.asts[this.top - 0];
                }
            },
            {
                key: "isMemberOfMember",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Member && this.asts[this.top - 1].operand2 === this.asts[this.top - 0];
                }
            },
            {
                key: "isItemOfList",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List;
                }
            },
            {
                key: "isThenOfIf",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.If && this.asts[this.top - 1].thenBod == this.asts[this.top - 0];
                }
            },
            {
                key: "isElseOfIf",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.If && this.asts[this.top - 1].elseBod == this.asts[this.top - 0];
                }
            },
            {
                key: "isBodyOfDefaultCase",
                value: function() {
                    return this.isBodyOfCase();
                }
            },
            {
                key: "isSingleStatementList",
                value: function() {
                    return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript.NodeType.List && 1 === this.asts[this.top].members.length;
                }
            },
            {
                key: "isArgumentListOfFunction",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
                }
            },
            {
                key: "isArgumentOfFunction",
                value: function() {
                    return this.count() >= 3 && this.asts[this.top - 1].nodeType === TypeScript.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript.NodeType.FuncDecl && this.asts[this.top - 2].arguments === this.asts[this.top - 1];
                }
            },
            {
                key: "isArgumentListOfCall",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.Call && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
                }
            },
            {
                key: "isArgumentListOfNew",
                value: function() {
                    return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript.NodeType.New && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
                }
            },
            {
                key: "isSynthesizedBlock",
                value: function() {
                    return this.count() >= 1 && this.asts[this.top - 0].nodeType === TypeScript.NodeType.Block && !1 === this.asts[this.top - 0].isStatementBlock;
                }
            }
        ], staticProps = [
            {
                key: "reverseIndexOf",
                value: function(items, index) {
                    return null === items || items.length <= index ? null : items[items.length - index - 1];
                }
            }
        ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), AstPath;
    }();
    TypeScript1.AstPath = AstPath, TypeScript1.isValidAstNode = isValidAstNode;
    var GetAstPathOptions1, AstPathContext = function AstPathContext() {
        "use strict";
        _classCallCheck(this, AstPathContext), this.path = new TypeScript.AstPath();
    };
    TypeScript1.AstPathContext = AstPathContext, (GetAstPathOptions1 = GetAstPathOptions || (GetAstPathOptions = {
    }))[GetAstPathOptions1.Default = 0] = "Default", GetAstPathOptions1[GetAstPathOptions1.EdgeInclusive = 1] = "EdgeInclusive", GetAstPathOptions1[GetAstPathOptions1.DontPruneSearchBasedOnPosition = 2] = "DontPruneSearchBasedOnPosition", TypeScript1.getAstPathToPosition = getAstPathToPosition, TypeScript1.getTokenizationOffset = getTokenizationOffset, TypeScript1.walkAST = walkAST, TypeScript1.GetAstPathOptions = GetAstPathOptions;
}(TypeScript || (TypeScript = {
}));
