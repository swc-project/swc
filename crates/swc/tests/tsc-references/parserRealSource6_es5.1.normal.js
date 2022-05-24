import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
var TypeScript;
(function(TypeScript1) {
    var preFindMemberScope = function preFindMemberScope(ast, parent, walker) {
        var memScope = walker.state;
        if (hasFlag(ast.flags, memScope.matchFlag) && (memScope.pos < 0 || memScope.pos == ast.limChar)) {
            memScope.ast = ast;
            if (ast.type == null && memScope.pos >= 0) {
                memScope.flow.inScopeTypeCheck(ast, memScope.scope);
            }
            memScope.type = ast.type;
            memScope.options.stopWalk();
        }
        return ast;
    };
    var pushTypeCollectionScope = function pushTypeCollectionScope(container, valueMembers, ambientValueMembers, enclosedTypes, ambientEnclosedTypes, context, thisType, classType, moduleDecl) {
        var builder = new SymbolScopeBuilder(valueMembers, ambientValueMembers, enclosedTypes, ambientEnclosedTypes, null, container);
        var chain = new ScopeChain(container, context.scopeChain, builder);
        chain.thisType = thisType;
        chain.classType = classType;
        chain.moduleDecl = moduleDecl;
        context.scopeChain = chain;
    };
    var popTypeCollectionScope = function popTypeCollectionScope(context) {
        context.scopeChain = context.scopeChain.previous;
    };
    var preFindEnclosingScope = function preFindEnclosingScope(ast, parent, walker) {
        var context = walker.state;
        var minChar = ast.minChar;
        var limChar = ast.limChar;
        // Account for the fact completion list may be called at the end of a file which
        // is has not been fully re-parsed yet.
        if (ast.nodeType == NodeType.Script && context.pos > limChar) limChar = context.pos;
        if (minChar <= context.pos && limChar >= context.pos) {
            switch(ast.nodeType){
                case NodeType.Script:
                    var script = ast;
                    context.scopeGetter = function() {
                        return script.bod === null ? null : script.bod.enclosingScope;
                    };
                    context.scopeStartAST = script;
                    break;
                case NodeType.ClassDeclaration:
                    context.scopeGetter = function() {
                        return ast.type === null || ast.type.instanceType.containedScope === null ? null : ast.type.instanceType.containedScope;
                    };
                    context.scopeStartAST = ast;
                    context.enclosingClassDecl = ast;
                    break;
                case NodeType.ObjectLit:
                    var objectLit = ast;
                    // Only consider target-typed object literals
                    if (objectLit.targetType) {
                        context.scopeGetter = function() {
                            return objectLit.targetType.containedScope;
                        };
                        context.objectLiteralScopeGetter = function() {
                            return objectLit.targetType.memberScope;
                        };
                        context.enclosingObjectLit = objectLit;
                    }
                    break;
                case NodeType.ModuleDeclaration:
                    context.deepestModuleDecl = ast;
                    context.scopeGetter = function() {
                        return ast.type === null ? null : ast.type.containedScope;
                    };
                    context.scopeStartAST = ast;
                    break;
                case NodeType.InterfaceDeclaration:
                    context.scopeGetter = function() {
                        return ast.type === null ? null : ast.type.containedScope;
                    };
                    context.scopeStartAST = ast;
                    break;
                case NodeType.FuncDecl:
                    {
                        var funcDecl = ast;
                        if (context.skipNextFuncDeclForClass) {
                            context.skipNextFuncDeclForClass = false;
                        } else {
                            context.scopeGetter = function() {
                                // The scope of a class constructor is hidden somewhere we don't expect :-S
                                if (funcDecl.isConstructor && hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod)) {
                                    if (ast.type && ast.type.enclosingType) {
                                        return ast.type.enclosingType.constructorScope;
                                    }
                                }
                                if (funcDecl.scopeType) {
                                    return funcDecl.scopeType.containedScope;
                                }
                                if (funcDecl.type) {
                                    return funcDecl.type.containedScope;
                                }
                                return null;
                            };
                            context.scopeStartAST = ast;
                        }
                    }
                    break;
            }
            walker.options.goChildren = true;
        } else {
            walker.options.goChildren = false;
        }
        return ast;
    };
    var findEnclosingScopeAt = function findEnclosingScopeAt(logger, script, text, pos, isMemberCompletion) {
        var context = new EnclosingScopeContext(logger, script, text, pos, isMemberCompletion);
        TypeScript.getAstWalkerFactory().walk(script, preFindEnclosingScope, null, null, context);
        if (context.scopeStartAST === null) return null;
        return context;
    };
    var TypeCollectionContext = function TypeCollectionContext(scopeChain, checker) {
        "use strict";
        _class_call_check(this, TypeCollectionContext);
        this.scopeChain = scopeChain;
        this.checker = checker;
        this.script = null;
    };
    TypeScript1.TypeCollectionContext = TypeCollectionContext;
    var MemberScopeContext = function MemberScopeContext(flow, pos, matchFlag) {
        "use strict";
        _class_call_check(this, MemberScopeContext);
        this.flow = flow;
        this.pos = pos;
        this.matchFlag = matchFlag;
        this.type = null;
        this.ast = null;
        this.options = new AstWalkOptions();
    };
    TypeScript1.MemberScopeContext = MemberScopeContext;
    var EnclosingScopeContext = /*#__PURE__*/ function() {
        "use strict";
        function EnclosingScopeContext(logger, script, text, pos, isMemberCompletion) {
            _class_call_check(this, EnclosingScopeContext);
            this.logger = logger;
            this.script = script;
            this.text = text;
            this.pos = pos;
            this.isMemberCompletion = isMemberCompletion;
            this.scopeGetter = null;
            this.objectLiteralScopeGetter = null;
            this.scopeStartAST = null;
            this.skipNextFuncDeclForClass = false;
            this.deepestModuleDecl = null;
            this.enclosingClassDecl = null;
            this.enclosingObjectLit = null;
            this.publicsOnly = true;
            this.useFullAst = false;
        }
        var _proto = EnclosingScopeContext.prototype;
        _proto.getScope = function getScope() {
            return this.scopeGetter();
        };
        _proto.getObjectLiteralScope = function getObjectLiteralScope() {
            return this.objectLiteralScopeGetter();
        };
        _proto.getScopeAST = function getScopeAST() {
            return this.scopeStartAST;
        };
        _proto.getScopePosition = function getScopePosition() {
            return this.scopeStartAST.minChar;
        };
        _proto.getScriptFragmentStartAST = function getScriptFragmentStartAST() {
            return this.scopeStartAST;
        };
        _proto.getScriptFragmentPosition = function getScriptFragmentPosition() {
            return this.getScriptFragmentStartAST().minChar;
        };
        _proto.getScriptFragment = function getScriptFragment() {
            if (this.scriptFragment == null) {
                var ast = this.getScriptFragmentStartAST();
                var minChar = ast.minChar;
                var limChar = this.isMemberCompletion ? this.pos : this.pos + 1;
                this.scriptFragment = TypeScript.quickParse(this.logger, ast, this.text, minChar, limChar, null).Script;
            }
            return this.scriptFragment;
        };
        return EnclosingScopeContext;
    }();
    TypeScript1.EnclosingScopeContext = EnclosingScopeContext;
    TypeScript1.preFindMemberScope = preFindMemberScope;
    TypeScript1.pushTypeCollectionScope = pushTypeCollectionScope;
    TypeScript1.popTypeCollectionScope = popTypeCollectionScope;
    TypeScript1.preFindEnclosingScope = preFindEnclosingScope;
    TypeScript1.findEnclosingScopeAt = findEnclosingScopeAt;
})(TypeScript || (TypeScript = {}));
