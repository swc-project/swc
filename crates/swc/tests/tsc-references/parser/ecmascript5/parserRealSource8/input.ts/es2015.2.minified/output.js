var TypeScript;
!function(TypeScript1) {
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
    TypeScript1.AssignScopeContext = class {
        constructor(scopeChain, typeFlow, modDeclChain){
            this.scopeChain = scopeChain, this.typeFlow = typeFlow, this.modDeclChain = modDeclChain;
        }
    }, TypeScript1.pushAssignScope = pushAssignScope, TypeScript1.popAssignScope = popAssignScope, TypeScript1.instanceCompare = instanceCompare, TypeScript1.instanceFilterStop = instanceFilterStop;
    class ScopeSearchFilter {
        reset() {
            this.result = null;
        }
        update(b) {
            return this.result = this.select(this.result, b), !!this.result && this.stop(this.result);
        }
        constructor(select, stop){
            this.select = select, this.stop = stop, this.result = null;
        }
    }
    function preAssignModuleScopes(ast1, context) {
        var moduleDecl = ast, memberScope = null, aggScope = null;
        moduleDecl.name && moduleDecl.mod && (moduleDecl.name.sym = moduleDecl.mod.symbol);
        var mod = moduleDecl.mod;
        !!mod && (memberScope = new SymbolTableScope(mod.members, mod.ambientMembers, mod.enclosedTypes, mod.ambientEnclosedTypes, mod.symbol), mod.memberScope = memberScope, context.modDeclChain.push(moduleDecl), context.typeFlow.checker.currentModDecl = moduleDecl, aggScope = new SymbolAggregateScope(mod.symbol), aggScope.addParentScope(memberScope), aggScope.addParentScope(context.scopeChain.scope), pushAssignScope(aggScope, context, null, null, null), mod.containedScope = aggScope, mod.symbol && context.typeFlow.addLocalsFromScope(mod.containedScope, mod.symbol, moduleDecl.vars, mod.members.privateMembers, !0));
    }
    function preAssignClassScopes(ast2, context1) {
        var classDecl = ast, memberScope = null, aggScope = null;
        classDecl.name && classDecl.type && (classDecl.name.sym = classDecl.type.symbol);
        var classType1 = ast2.type;
        if (classType1) {
            classType1.symbol, memberScope = context.typeFlow.checker.scopeOf(classType), (aggScope = new SymbolAggregateScope(classType1.symbol)).addParentScope(memberScope), aggScope.addParentScope(context1.scopeChain.scope), classType1.containedScope = aggScope, classType1.memberScope = memberScope;
            var instanceType1 = classType1.instanceType;
            memberScope = context.typeFlow.checker.scopeOf(instanceType), instanceType1.memberScope = memberScope, (aggScope = new SymbolAggregateScope(instanceType1.symbol)).addParentScope(context1.scopeChain.scope), pushAssignScope(aggScope, context1, instanceType1, classType1, null), instanceType1.containedScope = aggScope;
        } else ast2.type = context1.typeFlow.anyType;
    }
    function preAssignInterfaceScopes(ast3, context2) {
        var interfaceDecl = ast, memberScope = null, aggScope = null;
        interfaceDecl.name && interfaceDecl.type && (interfaceDecl.name.sym = interfaceDecl.type.symbol);
        var interfaceType1 = ast3.type;
        memberScope = context.typeFlow.checker.scopeOf(interfaceType), interfaceType1.memberScope = memberScope, (aggScope = new SymbolAggregateScope(interfaceType1.symbol)).addParentScope(memberScope), aggScope.addParentScope(context2.scopeChain.scope), pushAssignScope(aggScope, context2, null, null, null), interfaceType1.containedScope = aggScope;
    }
    function preAssignWithScopes(ast4, context) {
        var withStmt = ast, withType = withStmt.type, members = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), ambientMembers = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), withType = new Type(), withSymbol = new WithSymbol(withStmt.minChar, context.typeFlow.checker.locationInfo.unitIndex, withType);
        withType.members = members, withType.ambientMembers = ambientMembers, withType.symbol = withSymbol, withType.setHasImplementation(), withStmt.type = withType;
        var withScope = new TypeScript.SymbolScopeBuilder(withType.members, withType.ambientMembers, null, null, context.scopeChain.scope, withType.symbol);
        pushAssignScope(withScope, context, null, null, null), withType.containedScope = withScope;
    }
    function preAssignFuncDeclScopes(ast5, context3) {
        var funcDecl = ast, container1 = null, localContainer = null;
        funcDecl.type && (localContainer = ast5.type.symbol);
        var isStatic = hasFlag(funcDecl.fncFlags, FncFlags.Static), parentScope = isStatic && null != context3.scopeChain.fnc ? context3.scopeChain.fnc.type.memberScope : context3.scopeChain.scope;
        if (context3.scopeChain.thisType && (!funcDecl.isConstructor || hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod))) {
            var instType = context3.scopeChain.thisType;
            parentScope = instType.typeFlags & TypeFlags.IsClass || hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod) ? context3.scopeChain.previous.scope.container && context3.scopeChain.previous.scope.container.declAST && context3.scopeChain.previous.scope.container.declAST.nodeType == NodeType.FuncDecl && context.scopeChain.previous.scope.container.declAST.isConstructor ? instType.constructorScope : isStatic && context3.scopeChain.classType ? context3.scopeChain.classType.containedScope : instType.containedScope : !funcDecl.isMethod() || isStatic ? instType.constructorScope : instType.containedScope, container1 = instType.symbol;
        } else funcDecl.isConstructor && context3.scopeChain.thisType && (container1 = context3.scopeChain.thisType.symbol);
        if (null == funcDecl.type || hasFlag(funcDecl.type.symbol.flags, SymbolFlags.TypeSetDuringScopeAssignment)) {
            context3.scopeChain.fnc && context3.scopeChain.fnc.type && (container1 = context3.scopeChain.fnc.type.symbol);
            var funcScope = null, outerFnc = context3.scopeChain.fnc, nameText = funcDecl.name ? funcDecl.name.actualText : null, fgSym = null;
            isStatic ? (null == outerFnc.type.members && container1.getType().memberScope && (outerFnc.type.members = container.type.memberScope.valueMembers), funcScope = context3.scopeChain.fnc.type.memberScope, outerFnc.innerStaticFuncs[outerFnc.innerStaticFuncs.length] = funcDecl) : funcScope = !funcDecl.isConstructor && container1 && container1.declAST && container1.declAST.nodeType == NodeType.FuncDecl && container.declAST.isConstructor && !funcDecl.isMethod() ? context3.scopeChain.thisType.constructorScope : context3.scopeChain.scope, nameText && "__missing" != nameText && !funcDecl.isAccessor() && (fgSym = funcScope.findLocal(nameText, !1, !1)), context3.typeFlow.checker.createFunctionSignature(funcDecl, container1, funcScope, fgSym, null == fgSym), (!funcDecl.accessorSymbol && funcDecl.fncFlags & FncFlags.ClassMethod && container1 && (!fgSym || fgSym.declAST.nodeType != NodeType.FuncDecl) && funcDecl.isAccessor() || fgSym && fgSym.isAccessor()) && (funcDecl.accessorSymbol = context3.typeFlow.checker.createAccessorSymbol(funcDecl, fgSym, container1.getType(), funcDecl.isMethod() && isStatic, !0, funcScope, container1)), funcDecl.type.symbol.flags |= SymbolFlags.TypeSetDuringScopeAssignment;
        }
        if (funcDecl.name && funcDecl.type && (funcDecl.name.sym = funcDecl.type.symbol), funcDecl.scopeType = funcDecl.type, !funcDecl.isOverload) {
            var funcTable = new StringHashTable(), funcMembers = new ScopedMembers(new DualStringHashTable(funcTable, new StringHashTable())), ambientFuncTable = new StringHashTable(), ambientFuncMembers = new ScopedMembers(new DualStringHashTable(ambientFuncTable, new StringHashTable())), funcStaticTable = new StringHashTable(), funcStaticMembers = new ScopedMembers(new DualStringHashTable(funcStaticTable, new StringHashTable())), ambientFuncStaticTable = new StringHashTable(), ambientFuncStaticMembers = new ScopedMembers(new DualStringHashTable(ambientFuncStaticTable, new StringHashTable()));
            funcDecl.unitIndex = context3.typeFlow.checker.locationInfo.unitIndex;
            var locals = new SymbolScopeBuilder(funcMembers, ambientFuncMembers, null, null, parentScope, localContainer), statics = new SymbolScopeBuilder(funcStaticMembers, ambientFuncStaticMembers, null, null, parentScope, null);
            if (funcDecl.isConstructor && context3.scopeChain.thisType && (context3.scopeChain.thisType.constructorScope = locals), funcDecl.symbols = funcTable, !funcDecl.isSpecialFn()) {
                var group = funcDecl.type, signature = funcDecl.signature;
                funcDecl.isConstructor || (group.containedScope = locals, locals.container = group.symbol, group.memberScope = statics, statics.container = group.symbol), funcDecl.enclosingFnc = context3.scopeChain.fnc, group.enclosingType = isStatic ? context3.scopeChain.classType : context3.scopeChain.thisType;
                var fgSym = ast.type.symbol;
                if ((funcDecl.fncFlags & FncFlags.Signature) == FncFlags.None && funcDecl.vars && (context3.typeFlow.addLocalsFromScope(locals, fgSym, funcDecl.vars, funcTable, !1), context3.typeFlow.addLocalsFromScope(statics, fgSym, funcDecl.statics, funcStaticTable, !1)), signature.parameters) for(var len = signature.parameters.length, i = 0; i < len; i++){
                    var paramSym = signature.parameters[i];
                    context3.typeFlow.checker.resolveTypeLink(locals, paramSym.parameter.typeLink, !0);
                }
                context3.typeFlow.checker.resolveTypeLink(locals, signature.returnType, funcDecl.isSignature());
            }
            if (!funcDecl.isConstructor || hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod)) {
                var thisType = funcDecl.isConstructor && hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod) ? context3.scopeChain.thisType : null;
                pushAssignScope(locals, context3, thisType, null, funcDecl);
            }
        }
    }
    function preAssignCatchScopes(ast6, context) {
        var catchBlock = ast;
        if (catchBlock.param) {
            var catchTable = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable())), catchLocals = new SymbolScopeBuilder(catchTable, null, null, null, context.scopeChain.scope, context.scopeChain.scope.container);
            catchBlock.containedScope = catchLocals, pushAssignScope(catchLocals, context, context.scopeChain.thisType, context.scopeChain.classType, context.scopeChain.fnc);
        }
    }
    TypeScript1.ScopeSearchFilter = ScopeSearchFilter, TypeScript1.instanceFilter = new ScopeSearchFilter(instanceCompare, instanceFilterStop), TypeScript1.preAssignModuleScopes = preAssignModuleScopes, TypeScript1.preAssignClassScopes = preAssignClassScopes, TypeScript1.preAssignInterfaceScopes = preAssignInterfaceScopes, TypeScript1.preAssignWithScopes = preAssignWithScopes, TypeScript1.preAssignFuncDeclScopes = preAssignFuncDeclScopes, TypeScript1.preAssignCatchScopes = preAssignCatchScopes, TypeScript1.preAssignScopes = function(ast7, parent, walker) {
        var context = walker.state, go = !0;
        return ast7 && (ast7.nodeType == NodeType.List ? ast.enclosingScope = context.scopeChain.scope : ast7.nodeType == NodeType.ModuleDeclaration ? preAssignModuleScopes(ast7, context) : ast7.nodeType == NodeType.ClassDeclaration ? preAssignClassScopes(ast7, context) : ast7.nodeType == NodeType.InterfaceDeclaration ? preAssignInterfaceScopes(ast7, context) : ast7.nodeType == NodeType.With ? preAssignWithScopes(ast7, context) : ast7.nodeType == NodeType.FuncDecl ? preAssignFuncDeclScopes(ast7, context) : ast7.nodeType == NodeType.Catch ? preAssignCatchScopes(ast7, context) : ast7.nodeType == NodeType.TypeRef && (go = !1)), walker.options.goChildren = go, ast7;
    }, TypeScript1.postAssignScopes = function(ast8, parent, walker) {
        var context = walker.state, go = !0;
        if (ast8) if (ast8.nodeType == NodeType.ModuleDeclaration) popAssignScope(context), context.modDeclChain.pop(), context.modDeclChain.length >= 1 && (context.typeFlow.checker.currentModDecl = context.modDeclChain[context.modDeclChain.length - 1]);
        else if (ast8.nodeType == NodeType.ClassDeclaration) popAssignScope(context);
        else if (ast8.nodeType == NodeType.InterfaceDeclaration) popAssignScope(context);
        else if (ast8.nodeType == NodeType.With) popAssignScope(context);
        else if (ast8.nodeType == NodeType.FuncDecl) {
            var funcDecl = ast;
            (!funcDecl.isConstructor || hasFlag(funcDecl.fncFlags, FncFlags.ClassMethod)) && !funcDecl.isOverload && popAssignScope(context);
        } else ast8.nodeType == NodeType.Catch ? ast.param && popAssignScope(context) : go = !1;
        return walker.options.goChildren = go, ast8;
    };
}(TypeScript || (TypeScript = {
}));
