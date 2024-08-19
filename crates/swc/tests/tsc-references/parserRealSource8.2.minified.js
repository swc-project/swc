//// [parserRealSource8.ts]
var TypeScript;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(TypeScript) {
    function pushAssignScope(scope, context, type, classType, fnc) {
        var chain = new ScopeChain(null, context.scopeChain, scope);
        chain.thisType = type, chain.classType = classType, chain.fnc = fnc, context.scopeChain = chain;
    }
    function popAssignScope(context) {
        context.scopeChain = context.scopeChain.previous;
    }
    function instanceCompare(a, b) {
        return null != a && a.isInstanceProperty() ? a : b;
    }
    function instanceFilterStop(s) {
        return s.isInstanceProperty();
    }
    TypeScript.AssignScopeContext = function AssignScopeContext(scopeChain, typeFlow, modDeclChain) {
        _class_call_check(this, AssignScopeContext), this.scopeChain = scopeChain, this.typeFlow = typeFlow, this.modDeclChain = modDeclChain;
    }, TypeScript.pushAssignScope = pushAssignScope, TypeScript.popAssignScope = popAssignScope, TypeScript.instanceCompare = instanceCompare, TypeScript.instanceFilterStop = instanceFilterStop;
    var ScopeSearchFilter = /*#__PURE__*/ function() {
        function ScopeSearchFilter(select, stop) {
            _class_call_check(this, ScopeSearchFilter), this.select = select, this.stop = stop, this.result = null;
        }
        var _proto = ScopeSearchFilter.prototype;
        return _proto.reset = function() {
            this.result = null;
        }, _proto.update = function(b) {
            return this.result = this.select(this.result, b), !!this.result && this.stop(this.result);
        }, ScopeSearchFilter;
    }();
    function preAssignModuleScopes(ast, context) {
        var memberScope = null, aggScope = null;
        ast.name && ast.mod && (ast.name.sym = ast.mod.symbol);
        var mod = ast.mod;
        mod && (memberScope = new SymbolTableScope(mod.members, mod.ambientMembers, mod.enclosedTypes, mod.ambientEnclosedTypes, mod.symbol), mod.memberScope = memberScope, context.modDeclChain.push(ast), context.typeFlow.checker.currentModDecl = ast, (aggScope = new SymbolAggregateScope(mod.symbol)).addParentScope(memberScope), aggScope.addParentScope(context.scopeChain.scope), pushAssignScope(aggScope, context, null, null, null), mod.containedScope = aggScope, mod.symbol && context.typeFlow.addLocalsFromScope(mod.containedScope, mod.symbol, ast.vars, mod.members.privateMembers, !0));
    }
    function preAssignClassScopes(ast, context) {
        var memberScope = null, aggScope = null;
        ast.name && ast.type && (ast.name.sym = ast.type.symbol);
        var classType = ast.type;
        if (classType) {
            classType.symbol, memberScope = context.typeFlow.checker.scopeOf(classType), (aggScope = new SymbolAggregateScope(classType.symbol)).addParentScope(memberScope), aggScope.addParentScope(context.scopeChain.scope), classType.containedScope = aggScope, classType.memberScope = memberScope;
            var instanceType = classType.instanceType;
            memberScope = context.typeFlow.checker.scopeOf(instanceType), instanceType.memberScope = memberScope, (aggScope = new SymbolAggregateScope(instanceType.symbol)).addParentScope(context.scopeChain.scope), pushAssignScope(aggScope, context, instanceType, classType, null), instanceType.containedScope = aggScope;
        } else ast.type = context.typeFlow.anyType;
    }
    function preAssignInterfaceScopes(ast, context) {
        var memberScope = null, aggScope = null;
        ast.name && ast.type && (ast.name.sym = ast.type.symbol);
        var interfaceType = ast.type;
        memberScope = context.typeFlow.checker.scopeOf(interfaceType), interfaceType.memberScope = memberScope, (aggScope = new SymbolAggregateScope(interfaceType.symbol)).addParentScope(memberScope), aggScope.addParentScope(context.scopeChain.scope), pushAssignScope(aggScope, context, null, null, null), interfaceType.containedScope = aggScope;
    }
    function preAssignWithScopes(ast, context) {
        var withType = ast.type, members = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), ambientMembers = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), withType = new Type(), withSymbol = new WithSymbol(ast.minChar, context.typeFlow.checker.locationInfo.unitIndex, withType);
        withType.members = members, withType.ambientMembers = ambientMembers, withType.symbol = withSymbol, withType.setHasImplementation(), ast.type = withType;
        var withScope = new TypeScript.SymbolScopeBuilder(withType.members, withType.ambientMembers, null, null, context.scopeChain.scope, withType.symbol);
        pushAssignScope(withScope, context, null, null, null), withType.containedScope = withScope;
    }
    function preAssignFuncDeclScopes(ast, context) {
        var container = null, localContainer = null;
        ast.type && (localContainer = ast.type.symbol);
        var isStatic = hasFlag(ast.fncFlags, FncFlags.Static), parentScope = isStatic && null != context.scopeChain.fnc ? context.scopeChain.fnc.type.memberScope : context.scopeChain.scope;
        if (context.scopeChain.thisType && (!ast.isConstructor || hasFlag(ast.fncFlags, FncFlags.ClassMethod))) {
            var instType = context.scopeChain.thisType;
            instType.typeFlags & TypeFlags.IsClass || hasFlag(ast.fncFlags, FncFlags.ClassMethod) ? context.scopeChain.previous.scope.container && context.scopeChain.previous.scope.container.declAST && context.scopeChain.previous.scope.container.declAST.nodeType == NodeType.FuncDecl && context.scopeChain.previous.scope.container.declAST.isConstructor ? parentScope = instType.constructorScope : parentScope = isStatic && context.scopeChain.classType ? context.scopeChain.classType.containedScope : instType.containedScope : parentScope = !ast.isMethod() || isStatic ? instType.constructorScope : instType.containedScope, container = instType.symbol;
        } else ast.isConstructor && context.scopeChain.thisType && (container = context.scopeChain.thisType.symbol);
        if (null == ast.type || hasFlag(ast.type.symbol.flags, SymbolFlags.TypeSetDuringScopeAssignment)) {
            context.scopeChain.fnc && context.scopeChain.fnc.type && (container = context.scopeChain.fnc.type.symbol);
            var funcScope = null, outerFnc = context.scopeChain.fnc, nameText = ast.name ? ast.name.actualText : null, fgSym = null;
            isStatic ? (null == outerFnc.type.members && container.getType().memberScope && (outerFnc.type.members = container.type.memberScope.valueMembers), funcScope = context.scopeChain.fnc.type.memberScope, outerFnc.innerStaticFuncs[outerFnc.innerStaticFuncs.length] = ast) : !ast.isConstructor && container && container.declAST && container.declAST.nodeType == NodeType.FuncDecl && container.declAST.isConstructor && !ast.isMethod() ? funcScope = context.scopeChain.thisType.constructorScope : funcScope = context.scopeChain.scope, nameText && "__missing" != nameText && !ast.isAccessor() && (fgSym = funcScope.findLocal(nameText, !1, !1)), context.typeFlow.checker.createFunctionSignature(ast, container, funcScope, fgSym, null == fgSym), (!ast.accessorSymbol && ast.fncFlags & FncFlags.ClassMethod && container && (!fgSym || fgSym.declAST.nodeType != NodeType.FuncDecl) && ast.isAccessor() || fgSym && fgSym.isAccessor()) && (ast.accessorSymbol = context.typeFlow.checker.createAccessorSymbol(ast, fgSym, container.getType(), ast.isMethod() && isStatic, !0, funcScope, container)), ast.type.symbol.flags |= SymbolFlags.TypeSetDuringScopeAssignment;
        }
        if (ast.name && ast.type && (ast.name.sym = ast.type.symbol), ast.scopeType = ast.type, !ast.isOverload) {
            var funcTable = new StringHashTable(), funcMembers = new ScopedMembers(new DualStringHashTable(funcTable, new StringHashTable())), ambientFuncMembers = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), funcStaticTable = new StringHashTable(), funcStaticMembers = new ScopedMembers(new DualStringHashTable(funcStaticTable, new StringHashTable())), ambientFuncStaticMembers = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable()));
            ast.unitIndex = context.typeFlow.checker.locationInfo.unitIndex;
            var locals = new SymbolScopeBuilder(funcMembers, ambientFuncMembers, null, null, parentScope, localContainer), statics = new SymbolScopeBuilder(funcStaticMembers, ambientFuncStaticMembers, null, null, parentScope, null);
            if (ast.isConstructor && context.scopeChain.thisType && (context.scopeChain.thisType.constructorScope = locals), ast.symbols = funcTable, !ast.isSpecialFn()) {
                var group = ast.type, signature = ast.signature;
                ast.isConstructor || (group.containedScope = locals, locals.container = group.symbol, group.memberScope = statics, statics.container = group.symbol), ast.enclosingFnc = context.scopeChain.fnc, group.enclosingType = isStatic ? context.scopeChain.classType : context.scopeChain.thisType;
                var fgSym = ast.type.symbol;
                if ((ast.fncFlags & FncFlags.Signature) == FncFlags.None && ast.vars && (context.typeFlow.addLocalsFromScope(locals, fgSym, ast.vars, funcTable, !1), context.typeFlow.addLocalsFromScope(statics, fgSym, ast.statics, funcStaticTable, !1)), signature.parameters) for(var len = signature.parameters.length, i = 0; i < len; i++){
                    var paramSym = signature.parameters[i];
                    context.typeFlow.checker.resolveTypeLink(locals, paramSym.parameter.typeLink, !0);
                }
                context.typeFlow.checker.resolveTypeLink(locals, signature.returnType, ast.isSignature());
            }
            if (!ast.isConstructor || hasFlag(ast.fncFlags, FncFlags.ClassMethod)) {
                var thisType = ast.isConstructor && hasFlag(ast.fncFlags, FncFlags.ClassMethod) ? context.scopeChain.thisType : null;
                pushAssignScope(locals, context, thisType, null, ast);
            }
        }
    }
    function preAssignCatchScopes(ast, context) {
        if (ast.param) {
            var catchLocals = new SymbolScopeBuilder(new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), null, null, null, context.scopeChain.scope, context.scopeChain.scope.container);
            ast.containedScope = catchLocals, pushAssignScope(catchLocals, context, context.scopeChain.thisType, context.scopeChain.classType, context.scopeChain.fnc);
        }
    }
    TypeScript.ScopeSearchFilter = ScopeSearchFilter, TypeScript.instanceFilter = new ScopeSearchFilter(instanceCompare, instanceFilterStop), TypeScript.preAssignModuleScopes = preAssignModuleScopes, TypeScript.preAssignClassScopes = preAssignClassScopes, TypeScript.preAssignInterfaceScopes = preAssignInterfaceScopes, TypeScript.preAssignWithScopes = preAssignWithScopes, TypeScript.preAssignFuncDeclScopes = preAssignFuncDeclScopes, TypeScript.preAssignCatchScopes = preAssignCatchScopes, TypeScript.preAssignScopes = function(ast, parent, walker) {
        var context = walker.state, go = !0;
        return ast && (ast.nodeType == NodeType.List ? ast.enclosingScope = context.scopeChain.scope : ast.nodeType == NodeType.ModuleDeclaration ? preAssignModuleScopes(ast, context) : ast.nodeType == NodeType.ClassDeclaration ? preAssignClassScopes(ast, context) : ast.nodeType == NodeType.InterfaceDeclaration ? preAssignInterfaceScopes(ast, context) : ast.nodeType == NodeType.With ? preAssignWithScopes(ast, context) : ast.nodeType == NodeType.FuncDecl ? preAssignFuncDeclScopes(ast, context) : ast.nodeType == NodeType.Catch ? preAssignCatchScopes(ast, context) : ast.nodeType == NodeType.TypeRef && (go = !1)), walker.options.goChildren = go, ast;
    }, TypeScript.postAssignScopes = function(ast, parent, walker) {
        var context = walker.state, go = !0;
        return ast && (ast.nodeType == NodeType.ModuleDeclaration ? (popAssignScope(context), context.modDeclChain.pop(), context.modDeclChain.length >= 1 && (context.typeFlow.checker.currentModDecl = context.modDeclChain[context.modDeclChain.length - 1])) : ast.nodeType == NodeType.ClassDeclaration ? popAssignScope(context) : ast.nodeType == NodeType.InterfaceDeclaration ? popAssignScope(context) : ast.nodeType == NodeType.With ? popAssignScope(context) : ast.nodeType == NodeType.FuncDecl ? (!ast.isConstructor || hasFlag(ast.fncFlags, FncFlags.ClassMethod)) && !ast.isOverload && popAssignScope(context) : ast.nodeType == NodeType.Catch ? ast.param && popAssignScope(context) : go = !1), walker.options.goChildren = go, ast;
    };
}(TypeScript || (TypeScript = {}));
