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
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
!function(TypeScript1) {
    var globalAstWalkerFactory, ChildrenWalkers1, AstWalkOptions = function() {
        "use strict";
        function AstWalkOptions() {
            _classCallCheck(this, AstWalkOptions), this.goChildren = !0, this.goNextSibling = !0, this.reverseSiblings = !1;
        }
        return _createClass(AstWalkOptions, [
            {
                key: "stopWalk",
                value: function() {
                    var stop = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0];
                    this.goChildren = !stop, this.goNextSibling = !stop;
                }
            }
        ]), AstWalkOptions;
    }();
    TypeScript1.AstWalkOptions = AstWalkOptions;
    var AstWalker = function() {
        "use strict";
        function AstWalker(childrenWalkers, pre, post, options, state) {
            _classCallCheck(this, AstWalker), this.childrenWalkers = childrenWalkers, this.pre = pre, this.post = post, this.options = options, this.state = state;
        }
        return _createClass(AstWalker, [
            {
                key: "walk",
                value: function(ast, parent) {
                    var preAst = this.pre(ast, parent, this);
                    if (void 0 === preAst && (preAst = ast), this.options.goChildren) {
                        var svGoSib = this.options.goNextSibling;
                        this.options.goNextSibling = !0, this.childrenWalkers[ast.nodeType](ast, parent, this), this.options.goNextSibling = svGoSib;
                    } else this.options.goChildren = !0;
                    if (!this.post) return preAst;
                    var postAst = this.post(preAst, parent, this);
                    return void 0 === postAst && (postAst = preAst), postAst;
                }
            }
        ]), AstWalker;
    }(), AstWalkerFactory = function() {
        "use strict";
        function AstWalkerFactory() {
            _classCallCheck(this, AstWalkerFactory), this.childrenWalkers = [], this.initChildrenWalkers();
        }
        return _createClass(AstWalkerFactory, [
            {
                key: "walk",
                value: function(ast, pre, post, options, state) {
                    return this.getWalker(pre, post, options, state).walk(ast, null);
                }
            },
            {
                key: "getWalker",
                value: function(pre, post, options, state) {
                    return this.getSlowWalker(pre, post, options, state);
                }
            },
            {
                key: "getSlowWalker",
                value: function(pre, post, options, state) {
                    return options || (options = new AstWalkOptions()), new AstWalker(this.childrenWalkers, pre, post, options, state);
                }
            },
            {
                key: "initChildrenWalkers",
                value: function() {
                    for(var e in this.childrenWalkers[NodeType.None] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Empty] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.EmptyExpr] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.True] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.False] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.This] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Super] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.QString] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Regex] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Null] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.ArrayLit] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.ObjectLit] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.Void] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.Comma] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Pos] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.Neg] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.Delete] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.Await] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.In] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Dot] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.From] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Is] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.InstOf] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Typeof] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.NumberLit] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Name] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.TypeRef] = ChildrenWalkers.walkTypeReferenceChildren, this.childrenWalkers[NodeType.Index] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Call] = ChildrenWalkers.walkCallExpressionChildren, this.childrenWalkers[NodeType.New] = ChildrenWalkers.walkCallExpressionChildren, this.childrenWalkers[NodeType.Asg] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgAdd] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgSub] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgDiv] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgMul] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgMod] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgAnd] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgXor] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgOr] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgLsh] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgRsh] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.AsgRs2] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.ConditionalExpression] = ChildrenWalkers.walkTrinaryExpressionChildren, this.childrenWalkers[NodeType.LogOr] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.LogAnd] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Or] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Xor] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.And] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Eq] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Ne] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Eqv] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.NEqv] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Lt] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Le] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Gt] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Ge] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Add] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Sub] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Mul] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Div] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Mod] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Lsh] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Rsh] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Rs2] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.Not] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.LogNot] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.IncPre] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.DecPre] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.IncPost] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.DecPost] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.TypeAssertion] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.FuncDecl] = ChildrenWalkers.walkFuncDeclChildren, this.childrenWalkers[NodeType.Member] = ChildrenWalkers.walkBinaryExpressionChildren, this.childrenWalkers[NodeType.VarDecl] = ChildrenWalkers.walkBoundDeclChildren, this.childrenWalkers[NodeType.ArgDecl] = ChildrenWalkers.walkBoundDeclChildren, this.childrenWalkers[NodeType.Return] = ChildrenWalkers.walkReturnStatementChildren, this.childrenWalkers[NodeType.Break] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Continue] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Throw] = ChildrenWalkers.walkUnaryExpressionChildren, this.childrenWalkers[NodeType.For] = ChildrenWalkers.walkForStatementChildren, this.childrenWalkers[NodeType.ForIn] = ChildrenWalkers.walkForInStatementChildren, this.childrenWalkers[NodeType.If] = ChildrenWalkers.walkIfStatementChildren, this.childrenWalkers[NodeType.While] = ChildrenWalkers.walkWhileStatementChildren, this.childrenWalkers[NodeType.DoWhile] = ChildrenWalkers.walkDoWhileStatementChildren, this.childrenWalkers[NodeType.Block] = ChildrenWalkers.walkBlockChildren, this.childrenWalkers[NodeType.Case] = ChildrenWalkers.walkCaseStatementChildren, this.childrenWalkers[NodeType.Switch] = ChildrenWalkers.walkSwitchStatementChildren, this.childrenWalkers[NodeType.Try] = ChildrenWalkers.walkTryChildren, this.childrenWalkers[NodeType.TryCatch] = ChildrenWalkers.walkTryCatchChildren, this.childrenWalkers[NodeType.TryFinally] = ChildrenWalkers.walkTryFinallyChildren, this.childrenWalkers[NodeType.Finally] = ChildrenWalkers.walkFinallyChildren, this.childrenWalkers[NodeType.Catch] = ChildrenWalkers.walkCatchChildren, this.childrenWalkers[NodeType.List] = ChildrenWalkers.walkListChildren, this.childrenWalkers[NodeType.Script] = ChildrenWalkers.walkScriptChildren, this.childrenWalkers[NodeType.ClassDeclaration] = ChildrenWalkers.walkClassDeclChildren, this.childrenWalkers[NodeType.InterfaceDeclaration] = ChildrenWalkers.walkTypeDeclChildren, this.childrenWalkers[NodeType.ModuleDeclaration] = ChildrenWalkers.walkModuleDeclChildren, this.childrenWalkers[NodeType.ImportDeclaration] = ChildrenWalkers.walkImportDeclChildren, this.childrenWalkers[NodeType.With] = ChildrenWalkers.walkWithStatementChildren, this.childrenWalkers[NodeType.Label] = ChildrenWalkers.walkLabelChildren, this.childrenWalkers[NodeType.LabeledStatement] = ChildrenWalkers.walkLabeledStatementChildren, this.childrenWalkers[NodeType.EBStart] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.GotoEB] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.EndCode] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Error] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Comment] = ChildrenWalkers.walkNone, this.childrenWalkers[NodeType.Debugger] = ChildrenWalkers.walkNone, NodeType._map)if (void 0 === this.childrenWalkers[e]) throw new Error("initWalkers function is not up to date with enum content!");
                }
            }
        ]), AstWalkerFactory;
    }();
    TypeScript1.AstWalkerFactory = AstWalkerFactory, TypeScript1.getAstWalkerFactory = function() {
        return globalAstWalkerFactory || (globalAstWalkerFactory = new AstWalkerFactory()), globalAstWalkerFactory;
    }, (function(ChildrenWalkers) {
        function walkRecordChildren(preAst1, parent, walker1) {
            preAst1.name = walker.walk(preAst.name, preAst), walker1.options.goNextSibling && preAst1.members && (preAst1.members = walker.walk(preAst.members, preAst));
        }
        function walkNamedTypeChildren(preAst, parent, walker) {
            walkRecordChildren(preAst, parent, walker);
        }
        ChildrenWalkers.walkNone = function(preAst, parent, walker) {
        }, ChildrenWalkers.walkListChildren = function(preAst, parent, walker) {
            var len = preAst.members.length;
            if (walker.options.reverseSiblings) for(var i = len - 1; i >= 0; i--)walker.options.goNextSibling && (preAst.members[i] = walker.walk(preAst.members[i], preAst));
            else for(var i = 0; i < len; i++)walker.options.goNextSibling && (preAst.members[i] = walker.walk(preAst.members[i], preAst));
        }, ChildrenWalkers.walkUnaryExpressionChildren = function(preAst, parent, walker) {
            preAst.castTerm && (preAst.castTerm = walker.walk(preAst.castTerm, preAst)), preAst.operand && (preAst.operand = walker.walk(preAst.operand, preAst));
        }, ChildrenWalkers.walkBinaryExpressionChildren = function(preAst, parent, walker) {
            walker.options.reverseSiblings ? (preAst.operand2 && (preAst.operand2 = walker.walk(preAst.operand2, preAst)), preAst.operand1 && walker.options.goNextSibling && (preAst.operand1 = walker.walk(preAst.operand1, preAst))) : (preAst.operand1 && (preAst.operand1 = walker.walk(preAst.operand1, preAst)), preAst.operand2 && walker.options.goNextSibling && (preAst.operand2 = walker.walk(preAst.operand2, preAst)));
        }, ChildrenWalkers.walkTypeReferenceChildren = function(preAst, parent, walker) {
            preAst.term && (preAst.term = walker.walk(preAst.term, preAst));
        }, ChildrenWalkers.walkCallExpressionChildren = function(preAst2, parent, walker2) {
            walker2.options.reverseSiblings || (preAst2.target = walker2.walk(preAst2.target, preAst2)), preAst2.arguments && walker2.options.goNextSibling && (preAst2.arguments = walker.walk(preAst.arguments, preAst)), walker2.options.reverseSiblings && walker2.options.goNextSibling && (preAst2.target = walker2.walk(preAst2.target, preAst2));
        }, ChildrenWalkers.walkTrinaryExpressionChildren = function(preAst, parent, walker) {
            preAst.operand1 && (preAst.operand1 = walker.walk(preAst.operand1, preAst)), preAst.operand2 && walker.options.goNextSibling && (preAst.operand2 = walker.walk(preAst.operand2, preAst)), preAst.operand3 && walker.options.goNextSibling && (preAst.operand3 = walker.walk(preAst.operand3, preAst));
        }, ChildrenWalkers.walkFuncDeclChildren = function(preAst3, parent, walker3) {
            preAst3.name && (preAst3.name = walker.walk(preAst.name, preAst)), preAst3.arguments && preAst3.arguments.members.length > 0 && walker3.options.goNextSibling && (preAst3.arguments = walker.walk(preAst.arguments, preAst)), preAst3.returnTypeAnnotation && walker3.options.goNextSibling && (preAst3.returnTypeAnnotation = walker3.walk(preAst3.returnTypeAnnotation, preAst3)), preAst3.bod && preAst3.bod.members.length > 0 && walker3.options.goNextSibling && (preAst3.bod = walker.walk(preAst.bod, preAst));
        }, ChildrenWalkers.walkBoundDeclChildren = function(preAst4, parent, walker4) {
            preAst4.id && (preAst4.id = walker.walk(preAst.id, preAst)), preAst4.init && (preAst4.init = walker4.walk(preAst4.init, preAst4)), preAst4.typeExpr && walker4.options.goNextSibling && (preAst4.typeExpr = walker4.walk(preAst4.typeExpr, preAst4));
        }, ChildrenWalkers.walkReturnStatementChildren = function(preAst, parent, walker) {
            preAst.returnExpression && (preAst.returnExpression = walker.walk(preAst.returnExpression, preAst));
        }, ChildrenWalkers.walkForStatementChildren = function(preAst, parent, walker) {
            preAst.init && (preAst.init = walker.walk(preAst.init, preAst)), preAst.cond && walker.options.goNextSibling && (preAst.cond = walker.walk(preAst.cond, preAst)), preAst.incr && walker.options.goNextSibling && (preAst.incr = walker.walk(preAst.incr, preAst)), preAst.body && walker.options.goNextSibling && (preAst.body = walker.walk(preAst.body, preAst));
        }, ChildrenWalkers.walkForInStatementChildren = function(preAst, parent, walker) {
            preAst.lval = walker.walk(preAst.lval, preAst), walker.options.goNextSibling && (preAst.obj = walker.walk(preAst.obj, preAst)), preAst.body && walker.options.goNextSibling && (preAst.body = walker.walk(preAst.body, preAst));
        }, ChildrenWalkers.walkIfStatementChildren = function(preAst, parent, walker) {
            preAst.cond = walker.walk(preAst.cond, preAst), preAst.thenBod && walker.options.goNextSibling && (preAst.thenBod = walker.walk(preAst.thenBod, preAst)), preAst.elseBod && walker.options.goNextSibling && (preAst.elseBod = walker.walk(preAst.elseBod, preAst));
        }, ChildrenWalkers.walkWhileStatementChildren = function(preAst, parent, walker) {
            preAst.cond = walker.walk(preAst.cond, preAst), preAst.body && walker.options.goNextSibling && (preAst.body = walker.walk(preAst.body, preAst));
        }, ChildrenWalkers.walkDoWhileStatementChildren = function(preAst, parent, walker) {
            preAst.cond = walker.walk(preAst.cond, preAst), preAst.body && walker.options.goNextSibling && (preAst.body = walker.walk(preAst.body, preAst));
        }, ChildrenWalkers.walkBlockChildren = function(preAst5, parent, walker5) {
            preAst5.statements && (preAst5.statements = walker.walk(preAst.statements, preAst));
        }, ChildrenWalkers.walkCaseStatementChildren = function(preAst6, parent, walker6) {
            preAst6.expr && (preAst6.expr = walker6.walk(preAst6.expr, preAst6)), preAst6.body && walker6.options.goNextSibling && (preAst6.body = walker.walk(preAst.body, preAst));
        }, ChildrenWalkers.walkSwitchStatementChildren = function(preAst7, parent, walker7) {
            preAst7.val && (preAst7.val = walker7.walk(preAst7.val, preAst7)), preAst7.caseList && walker7.options.goNextSibling && (preAst7.caseList = walker.walk(preAst.caseList, preAst));
        }, ChildrenWalkers.walkTryChildren = function(preAst, parent, walker) {
            preAst.body && (preAst.body = walker.walk(preAst.body, preAst));
        }, ChildrenWalkers.walkTryCatchChildren = function(preAst8, parent, walker8) {
            preAst8.tryNode && (preAst8.tryNode = walker.walk(preAst.tryNode, preAst)), preAst8.catchNode && walker8.options.goNextSibling && (preAst8.catchNode = walker.walk(preAst.catchNode, preAst));
        }, ChildrenWalkers.walkTryFinallyChildren = function(preAst9, parent, walker9) {
            preAst9.tryNode && (preAst9.tryNode = walker9.walk(preAst9.tryNode, preAst9)), preAst9.finallyNode && walker9.options.goNextSibling && (preAst9.finallyNode = walker.walk(preAst.finallyNode, preAst));
        }, ChildrenWalkers.walkFinallyChildren = function(preAst, parent, walker) {
            preAst.body && (preAst.body = walker.walk(preAst.body, preAst));
        }, ChildrenWalkers.walkCatchChildren = function(preAst10, parent, walker10) {
            preAst10.param && (preAst10.param = walker.walk(preAst.param, preAst)), preAst10.body && walker10.options.goNextSibling && (preAst10.body = walker10.walk(preAst10.body, preAst10));
        }, ChildrenWalkers.walkRecordChildren = walkRecordChildren, ChildrenWalkers.walkNamedTypeChildren = walkNamedTypeChildren, ChildrenWalkers.walkClassDeclChildren = function(preAst11, parent, walker11) {
            walkNamedTypeChildren(preAst11, parent, walker11), walker11.options.goNextSibling && preAst11.extendsList && (preAst11.extendsList = walker.walk(preAst.extendsList, preAst)), walker11.options.goNextSibling && preAst11.implementsList && (preAst11.implementsList = walker.walk(preAst.implementsList, preAst));
        }, ChildrenWalkers.walkScriptChildren = function(preAst12, parent, walker12) {
            preAst12.bod && (preAst12.bod = walker.walk(preAst.bod, preAst));
        }, ChildrenWalkers.walkTypeDeclChildren = function(preAst13, parent, walker13) {
            walkNamedTypeChildren(preAst13, parent, walker13), walker13.options.goNextSibling && preAst13.extendsList && (preAst13.extendsList = walker.walk(preAst.extendsList, preAst)), walker13.options.goNextSibling && preAst13.implementsList && (preAst13.implementsList = walker.walk(preAst.implementsList, preAst));
        }, ChildrenWalkers.walkModuleDeclChildren = function(preAst, parent, walker) {
            walkRecordChildren(preAst, parent, walker);
        }, ChildrenWalkers.walkImportDeclChildren = function(preAst14, parent, walker14) {
            preAst14.id && (preAst14.id = walker.walk(preAst.id, preAst)), preAst14.alias && (preAst14.alias = walker14.walk(preAst14.alias, preAst14));
        }, ChildrenWalkers.walkWithStatementChildren = function(preAst, parent, walker) {
            preAst.expr && (preAst.expr = walker.walk(preAst.expr, preAst)), preAst.body && walker.options.goNextSibling && (preAst.body = walker.walk(preAst.body, preAst));
        }, ChildrenWalkers.walkLabelChildren = function(preAst, parent, walker) {
        }, ChildrenWalkers.walkLabeledStatementChildren = function(preAst15, parent, walker15) {
            preAst15.labels = walker.walk(preAst.labels, preAst), walker15.options.goNextSibling && (preAst15.stmt = walker15.walk(preAst15.stmt, preAst15));
        };
    })(ChildrenWalkers1 || (ChildrenWalkers1 = {
    }));
}(TypeScript || (TypeScript = {
}));
