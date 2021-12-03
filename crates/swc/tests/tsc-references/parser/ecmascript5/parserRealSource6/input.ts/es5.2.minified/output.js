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
    var preFindMemberScope = function(ast, parent, walker) {
        var memScope = walker.state;
        return hasFlag(ast.flags, memScope.matchFlag) && (memScope.pos < 0 || memScope.pos == ast.limChar) && (memScope.ast = ast, null == ast.type && memScope.pos >= 0 && memScope.flow.inScopeTypeCheck(ast, memScope.scope), memScope.type = ast.type, memScope.options.stopWalk()), ast;
    }, preFindEnclosingScope = function(ast, parent, walker) {
        var context = walker.state, minChar = ast.minChar, limChar = ast.limChar;
        if (ast.nodeType == NodeType.Script && context.pos > limChar && (limChar = context.pos), minChar <= context.pos && limChar >= context.pos) {
            switch(ast.nodeType){
                case NodeType.Script:
                    var script = ast;
                    context.scopeGetter = function() {
                        return null === script.bod ? null : script.bod.enclosingScope;
                    }, context.scopeStartAST = script;
                    break;
                case NodeType.ClassDeclaration:
                    context.scopeGetter = function() {
                        return null === ast.type || null === ast.type.instanceType.containedScope ? null : ast.type.instanceType.containedScope;
                    }, context.scopeStartAST = ast, context.enclosingClassDecl = ast;
                    break;
                case NodeType.ObjectLit:
                    var objectLit = ast;
                    objectLit.targetType && (context.scopeGetter = function() {
                        return objectLit.targetType.containedScope;
                    }, context.objectLiteralScopeGetter = function() {
                        return objectLit.targetType.memberScope;
                    }, context.enclosingObjectLit = objectLit);
                    break;
                case NodeType.ModuleDeclaration:
                    context.deepestModuleDecl = ast, context.scopeGetter = function() {
                        return null === ast.type ? null : ast.type.containedScope;
                    }, context.scopeStartAST = ast;
                    break;
                case NodeType.InterfaceDeclaration:
                    context.scopeGetter = function() {
                        return null === ast.type ? null : ast.type.containedScope;
                    }, context.scopeStartAST = ast;
                    break;
                case NodeType.FuncDecl:
                    var funcDecl = ast;
                    context.skipNextFuncDeclForClass ? context.skipNextFuncDeclForClass = !1 : (context.scopeGetter = function() {
                        return funcDecl.isConstructor && hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod) && ast.type && ast.type.enclosingType ? ast.type.enclosingType.constructorScope : funcDecl.scopeType ? funcDecl.scopeType.containedScope : funcDecl.type ? funcDecl.type.containedScope : null;
                    }, context.scopeStartAST = ast);
                    break;
            }
            walker.options.goChildren = !0;
        } else walker.options.goChildren = !1;
        return ast;
    }, findEnclosingScopeAt = function(logger, script, text, pos, isMemberCompletion) {
        var context = new EnclosingScopeContext(logger, script, text, pos, isMemberCompletion);
        return (TypeScript.getAstWalkerFactory().walk(script, preFindEnclosingScope, null, null, context), null === context.scopeStartAST) ? null : context;
    }, TypeCollectionContext = function(scopeChain, checker) {
        "use strict";
        _classCallCheck(this, TypeCollectionContext), this.scopeChain = scopeChain, this.checker = checker, this.script = null;
    };
    TypeScript1.TypeCollectionContext = TypeCollectionContext;
    var MemberScopeContext = function(flow, pos, matchFlag) {
        "use strict";
        _classCallCheck(this, MemberScopeContext), this.flow = flow, this.pos = pos, this.matchFlag = matchFlag, this.type = null, this.ast = null, this.options = new AstWalkOptions();
    };
    TypeScript1.MemberScopeContext = MemberScopeContext;
    var EnclosingScopeContext = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function EnclosingScopeContext(logger, script, text, pos, isMemberCompletion) {
            _classCallCheck(this, EnclosingScopeContext), this.logger = logger, this.script = script, this.text = text, this.pos = pos, this.isMemberCompletion = isMemberCompletion, this.scopeGetter = null, this.objectLiteralScopeGetter = null, this.scopeStartAST = null, this.skipNextFuncDeclForClass = !1, this.deepestModuleDecl = null, this.enclosingClassDecl = null, this.enclosingObjectLit = null, this.publicsOnly = !0, this.useFullAst = !1;
        }
        return Constructor = EnclosingScopeContext, protoProps = [
            {
                key: "getScope",
                value: function() {
                    return this.scopeGetter();
                }
            },
            {
                key: "getObjectLiteralScope",
                value: function() {
                    return this.objectLiteralScopeGetter();
                }
            },
            {
                key: "getScopeAST",
                value: function() {
                    return this.scopeStartAST;
                }
            },
            {
                key: "getScopePosition",
                value: function() {
                    return this.scopeStartAST.minChar;
                }
            },
            {
                key: "getScriptFragmentStartAST",
                value: function() {
                    return this.scopeStartAST;
                }
            },
            {
                key: "getScriptFragmentPosition",
                value: function() {
                    return this.getScriptFragmentStartAST().minChar;
                }
            },
            {
                key: "getScriptFragment",
                value: function() {
                    if (null == this.scriptFragment) {
                        var ast = this.getScriptFragmentStartAST(), minChar = ast.minChar, limChar = this.isMemberCompletion ? this.pos : this.pos + 1;
                        this.scriptFragment = TypeScript.quickParse(this.logger, ast, this.text, minChar, limChar, null).Script;
                    }
                    return this.scriptFragment;
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), EnclosingScopeContext;
    }();
    TypeScript1.EnclosingScopeContext = EnclosingScopeContext, TypeScript1.preFindMemberScope = preFindMemberScope, TypeScript1.pushTypeCollectionScope = function(container, valueMembers, ambientValueMembers, enclosedTypes, ambientEnclosedTypes, context, thisType, classType, moduleDecl) {
        var builder = new SymbolScopeBuilder(valueMembers, ambientValueMembers, enclosedTypes, ambientEnclosedTypes, null, container), chain = new ScopeChain(container, context.scopeChain, builder);
        chain.thisType = thisType, chain.classType = classType, chain.moduleDecl = moduleDecl, context.scopeChain = chain;
    }, TypeScript1.popTypeCollectionScope = function(context) {
        context.scopeChain = context.scopeChain.previous;
    }, TypeScript1.preFindEnclosingScope = preFindEnclosingScope, TypeScript1.findEnclosingScopeAt = findEnclosingScopeAt;
}(TypeScript || (TypeScript = {
}));
