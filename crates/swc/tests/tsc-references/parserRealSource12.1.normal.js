//// [parserRealSource12.ts]
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(TypeScript) {
    var AstWalkOptions = /*#__PURE__*/ function() {
        "use strict";
        function AstWalkOptions() {
            _class_call_check(this, AstWalkOptions);
            this.goChildren = true;
            this.goNextSibling = true;
            this.reverseSiblings = false // visit siblings in reverse execution order
            ;
        }
        var _proto = AstWalkOptions.prototype;
        _proto.stopWalk = function stopWalk() {
            var stop = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
            this.goChildren = !stop;
            this.goNextSibling = !stop;
        };
        return AstWalkOptions;
    }();
    TypeScript.AstWalkOptions = AstWalkOptions;
    var AstWalker = /*#__PURE__*/ function() {
        "use strict";
        function AstWalker(childrenWalkers, pre, post, options, state) {
            _class_call_check(this, AstWalker);
            this.childrenWalkers = childrenWalkers;
            this.pre = pre;
            this.post = post;
            this.options = options;
            this.state = state;
        }
        var _proto = AstWalker.prototype;
        _proto.walk = function walk(ast, parent) {
            var preAst = this.pre(ast, parent, this);
            if (preAst === undefined) {
                preAst = ast;
            }
            if (this.options.goChildren) {
                var svGoSib = this.options.goNextSibling;
                this.options.goNextSibling = true;
                // Call the "walkChildren" function corresponding to "nodeType".
                this.childrenWalkers[ast.nodeType](ast, parent, this);
                this.options.goNextSibling = svGoSib;
            } else {
                // no go only applies to children of node issuing it
                this.options.goChildren = true;
            }
            if (this.post) {
                var postAst = this.post(preAst, parent, this);
                if (postAst === undefined) {
                    postAst = preAst;
                }
                return postAst;
            } else {
                return preAst;
            }
        };
        return AstWalker;
    }();
    var AstWalkerFactory = /*#__PURE__*/ function() {
        "use strict";
        function AstWalkerFactory() {
            _class_call_check(this, AstWalkerFactory);
            this.childrenWalkers = [];
            this.initChildrenWalkers();
        }
        var _proto = AstWalkerFactory.prototype;
        _proto.walk = function walk(ast, pre, post, options, state) {
            return this.getWalker(pre, post, options, state).walk(ast, null);
        };
        _proto.getWalker = function getWalker(pre, post, options, state) {
            return this.getSlowWalker(pre, post, options, state);
        };
        _proto.getSlowWalker = function getSlowWalker(pre, post, options, state) {
            if (!options) {
                options = new AstWalkOptions();
            }
            return new AstWalker(this.childrenWalkers, pre, post, options, state);
        };
        _proto.initChildrenWalkers = function initChildrenWalkers() {
            this.childrenWalkers[NodeType.None] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Empty] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.EmptyExpr] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.True] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.False] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.This] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Super] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.QString] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Regex] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Null] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.ArrayLit] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.ObjectLit] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.Void] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.Comma] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Pos] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.Neg] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.Delete] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.Await] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.In] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Dot] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.From] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Is] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.InstOf] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Typeof] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.NumberLit] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Name] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.TypeRef] = ChildrenWalkers.walkTypeReferenceChildren;
            this.childrenWalkers[NodeType.Index] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Call] = ChildrenWalkers.walkCallExpressionChildren;
            this.childrenWalkers[NodeType.New] = ChildrenWalkers.walkCallExpressionChildren;
            this.childrenWalkers[NodeType.Asg] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgAdd] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgSub] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgDiv] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgMul] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgMod] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgAnd] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgXor] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgOr] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgLsh] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgRsh] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.AsgRs2] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.ConditionalExpression] = ChildrenWalkers.walkTrinaryExpressionChildren;
            this.childrenWalkers[NodeType.LogOr] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.LogAnd] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Or] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Xor] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.And] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Eq] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Ne] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Eqv] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.NEqv] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Lt] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Le] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Gt] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Ge] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Add] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Sub] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Mul] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Div] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Mod] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Lsh] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Rsh] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Rs2] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.Not] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.LogNot] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.IncPre] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.DecPre] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.IncPost] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.DecPost] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.TypeAssertion] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.FuncDecl] = ChildrenWalkers.walkFuncDeclChildren;
            this.childrenWalkers[NodeType.Member] = ChildrenWalkers.walkBinaryExpressionChildren;
            this.childrenWalkers[NodeType.VarDecl] = ChildrenWalkers.walkBoundDeclChildren;
            this.childrenWalkers[NodeType.ArgDecl] = ChildrenWalkers.walkBoundDeclChildren;
            this.childrenWalkers[NodeType.Return] = ChildrenWalkers.walkReturnStatementChildren;
            this.childrenWalkers[NodeType.Break] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Continue] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Throw] = ChildrenWalkers.walkUnaryExpressionChildren;
            this.childrenWalkers[NodeType.For] = ChildrenWalkers.walkForStatementChildren;
            this.childrenWalkers[NodeType.ForIn] = ChildrenWalkers.walkForInStatementChildren;
            this.childrenWalkers[NodeType.If] = ChildrenWalkers.walkIfStatementChildren;
            this.childrenWalkers[NodeType.While] = ChildrenWalkers.walkWhileStatementChildren;
            this.childrenWalkers[NodeType.DoWhile] = ChildrenWalkers.walkDoWhileStatementChildren;
            this.childrenWalkers[NodeType.Block] = ChildrenWalkers.walkBlockChildren;
            this.childrenWalkers[NodeType.Case] = ChildrenWalkers.walkCaseStatementChildren;
            this.childrenWalkers[NodeType.Switch] = ChildrenWalkers.walkSwitchStatementChildren;
            this.childrenWalkers[NodeType.Try] = ChildrenWalkers.walkTryChildren;
            this.childrenWalkers[NodeType.TryCatch] = ChildrenWalkers.walkTryCatchChildren;
            this.childrenWalkers[NodeType.TryFinally] = ChildrenWalkers.walkTryFinallyChildren;
            this.childrenWalkers[NodeType.Finally] = ChildrenWalkers.walkFinallyChildren;
            this.childrenWalkers[NodeType.Catch] = ChildrenWalkers.walkCatchChildren;
            this.childrenWalkers[NodeType.List] = ChildrenWalkers.walkListChildren;
            this.childrenWalkers[NodeType.Script] = ChildrenWalkers.walkScriptChildren;
            this.childrenWalkers[NodeType.ClassDeclaration] = ChildrenWalkers.walkClassDeclChildren;
            this.childrenWalkers[NodeType.InterfaceDeclaration] = ChildrenWalkers.walkTypeDeclChildren;
            this.childrenWalkers[NodeType.ModuleDeclaration] = ChildrenWalkers.walkModuleDeclChildren;
            this.childrenWalkers[NodeType.ImportDeclaration] = ChildrenWalkers.walkImportDeclChildren;
            this.childrenWalkers[NodeType.With] = ChildrenWalkers.walkWithStatementChildren;
            this.childrenWalkers[NodeType.Label] = ChildrenWalkers.walkLabelChildren;
            this.childrenWalkers[NodeType.LabeledStatement] = ChildrenWalkers.walkLabeledStatementChildren;
            this.childrenWalkers[NodeType.EBStart] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.GotoEB] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.EndCode] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Error] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Comment] = ChildrenWalkers.walkNone;
            this.childrenWalkers[NodeType.Debugger] = ChildrenWalkers.walkNone;
            // Verify the code is up to date with the enum
            for(var e in NodeType._map){
                if (this.childrenWalkers[e] === undefined) {
                    throw new Error("initWalkers function is not up to date with enum content!");
                }
            }
        };
        return AstWalkerFactory;
    }();
    TypeScript.AstWalkerFactory = AstWalkerFactory;
    var globalAstWalkerFactory;
    function getAstWalkerFactory() {
        if (!globalAstWalkerFactory) {
            globalAstWalkerFactory = new AstWalkerFactory();
        }
        return globalAstWalkerFactory;
    }
    TypeScript.getAstWalkerFactory = getAstWalkerFactory;
    (function(ChildrenWalkers) {
        function walkNone(preAst, parent, walker) {
        // Nothing to do
        }
        ChildrenWalkers.walkNone = walkNone;
        function walkListChildren(preAst, parent, walker) {
            var len = preAst.members.length;
            if (walker.options.reverseSiblings) {
                for(var i = len - 1; i >= 0; i--){
                    if (walker.options.goNextSibling) {
                        preAst.members[i] = walker.walk(preAst.members[i], preAst);
                    }
                }
            } else {
                for(var i = 0; i < len; i++){
                    if (walker.options.goNextSibling) {
                        preAst.members[i] = walker.walk(preAst.members[i], preAst);
                    }
                }
            }
        }
        ChildrenWalkers.walkListChildren = walkListChildren;
        function walkUnaryExpressionChildren(preAst, parent, walker) {
            if (preAst.castTerm) {
                preAst.castTerm = walker.walk(preAst.castTerm, preAst);
            }
            if (preAst.operand) {
                preAst.operand = walker.walk(preAst.operand, preAst);
            }
        }
        ChildrenWalkers.walkUnaryExpressionChildren = walkUnaryExpressionChildren;
        function walkBinaryExpressionChildren(preAst, parent, walker) {
            if (walker.options.reverseSiblings) {
                if (preAst.operand2) {
                    preAst.operand2 = walker.walk(preAst.operand2, preAst);
                }
                if (preAst.operand1 && walker.options.goNextSibling) {
                    preAst.operand1 = walker.walk(preAst.operand1, preAst);
                }
            } else {
                if (preAst.operand1) {
                    preAst.operand1 = walker.walk(preAst.operand1, preAst);
                }
                if (preAst.operand2 && walker.options.goNextSibling) {
                    preAst.operand2 = walker.walk(preAst.operand2, preAst);
                }
            }
        }
        ChildrenWalkers.walkBinaryExpressionChildren = walkBinaryExpressionChildren;
        function walkTypeReferenceChildren(preAst, parent, walker) {
            if (preAst.term) {
                preAst.term = walker.walk(preAst.term, preAst);
            }
        }
        ChildrenWalkers.walkTypeReferenceChildren = walkTypeReferenceChildren;
        function walkCallExpressionChildren(preAst, parent, walker) {
            if (!walker.options.reverseSiblings) {
                preAst.target = walker.walk(preAst.target, preAst);
            }
            if (preAst.arguments && walker.options.goNextSibling) {
                preAst.arguments = walker.walk(preAst.arguments, preAst);
            }
            if (walker.options.reverseSiblings && walker.options.goNextSibling) {
                preAst.target = walker.walk(preAst.target, preAst);
            }
        }
        ChildrenWalkers.walkCallExpressionChildren = walkCallExpressionChildren;
        function walkTrinaryExpressionChildren(preAst, parent, walker) {
            if (preAst.operand1) {
                preAst.operand1 = walker.walk(preAst.operand1, preAst);
            }
            if (preAst.operand2 && walker.options.goNextSibling) {
                preAst.operand2 = walker.walk(preAst.operand2, preAst);
            }
            if (preAst.operand3 && walker.options.goNextSibling) {
                preAst.operand3 = walker.walk(preAst.operand3, preAst);
            }
        }
        ChildrenWalkers.walkTrinaryExpressionChildren = walkTrinaryExpressionChildren;
        function walkFuncDeclChildren(preAst, parent, walker) {
            if (preAst.name) {
                preAst.name = walker.walk(preAst.name, preAst);
            }
            if (preAst.arguments && preAst.arguments.members.length > 0 && walker.options.goNextSibling) {
                preAst.arguments = walker.walk(preAst.arguments, preAst);
            }
            if (preAst.returnTypeAnnotation && walker.options.goNextSibling) {
                preAst.returnTypeAnnotation = walker.walk(preAst.returnTypeAnnotation, preAst);
            }
            if (preAst.bod && preAst.bod.members.length > 0 && walker.options.goNextSibling) {
                preAst.bod = walker.walk(preAst.bod, preAst);
            }
        }
        ChildrenWalkers.walkFuncDeclChildren = walkFuncDeclChildren;
        function walkBoundDeclChildren(preAst, parent, walker) {
            if (preAst.id) {
                preAst.id = walker.walk(preAst.id, preAst);
            }
            if (preAst.init) {
                preAst.init = walker.walk(preAst.init, preAst);
            }
            if (preAst.typeExpr && walker.options.goNextSibling) {
                preAst.typeExpr = walker.walk(preAst.typeExpr, preAst);
            }
        }
        ChildrenWalkers.walkBoundDeclChildren = walkBoundDeclChildren;
        function walkReturnStatementChildren(preAst, parent, walker) {
            if (preAst.returnExpression) {
                preAst.returnExpression = walker.walk(preAst.returnExpression, preAst);
            }
        }
        ChildrenWalkers.walkReturnStatementChildren = walkReturnStatementChildren;
        function walkForStatementChildren(preAst, parent, walker) {
            if (preAst.init) {
                preAst.init = walker.walk(preAst.init, preAst);
            }
            if (preAst.cond && walker.options.goNextSibling) {
                preAst.cond = walker.walk(preAst.cond, preAst);
            }
            if (preAst.incr && walker.options.goNextSibling) {
                preAst.incr = walker.walk(preAst.incr, preAst);
            }
            if (preAst.body && walker.options.goNextSibling) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkForStatementChildren = walkForStatementChildren;
        function walkForInStatementChildren(preAst, parent, walker) {
            preAst.lval = walker.walk(preAst.lval, preAst);
            if (walker.options.goNextSibling) {
                preAst.obj = walker.walk(preAst.obj, preAst);
            }
            if (preAst.body && walker.options.goNextSibling) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkForInStatementChildren = walkForInStatementChildren;
        function walkIfStatementChildren(preAst, parent, walker) {
            preAst.cond = walker.walk(preAst.cond, preAst);
            if (preAst.thenBod && walker.options.goNextSibling) {
                preAst.thenBod = walker.walk(preAst.thenBod, preAst);
            }
            if (preAst.elseBod && walker.options.goNextSibling) {
                preAst.elseBod = walker.walk(preAst.elseBod, preAst);
            }
        }
        ChildrenWalkers.walkIfStatementChildren = walkIfStatementChildren;
        function walkWhileStatementChildren(preAst, parent, walker) {
            preAst.cond = walker.walk(preAst.cond, preAst);
            if (preAst.body && walker.options.goNextSibling) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkWhileStatementChildren = walkWhileStatementChildren;
        function walkDoWhileStatementChildren(preAst, parent, walker) {
            preAst.cond = walker.walk(preAst.cond, preAst);
            if (preAst.body && walker.options.goNextSibling) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkDoWhileStatementChildren = walkDoWhileStatementChildren;
        function walkBlockChildren(preAst, parent, walker) {
            if (preAst.statements) {
                preAst.statements = walker.walk(preAst.statements, preAst);
            }
        }
        ChildrenWalkers.walkBlockChildren = walkBlockChildren;
        function walkCaseStatementChildren(preAst, parent, walker) {
            if (preAst.expr) {
                preAst.expr = walker.walk(preAst.expr, preAst);
            }
            if (preAst.body && walker.options.goNextSibling) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkCaseStatementChildren = walkCaseStatementChildren;
        function walkSwitchStatementChildren(preAst, parent, walker) {
            if (preAst.val) {
                preAst.val = walker.walk(preAst.val, preAst);
            }
            if (preAst.caseList && walker.options.goNextSibling) {
                preAst.caseList = walker.walk(preAst.caseList, preAst);
            }
        }
        ChildrenWalkers.walkSwitchStatementChildren = walkSwitchStatementChildren;
        function walkTryChildren(preAst, parent, walker) {
            if (preAst.body) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkTryChildren = walkTryChildren;
        function walkTryCatchChildren(preAst, parent, walker) {
            if (preAst.tryNode) {
                preAst.tryNode = walker.walk(preAst.tryNode, preAst);
            }
            if (preAst.catchNode && walker.options.goNextSibling) {
                preAst.catchNode = walker.walk(preAst.catchNode, preAst);
            }
        }
        ChildrenWalkers.walkTryCatchChildren = walkTryCatchChildren;
        function walkTryFinallyChildren(preAst, parent, walker) {
            if (preAst.tryNode) {
                preAst.tryNode = walker.walk(preAst.tryNode, preAst);
            }
            if (preAst.finallyNode && walker.options.goNextSibling) {
                preAst.finallyNode = walker.walk(preAst.finallyNode, preAst);
            }
        }
        ChildrenWalkers.walkTryFinallyChildren = walkTryFinallyChildren;
        function walkFinallyChildren(preAst, parent, walker) {
            if (preAst.body) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkFinallyChildren = walkFinallyChildren;
        function walkCatchChildren(preAst, parent, walker) {
            if (preAst.param) {
                preAst.param = walker.walk(preAst.param, preAst);
            }
            if (preAst.body && walker.options.goNextSibling) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkCatchChildren = walkCatchChildren;
        function walkRecordChildren(preAst, parent, walker) {
            preAst.name = walker.walk(preAst.name, preAst);
            if (walker.options.goNextSibling && preAst.members) {
                preAst.members = walker.walk(preAst.members, preAst);
            }
        }
        ChildrenWalkers.walkRecordChildren = walkRecordChildren;
        function walkNamedTypeChildren(preAst, parent, walker) {
            walkRecordChildren(preAst, parent, walker);
        }
        ChildrenWalkers.walkNamedTypeChildren = walkNamedTypeChildren;
        function walkClassDeclChildren(preAst, parent, walker) {
            walkNamedTypeChildren(preAst, parent, walker);
            if (walker.options.goNextSibling && preAst.extendsList) {
                preAst.extendsList = walker.walk(preAst.extendsList, preAst);
            }
            if (walker.options.goNextSibling && preAst.implementsList) {
                preAst.implementsList = walker.walk(preAst.implementsList, preAst);
            }
        }
        ChildrenWalkers.walkClassDeclChildren = walkClassDeclChildren;
        function walkScriptChildren(preAst, parent, walker) {
            if (preAst.bod) {
                preAst.bod = walker.walk(preAst.bod, preAst);
            }
        }
        ChildrenWalkers.walkScriptChildren = walkScriptChildren;
        function walkTypeDeclChildren(preAst, parent, walker) {
            walkNamedTypeChildren(preAst, parent, walker);
            // walked arguments as part of members
            if (walker.options.goNextSibling && preAst.extendsList) {
                preAst.extendsList = walker.walk(preAst.extendsList, preAst);
            }
            if (walker.options.goNextSibling && preAst.implementsList) {
                preAst.implementsList = walker.walk(preAst.implementsList, preAst);
            }
        }
        ChildrenWalkers.walkTypeDeclChildren = walkTypeDeclChildren;
        function walkModuleDeclChildren(preAst, parent, walker) {
            walkRecordChildren(preAst, parent, walker);
        }
        ChildrenWalkers.walkModuleDeclChildren = walkModuleDeclChildren;
        function walkImportDeclChildren(preAst, parent, walker) {
            if (preAst.id) {
                preAst.id = walker.walk(preAst.id, preAst);
            }
            if (preAst.alias) {
                preAst.alias = walker.walk(preAst.alias, preAst);
            }
        }
        ChildrenWalkers.walkImportDeclChildren = walkImportDeclChildren;
        function walkWithStatementChildren(preAst, parent, walker) {
            if (preAst.expr) {
                preAst.expr = walker.walk(preAst.expr, preAst);
            }
            if (preAst.body && walker.options.goNextSibling) {
                preAst.body = walker.walk(preAst.body, preAst);
            }
        }
        ChildrenWalkers.walkWithStatementChildren = walkWithStatementChildren;
        function walkLabelChildren(preAst, parent, walker) {
        //TODO: Walk "id"?
        }
        ChildrenWalkers.walkLabelChildren = walkLabelChildren;
        function walkLabeledStatementChildren(preAst, parent, walker) {
            preAst.labels = walker.walk(preAst.labels, preAst);
            if (walker.options.goNextSibling) {
                preAst.stmt = walker.walk(preAst.stmt, preAst);
            }
        }
        ChildrenWalkers.walkLabeledStatementChildren = walkLabeledStatementChildren;
    })(ChildrenWalkers || (ChildrenWalkers = {}));
    var ChildrenWalkers;
})(TypeScript || (TypeScript = {}));
var TypeScript;
