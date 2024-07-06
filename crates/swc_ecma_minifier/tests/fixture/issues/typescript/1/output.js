var ts, ts1, dynamicImportUMDHelper;
(ts1 = ts || (ts = {})).transformModule = function(context) {
    var currentSourceFile, currentModuleInfo, needUMDDynamicImportHelper, factory = context.factory, emitHelpers = context.getEmitHelperFactory, startLexicalEnvironment = context.startLexicalEnvironment, endLexicalEnvironment = context.endLexicalEnvironment, hoistVariableDeclaration = context.hoistVariableDeclaration, compilerOptions = context.getCompilerOptions(), resolver = context.getEmitResolver(), host = context.getEmitHost(), languageVersion = ts1.getEmitScriptTarget(compilerOptions), moduleKind = ts1.getEmitModuleKind(compilerOptions), previousOnSubstituteNode = context.onSubstituteNode, previousOnEmitNode = context.onEmitNode;
    context.onSubstituteNode = //
    // Substitutions
    //
    /**
         * Hooks node substitutions.
         *
         * @param hint A hint as to the intended usage of the node.
         * @param node The node to substitute.
         */ function(hint, node) {
        return (node = previousOnSubstituteNode(hint, node)).id && noSubstitution[node.id] ? node : 1 /* Expression */  === hint ? /**
         * Substitution for an Expression that may contain an imported or exported symbol.
         *
         * @param node The node to substitute.
         */ function(node) {
            switch(node.kind){
                case 79 /* Identifier */ :
                    return substituteExpressionIdentifier(node);
                case 207 /* CallExpression */ :
                    return function(node) {
                        if (ts1.isIdentifier(node.expression)) {
                            var expression = substituteExpressionIdentifier(node.expression);
                            if (noSubstitution[ts1.getNodeId(expression)] = !0, !ts1.isIdentifier(expression) && !(4096 /* HelperName */  & ts1.getEmitFlags(node.expression))) return ts1.addEmitFlags(factory.updateCallExpression(node, expression, /*typeArguments*/ void 0, node.arguments), 536870912 /* IndirectCall */ );
                        }
                        return node;
                    }(node);
                case 209 /* TaggedTemplateExpression */ :
                    return function(node) {
                        if (ts1.isIdentifier(node.tag)) {
                            var tag = substituteExpressionIdentifier(node.tag);
                            if (noSubstitution[ts1.getNodeId(tag)] = !0, !ts1.isIdentifier(tag) && !(4096 /* HelperName */  & ts1.getEmitFlags(node.tag))) return ts1.addEmitFlags(factory.updateTaggedTemplateExpression(node, tag, /*typeArguments*/ void 0, node.template), 536870912 /* IndirectCall */ );
                        }
                        return node;
                    }(node);
                case 220 /* BinaryExpression */ :
                    return(/**
         * Substitution for a BinaryExpression that may contain an imported or exported symbol.
         *
         * @param node The node to substitute.
         */ function(node) {
                        // When we see an assignment expression whose left-hand side is an exported symbol,
                        // we should ensure all exports of that symbol are updated with the correct value.
                        //
                        // - We do not substitute generated identifiers for any reason.
                        // - We do not substitute identifiers tagged with the LocalName flag.
                        // - We do not substitute identifiers that were originally the name of an enum or
                        //   namespace due to how they are transformed in TypeScript.
                        // - We only substitute identifiers that are exported at the top level.
                        if (ts1.isAssignmentOperator(node.operatorToken.kind) && ts1.isIdentifier(node.left) && !ts1.isGeneratedIdentifier(node.left) && !ts1.isLocalName(node.left) && !ts1.isDeclarationNameOfEnumOrNamespace(node.left)) {
                            var exportedNames = getExports(node.left);
                            if (exportedNames) {
                                for(var expression = node, _i = 0; _i < exportedNames.length; _i++){
                                    var exportName = exportedNames[_i];
                                    // Mark the node to prevent triggering this rule again.
                                    noSubstitution[ts1.getNodeId(expression)] = !0, expression = createExportExpression(exportName, expression, /*location*/ node);
                                }
                                return expression;
                            }
                        }
                        return node;
                    }(node));
            }
            return node;
        }(node) : ts1.isShorthandPropertyAssignment(node) ? /**
         * Substitution for a ShorthandPropertyAssignment whose declaration name is an imported
         * or exported symbol.
         *
         * @param node The node to substitute.
         */ function(node) {
            var name = node.name, exportedOrImportedName = substituteExpressionIdentifier(name);
            if (exportedOrImportedName !== name) {
                // A shorthand property with an assignment initializer is probably part of a
                // destructuring assignment
                if (node.objectAssignmentInitializer) {
                    var initializer = factory.createAssignment(exportedOrImportedName, node.objectAssignmentInitializer);
                    return ts1.setTextRange(factory.createPropertyAssignment(name, initializer), node);
                }
                return ts1.setTextRange(factory.createPropertyAssignment(name, exportedOrImportedName), node);
            }
            return node;
        }(node) : node;
    }, context.onEmitNode = //
    // Emit Notification
    //
    /**
         * Hook for node emit notifications.
         *
         * @param hint A hint as to the intended usage of the node.
         * @param node The node to emit.
         * @param emit A callback used to emit the node in the printer.
         */ function(hint, node, emitCallback) {
        303 /* SourceFile */  === node.kind ? (currentSourceFile = node, currentModuleInfo = moduleInfoMap[ts1.getOriginalNodeId(currentSourceFile)], previousOnEmitNode(hint, node, emitCallback), currentSourceFile = void 0, currentModuleInfo = void 0) : previousOnEmitNode(hint, node, emitCallback);
    }, context.enableSubstitution(207 /* CallExpression */ ), context.enableSubstitution(209 /* TaggedTemplateExpression */ ), context.enableSubstitution(79 /* Identifier */ ), context.enableSubstitution(220 /* BinaryExpression */ ), context.enableSubstitution(295 /* ShorthandPropertyAssignment */ ), context.enableEmitNotification(303 /* SourceFile */ );
    var moduleInfoMap = [], deferredExports = [], noSubstitution = []; // The ExternalModuleInfo for each file.
    return ts1.chainBundle(context, /**
         * Transforms the module aspects of a SourceFile.
         *
         * @param node The SourceFile node.
         */ function(node) {
        if (node.isDeclarationFile || !(ts1.isEffectiveExternalModule(node, compilerOptions) || 4194304 /* ContainsDynamicImport */  & node.transformFlags || ts1.isJsonSourceFile(node) && ts1.hasJsonModuleEmitEnabled(compilerOptions) && ts1.outFile(compilerOptions))) return node;
        currentSourceFile = node, currentModuleInfo = ts1.collectExternalModuleInfo(context, node, resolver, compilerOptions), moduleInfoMap[ts1.getOriginalNodeId(node)] = currentModuleInfo;
        var updated = (function(moduleKind) {
            switch(moduleKind){
                case ts1.ModuleKind.AMD:
                    return transformAMDModule;
                case ts1.ModuleKind.UMD:
                    return transformUMDModule;
                default:
                    return transformCommonJSModule;
            }
        })(moduleKind)(node);
        return currentSourceFile = void 0, currentModuleInfo = void 0, needUMDDynamicImportHelper = !1, updated;
    });
    function shouldEmitUnderscoreUnderscoreESModule() {
        return !!(!currentModuleInfo.exportEquals && ts1.isExternalModule(currentSourceFile));
    }
    /**
         * Transforms a SourceFile into a CommonJS module.
         *
         * @param node The SourceFile node.
         */ function transformCommonJSModule(node) {
        startLexicalEnvironment();
        var statements = [], ensureUseStrict = ts1.getStrictOptionValue(compilerOptions, "alwaysStrict") || !compilerOptions.noImplicitUseStrict && ts1.isExternalModule(currentSourceFile), statementOffset = factory.copyPrologue(node.statements, statements, ensureUseStrict && !ts1.isJsonSourceFile(node), topLevelVisitor);
        if (shouldEmitUnderscoreUnderscoreESModule() && ts1.append(statements, createUnderscoreUnderscoreESModule()), ts1.length(currentModuleInfo.exportedNames)) for(var i = 0; i < currentModuleInfo.exportedNames.length; i += 50)ts1.append(statements, factory.createExpressionStatement(ts1.reduceLeft(currentModuleInfo.exportedNames.slice(i, i + 50), function(prev, nextId) {
            return factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.createIdentifier(ts1.idText(nextId))), prev);
        }, factory.createVoidZero())));
        ts1.append(statements, ts1.visitNode(currentModuleInfo.externalHelpersImportDeclaration, topLevelVisitor, ts1.isStatement)), ts1.addRange(statements, ts1.visitNodes(node.statements, topLevelVisitor, ts1.isStatement, statementOffset)), addExportEqualsIfNeeded(statements, /*emitAsReturn*/ !1), ts1.insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
        var updated = factory.updateSourceFile(node, ts1.setTextRange(factory.createNodeArray(statements), node.statements));
        return ts1.addEmitHelpers(updated, context.readEmitHelpers()), updated;
    }
    /**
         * Transforms a SourceFile into an AMD module.
         *
         * @param node The SourceFile node.
         */ function transformAMDModule(node) {
        var define = factory.createIdentifier("define"), moduleName = ts1.tryGetModuleNameFromFile(factory, node, host, compilerOptions), jsonSourceFile = ts1.isJsonSourceFile(node) && node, _a = collectAsynchronousDependencies(node, /*includeNonAmdDependencies*/ !0), aliasedModuleNames = _a.aliasedModuleNames, unaliasedModuleNames = _a.unaliasedModuleNames, importAliasNames = _a.importAliasNames, updated = factory.updateSourceFile(node, ts1.setTextRange(factory.createNodeArray([
            factory.createExpressionStatement(factory.createCallExpression(define, /*typeArguments*/ void 0, __spreadArray(__spreadArray([], moduleName ? [
                moduleName
            ] : [], !0), [
                // Add the dependency array argument:
                //
                //     ["require", "exports", module1", "module2", ...]
                factory.createArrayLiteralExpression(jsonSourceFile ? ts1.emptyArray : __spreadArray(__spreadArray([
                    factory.createStringLiteral("require"),
                    factory.createStringLiteral("exports")
                ], aliasedModuleNames, !0), unaliasedModuleNames, !0)),
                // Add the module body function argument:
                //
                //     function (require, exports, module1, module2) ...
                jsonSourceFile ? jsonSourceFile.statements.length ? jsonSourceFile.statements[0].expression : factory.createObjectLiteralExpression() : factory.createFunctionExpression(/*modifiers*/ void 0, /*asteriskToken*/ void 0, /*name*/ void 0, /*typeParameters*/ void 0, __spreadArray([
                    factory.createParameterDeclaration(/*decorators*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, "require"),
                    factory.createParameterDeclaration(/*decorators*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, "exports")
                ], importAliasNames, !0), /*type*/ void 0, transformAsynchronousModuleBody(node))
            ], !1)))
        ]), /*location*/ node.statements));
        return ts1.addEmitHelpers(updated, context.readEmitHelpers()), updated;
    }
    /**
         * Transforms a SourceFile into a UMD module.
         *
         * @param node The SourceFile node.
         */ function transformUMDModule(node) {
        var _a = collectAsynchronousDependencies(node, /*includeNonAmdDependencies*/ !1), aliasedModuleNames = _a.aliasedModuleNames, unaliasedModuleNames = _a.unaliasedModuleNames, importAliasNames = _a.importAliasNames, moduleName = ts1.tryGetModuleNameFromFile(factory, node, host, compilerOptions), umdHeader = factory.createFunctionExpression(/*modifiers*/ void 0, /*asteriskToken*/ void 0, /*name*/ void 0, /*typeParameters*/ void 0, [
            factory.createParameterDeclaration(/*decorators*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, "factory")
        ], /*type*/ void 0, ts1.setTextRange(factory.createBlock([
            factory.createIfStatement(factory.createLogicalAnd(factory.createTypeCheck(factory.createIdentifier("module"), "object"), factory.createTypeCheck(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), "object")), factory.createBlock([
                factory.createVariableStatement(/*modifiers*/ void 0, [
                    factory.createVariableDeclaration("v", /*exclamationToken*/ void 0, /*type*/ void 0, factory.createCallExpression(factory.createIdentifier("factory"), /*typeArguments*/ void 0, [
                        factory.createIdentifier("require"),
                        factory.createIdentifier("exports")
                    ]))
                ]),
                ts1.setEmitFlags(factory.createIfStatement(factory.createStrictInequality(factory.createIdentifier("v"), factory.createIdentifier("undefined")), factory.createExpressionStatement(factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), factory.createIdentifier("v")))), 1 /* SingleLine */ )
            ]), factory.createIfStatement(factory.createLogicalAnd(factory.createTypeCheck(factory.createIdentifier("define"), "function"), factory.createPropertyAccessExpression(factory.createIdentifier("define"), "amd")), factory.createBlock([
                factory.createExpressionStatement(factory.createCallExpression(factory.createIdentifier("define"), /*typeArguments*/ void 0, __spreadArray(__spreadArray([], moduleName ? [
                    moduleName
                ] : [], !0), [
                    factory.createArrayLiteralExpression(__spreadArray(__spreadArray([
                        factory.createStringLiteral("require"),
                        factory.createStringLiteral("exports")
                    ], aliasedModuleNames, !0), unaliasedModuleNames, !0)),
                    factory.createIdentifier("factory")
                ], !1)))
            ])))
        ], /*multiLine*/ !0), /*location*/ void 0)), updated = factory.updateSourceFile(node, ts1.setTextRange(factory.createNodeArray([
            factory.createExpressionStatement(factory.createCallExpression(umdHeader, /*typeArguments*/ void 0, [
                // Add the module body function argument:
                //
                //     function (require, exports) ...
                factory.createFunctionExpression(/*modifiers*/ void 0, /*asteriskToken*/ void 0, /*name*/ void 0, /*typeParameters*/ void 0, __spreadArray([
                    factory.createParameterDeclaration(/*decorators*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, "require"),
                    factory.createParameterDeclaration(/*decorators*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, "exports")
                ], importAliasNames, !0), /*type*/ void 0, transformAsynchronousModuleBody(node))
            ]))
        ]), /*location*/ node.statements));
        return ts1.addEmitHelpers(updated, context.readEmitHelpers()), updated;
    }
    /**
         * Collect the additional asynchronous dependencies for the module.
         *
         * @param node The source file.
         * @param includeNonAmdDependencies A value indicating whether to include non-AMD dependencies.
         */ function collectAsynchronousDependencies(node, includeNonAmdDependencies) {
        // Fill in amd-dependency tags
        for(var aliasedModuleNames = [], unaliasedModuleNames = [], importAliasNames = [], _i = 0, _a = node.amdDependencies; _i < _a.length; _i++){
            var amdDependency = _a[_i];
            amdDependency.name ? (aliasedModuleNames.push(factory.createStringLiteral(amdDependency.path)), importAliasNames.push(factory.createParameterDeclaration(/*decorators*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, amdDependency.name))) : unaliasedModuleNames.push(factory.createStringLiteral(amdDependency.path));
        }
        for(var _b = 0, _c = currentModuleInfo.externalImports; _b < _c.length; _b++){
            var importNode = _c[_b], externalModuleName = ts1.getExternalModuleNameLiteral(factory, importNode, currentSourceFile, host, resolver, compilerOptions), importAliasName = ts1.getLocalNameForExternalImport(factory, importNode, currentSourceFile);
            // It is possible that externalModuleName is undefined if it is not string literal.
            // This can happen in the invalid import syntax.
            // E.g : "import * from alias from 'someLib';"
            externalModuleName && (includeNonAmdDependencies && importAliasName ? (// Set emitFlags on the name of the classDeclaration
            // This is so that when printer will not substitute the identifier
            ts1.setEmitFlags(importAliasName, 4 /* NoSubstitution */ ), aliasedModuleNames.push(externalModuleName), importAliasNames.push(factory.createParameterDeclaration(/*decorators*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, importAliasName))) : unaliasedModuleNames.push(externalModuleName));
        }
        return {
            aliasedModuleNames: aliasedModuleNames,
            unaliasedModuleNames: unaliasedModuleNames,
            importAliasNames: importAliasNames
        };
    }
    function getAMDImportExpressionForImport(node) {
        if (!(ts1.isImportEqualsDeclaration(node) || ts1.isExportDeclaration(node)) && ts1.getExternalModuleNameLiteral(factory, node, currentSourceFile, host, resolver, compilerOptions)) {
            var name = ts1.getLocalNameForExternalImport(factory, node, currentSourceFile), expr = getHelperExpressionForImport(node, name); // TODO: GH#18217
            if (expr !== name) return factory.createExpressionStatement(factory.createAssignment(name, expr));
        }
    }
    /**
         * Transforms a SourceFile into an AMD or UMD module body.
         *
         * @param node The SourceFile node.
         */ function transformAsynchronousModuleBody(node) {
        startLexicalEnvironment();
        var statements = [], statementOffset = factory.copyPrologue(node.statements, statements, /*ensureUseStrict*/ !compilerOptions.noImplicitUseStrict, topLevelVisitor);
        shouldEmitUnderscoreUnderscoreESModule() && ts1.append(statements, createUnderscoreUnderscoreESModule()), ts1.length(currentModuleInfo.exportedNames) && ts1.append(statements, factory.createExpressionStatement(ts1.reduceLeft(currentModuleInfo.exportedNames, function(prev, nextId) {
            return factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.createIdentifier(ts1.idText(nextId))), prev);
        }, factory.createVoidZero()))), // Visit each statement of the module body.
        ts1.append(statements, ts1.visitNode(currentModuleInfo.externalHelpersImportDeclaration, topLevelVisitor, ts1.isStatement)), moduleKind === ts1.ModuleKind.AMD && ts1.addRange(statements, ts1.mapDefined(currentModuleInfo.externalImports, getAMDImportExpressionForImport)), ts1.addRange(statements, ts1.visitNodes(node.statements, topLevelVisitor, ts1.isStatement, statementOffset)), // Append the 'export =' statement if provided.
        addExportEqualsIfNeeded(statements, /*emitAsReturn*/ !0), // End the lexical environment for the module body
        // and merge any new lexical declarations.
        ts1.insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
        var body = factory.createBlock(statements, /*multiLine*/ !0);
        return needUMDDynamicImportHelper && ts1.addEmitHelper(body, dynamicImportUMDHelper), body;
    }
    /**
         * Adds the down-level representation of `export=` to the statement list if one exists
         * in the source file.
         *
         * @param statements The Statement list to modify.
         * @param emitAsReturn A value indicating whether to emit the `export=` statement as a
         * return statement.
         */ function addExportEqualsIfNeeded(statements, emitAsReturn) {
        if (currentModuleInfo.exportEquals) {
            var expressionResult = ts1.visitNode(currentModuleInfo.exportEquals.expression, visitor);
            if (expressionResult) {
                if (emitAsReturn) {
                    var statement = factory.createReturnStatement(expressionResult);
                    ts1.setTextRange(statement, currentModuleInfo.exportEquals), ts1.setEmitFlags(statement, 1920 /* NoComments */ ), statements.push(statement);
                } else {
                    var statement = factory.createExpressionStatement(factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), expressionResult));
                    ts1.setTextRange(statement, currentModuleInfo.exportEquals), ts1.setEmitFlags(statement, 1536 /* NoComments */ ), statements.push(statement);
                }
            }
        }
    }
    //
    // Top-Level Source Element Visitors
    //
    /**
         * Visits a node at the top level of the source file.
         *
         * @param node The node to visit.
         */ function topLevelVisitor(node) {
        switch(node.kind){
            case 265 /* ImportDeclaration */ :
                return(/**
         * Visits an ImportDeclaration node.
         *
         * @param node The node to visit.
         */ function(node) {
                    var statements, namespaceDeclaration = ts1.getNamespaceDeclarationNode(node);
                    if (moduleKind !== ts1.ModuleKind.AMD) {
                        if (!node.importClause) // import "mod";
                        return ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createRequireCall(node)), node), node);
                        var variables = [];
                        namespaceDeclaration && !ts1.isDefaultImport(node) ? // import * as n from "mod";
                        variables.push(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), /*exclamationToken*/ void 0, /*type*/ void 0, getHelperExpressionForImport(node, createRequireCall(node)))) : (// import d from "mod";
                        // import { x, y } from "mod";
                        // import d, { x, y } from "mod";
                        // import d, * as n from "mod";
                        variables.push(factory.createVariableDeclaration(factory.getGeneratedNameForNode(node), /*exclamationToken*/ void 0, /*type*/ void 0, getHelperExpressionForImport(node, createRequireCall(node)))), namespaceDeclaration && ts1.isDefaultImport(node) && variables.push(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), /*exclamationToken*/ void 0, /*type*/ void 0, factory.getGeneratedNameForNode(node)))), statements = ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createVariableStatement(/*modifiers*/ void 0, factory.createVariableDeclarationList(variables, languageVersion >= 2 /* ES2015 */  ? 2 /* Const */  : 0 /* None */ )), /*location*/ node), /*original*/ node));
                    } else namespaceDeclaration && ts1.isDefaultImport(node) && // import d, * as n from "mod";
                    (statements = ts1.append(statements, factory.createVariableStatement(/*modifiers*/ void 0, factory.createVariableDeclarationList([
                        ts1.setOriginalNode(ts1.setTextRange(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), /*exclamationToken*/ void 0, /*type*/ void 0, factory.getGeneratedNameForNode(node)), /*location*/ node), /*original*/ node)
                    ], languageVersion >= 2 /* ES2015 */  ? 2 /* Const */  : 0 /* None */ ))));
                    if (hasAssociatedEndOfDeclarationMarker(node)) {
                        // Defer exports until we encounter an EndOfDeclarationMarker node
                        var id = ts1.getOriginalNodeId(node);
                        deferredExports[id] = appendExportsOfImportDeclaration(deferredExports[id], node);
                    } else statements = appendExportsOfImportDeclaration(statements, node);
                    return ts1.singleOrMany(statements);
                }(node));
            case 264 /* ImportEqualsDeclaration */ :
                return(/**
         * Visits an ImportEqualsDeclaration node.
         *
         * @param node The node to visit.
         */ function(node) {
                    if (ts1.Debug.assert(ts1.isExternalModuleImportEqualsDeclaration(node), "import= for internal module references should be handled in an earlier transformer."), moduleKind !== ts1.ModuleKind.AMD ? statements = ts1.hasSyntacticModifier(node, 1 /* Export */ ) ? ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createExportExpression(node.name, createRequireCall(node))), node), node)) : ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createVariableStatement(/*modifiers*/ void 0, factory.createVariableDeclarationList([
                        factory.createVariableDeclaration(factory.cloneNode(node.name), /*exclamationToken*/ void 0, /*type*/ void 0, createRequireCall(node))
                    ], /*flags*/ languageVersion >= 2 /* ES2015 */  ? 2 /* Const */  : 0 /* None */ )), node), node)) : ts1.hasSyntacticModifier(node, 1 /* Export */ ) && (statements = ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createExportExpression(factory.getExportName(node), factory.getLocalName(node))), node), node))), hasAssociatedEndOfDeclarationMarker(node)) {
                        // Defer exports until we encounter an EndOfDeclarationMarker node
                        var statements, id = ts1.getOriginalNodeId(node);
                        deferredExports[id] = appendExportsOfImportEqualsDeclaration(deferredExports[id], node);
                    } else statements = appendExportsOfImportEqualsDeclaration(statements, node);
                    return ts1.singleOrMany(statements);
                }(node));
            case 271 /* ExportDeclaration */ :
                return(/**
         * Visits an ExportDeclaration node.
         *
         * @param The node to visit.
         */ function(node) {
                    if (node.moduleSpecifier) {
                        var innerExpr, generatedName = factory.getGeneratedNameForNode(node);
                        if (node.exportClause && ts1.isNamedExports(node.exportClause)) {
                            var statements = [];
                            // export { x, y } from "mod";
                            moduleKind !== ts1.ModuleKind.AMD && statements.push(ts1.setOriginalNode(ts1.setTextRange(factory.createVariableStatement(/*modifiers*/ void 0, factory.createVariableDeclarationList([
                                factory.createVariableDeclaration(generatedName, /*exclamationToken*/ void 0, /*type*/ void 0, createRequireCall(node))
                            ])), /*location*/ node), /* original */ node));
                            for(var _i = 0, _a = node.exportClause.elements; _i < _a.length; _i++){
                                var specifier = _a[_i];
                                if (0 /* ES3 */  === languageVersion) statements.push(ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(emitHelpers().createCreateBindingHelper(generatedName, factory.createStringLiteralFromNode(specifier.propertyName || specifier.name), specifier.propertyName ? factory.createStringLiteralFromNode(specifier.name) : void 0)), specifier), specifier));
                                else {
                                    var exportNeedsImportDefault = !!ts1.getESModuleInterop(compilerOptions) && !(67108864 /* NeverApplyImportHelper */  & ts1.getEmitFlags(node)) && "default" === ts1.idText(specifier.propertyName || specifier.name), exportedValue = factory.createPropertyAccessExpression(exportNeedsImportDefault ? emitHelpers().createImportDefaultHelper(generatedName) : generatedName, specifier.propertyName || specifier.name);
                                    statements.push(ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createExportExpression(factory.getExportName(specifier), exportedValue, /* location */ void 0, /* liveBinding */ !0)), specifier), specifier));
                                }
                            }
                            return ts1.singleOrMany(statements);
                        }
                        if (!node.exportClause) // export * from "mod";
                        return ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(emitHelpers().createExportStarHelper(moduleKind !== ts1.ModuleKind.AMD ? createRequireCall(node) : generatedName)), node), node);
                        var statements = [];
                        return(// export * as ns from "mod";
                        // export * as default from "mod";
                        statements.push(ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createExportExpression(factory.cloneNode(node.exportClause.name), (innerExpr = moduleKind !== ts1.ModuleKind.AMD ? createRequireCall(node) : ts1.isExportNamespaceAsDefaultDeclaration(node) ? generatedName : factory.createIdentifier(ts1.idText(node.exportClause.name)), !ts1.getESModuleInterop(compilerOptions) || 67108864 /* NeverApplyImportHelper */  & ts1.getEmitFlags(node) ? innerExpr : ts1.getExportNeedsImportStarHelper(node) ? emitHelpers().createImportStarHelper(innerExpr) : innerExpr))), node), node)), ts1.singleOrMany(statements));
                    }
                }(node));
            case 270 /* ExportAssignment */ :
                return(/**
         * Visits an ExportAssignment node.
         *
         * @param node The node to visit.
         */ function(node) {
                    if (!node.isExportEquals) {
                        var statements, original = node.original;
                        if (original && hasAssociatedEndOfDeclarationMarker(original)) {
                            // Defer exports until we encounter an EndOfDeclarationMarker node
                            var id = ts1.getOriginalNodeId(node);
                            deferredExports[id] = appendExportStatement(deferredExports[id], factory.createIdentifier("default"), ts1.visitNode(node.expression, visitor), /*location*/ node, /*allowComments*/ !0);
                        } else statements = appendExportStatement(statements, factory.createIdentifier("default"), ts1.visitNode(node.expression, visitor), /*location*/ node, /*allowComments*/ !0);
                        return ts1.singleOrMany(statements);
                    }
                }(node));
            case 236 /* VariableStatement */ :
                return(/**
         * Visits a VariableStatement node.
         *
         * @param node The node to visit.
         */ function(node) {
                    if (ts1.hasSyntacticModifier(node, 1 /* Export */ )) {
                        // If we're exporting these variables, then these just become assignments to 'exports.x'.
                        for(var statements, variables, expressions, modifiers = void 0, removeCommentsOnExpressions = !1, _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++){
                            var variable = _a[_i];
                            if (ts1.isIdentifier(variable.name) && ts1.isLocalName(variable.name)) modifiers || (modifiers = ts1.visitNodes(node.modifiers, modifierVisitor, ts1.isModifier)), variables = ts1.append(variables, variable);
                            else if (variable.initializer) {
                                if (!ts1.isBindingPattern(variable.name) && (ts1.isArrowFunction(variable.initializer) || ts1.isFunctionExpression(variable.initializer) || ts1.isClassExpression(variable.initializer))) {
                                    var expression = factory.createAssignment(ts1.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), variable.name), /*location*/ variable.name), factory.createIdentifier(ts1.getTextOfIdentifierOrLiteral(variable.name))), updatedVariable = factory.createVariableDeclaration(variable.name, variable.exclamationToken, variable.type, ts1.visitNode(variable.initializer, visitor));
                                    variables = ts1.append(variables, updatedVariable), expressions = ts1.append(expressions, expression), removeCommentsOnExpressions = !0;
                                } else expressions = ts1.append(expressions, ts1.isBindingPattern(variable.name) ? ts1.flattenDestructuringAssignment(ts1.visitNode(variable, visitor), /*visitor*/ void 0, context, 0 /* All */ , /*needsValue*/ !1, createAllExportExpressions) : factory.createAssignment(ts1.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), variable.name), /*location*/ variable.name), variable.initializer ? ts1.visitNode(variable.initializer, visitor) : factory.createVoidZero()));
                            }
                        }
                        if (variables && (statements = ts1.append(statements, factory.updateVariableStatement(node, modifiers, factory.updateVariableDeclarationList(node.declarationList, variables)))), expressions) {
                            var statement = ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(factory.inlineExpressions(expressions)), node), node);
                            removeCommentsOnExpressions && ts1.removeAllComments(statement), statements = ts1.append(statements, statement);
                        }
                    } else statements = ts1.append(statements, ts1.visitEachChild(node, visitor, context));
                    if (hasAssociatedEndOfDeclarationMarker(node)) {
                        // Defer exports until we encounter an EndOfDeclarationMarker node
                        var id = ts1.getOriginalNodeId(node);
                        deferredExports[id] = appendExportsOfVariableStatement(deferredExports[id], node);
                    } else statements = appendExportsOfVariableStatement(statements, node);
                    return ts1.singleOrMany(statements);
                }(node));
            case 255 /* FunctionDeclaration */ :
                return(/**
         * Visits a FunctionDeclaration node.
         *
         * @param node The node to visit.
         */ function(node) {
                    var statements;
                    if (statements = ts1.hasSyntacticModifier(node, 1 /* Export */ ) ? ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createFunctionDeclaration(/*decorators*/ void 0, ts1.visitNodes(node.modifiers, modifierVisitor, ts1.isModifier), node.asteriskToken, factory.getDeclarationName(node, /*allowComments*/ !0, /*allowSourceMaps*/ !0), /*typeParameters*/ void 0, ts1.visitNodes(node.parameters, visitor), /*type*/ void 0, ts1.visitEachChild(node.body, visitor, context)), /*location*/ node), /*original*/ node)) : ts1.append(statements, ts1.visitEachChild(node, visitor, context)), hasAssociatedEndOfDeclarationMarker(node)) {
                        // Defer exports until we encounter an EndOfDeclarationMarker node
                        var id = ts1.getOriginalNodeId(node);
                        deferredExports[id] = appendExportsOfHoistedDeclaration(deferredExports[id], node);
                    } else statements = appendExportsOfHoistedDeclaration(statements, node);
                    return ts1.singleOrMany(statements);
                }(node));
            case 256 /* ClassDeclaration */ :
                return(/**
         * Visits a ClassDeclaration node.
         *
         * @param node The node to visit.
         */ function(node) {
                    var statements;
                    if (statements = ts1.hasSyntacticModifier(node, 1 /* Export */ ) ? ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createClassDeclaration(/*decorators*/ void 0, ts1.visitNodes(node.modifiers, modifierVisitor, ts1.isModifier), factory.getDeclarationName(node, /*allowComments*/ !0, /*allowSourceMaps*/ !0), /*typeParameters*/ void 0, ts1.visitNodes(node.heritageClauses, visitor), ts1.visitNodes(node.members, visitor)), node), node)) : ts1.append(statements, ts1.visitEachChild(node, visitor, context)), hasAssociatedEndOfDeclarationMarker(node)) {
                        // Defer exports until we encounter an EndOfDeclarationMarker node
                        var id = ts1.getOriginalNodeId(node);
                        deferredExports[id] = appendExportsOfHoistedDeclaration(deferredExports[id], node);
                    } else statements = appendExportsOfHoistedDeclaration(statements, node);
                    return ts1.singleOrMany(statements);
                }(node));
            case 350 /* MergeDeclarationMarker */ :
                return(/**
         * Visits a MergeDeclarationMarker used as a placeholder for the beginning of a merged
         * and transformed declaration.
         *
         * @param node The node to visit.
         */ function(node) {
                    // For an EnumDeclaration or ModuleDeclaration that merges with a preceeding
                    // declaration we do not emit a leading variable declaration. To preserve the
                    // begin/end semantics of the declararation and to properly handle exports
                    // we wrapped the leading variable declaration in a `MergeDeclarationMarker`.
                    //
                    // To balance the declaration, add the exports of the elided variable
                    // statement.
                    if (hasAssociatedEndOfDeclarationMarker(node) && 236 /* VariableStatement */  === node.original.kind) {
                        var id = ts1.getOriginalNodeId(node);
                        deferredExports[id] = appendExportsOfVariableStatement(deferredExports[id], node.original);
                    }
                    return node;
                }(node));
            case 351 /* EndOfDeclarationMarker */ :
                var id, statements;
                return (statements = deferredExports[id = ts1.getOriginalNodeId(node)]) ? (delete deferredExports[id], ts1.append(statements, node)) : node;
            default:
                return visitor(node);
        }
    }
    function visitorWorker(node, valueIsDiscarded) {
        // This visitor does not need to descend into the tree if there is no dynamic import, destructuring assignment, or update expression
        // as export/import statements are only transformed at the top level of a file.
        if (!(71307264 /* ContainsUpdateExpressionForIdentifier */  & node.transformFlags)) return node;
        switch(node.kind){
            case 241 /* ForStatement */ :
                return factory.updateForStatement(node, ts1.visitNode(node.initializer, discardedValueVisitor, ts1.isForInitializer), ts1.visitNode(node.condition, visitor, ts1.isExpression), ts1.visitNode(node.incrementor, discardedValueVisitor, ts1.isExpression), ts1.visitIterationBody(node.statement, visitor, context));
            case 237 /* ExpressionStatement */ :
                return factory.updateExpressionStatement(node, ts1.visitNode(node.expression, discardedValueVisitor, ts1.isExpression));
            case 211 /* ParenthesizedExpression */ :
                return factory.updateParenthesizedExpression(node, ts1.visitNode(node.expression, valueIsDiscarded ? discardedValueVisitor : visitor, ts1.isExpression));
            case 348 /* PartiallyEmittedExpression */ :
                return factory.updatePartiallyEmittedExpression(node, ts1.visitNode(node.expression, valueIsDiscarded ? discardedValueVisitor : visitor, ts1.isExpression));
            case 207 /* CallExpression */ :
                if (ts1.isImportCall(node) && void 0 === currentSourceFile.impliedNodeFormat) return function(node) {
                    var externalModuleName = ts1.getExternalModuleNameLiteral(factory, node, currentSourceFile, host, resolver, compilerOptions), firstArgument = ts1.visitNode(ts1.firstOrUndefined(node.arguments), visitor), argument = !externalModuleName || firstArgument && ts1.isStringLiteral(firstArgument) && firstArgument.text === externalModuleName.text ? firstArgument : externalModuleName, containsLexicalThis = !!(8192 /* ContainsLexicalThis */  & node.transformFlags);
                    switch(compilerOptions.module){
                        case ts1.ModuleKind.AMD:
                            return createImportCallExpressionAMD(argument, containsLexicalThis);
                        case ts1.ModuleKind.UMD:
                            return function(arg, containsLexicalThis) {
                                if (// (function (factory) {
                                //      ... (regular UMD)
                                // }
                                // })(function (require, exports, useSyncRequire) {
                                //      "use strict";
                                //      Object.defineProperty(exports, "__esModule", { value: true });
                                //      var __syncRequire = typeof module === "object" && typeof module.exports === "object";
                                //      var __resolved = new Promise(function (resolve) { resolve(); });
                                //      .....
                                //      __syncRequire
                                //          ? __resolved.then(function () { return require(x); }) /*CommonJs Require*/
                                //          : new Promise(function (_a, _b) { require([x], _a, _b); }); /*Amd Require*/
                                // });
                                needUMDDynamicImportHelper = !0, ts1.isSimpleCopiableExpression(arg)) {
                                    var argClone = ts1.isGeneratedIdentifier(arg) ? arg : ts1.isStringLiteral(arg) ? factory.createStringLiteralFromNode(arg) : ts1.setEmitFlags(ts1.setTextRange(factory.cloneNode(arg), arg), 1536 /* NoComments */ );
                                    return factory.createConditionalExpression(/*condition*/ factory.createIdentifier("__syncRequire"), /*questionToken*/ void 0, /*whenTrue*/ createImportCallExpressionCommonJS(arg, containsLexicalThis), /*colonToken*/ void 0, /*whenFalse*/ createImportCallExpressionAMD(argClone, containsLexicalThis));
                                }
                                var temp = factory.createTempVariable(hoistVariableDeclaration);
                                return factory.createComma(factory.createAssignment(temp, arg), factory.createConditionalExpression(/*condition*/ factory.createIdentifier("__syncRequire"), /*questionToken*/ void 0, /*whenTrue*/ createImportCallExpressionCommonJS(temp, containsLexicalThis), /*colonToken*/ void 0, /*whenFalse*/ createImportCallExpressionAMD(temp, containsLexicalThis)));
                            }(null != argument ? argument : factory.createVoidZero(), containsLexicalThis);
                        case ts1.ModuleKind.CommonJS:
                        default:
                            return createImportCallExpressionCommonJS(argument, containsLexicalThis);
                    }
                }(node);
                break;
            case 220 /* BinaryExpression */ :
                if (ts1.isDestructuringAssignment(node)) return !function destructuringNeedsFlattening(node) {
                    if (ts1.isObjectLiteralExpression(node)) for(var _i = 0, _a = node.properties; _i < _a.length; _i++){
                        var elem = _a[_i];
                        switch(elem.kind){
                            case 294 /* PropertyAssignment */ :
                                if (destructuringNeedsFlattening(elem.initializer)) return !0;
                                break;
                            case 295 /* ShorthandPropertyAssignment */ :
                                if (destructuringNeedsFlattening(elem.name)) return !0;
                                break;
                            case 296 /* SpreadAssignment */ :
                                if (destructuringNeedsFlattening(elem.expression)) return !0;
                                break;
                            case 168 /* MethodDeclaration */ :
                            case 171 /* GetAccessor */ :
                            case 172 /* SetAccessor */ :
                                return !1;
                            default:
                                ts1.Debug.assertNever(elem, "Unhandled object member kind");
                        }
                    }
                    else if (ts1.isArrayLiteralExpression(node)) for(var _b = 0, _c = node.elements; _b < _c.length; _b++){
                        var elem = _c[_b];
                        if (ts1.isSpreadElement(elem)) {
                            if (destructuringNeedsFlattening(elem.expression)) return !0;
                        } else if (destructuringNeedsFlattening(elem)) return !0;
                    }
                    else if (ts1.isIdentifier(node)) return ts1.length(getExports(node)) > (ts1.isExportName(node) ? 1 : 0);
                    return !1;
                }(node.left) ? ts1.visitEachChild(node, visitor, context) : ts1.flattenDestructuringAssignment(node, visitor, context, 0 /* All */ , !valueIsDiscarded, createAllExportExpressions);
                break;
            case 218 /* PrefixUnaryExpression */ :
            case 219 /* PostfixUnaryExpression */ :
                return function(node, valueIsDiscarded) {
                    // When we see a prefix or postfix increment expression whose operand is an exported
                    // symbol, we should ensure all exports of that symbol are updated with the correct
                    // value.
                    //
                    // - We do not transform generated identifiers for any reason.
                    // - We do not transform identifiers tagged with the LocalName flag.
                    // - We do not transform identifiers that were originally the name of an enum or
                    //   namespace due to how they are transformed in TypeScript.
                    // - We only transform identifiers that are exported at the top level.
                    if ((45 /* PlusPlusToken */  === node.operator || 46 /* MinusMinusToken */  === node.operator) && ts1.isIdentifier(node.operand) && !ts1.isGeneratedIdentifier(node.operand) && !ts1.isLocalName(node.operand) && !ts1.isDeclarationNameOfEnumOrNamespace(node.operand)) {
                        var exportedNames = getExports(node.operand);
                        if (exportedNames) {
                            var temp = void 0, expression = ts1.visitNode(node.operand, visitor, ts1.isExpression);
                            ts1.isPrefixUnaryExpression(node) ? expression = factory.updatePrefixUnaryExpression(node, expression) : (expression = factory.updatePostfixUnaryExpression(node, expression), valueIsDiscarded || (temp = factory.createTempVariable(hoistVariableDeclaration), expression = factory.createAssignment(temp, expression), ts1.setTextRange(expression, node)), expression = factory.createComma(expression, factory.cloneNode(node.operand)), ts1.setTextRange(expression, node));
                            for(var _i = 0; _i < exportedNames.length; _i++){
                                var exportName = exportedNames[_i];
                                noSubstitution[ts1.getNodeId(expression)] = !0, expression = createExportExpression(exportName, expression), ts1.setTextRange(expression, node);
                            }
                            return temp && (noSubstitution[ts1.getNodeId(expression)] = !0, expression = factory.createComma(expression, temp), ts1.setTextRange(expression, node)), expression;
                        }
                    }
                    return ts1.visitEachChild(node, visitor, context);
                }(node, valueIsDiscarded);
        }
        return ts1.visitEachChild(node, visitor, context);
    }
    function visitor(node) {
        return visitorWorker(node, /*valueIsDiscarded*/ !1);
    }
    function discardedValueVisitor(node) {
        return visitorWorker(node, /*valueIsDiscarded*/ !0);
    }
    function createImportCallExpressionAMD(arg, containsLexicalThis) {
        // improt("./blah")
        // emit as
        // define(["require", "exports", "blah"], function (require, exports) {
        //     ...
        //     new Promise(function (_a, _b) { require([x], _a, _b); }); /*Amd Require*/
        // });
        var func, resolve = factory.createUniqueName("resolve"), reject = factory.createUniqueName("reject"), parameters = [
            factory.createParameterDeclaration(/*decorator*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, /*name*/ resolve),
            factory.createParameterDeclaration(/*decorator*/ void 0, /*modifiers*/ void 0, /*dotDotDotToken*/ void 0, /*name*/ reject)
        ], body = factory.createBlock([
            factory.createExpressionStatement(factory.createCallExpression(factory.createIdentifier("require"), /*typeArguments*/ void 0, [
                factory.createArrayLiteralExpression([
                    arg || factory.createOmittedExpression()
                ]),
                resolve,
                reject
            ]))
        ]);
        languageVersion >= 2 /* ES2015 */  ? func = factory.createArrowFunction(/*modifiers*/ void 0, /*typeParameters*/ void 0, parameters, /*type*/ void 0, /*equalsGreaterThanToken*/ void 0, body) : (func = factory.createFunctionExpression(/*modifiers*/ void 0, /*asteriskToken*/ void 0, /*name*/ void 0, /*typeParameters*/ void 0, parameters, /*type*/ void 0, body), containsLexicalThis && ts1.setEmitFlags(func, 8 /* CapturesThis */ ));
        var promise = factory.createNewExpression(factory.createIdentifier("Promise"), /*typeArguments*/ void 0, [
            func
        ]);
        return ts1.getESModuleInterop(compilerOptions) ? factory.createCallExpression(factory.createPropertyAccessExpression(promise, factory.createIdentifier("then")), /*typeArguments*/ void 0, [
            emitHelpers().createImportStarCallbackHelper()
        ]) : promise;
    }
    function createImportCallExpressionCommonJS(arg, containsLexicalThis) {
        // import("./blah")
        // emit as
        // Promise.resolve().then(function () { return require(x); }) /*CommonJs Require*/
        // We have to wrap require in then callback so that require is done in asynchronously
        // if we simply do require in resolve callback in Promise constructor. We will execute the loading immediately
        var func, promiseResolveCall = factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Promise"), "resolve"), /*typeArguments*/ void 0, /*argumentsArray*/ []), requireCall = factory.createCallExpression(factory.createIdentifier("require"), /*typeArguments*/ void 0, arg ? [
            arg
        ] : []);
        return ts1.getESModuleInterop(compilerOptions) && (requireCall = emitHelpers().createImportStarHelper(requireCall)), languageVersion >= 2 /* ES2015 */  ? func = factory.createArrowFunction(/*modifiers*/ void 0, /*typeParameters*/ void 0, /*parameters*/ [], /*type*/ void 0, /*equalsGreaterThanToken*/ void 0, requireCall) : (func = factory.createFunctionExpression(/*modifiers*/ void 0, /*asteriskToken*/ void 0, /*name*/ void 0, /*typeParameters*/ void 0, /*parameters*/ [], /*type*/ void 0, factory.createBlock([
            factory.createReturnStatement(requireCall)
        ])), containsLexicalThis && ts1.setEmitFlags(func, 8 /* CapturesThis */ )), factory.createCallExpression(factory.createPropertyAccessExpression(promiseResolveCall, "then"), /*typeArguments*/ void 0, [
            func
        ]);
    }
    function getHelperExpressionForImport(node, innerExpr) {
        return !ts1.getESModuleInterop(compilerOptions) || 67108864 /* NeverApplyImportHelper */  & ts1.getEmitFlags(node) ? innerExpr : ts1.getImportNeedsImportStarHelper(node) ? emitHelpers().createImportStarHelper(innerExpr) : ts1.getImportNeedsImportDefaultHelper(node) ? emitHelpers().createImportDefaultHelper(innerExpr) : innerExpr;
    }
    /**
         * Creates a `require()` call to import an external module.
         *
         * @param importNode The declararation to import.
         */ function createRequireCall(importNode) {
        var moduleName = ts1.getExternalModuleNameLiteral(factory, importNode, currentSourceFile, host, resolver, compilerOptions), args = [];
        return moduleName && args.push(moduleName), factory.createCallExpression(factory.createIdentifier("require"), /*typeArguments*/ void 0, args);
    }
    function createAllExportExpressions(name, value, location) {
        var exportedNames = getExports(name);
        if (exportedNames) {
            for(var expression = ts1.isExportName(name) ? value : factory.createAssignment(name, value), _i = 0; _i < exportedNames.length; _i++){
                var exportName = exportedNames[_i];
                // Mark the node to prevent triggering substitution.
                ts1.setEmitFlags(expression, 4 /* NoSubstitution */ ), expression = createExportExpression(exportName, expression, /*location*/ location);
            }
            return expression;
        }
        return factory.createAssignment(name, value);
    }
    /**
         * Determines whether a node has an associated EndOfDeclarationMarker.
         *
         * @param node The node to test.
         */ function hasAssociatedEndOfDeclarationMarker(node) {
        return (4194304 /* HasEndOfDeclarationMarker */  & ts1.getEmitFlags(node)) != 0;
    }
    /**
         * Appends the exports of an ImportDeclaration to a statement list, returning the
         * statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param decl The declaration whose exports are to be recorded.
         */ function appendExportsOfImportDeclaration(statements, decl) {
        if (currentModuleInfo.exportEquals) return statements;
        var importClause = decl.importClause;
        if (!importClause) return statements;
        importClause.name && (statements = appendExportsOfDeclaration(statements, importClause));
        var namedBindings = importClause.namedBindings;
        if (namedBindings) switch(namedBindings.kind){
            case 267 /* NamespaceImport */ :
                statements = appendExportsOfDeclaration(statements, namedBindings);
                break;
            case 268 /* NamedImports */ :
                for(var _i = 0, _a = namedBindings.elements; _i < _a.length; _i++)statements = appendExportsOfDeclaration(statements, _a[_i], /* liveBinding */ !0);
        }
        return statements;
    }
    /**
         * Appends the exports of an ImportEqualsDeclaration to a statement list, returning the
         * statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param decl The declaration whose exports are to be recorded.
         */ function appendExportsOfImportEqualsDeclaration(statements, decl) {
        return currentModuleInfo.exportEquals ? statements : appendExportsOfDeclaration(statements, decl);
    }
    /**
         * Appends the exports of a VariableStatement to a statement list, returning the statement
         * list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param node The VariableStatement whose exports are to be recorded.
         */ function appendExportsOfVariableStatement(statements, node) {
        if (currentModuleInfo.exportEquals) return statements;
        for(var _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++)statements = /**
         * Appends the exports of a VariableDeclaration or BindingElement to a statement list,
         * returning the statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param decl The declaration whose exports are to be recorded.
         */ function appendExportsOfBindingElement(statements, decl) {
            if (currentModuleInfo.exportEquals) return statements;
            if (ts1.isBindingPattern(decl.name)) for(var _i = 0, _a = decl.name.elements; _i < _a.length; _i++){
                var element = _a[_i];
                ts1.isOmittedExpression(element) || (statements = appendExportsOfBindingElement(statements, element));
            }
            else ts1.isGeneratedIdentifier(decl.name) || (statements = appendExportsOfDeclaration(statements, decl));
            return statements;
        }(statements, _a[_i]);
        return statements;
    }
    /**
         * Appends the exports of a ClassDeclaration or FunctionDeclaration to a statement list,
         * returning the statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param decl The declaration whose exports are to be recorded.
         */ function appendExportsOfHoistedDeclaration(statements, decl) {
        return currentModuleInfo.exportEquals || (ts1.hasSyntacticModifier(decl, 1 /* Export */ ) && (statements = appendExportStatement(statements, ts1.hasSyntacticModifier(decl, 512 /* Default */ ) ? factory.createIdentifier("default") : factory.getDeclarationName(decl), factory.getLocalName(decl), /*location*/ decl)), decl.name && (statements = appendExportsOfDeclaration(statements, decl))), statements;
    }
    /**
         * Appends the exports of a declaration to a statement list, returning the statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param decl The declaration to export.
         */ function appendExportsOfDeclaration(statements, decl, liveBinding) {
        var name = factory.getDeclarationName(decl), exportSpecifiers = currentModuleInfo.exportSpecifiers.get(ts1.idText(name));
        if (exportSpecifiers) for(var _i = 0; _i < exportSpecifiers.length; _i++){
            var exportSpecifier = exportSpecifiers[_i];
            statements = appendExportStatement(statements, exportSpecifier.name, name, /*location*/ exportSpecifier.name, /* allowComments */ void 0, liveBinding);
        }
        return statements;
    }
    /**
         * Appends the down-level representation of an export to a statement list, returning the
         * statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param exportName The name of the export.
         * @param expression The expression to export.
         * @param location The location to use for source maps and comments for the export.
         * @param allowComments Whether to allow comments on the export.
         */ function appendExportStatement(statements, exportName, expression, location, allowComments, liveBinding) {
        var statement;
        return statements = ts1.append(statements, (statement = ts1.setTextRange(factory.createExpressionStatement(createExportExpression(exportName, expression, /* location */ void 0, liveBinding)), location), ts1.startOnNewLine(statement), allowComments || ts1.setEmitFlags(statement, 1536 /* NoComments */ ), statement));
    }
    function createUnderscoreUnderscoreESModule() {
        var statement;
        return statement = 0 /* ES3 */  === languageVersion ? factory.createExpressionStatement(createExportExpression(factory.createIdentifier("__esModule"), factory.createTrue())) : factory.createExpressionStatement(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Object"), "defineProperty"), /*typeArguments*/ void 0, [
            factory.createIdentifier("exports"),
            factory.createStringLiteral("__esModule"),
            factory.createObjectLiteralExpression([
                factory.createPropertyAssignment("value", factory.createTrue())
            ])
        ])), ts1.setEmitFlags(statement, 1048576 /* CustomPrologue */ ), statement;
    }
    /**
         * Creates a call to the current file's export function to export a value.
         *
         * @param name The bound name of the export.
         * @param value The exported value.
         * @param location The location to use for source maps and comments for the export.
         */ function createExportExpression(name, value, location, liveBinding) {
        return ts1.setTextRange(liveBinding && 0 /* ES3 */  !== languageVersion ? factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Object"), "defineProperty"), /*typeArguments*/ void 0, [
            factory.createIdentifier("exports"),
            factory.createStringLiteralFromNode(name),
            factory.createObjectLiteralExpression([
                factory.createPropertyAssignment("enumerable", factory.createTrue()),
                factory.createPropertyAssignment("get", factory.createFunctionExpression(/*modifiers*/ void 0, /*asteriskToken*/ void 0, /*name*/ void 0, /*typeParameters*/ void 0, /*parameters*/ [], /*type*/ void 0, factory.createBlock([
                    factory.createReturnStatement(value)
                ])))
            ])
        ]) : factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.cloneNode(name)), value), location);
    }
    //
    // Modifier Visitors
    //
    /**
         * Visit nodes to elide module-specific modifiers.
         *
         * @param node The node to visit.
         */ function modifierVisitor(node) {
        // Elide module-specific modifiers.
        switch(node.kind){
            case 93 /* ExportKeyword */ :
            case 88 /* DefaultKeyword */ :
                return;
        }
        return node;
    }
    /**
         * Substitution for an Identifier expression that may contain an imported or exported
         * symbol.
         *
         * @param node The node to substitute.
         */ function substituteExpressionIdentifier(node) {
        var _a, _b;
        if (4096 /* HelperName */  & ts1.getEmitFlags(node)) {
            var externalHelpersModuleName = ts1.getExternalHelpersModuleName(currentSourceFile);
            if (externalHelpersModuleName) return factory.createPropertyAccessExpression(externalHelpersModuleName, node);
        } else if (!(ts1.isGeneratedIdentifier(node) && !(64 /* AllowNameSubstitution */  & node.autoGenerateFlags)) && !ts1.isLocalName(node)) {
            var exportContainer = resolver.getReferencedExportContainer(node, ts1.isExportName(node));
            if (exportContainer && 303 /* SourceFile */  === exportContainer.kind) return ts1.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.cloneNode(node)), /*location*/ node);
            var importDeclaration = resolver.getReferencedImportDeclaration(node);
            if (importDeclaration) {
                if (ts1.isImportClause(importDeclaration)) return ts1.setTextRange(factory.createPropertyAccessExpression(factory.getGeneratedNameForNode(importDeclaration.parent), factory.createIdentifier("default")), /*location*/ node);
                if (ts1.isImportSpecifier(importDeclaration)) {
                    var name = importDeclaration.propertyName || importDeclaration.name;
                    return ts1.setTextRange(factory.createPropertyAccessExpression(factory.getGeneratedNameForNode((null === (_b = null === (_a = importDeclaration.parent) || void 0 === _a ? void 0 : _a.parent) || void 0 === _b ? void 0 : _b.parent) || importDeclaration), factory.cloneNode(name)), /*location*/ node);
                }
            }
        }
        return node;
    }
    /**
         * Gets the additional exports of a name.
         *
         * @param name The name.
         */ function getExports(name) {
        if (!ts1.isGeneratedIdentifier(name)) {
            var valueDeclaration = resolver.getReferencedImportDeclaration(name) || resolver.getReferencedValueDeclaration(name);
            if (valueDeclaration) return currentModuleInfo && currentModuleInfo.exportedBindings[ts1.getOriginalNodeId(valueDeclaration)];
        }
    }
}, dynamicImportUMDHelper = {
    name: "typescript:dynamicimport-sync-require",
    scoped: !0,
    text: "\n            var __syncRequire = typeof module === \"object\" && typeof module.exports === \"object\";"
};
