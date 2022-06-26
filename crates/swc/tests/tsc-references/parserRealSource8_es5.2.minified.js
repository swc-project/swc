var TypeScript;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(TypeScript1) {
    var pushAssignScope = function(scope, context, type, classType, fnc) {
        var chain = new ScopeChain(null, context.scopeChain, scope);
        chain.thisType = type, chain.classType = classType, chain.fnc = fnc, context.scopeChain = chain;
    }, popAssignScope = function(context) {
        context.scopeChain = context.scopeChain.previous;
    }, instanceCompare = function(a, b) {
        return null != a && a.isInstanceProperty() ? a : b;
    }, instanceFilterStop = function(s) {
        return s.isInstanceProperty();
    }, preAssignModuleScopes = function(ast, context) {
        var moduleDecl = ast, memberScope = null, aggScope = null;
        moduleDecl.name && moduleDecl.mod && (moduleDecl.name.sym = moduleDecl.mod.symbol);
        var mod = moduleDecl.mod;
        mod && (memberScope = new SymbolTableScope(mod.members, mod.ambientMembers, mod.enclosedTypes, mod.ambientEnclosedTypes, mod.symbol), mod.memberScope = memberScope, context.modDeclChain.push(moduleDecl), context.typeFlow.checker.currentModDecl = moduleDecl, aggScope = new SymbolAggregateScope(mod.symbol), aggScope.addParentScope(memberScope), aggScope.addParentScope(context.scopeChain.scope), pushAssignScope(aggScope, context, null, null, null), mod.containedScope = aggScope, mod.symbol && context.typeFlow.addLocalsFromScope(mod.containedScope, mod.symbol, moduleDecl.vars, mod.members.privateMembers, !0));
    }, preAssignClassScopes = function(ast, context) {
        var classDecl = ast, memberScope = null, aggScope = null;
        classDecl.name && classDecl.type && (classDecl.name.sym = classDecl.type.symbol);
        var classType = ast.type;
        if (classType) {
            classType.symbol, memberScope = context.typeFlow.checker.scopeOf(classType), (aggScope = new SymbolAggregateScope(classType.symbol)).addParentScope(memberScope), aggScope.addParentScope(context.scopeChain.scope), classType.containedScope = aggScope, classType.memberScope = memberScope;
            var instanceType = classType.instanceType;
            memberScope = context.typeFlow.checker.scopeOf(instanceType), instanceType.memberScope = memberScope, aggScope = new SymbolAggregateScope(instanceType.symbol), aggScope.addParentScope(context.scopeChain.scope), pushAssignScope(aggScope, context, instanceType, classType, null), instanceType.containedScope = aggScope;
        } else ast.type = context.typeFlow.anyType;
    }, preAssignInterfaceScopes = function(ast, context) {
        var interfaceDecl = ast, memberScope = null, aggScope = null;
        interfaceDecl.name && interfaceDecl.type && (interfaceDecl.name.sym = interfaceDecl.type.symbol);
        var interfaceType = ast.type;
        memberScope = context.typeFlow.checker.scopeOf(interfaceType), interfaceType.memberScope = memberScope, aggScope = new SymbolAggregateScope(interfaceType.symbol), aggScope.addParentScope(memberScope), aggScope.addParentScope(context.scopeChain.scope), pushAssignScope(aggScope, context, null, null, null), interfaceType.containedScope = aggScope;
    }, preAssignWithScopes = function(ast, context) {
        var withStmt = ast, withType = withStmt.type, members = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), ambientMembers = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), withType = new Type(), withSymbol = new WithSymbol(withStmt.minChar, context.typeFlow.checker.locationInfo.unitIndex, withType);
        withType.members = members, withType.ambientMembers = ambientMembers, withType.symbol = withSymbol, withType.setHasImplementation(), withStmt.type = withType;
        var withScope = new TypeScript.SymbolScopeBuilder(withType.members, withType.ambientMembers, null, null, context.scopeChain.scope, withType.symbol);
        pushAssignScope(withScope, context, null, null, null), withType.containedScope = withScope;
    }, preAssignFuncDeclScopes = function(ast, context) {
        var funcDecl = ast, container = null, localContainer = null;
        funcDecl.type && (localContainer = ast.type.symbol);
        var isStatic = hasFlag(funcDecl.fncFlags, FncFlags.Static), parentScope = isStatic && null != context.scopeChain.fnc ? context.scopeChain.fnc.type.memberScope : context.scopeChain.scope;
        if (context.scopeChain.thisType && (!funcDecl.isConstructor || hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod))) {
            var instType = context.scopeChain.thisType;
            parentScope = instType.typeFlags & TypeFlags.IsClass || hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod) ? context.scopeChain.previous.scope.container && context.scopeChain.previous.scope.container.declAST && context.scopeChain.previous.scope.container.declAST.nodeType == NodeType.FuncDecl && context.scopeChain.previous.scope.container.declAST.isConstructor ? instType.constructorScope : isStatic && context.scopeChain.classType ? context.scopeChain.classType.containedScope : instType.containedScope : !funcDecl.isMethod() || isStatic ? instType.constructorScope : instType.containedScope, container = instType.symbol;
        } else funcDecl.isConstructor && context.scopeChain.thisType && (container = context.scopeChain.thisType.symbol);
        if (null == funcDecl.type || hasFlag(funcDecl.type.symbol.flags, SymbolFlags.TypeSetDuringScopeAssignment)) {
            context.scopeChain.fnc && context.scopeChain.fnc.type && (container = context.scopeChain.fnc.type.symbol);
            var funcScope = null, outerFnc = context.scopeChain.fnc, nameText = funcDecl.name ? funcDecl.name.actualText : null, fgSym = null;
            isStatic ? (null == outerFnc.type.members && container.getType().memberScope && (outerFnc.type.members = container.type.memberScope.valueMembers), funcScope = context.scopeChain.fnc.type.memberScope, outerFnc.innerStaticFuncs[outerFnc.innerStaticFuncs.length] = funcDecl) : funcScope = !funcDecl.isConstructor && container && container.declAST && container.declAST.nodeType == NodeType.FuncDecl && container.declAST.isConstructor && !funcDecl.isMethod() ? context.scopeChain.thisType.constructorScope : context.scopeChain.scope, nameText && "__missing" != nameText && !funcDecl.isAccessor() && (fgSym = funcScope.findLocal(nameText, !1, !1)), context.typeFlow.checker.createFunctionSignature(funcDecl, container, funcScope, fgSym, null == fgSym), (!funcDecl.accessorSymbol && funcDecl.fncFlags & FncFlags.ClassMethod && container && (!fgSym || fgSym.declAST.nodeType != NodeType.FuncDecl) && funcDecl.isAccessor() || fgSym && fgSym.isAccessor()) && (funcDecl.accessorSymbol = context.typeFlow.checker.createAccessorSymbol(funcDecl, fgSym, container.getType(), funcDecl.isMethod() && isStatic, !0, funcScope, container)), funcDecl.type.symbol.flags |= SymbolFlags.TypeSetDuringScopeAssignment;
        }
        if (funcDecl.name && funcDecl.type && (funcDecl.name.sym = funcDecl.type.symbol), funcDecl.scopeType = funcDecl.type, !funcDecl.isOverload) {
            var funcTable = new StringHashTable(), funcMembers = new ScopedMembers(new DualStringHashTable(funcTable, new StringHashTable())), ambientFuncTable = new StringHashTable(), ambientFuncMembers = new ScopedMembers(new DualStringHashTable(ambientFuncTable, new StringHashTable())), funcStaticTable = new StringHashTable(), funcStaticMembers = new ScopedMembers(new DualStringHashTable(funcStaticTable, new StringHashTable())), ambientFuncStaticTable = new StringHashTable(), ambientFuncStaticMembers = new ScopedMembers(new DualStringHashTable(ambientFuncStaticTable, new StringHashTable()));
            funcDecl.unitIndex = context.typeFlow.checker.locationInfo.unitIndex;
            var locals = new SymbolScopeBuilder(funcMembers, ambientFuncMembers, null, null, parentScope, localContainer), statics = new SymbolScopeBuilder(funcStaticMembers, ambientFuncStaticMembers, null, null, parentScope, null);
            if (funcDecl.isConstructor && context.scopeChain.thisType && (context.scopeChain.thisType.constructorScope = locals), funcDecl.symbols = funcTable, !funcDecl.isSpecialFn()) {
                var group = funcDecl.type, signature = funcDecl.signature;
                funcDecl.isConstructor || (group.containedScope = locals, locals.container = group.symbol, group.memberScope = statics, statics.container = group.symbol), funcDecl.enclosingFnc = context.scopeChain.fnc, group.enclosingType = isStatic ? context.scopeChain.classType : context.scopeChain.thisType;
                var fgSym = ast.type.symbol;
                if ((funcDecl.fncFlags & FncFlags.Signature) == FncFlags.None && funcDecl.vars && (context.typeFlow.addLocalsFromScope(locals, fgSym, funcDecl.vars, funcTable, !1), context.typeFlow.addLocalsFromScope(statics, fgSym, funcDecl.statics, funcStaticTable, !1)), signature.parameters) for(var len = signature.parameters.length, i = 0; i < len; i++){
                    var paramSym = signature.parameters[i];
                    context.typeFlow.checker.resolveTypeLink(locals, paramSym.parameter.typeLink, !0);
                }
                context.typeFlow.checker.resolveTypeLink(locals, signature.returnType, funcDecl.isSignature());
            }
            if (!funcDecl.isConstructor || hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod)) {
                var thisType = funcDecl.isConstructor && hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod) ? context.scopeChain.thisType : null;
                pushAssignScope(locals, context, thisType, null, funcDecl);
            }
        }
    }, preAssignCatchScopes = function(ast, context) {
        var catchBlock = ast;
        if (catchBlock.param) {
            var catchTable = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), catchLocals = new SymbolScopeBuilder(catchTable, null, null, null, context.scopeChain.scope, context.scopeChain.scope.container);
            catchBlock.containedScope = catchLocals, pushAssignScope(catchLocals, context, context.scopeChain.thisType, context.scopeChain.classType, context.scopeChain.fnc);
        }
    }, preAssignScopes = function(ast, parent, walker) {
        var context = walker.state, go = !0;
        return ast && (ast.nodeType == NodeType.List ? ast.enclosingScope = context.scopeChain.scope : ast.nodeType == NodeType.ModuleDeclaration ? preAssignModuleScopes(ast, context) : ast.nodeType == NodeType.ClassDeclaration ? preAssignClassScopes(ast, context) : ast.nodeType == NodeType.InterfaceDeclaration ? preAssignInterfaceScopes(ast, context) : ast.nodeType == NodeType.With ? preAssignWithScopes(ast, context) : ast.nodeType == NodeType.FuncDecl ? preAssignFuncDeclScopes(ast, context) : ast.nodeType == NodeType.Catch ? preAssignCatchScopes(ast, context) : ast.nodeType == NodeType.TypeRef && (go = !1)), walker.options.goChildren = go, ast;
    }, postAssignScopes = function(ast, parent, walker) {
        var context = walker.state, go = !0;
        if (ast) {
            if (ast.nodeType == NodeType.ModuleDeclaration) popAssignScope(context), context.modDeclChain.pop(), context.modDeclChain.length >= 1 && (context.typeFlow.checker.currentModDecl = context.modDeclChain[context.modDeclChain.length - 1]);
            else if (ast.nodeType == NodeType.ClassDeclaration) popAssignScope(context);
            else if (ast.nodeType == NodeType.InterfaceDeclaration) popAssignScope(context);
            else if (ast.nodeType == NodeType.With) popAssignScope(context);
            else if (ast.nodeType == NodeType.FuncDecl) {
                var funcDecl = ast;
                (!funcDecl.isConstructor || hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod)) && !funcDecl.isOverload && popAssignScope(context);
            } else ast.nodeType == NodeType.Catch ? ast.param && popAssignScope(context) : go = !1;
        }
        return walker.options.goChildren = go, ast;
    }, AssignScopeContext = function(scopeChain, typeFlow, modDeclChain) {
        "use strict";
        _class_call_check(this, AssignScopeContext), this.scopeChain = scopeChain, this.typeFlow = typeFlow, this.modDeclChain = modDeclChain;
    };
    TypeScript1.AssignScopeContext = AssignScopeContext, TypeScript1.pushAssignScope = pushAssignScope, TypeScript1.popAssignScope = popAssignScope, TypeScript1.instanceCompare = instanceCompare, TypeScript1.instanceFilterStop = instanceFilterStop;
    var ScopeSearchFilter = function() {
        "use strict";
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
    TypeScript1.ScopeSearchFilter = ScopeSearchFilter, TypeScript1.instanceFilter = new ScopeSearchFilter(instanceCompare, instanceFilterStop), TypeScript1.preAssignModuleScopes = preAssignModuleScopes, TypeScript1.preAssignClassScopes = preAssignClassScopes, TypeScript1.preAssignInterfaceScopes = preAssignInterfaceScopes, TypeScript1.preAssignWithScopes = preAssignWithScopes, TypeScript1.preAssignFuncDeclScopes = preAssignFuncDeclScopes, TypeScript1.preAssignCatchScopes = preAssignCatchScopes, TypeScript1.preAssignScopes = preAssignScopes, TypeScript1.postAssignScopes = postAssignScopes;
}(TypeScript || (TypeScript = {}));
