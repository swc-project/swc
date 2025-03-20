//// [parserRealSource6.ts]
var TypeScript;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(TypeScript) {
    TypeScript.TypeCollectionContext = function TypeCollectionContext(scopeChain, checker) {
        _class_call_check(this, TypeCollectionContext), this.scopeChain = scopeChain, this.checker = checker, this.script = null;
    }, TypeScript.MemberScopeContext = function MemberScopeContext(flow, pos, matchFlag) {
        _class_call_check(this, MemberScopeContext), this.flow = flow, this.pos = pos, this.matchFlag = matchFlag, this.type = null, this.ast = null, this.options = new AstWalkOptions();
    };
    var EnclosingScopeContext = /*#__PURE__*/ function() {
        function EnclosingScopeContext(logger, script, text, pos, isMemberCompletion) {
            _class_call_check(this, EnclosingScopeContext), this.logger = logger, this.script = script, this.text = text, this.pos = pos, this.isMemberCompletion = isMemberCompletion, this.scopeGetter = null, this.objectLiteralScopeGetter = null, this.scopeStartAST = null, this.skipNextFuncDeclForClass = !1, this.deepestModuleDecl = null, this.enclosingClassDecl = null, this.enclosingObjectLit = null, this.publicsOnly = !0, this.useFullAst = !1;
        }
        var _proto = EnclosingScopeContext.prototype;
        return _proto.getScope = function() {
            return this.scopeGetter();
        }, _proto.getObjectLiteralScope = function() {
            return this.objectLiteralScopeGetter();
        }, _proto.getScopeAST = function() {
            return this.scopeStartAST;
        }, _proto.getScopePosition = function() {
            return this.scopeStartAST.minChar;
        }, _proto.getScriptFragmentStartAST = function() {
            return this.scopeStartAST;
        }, _proto.getScriptFragmentPosition = function() {
            return this.getScriptFragmentStartAST().minChar;
        }, _proto.getScriptFragment = function() {
            if (null == this.scriptFragment) {
                var ast = this.getScriptFragmentStartAST(), minChar = ast.minChar, limChar = this.isMemberCompletion ? this.pos : this.pos + 1;
                this.scriptFragment = TypeScript.quickParse(this.logger, ast, this.text, minChar, limChar, null).Script;
            }
            return this.scriptFragment;
        }, EnclosingScopeContext;
    }();
    function preFindEnclosingScope(ast, parent, walker) {
        var context = walker.state, minChar = ast.minChar, limChar = ast.limChar;
        if (ast.nodeType == NodeType.Script && context.pos > limChar && (limChar = context.pos), minChar <= context.pos && limChar >= context.pos) {
            switch(ast.nodeType){
                case NodeType.Script:
                    context.scopeGetter = function() {
                        return null === ast.bod ? null : ast.bod.enclosingScope;
                    }, context.scopeStartAST = ast;
                    break;
                case NodeType.ClassDeclaration:
                    context.scopeGetter = function() {
                        return null === ast.type || null === ast.type.instanceType.containedScope ? null : ast.type.instanceType.containedScope;
                    }, context.scopeStartAST = ast, context.enclosingClassDecl = ast;
                    break;
                case NodeType.ObjectLit:
                    ast.targetType && (context.scopeGetter = function() {
                        return ast.targetType.containedScope;
                    }, context.objectLiteralScopeGetter = function() {
                        return ast.targetType.memberScope;
                    }, context.enclosingObjectLit = ast);
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
                    context.skipNextFuncDeclForClass ? context.skipNextFuncDeclForClass = !1 : (context.scopeGetter = function() {
                        return ast.isConstructor && hasFlag(ast.fncFlags, FncFlags.ClassMethod) && ast.type && ast.type.enclosingType ? ast.type.enclosingType.constructorScope : ast.scopeType ? ast.scopeType.containedScope : ast.type ? ast.type.containedScope : null;
                    }, context.scopeStartAST = ast);
            }
            walker.options.goChildren = !0;
        } else walker.options.goChildren = !1;
        return ast;
    }
    TypeScript.EnclosingScopeContext = EnclosingScopeContext, TypeScript.preFindMemberScope = function(ast, parent, walker) {
        var memScope = walker.state;
        return hasFlag(ast.flags, memScope.matchFlag) && (memScope.pos < 0 || memScope.pos == ast.limChar) && (memScope.ast = ast, null == ast.type && memScope.pos >= 0 && memScope.flow.inScopeTypeCheck(ast, memScope.scope), memScope.type = ast.type, memScope.options.stopWalk()), ast;
    }, TypeScript.pushTypeCollectionScope = function(container, valueMembers, ambientValueMembers, enclosedTypes, ambientEnclosedTypes, context, thisType, classType, moduleDecl) {
        var builder = new SymbolScopeBuilder(valueMembers, ambientValueMembers, enclosedTypes, ambientEnclosedTypes, null, container), chain = new ScopeChain(container, context.scopeChain, builder);
        chain.thisType = thisType, chain.classType = classType, chain.moduleDecl = moduleDecl, context.scopeChain = chain;
    }, TypeScript.popTypeCollectionScope = function(context) {
        context.scopeChain = context.scopeChain.previous;
    }, TypeScript.preFindEnclosingScope = preFindEnclosingScope, TypeScript.findEnclosingScopeAt = function(logger, script, text, pos, isMemberCompletion) {
        var context = new EnclosingScopeContext(logger, script, text, pos, isMemberCompletion);
        return (TypeScript.getAstWalkerFactory().walk(script, preFindEnclosingScope, null, null, context), null === context.scopeStartAST) ? null : context;
    };
}(TypeScript || (TypeScript = {}));
