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
        _classCallCheck(this, TypeCollectionContext);
        this.scopeChain = scopeChain;
        this.checker = checker;
        this.script = null;
    };
    TypeScript1.TypeCollectionContext = TypeCollectionContext;
    var MemberScopeContext = function MemberScopeContext(flow, pos, matchFlag) {
        "use strict";
        _classCallCheck(this, MemberScopeContext);
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
            _classCallCheck(this, EnclosingScopeContext);
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
        _createClass(EnclosingScopeContext, [
            {
                key: "getScope",
                value: function getScope() {
                    return this.scopeGetter();
                }
            },
            {
                key: "getObjectLiteralScope",
                value: function getObjectLiteralScope() {
                    return this.objectLiteralScopeGetter();
                }
            },
            {
                key: "getScopeAST",
                value: function getScopeAST() {
                    return this.scopeStartAST;
                }
            },
            {
                key: "getScopePosition",
                value: function getScopePosition() {
                    return this.scopeStartAST.minChar;
                }
            },
            {
                key: "getScriptFragmentStartAST",
                value: function getScriptFragmentStartAST() {
                    return this.scopeStartAST;
                }
            },
            {
                key: "getScriptFragmentPosition",
                value: function getScriptFragmentPosition() {
                    return this.getScriptFragmentStartAST().minChar;
                }
            },
            {
                key: "getScriptFragment",
                value: function getScriptFragment() {
                    if (this.scriptFragment == null) {
                        var ast = this.getScriptFragmentStartAST();
                        var minChar = ast.minChar;
                        var limChar = this.isMemberCompletion ? this.pos : this.pos + 1;
                        this.scriptFragment = TypeScript.quickParse(this.logger, ast, this.text, minChar, limChar, null).Script;
                    }
                    return this.scriptFragment;
                }
            }
        ]);
        return EnclosingScopeContext;
    }();
    TypeScript1.EnclosingScopeContext = EnclosingScopeContext;
    TypeScript1.preFindMemberScope = preFindMemberScope;
    TypeScript1.pushTypeCollectionScope = pushTypeCollectionScope;
    TypeScript1.popTypeCollectionScope = popTypeCollectionScope;
    TypeScript1.preFindEnclosingScope = preFindEnclosingScope;
    TypeScript1.findEnclosingScopeAt = findEnclosingScopeAt;
})(TypeScript || (TypeScript = {
}));
