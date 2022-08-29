var ts;
!function(ts) {
    ts.transformModule = function(context) {
        var currentSourceFile, currentModuleInfo, needUMDDynamicImportHelper, factory = context.factory, emitHelpers = context.getEmitHelperFactory, startLexicalEnvironment = context.startLexicalEnvironment, endLexicalEnvironment = context.endLexicalEnvironment, hoistVariableDeclaration = context.hoistVariableDeclaration, compilerOptions = context.getCompilerOptions(), resolver = context.getEmitResolver(), host = context.getEmitHost(), languageVersion = ts.getEmitScriptTarget(compilerOptions), moduleKind = ts.getEmitModuleKind(compilerOptions), previousOnSubstituteNode = context.onSubstituteNode, previousOnEmitNode = context.onEmitNode;
        context.onSubstituteNode = function(hint, node) {
            return (node = previousOnSubstituteNode(hint, node)).id && noSubstitution[node.id] ? node : 1 === hint ? substituteExpression(node) : ts.isShorthandPropertyAssignment(node) ? substituteShorthandPropertyAssignment(node) : node;
        }, context.onEmitNode = function(hint, node, emitCallback) {
            303 === node.kind ? (currentSourceFile = node, currentModuleInfo = moduleInfoMap[ts.getOriginalNodeId(currentSourceFile)], previousOnEmitNode(hint, node, emitCallback), currentSourceFile = void 0, currentModuleInfo = void 0) : previousOnEmitNode(hint, node, emitCallback);
        }, context.enableSubstitution(207), context.enableSubstitution(209), context.enableSubstitution(79), context.enableSubstitution(220), context.enableSubstitution(295), context.enableEmitNotification(303);
        var moduleInfoMap = [], deferredExports = [], noSubstitution = [];
        return ts.chainBundle(context, function(node) {
            if (node.isDeclarationFile || !(ts.isEffectiveExternalModule(node, compilerOptions) || 4194304 & node.transformFlags || ts.isJsonSourceFile(node) && ts.hasJsonModuleEmitEnabled(compilerOptions) && ts.outFile(compilerOptions))) return node;
            currentSourceFile = node, currentModuleInfo = ts.collectExternalModuleInfo(context, node, resolver, compilerOptions), moduleInfoMap[ts.getOriginalNodeId(node)] = currentModuleInfo;
            var transformModule = function(moduleKind) {
                switch(moduleKind){
                    case ts.ModuleKind.AMD:
                        return transformAMDModule;
                    case ts.ModuleKind.UMD:
                        return transformUMDModule;
                    default:
                        return transformCommonJSModule;
                }
            }(moduleKind), updated = transformModule(node);
            return currentSourceFile = void 0, currentModuleInfo = void 0, needUMDDynamicImportHelper = !1, updated;
        });
        function shouldEmitUnderscoreUnderscoreESModule() {
            return !!(!currentModuleInfo.exportEquals && ts.isExternalModule(currentSourceFile));
        }
        function transformCommonJSModule(node) {
            startLexicalEnvironment();
            var statements = [], ensureUseStrict = ts.getStrictOptionValue(compilerOptions, "alwaysStrict") || !compilerOptions.noImplicitUseStrict && ts.isExternalModule(currentSourceFile), statementOffset = factory.copyPrologue(node.statements, statements, ensureUseStrict && !ts.isJsonSourceFile(node), topLevelVisitor);
            if (shouldEmitUnderscoreUnderscoreESModule() && ts.append(statements, createUnderscoreUnderscoreESModule()), ts.length(currentModuleInfo.exportedNames)) for(var i = 0; i < currentModuleInfo.exportedNames.length; i += 50)ts.append(statements, factory.createExpressionStatement(ts.reduceLeft(currentModuleInfo.exportedNames.slice(i, i + 50), function(prev, nextId) {
                return factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.createIdentifier(ts.idText(nextId))), prev);
            }, factory.createVoidZero())));
            ts.append(statements, ts.visitNode(currentModuleInfo.externalHelpersImportDeclaration, topLevelVisitor, ts.isStatement)), ts.addRange(statements, ts.visitNodes(node.statements, topLevelVisitor, ts.isStatement, statementOffset)), addExportEqualsIfNeeded(statements, !1), ts.insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
            var updated = factory.updateSourceFile(node, ts.setTextRange(factory.createNodeArray(statements), node.statements));
            return ts.addEmitHelpers(updated, context.readEmitHelpers()), updated;
        }
        function transformAMDModule(node) {
            var define = factory.createIdentifier("define"), moduleName = ts.tryGetModuleNameFromFile(factory, node, host, compilerOptions), jsonSourceFile = ts.isJsonSourceFile(node) && node, _a = collectAsynchronousDependencies(node, !0), aliasedModuleNames = _a.aliasedModuleNames, unaliasedModuleNames = _a.unaliasedModuleNames, importAliasNames = _a.importAliasNames, updated = factory.updateSourceFile(node, ts.setTextRange(factory.createNodeArray([
                factory.createExpressionStatement(factory.createCallExpression(define, void 0, __spreadArray(__spreadArray([], moduleName ? [
                    moduleName
                ] : [], !0), [
                    factory.createArrayLiteralExpression(jsonSourceFile ? ts.emptyArray : __spreadArray(__spreadArray([
                        factory.createStringLiteral("require"),
                        factory.createStringLiteral("exports")
                    ], aliasedModuleNames, !0), unaliasedModuleNames, !0)),
                    jsonSourceFile ? jsonSourceFile.statements.length ? jsonSourceFile.statements[0].expression : factory.createObjectLiteralExpression() : factory.createFunctionExpression(void 0, void 0, void 0, void 0, __spreadArray([
                        factory.createParameterDeclaration(void 0, void 0, void 0, "require"),
                        factory.createParameterDeclaration(void 0, void 0, void 0, "exports")
                    ], importAliasNames, !0), void 0, transformAsynchronousModuleBody(node))
                ], !1)))
            ]), node.statements));
            return ts.addEmitHelpers(updated, context.readEmitHelpers()), updated;
        }
        function transformUMDModule(node) {
            var _a = collectAsynchronousDependencies(node, !1), aliasedModuleNames = _a.aliasedModuleNames, unaliasedModuleNames = _a.unaliasedModuleNames, importAliasNames = _a.importAliasNames, moduleName = ts.tryGetModuleNameFromFile(factory, node, host, compilerOptions), umdHeader = factory.createFunctionExpression(void 0, void 0, void 0, void 0, [
                factory.createParameterDeclaration(void 0, void 0, void 0, "factory")
            ], void 0, ts.setTextRange(factory.createBlock([
                factory.createIfStatement(factory.createLogicalAnd(factory.createTypeCheck(factory.createIdentifier("module"), "object"), factory.createTypeCheck(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), "object")), factory.createBlock([
                    factory.createVariableStatement(void 0, [
                        factory.createVariableDeclaration("v", void 0, void 0, factory.createCallExpression(factory.createIdentifier("factory"), void 0, [
                            factory.createIdentifier("require"),
                            factory.createIdentifier("exports")
                        ]))
                    ]),
                    ts.setEmitFlags(factory.createIfStatement(factory.createStrictInequality(factory.createIdentifier("v"), factory.createIdentifier("undefined")), factory.createExpressionStatement(factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), factory.createIdentifier("v")))), 1)
                ]), factory.createIfStatement(factory.createLogicalAnd(factory.createTypeCheck(factory.createIdentifier("define"), "function"), factory.createPropertyAccessExpression(factory.createIdentifier("define"), "amd")), factory.createBlock([
                    factory.createExpressionStatement(factory.createCallExpression(factory.createIdentifier("define"), void 0, __spreadArray(__spreadArray([], moduleName ? [
                        moduleName
                    ] : [], !0), [
                        factory.createArrayLiteralExpression(__spreadArray(__spreadArray([
                            factory.createStringLiteral("require"),
                            factory.createStringLiteral("exports")
                        ], aliasedModuleNames, !0), unaliasedModuleNames, !0)),
                        factory.createIdentifier("factory")
                    ], !1)))
                ])))
            ], !0), void 0)), updated = factory.updateSourceFile(node, ts.setTextRange(factory.createNodeArray([
                factory.createExpressionStatement(factory.createCallExpression(umdHeader, void 0, [
                    factory.createFunctionExpression(void 0, void 0, void 0, void 0, __spreadArray([
                        factory.createParameterDeclaration(void 0, void 0, void 0, "require"),
                        factory.createParameterDeclaration(void 0, void 0, void 0, "exports")
                    ], importAliasNames, !0), void 0, transformAsynchronousModuleBody(node))
                ]))
            ]), node.statements));
            return ts.addEmitHelpers(updated, context.readEmitHelpers()), updated;
        }
        function collectAsynchronousDependencies(node, includeNonAmdDependencies) {
            for(var aliasedModuleNames = [], unaliasedModuleNames = [], importAliasNames = [], _i = 0, _a = node.amdDependencies; _i < _a.length; _i++){
                var amdDependency = _a[_i];
                amdDependency.name ? (aliasedModuleNames.push(factory.createStringLiteral(amdDependency.path)), importAliasNames.push(factory.createParameterDeclaration(void 0, void 0, void 0, amdDependency.name))) : unaliasedModuleNames.push(factory.createStringLiteral(amdDependency.path));
            }
            for(var _b = 0, _c = currentModuleInfo.externalImports; _b < _c.length; _b++){
                var importNode = _c[_b], externalModuleName = ts.getExternalModuleNameLiteral(factory, importNode, currentSourceFile, host, resolver, compilerOptions), importAliasName = ts.getLocalNameForExternalImport(factory, importNode, currentSourceFile);
                externalModuleName && (includeNonAmdDependencies && importAliasName ? (ts.setEmitFlags(importAliasName, 4), aliasedModuleNames.push(externalModuleName), importAliasNames.push(factory.createParameterDeclaration(void 0, void 0, void 0, importAliasName))) : unaliasedModuleNames.push(externalModuleName));
            }
            return {
                aliasedModuleNames: aliasedModuleNames,
                unaliasedModuleNames: unaliasedModuleNames,
                importAliasNames: importAliasNames
            };
        }
        function getAMDImportExpressionForImport(node) {
            if (!(ts.isImportEqualsDeclaration(node) || ts.isExportDeclaration(node)) && ts.getExternalModuleNameLiteral(factory, node, currentSourceFile, host, resolver, compilerOptions)) {
                var name = ts.getLocalNameForExternalImport(factory, node, currentSourceFile), expr = getHelperExpressionForImport(node, name);
                if (expr !== name) return factory.createExpressionStatement(factory.createAssignment(name, expr));
            }
        }
        function transformAsynchronousModuleBody(node) {
            startLexicalEnvironment();
            var statements = [], statementOffset = factory.copyPrologue(node.statements, statements, !compilerOptions.noImplicitUseStrict, topLevelVisitor);
            shouldEmitUnderscoreUnderscoreESModule() && ts.append(statements, createUnderscoreUnderscoreESModule()), ts.length(currentModuleInfo.exportedNames) && ts.append(statements, factory.createExpressionStatement(ts.reduceLeft(currentModuleInfo.exportedNames, function(prev, nextId) {
                return factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.createIdentifier(ts.idText(nextId))), prev);
            }, factory.createVoidZero()))), ts.append(statements, ts.visitNode(currentModuleInfo.externalHelpersImportDeclaration, topLevelVisitor, ts.isStatement)), moduleKind === ts.ModuleKind.AMD && ts.addRange(statements, ts.mapDefined(currentModuleInfo.externalImports, getAMDImportExpressionForImport)), ts.addRange(statements, ts.visitNodes(node.statements, topLevelVisitor, ts.isStatement, statementOffset)), addExportEqualsIfNeeded(statements, !0), ts.insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
            var body = factory.createBlock(statements, !0);
            return needUMDDynamicImportHelper && ts.addEmitHelper(body, dynamicImportUMDHelper), body;
        }
        function addExportEqualsIfNeeded(statements, emitAsReturn) {
            if (currentModuleInfo.exportEquals) {
                var expressionResult = ts.visitNode(currentModuleInfo.exportEquals.expression, visitor);
                if (expressionResult) if (emitAsReturn) {
                    var statement = factory.createReturnStatement(expressionResult);
                    ts.setTextRange(statement, currentModuleInfo.exportEquals), ts.setEmitFlags(statement, 1920), statements.push(statement);
                } else {
                    var statement = factory.createExpressionStatement(factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), expressionResult));
                    ts.setTextRange(statement, currentModuleInfo.exportEquals), ts.setEmitFlags(statement, 1536), statements.push(statement);
                }
            }
        }
        function topLevelVisitor(node) {
            switch(node.kind){
                case 265:
                    return visitImportDeclaration(node);
                case 264:
                    return visitImportEqualsDeclaration(node);
                case 271:
                    return visitExportDeclaration(node);
                case 270:
                    return visitExportAssignment(node);
                case 236:
                    return visitVariableStatement(node);
                case 255:
                    return visitFunctionDeclaration(node);
                case 256:
                    return visitClassDeclaration(node);
                case 350:
                    return visitMergeDeclarationMarker(node);
                case 351:
                    return visitEndOfDeclarationMarker(node);
                default:
                    return visitor(node);
            }
        }
        function visitorWorker(node, valueIsDiscarded) {
            if (!(71307264 & node.transformFlags)) return node;
            switch(node.kind){
                case 241:
                    return visitForStatement(node);
                case 237:
                    return visitExpressionStatement(node);
                case 211:
                    return visitParenthesizedExpression(node, valueIsDiscarded);
                case 348:
                    return visitPartiallyEmittedExpression(node, valueIsDiscarded);
                case 207:
                    if (ts.isImportCall(node) && void 0 === currentSourceFile.impliedNodeFormat) return visitImportCallExpression(node);
                    break;
                case 220:
                    if (ts.isDestructuringAssignment(node)) return visitDestructuringAssignment(node, valueIsDiscarded);
                    break;
                case 218:
                case 219:
                    return visitPreOrPostfixUnaryExpression(node, valueIsDiscarded);
            }
            return ts.visitEachChild(node, visitor, context);
        }
        function visitor(node) {
            return visitorWorker(node, !1);
        }
        function discardedValueVisitor(node) {
            return visitorWorker(node, !0);
        }
        function visitDestructuringAssignment(node, valueIsDiscarded) {
            return !function destructuringNeedsFlattening(node) {
                if (ts.isObjectLiteralExpression(node)) for(var _i = 0, _a = node.properties; _i < _a.length; _i++){
                    var elem = _a[_i];
                    switch(elem.kind){
                        case 294:
                            if (destructuringNeedsFlattening(elem.initializer)) return !0;
                            break;
                        case 295:
                            if (destructuringNeedsFlattening(elem.name)) return !0;
                            break;
                        case 296:
                            if (destructuringNeedsFlattening(elem.expression)) return !0;
                            break;
                        case 168:
                        case 171:
                        case 172:
                            return !1;
                        default:
                            ts.Debug.assertNever(elem, "Unhandled object member kind");
                    }
                }
                else if (ts.isArrayLiteralExpression(node)) for(var _b = 0, _c = node.elements; _b < _c.length; _b++){
                    var elem = _c[_b];
                    if (ts.isSpreadElement(elem)) {
                        if (destructuringNeedsFlattening(elem.expression)) return !0;
                    } else if (destructuringNeedsFlattening(elem)) return !0;
                }
                else if (ts.isIdentifier(node)) return ts.length(getExports(node)) > (ts.isExportName(node) ? 1 : 0);
                return !1;
            }(node.left) ? ts.visitEachChild(node, visitor, context) : ts.flattenDestructuringAssignment(node, visitor, context, 0, !valueIsDiscarded, createAllExportExpressions);
        }
        function visitForStatement(node) {
            return factory.updateForStatement(node, ts.visitNode(node.initializer, discardedValueVisitor, ts.isForInitializer), ts.visitNode(node.condition, visitor, ts.isExpression), ts.visitNode(node.incrementor, discardedValueVisitor, ts.isExpression), ts.visitIterationBody(node.statement, visitor, context));
        }
        function visitExpressionStatement(node) {
            return factory.updateExpressionStatement(node, ts.visitNode(node.expression, discardedValueVisitor, ts.isExpression));
        }
        function visitParenthesizedExpression(node, valueIsDiscarded) {
            return factory.updateParenthesizedExpression(node, ts.visitNode(node.expression, valueIsDiscarded ? discardedValueVisitor : visitor, ts.isExpression));
        }
        function visitPartiallyEmittedExpression(node, valueIsDiscarded) {
            return factory.updatePartiallyEmittedExpression(node, ts.visitNode(node.expression, valueIsDiscarded ? discardedValueVisitor : visitor, ts.isExpression));
        }
        function visitPreOrPostfixUnaryExpression(node, valueIsDiscarded) {
            if ((45 === node.operator || 46 === node.operator) && ts.isIdentifier(node.operand) && !ts.isGeneratedIdentifier(node.operand) && !ts.isLocalName(node.operand) && !ts.isDeclarationNameOfEnumOrNamespace(node.operand)) {
                var exportedNames = getExports(node.operand);
                if (exportedNames) {
                    var temp = void 0, expression = ts.visitNode(node.operand, visitor, ts.isExpression);
                    ts.isPrefixUnaryExpression(node) ? expression = factory.updatePrefixUnaryExpression(node, expression) : (expression = factory.updatePostfixUnaryExpression(node, expression), valueIsDiscarded || (temp = factory.createTempVariable(hoistVariableDeclaration), expression = factory.createAssignment(temp, expression), ts.setTextRange(expression, node)), expression = factory.createComma(expression, factory.cloneNode(node.operand)), ts.setTextRange(expression, node));
                    for(var _i = 0, exportedNames_1 = exportedNames; _i < exportedNames_1.length; _i++){
                        var exportName = exportedNames_1[_i];
                        noSubstitution[ts.getNodeId(expression)] = !0, expression = createExportExpression(exportName, expression), ts.setTextRange(expression, node);
                    }
                    return temp && (noSubstitution[ts.getNodeId(expression)] = !0, expression = factory.createComma(expression, temp), ts.setTextRange(expression, node)), expression;
                }
            }
            return ts.visitEachChild(node, visitor, context);
        }
        function visitImportCallExpression(node) {
            var externalModuleName = ts.getExternalModuleNameLiteral(factory, node, currentSourceFile, host, resolver, compilerOptions), firstArgument = ts.visitNode(ts.firstOrUndefined(node.arguments), visitor), argument = !externalModuleName || firstArgument && ts.isStringLiteral(firstArgument) && firstArgument.text === externalModuleName.text ? firstArgument : externalModuleName, containsLexicalThis = !!(8192 & node.transformFlags);
            switch(compilerOptions.module){
                case ts.ModuleKind.AMD:
                    return createImportCallExpressionAMD(argument, containsLexicalThis);
                case ts.ModuleKind.UMD:
                    return createImportCallExpressionUMD(null != argument ? argument : factory.createVoidZero(), containsLexicalThis);
                case ts.ModuleKind.CommonJS:
                default:
                    return createImportCallExpressionCommonJS(argument, containsLexicalThis);
            }
        }
        function createImportCallExpressionUMD(arg, containsLexicalThis) {
            if (needUMDDynamicImportHelper = !0, ts.isSimpleCopiableExpression(arg)) {
                var argClone = ts.isGeneratedIdentifier(arg) ? arg : ts.isStringLiteral(arg) ? factory.createStringLiteralFromNode(arg) : ts.setEmitFlags(ts.setTextRange(factory.cloneNode(arg), arg), 1536);
                return factory.createConditionalExpression(factory.createIdentifier("__syncRequire"), void 0, createImportCallExpressionCommonJS(arg, containsLexicalThis), void 0, createImportCallExpressionAMD(argClone, containsLexicalThis));
            }
            var temp = factory.createTempVariable(hoistVariableDeclaration);
            return factory.createComma(factory.createAssignment(temp, arg), factory.createConditionalExpression(factory.createIdentifier("__syncRequire"), void 0, createImportCallExpressionCommonJS(temp, containsLexicalThis), void 0, createImportCallExpressionAMD(temp, containsLexicalThis)));
        }
        function createImportCallExpressionAMD(arg, containsLexicalThis) {
            var func, resolve = factory.createUniqueName("resolve"), reject = factory.createUniqueName("reject"), parameters = [
                factory.createParameterDeclaration(void 0, void 0, void 0, resolve),
                factory.createParameterDeclaration(void 0, void 0, void 0, reject)
            ], body = factory.createBlock([
                factory.createExpressionStatement(factory.createCallExpression(factory.createIdentifier("require"), void 0, [
                    factory.createArrayLiteralExpression([
                        arg || factory.createOmittedExpression()
                    ]),
                    resolve,
                    reject
                ]))
            ]);
            languageVersion >= 2 ? func = factory.createArrowFunction(void 0, void 0, parameters, void 0, void 0, body) : (func = factory.createFunctionExpression(void 0, void 0, void 0, void 0, parameters, void 0, body), containsLexicalThis && ts.setEmitFlags(func, 8));
            var promise = factory.createNewExpression(factory.createIdentifier("Promise"), void 0, [
                func
            ]);
            return ts.getESModuleInterop(compilerOptions) ? factory.createCallExpression(factory.createPropertyAccessExpression(promise, factory.createIdentifier("then")), void 0, [
                emitHelpers().createImportStarCallbackHelper()
            ]) : promise;
        }
        function createImportCallExpressionCommonJS(arg, containsLexicalThis) {
            var func, promiseResolveCall = factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Promise"), "resolve"), void 0, []), requireCall = factory.createCallExpression(factory.createIdentifier("require"), void 0, arg ? [
                arg
            ] : []);
            return ts.getESModuleInterop(compilerOptions) && (requireCall = emitHelpers().createImportStarHelper(requireCall)), languageVersion >= 2 ? func = factory.createArrowFunction(void 0, void 0, [], void 0, void 0, requireCall) : (func = factory.createFunctionExpression(void 0, void 0, void 0, void 0, [], void 0, factory.createBlock([
                factory.createReturnStatement(requireCall)
            ])), containsLexicalThis && ts.setEmitFlags(func, 8)), factory.createCallExpression(factory.createPropertyAccessExpression(promiseResolveCall, "then"), void 0, [
                func
            ]);
        }
        function getHelperExpressionForImport(node, innerExpr) {
            return !ts.getESModuleInterop(compilerOptions) || 67108864 & ts.getEmitFlags(node) ? innerExpr : ts.getImportNeedsImportStarHelper(node) ? emitHelpers().createImportStarHelper(innerExpr) : ts.getImportNeedsImportDefaultHelper(node) ? emitHelpers().createImportDefaultHelper(innerExpr) : innerExpr;
        }
        function visitImportDeclaration(node) {
            var statements, namespaceDeclaration = ts.getNamespaceDeclarationNode(node);
            if (moduleKind !== ts.ModuleKind.AMD) {
                if (!node.importClause) return ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createRequireCall(node)), node), node);
                var variables = [];
                namespaceDeclaration && !ts.isDefaultImport(node) ? variables.push(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), void 0, void 0, getHelperExpressionForImport(node, createRequireCall(node)))) : (variables.push(factory.createVariableDeclaration(factory.getGeneratedNameForNode(node), void 0, void 0, getHelperExpressionForImport(node, createRequireCall(node)))), namespaceDeclaration && ts.isDefaultImport(node) && variables.push(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), void 0, void 0, factory.getGeneratedNameForNode(node)))), statements = ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createVariableStatement(void 0, factory.createVariableDeclarationList(variables, languageVersion >= 2 ? 2 : 0)), node), node));
            } else namespaceDeclaration && ts.isDefaultImport(node) && (statements = ts.append(statements, factory.createVariableStatement(void 0, factory.createVariableDeclarationList([
                ts.setOriginalNode(ts.setTextRange(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), void 0, void 0, factory.getGeneratedNameForNode(node)), node), node)
            ], languageVersion >= 2 ? 2 : 0))));
            if (hasAssociatedEndOfDeclarationMarker(node)) {
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfImportDeclaration(deferredExports[id], node);
            } else statements = appendExportsOfImportDeclaration(statements, node);
            return ts.singleOrMany(statements);
        }
        function createRequireCall(importNode) {
            var moduleName = ts.getExternalModuleNameLiteral(factory, importNode, currentSourceFile, host, resolver, compilerOptions), args = [];
            return moduleName && args.push(moduleName), factory.createCallExpression(factory.createIdentifier("require"), void 0, args);
        }
        function visitImportEqualsDeclaration(node) {
            if (ts.Debug.assert(ts.isExternalModuleImportEqualsDeclaration(node), "import= for internal module references should be handled in an earlier transformer."), moduleKind !== ts.ModuleKind.AMD ? statements = ts.hasSyntacticModifier(node, 1) ? ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createExportExpression(node.name, createRequireCall(node))), node), node)) : ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createVariableStatement(void 0, factory.createVariableDeclarationList([
                factory.createVariableDeclaration(factory.cloneNode(node.name), void 0, void 0, createRequireCall(node))
            ], languageVersion >= 2 ? 2 : 0)), node), node)) : ts.hasSyntacticModifier(node, 1) && (statements = ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createExportExpression(factory.getExportName(node), factory.getLocalName(node))), node), node))), hasAssociatedEndOfDeclarationMarker(node)) {
                var statements, id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfImportEqualsDeclaration(deferredExports[id], node);
            } else statements = appendExportsOfImportEqualsDeclaration(statements, node);
            return ts.singleOrMany(statements);
        }
        function visitExportDeclaration(node) {
            if (node.moduleSpecifier) {
                var generatedName = factory.getGeneratedNameForNode(node);
                if (node.exportClause && ts.isNamedExports(node.exportClause)) {
                    var statements = [];
                    moduleKind !== ts.ModuleKind.AMD && statements.push(ts.setOriginalNode(ts.setTextRange(factory.createVariableStatement(void 0, factory.createVariableDeclarationList([
                        factory.createVariableDeclaration(generatedName, void 0, void 0, createRequireCall(node))
                    ])), node), node));
                    for(var _i = 0, _a = node.exportClause.elements; _i < _a.length; _i++){
                        var specifier = _a[_i];
                        if (0 === languageVersion) statements.push(ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(emitHelpers().createCreateBindingHelper(generatedName, factory.createStringLiteralFromNode(specifier.propertyName || specifier.name), specifier.propertyName ? factory.createStringLiteralFromNode(specifier.name) : void 0)), specifier), specifier));
                        else {
                            var exportNeedsImportDefault = !!ts.getESModuleInterop(compilerOptions) && !(67108864 & ts.getEmitFlags(node)) && "default" === ts.idText(specifier.propertyName || specifier.name), exportedValue = factory.createPropertyAccessExpression(exportNeedsImportDefault ? emitHelpers().createImportDefaultHelper(generatedName) : generatedName, specifier.propertyName || specifier.name);
                            statements.push(ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createExportExpression(factory.getExportName(specifier), exportedValue, void 0, !0)), specifier), specifier));
                        }
                    }
                    return ts.singleOrMany(statements);
                }
                if (!node.exportClause) return ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(emitHelpers().createExportStarHelper(moduleKind !== ts.ModuleKind.AMD ? createRequireCall(node) : generatedName)), node), node);
                var node1, innerExpr, statements = [];
                return statements.push(ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createExportExpression(factory.cloneNode(node.exportClause.name), (node1 = node, innerExpr = moduleKind !== ts.ModuleKind.AMD ? createRequireCall(node) : ts.isExportNamespaceAsDefaultDeclaration(node) ? generatedName : factory.createIdentifier(ts.idText(node.exportClause.name)), !ts.getESModuleInterop(compilerOptions) || 67108864 & ts.getEmitFlags(node1) ? innerExpr : ts.getExportNeedsImportStarHelper(node1) ? emitHelpers().createImportStarHelper(innerExpr) : innerExpr))), node), node)), ts.singleOrMany(statements);
            }
        }
        function visitExportAssignment(node) {
            if (!node.isExportEquals) {
                var statements, original = node.original;
                if (original && hasAssociatedEndOfDeclarationMarker(original)) {
                    var id = ts.getOriginalNodeId(node);
                    deferredExports[id] = appendExportStatement(deferredExports[id], factory.createIdentifier("default"), ts.visitNode(node.expression, visitor), node, !0);
                } else statements = appendExportStatement(statements, factory.createIdentifier("default"), ts.visitNode(node.expression, visitor), node, !0);
                return ts.singleOrMany(statements);
            }
        }
        function visitFunctionDeclaration(node) {
            var statements;
            if (statements = ts.hasSyntacticModifier(node, 1) ? ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createFunctionDeclaration(void 0, ts.visitNodes(node.modifiers, modifierVisitor, ts.isModifier), node.asteriskToken, factory.getDeclarationName(node, !0, !0), void 0, ts.visitNodes(node.parameters, visitor), void 0, ts.visitEachChild(node.body, visitor, context)), node), node)) : ts.append(statements, ts.visitEachChild(node, visitor, context)), hasAssociatedEndOfDeclarationMarker(node)) {
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfHoistedDeclaration(deferredExports[id], node);
            } else statements = appendExportsOfHoistedDeclaration(statements, node);
            return ts.singleOrMany(statements);
        }
        function visitClassDeclaration(node) {
            var statements;
            if (statements = ts.hasSyntacticModifier(node, 1) ? ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createClassDeclaration(void 0, ts.visitNodes(node.modifiers, modifierVisitor, ts.isModifier), factory.getDeclarationName(node, !0, !0), void 0, ts.visitNodes(node.heritageClauses, visitor), ts.visitNodes(node.members, visitor)), node), node)) : ts.append(statements, ts.visitEachChild(node, visitor, context)), hasAssociatedEndOfDeclarationMarker(node)) {
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfHoistedDeclaration(deferredExports[id], node);
            } else statements = appendExportsOfHoistedDeclaration(statements, node);
            return ts.singleOrMany(statements);
        }
        function visitVariableStatement(node) {
            if (ts.hasSyntacticModifier(node, 1)) {
                for(var statements, variables, expressions, modifiers = void 0, removeCommentsOnExpressions = !1, _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++){
                    var variable = _a[_i];
                    if (ts.isIdentifier(variable.name) && ts.isLocalName(variable.name)) modifiers || (modifiers = ts.visitNodes(node.modifiers, modifierVisitor, ts.isModifier)), variables = ts.append(variables, variable);
                    else if (variable.initializer) if (!ts.isBindingPattern(variable.name) && (ts.isArrowFunction(variable.initializer) || ts.isFunctionExpression(variable.initializer) || ts.isClassExpression(variable.initializer))) {
                        var expression = factory.createAssignment(ts.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), variable.name), variable.name), factory.createIdentifier(ts.getTextOfIdentifierOrLiteral(variable.name))), updatedVariable = factory.createVariableDeclaration(variable.name, variable.exclamationToken, variable.type, ts.visitNode(variable.initializer, visitor));
                        variables = ts.append(variables, updatedVariable), expressions = ts.append(expressions, expression), removeCommentsOnExpressions = !0;
                    } else expressions = ts.append(expressions, transformInitializedVariable(variable));
                }
                if (variables && (statements = ts.append(statements, factory.updateVariableStatement(node, modifiers, factory.updateVariableDeclarationList(node.declarationList, variables)))), expressions) {
                    var statement = ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(factory.inlineExpressions(expressions)), node), node);
                    removeCommentsOnExpressions && ts.removeAllComments(statement), statements = ts.append(statements, statement);
                }
            } else statements = ts.append(statements, ts.visitEachChild(node, visitor, context));
            if (hasAssociatedEndOfDeclarationMarker(node)) {
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfVariableStatement(deferredExports[id], node);
            } else statements = appendExportsOfVariableStatement(statements, node);
            return ts.singleOrMany(statements);
        }
        function createAllExportExpressions(name, value, location) {
            var exportedNames = getExports(name);
            if (exportedNames) {
                for(var expression = ts.isExportName(name) ? value : factory.createAssignment(name, value), _i = 0, exportedNames_2 = exportedNames; _i < exportedNames_2.length; _i++){
                    var exportName = exportedNames_2[_i];
                    ts.setEmitFlags(expression, 4), expression = createExportExpression(exportName, expression, location);
                }
                return expression;
            }
            return factory.createAssignment(name, value);
        }
        function transformInitializedVariable(node) {
            return ts.isBindingPattern(node.name) ? ts.flattenDestructuringAssignment(ts.visitNode(node, visitor), void 0, context, 0, !1, createAllExportExpressions) : factory.createAssignment(ts.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), node.name), node.name), node.initializer ? ts.visitNode(node.initializer, visitor) : factory.createVoidZero());
        }
        function visitMergeDeclarationMarker(node) {
            if (hasAssociatedEndOfDeclarationMarker(node) && 236 === node.original.kind) {
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfVariableStatement(deferredExports[id], node.original);
            }
            return node;
        }
        function hasAssociatedEndOfDeclarationMarker(node) {
            return (4194304 & ts.getEmitFlags(node)) != 0;
        }
        function visitEndOfDeclarationMarker(node) {
            var id = ts.getOriginalNodeId(node), statements = deferredExports[id];
            return statements ? (delete deferredExports[id], ts.append(statements, node)) : node;
        }
        function appendExportsOfImportDeclaration(statements, decl) {
            if (currentModuleInfo.exportEquals) return statements;
            var importClause = decl.importClause;
            if (!importClause) return statements;
            importClause.name && (statements = appendExportsOfDeclaration(statements, importClause));
            var namedBindings = importClause.namedBindings;
            if (namedBindings) switch(namedBindings.kind){
                case 267:
                    statements = appendExportsOfDeclaration(statements, namedBindings);
                    break;
                case 268:
                    for(var _i = 0, _a = namedBindings.elements; _i < _a.length; _i++)statements = appendExportsOfDeclaration(statements, _a[_i], !0);
            }
            return statements;
        }
        function appendExportsOfImportEqualsDeclaration(statements, decl) {
            return currentModuleInfo.exportEquals ? statements : appendExportsOfDeclaration(statements, decl);
        }
        function appendExportsOfVariableStatement(statements, node) {
            if (currentModuleInfo.exportEquals) return statements;
            for(var _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++)statements = appendExportsOfBindingElement(statements, _a[_i]);
            return statements;
        }
        function appendExportsOfBindingElement(statements, decl) {
            if (currentModuleInfo.exportEquals) return statements;
            if (ts.isBindingPattern(decl.name)) for(var _i = 0, _a = decl.name.elements; _i < _a.length; _i++){
                var element = _a[_i];
                ts.isOmittedExpression(element) || (statements = appendExportsOfBindingElement(statements, element));
            }
            else ts.isGeneratedIdentifier(decl.name) || (statements = appendExportsOfDeclaration(statements, decl));
            return statements;
        }
        function appendExportsOfHoistedDeclaration(statements, decl) {
            if (currentModuleInfo.exportEquals) return statements;
            if (ts.hasSyntacticModifier(decl, 1)) {
                var exportName = ts.hasSyntacticModifier(decl, 512) ? factory.createIdentifier("default") : factory.getDeclarationName(decl);
                statements = appendExportStatement(statements, exportName, factory.getLocalName(decl), decl);
            }
            return decl.name && (statements = appendExportsOfDeclaration(statements, decl)), statements;
        }
        function appendExportsOfDeclaration(statements, decl, liveBinding) {
            var name = factory.getDeclarationName(decl), exportSpecifiers = currentModuleInfo.exportSpecifiers.get(ts.idText(name));
            if (exportSpecifiers) for(var _i = 0, exportSpecifiers_1 = exportSpecifiers; _i < exportSpecifiers_1.length; _i++){
                var exportSpecifier = exportSpecifiers_1[_i];
                statements = appendExportStatement(statements, exportSpecifier.name, name, exportSpecifier.name, void 0, liveBinding);
            }
            return statements;
        }
        function appendExportStatement(statements, exportName, expression, location, allowComments, liveBinding) {
            return statements = ts.append(statements, createExportStatement(exportName, expression, location, allowComments, liveBinding));
        }
        function createUnderscoreUnderscoreESModule() {
            var statement;
            return statement = 0 === languageVersion ? factory.createExpressionStatement(createExportExpression(factory.createIdentifier("__esModule"), factory.createTrue())) : factory.createExpressionStatement(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Object"), "defineProperty"), void 0, [
                factory.createIdentifier("exports"),
                factory.createStringLiteral("__esModule"),
                factory.createObjectLiteralExpression([
                    factory.createPropertyAssignment("value", factory.createTrue())
                ])
            ])), ts.setEmitFlags(statement, 1048576), statement;
        }
        function createExportStatement(name, value, location, allowComments, liveBinding) {
            var statement = ts.setTextRange(factory.createExpressionStatement(createExportExpression(name, value, void 0, liveBinding)), location);
            return ts.startOnNewLine(statement), allowComments || ts.setEmitFlags(statement, 1536), statement;
        }
        function createExportExpression(name, value, location, liveBinding) {
            return ts.setTextRange(liveBinding && 0 !== languageVersion ? factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Object"), "defineProperty"), void 0, [
                factory.createIdentifier("exports"),
                factory.createStringLiteralFromNode(name),
                factory.createObjectLiteralExpression([
                    factory.createPropertyAssignment("enumerable", factory.createTrue()),
                    factory.createPropertyAssignment("get", factory.createFunctionExpression(void 0, void 0, void 0, void 0, [], void 0, factory.createBlock([
                        factory.createReturnStatement(value)
                    ])))
                ])
            ]) : factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.cloneNode(name)), value), location);
        }
        function modifierVisitor(node) {
            switch(node.kind){
                case 93:
                case 88:
                    return;
            }
            return node;
        }
        function substituteShorthandPropertyAssignment(node) {
            var name = node.name, exportedOrImportedName = substituteExpressionIdentifier(name);
            if (exportedOrImportedName !== name) {
                if (node.objectAssignmentInitializer) {
                    var initializer = factory.createAssignment(exportedOrImportedName, node.objectAssignmentInitializer);
                    return ts.setTextRange(factory.createPropertyAssignment(name, initializer), node);
                }
                return ts.setTextRange(factory.createPropertyAssignment(name, exportedOrImportedName), node);
            }
            return node;
        }
        function substituteExpression(node) {
            switch(node.kind){
                case 79:
                    return substituteExpressionIdentifier(node);
                case 207:
                    return substituteCallExpression(node);
                case 209:
                    return substituteTaggedTemplateExpression(node);
                case 220:
                    return substituteBinaryExpression(node);
            }
            return node;
        }
        function substituteCallExpression(node) {
            if (ts.isIdentifier(node.expression)) {
                var expression = substituteExpressionIdentifier(node.expression);
                if (noSubstitution[ts.getNodeId(expression)] = !0, !ts.isIdentifier(expression) && !(4096 & ts.getEmitFlags(node.expression))) return ts.addEmitFlags(factory.updateCallExpression(node, expression, void 0, node.arguments), 536870912);
            }
            return node;
        }
        function substituteTaggedTemplateExpression(node) {
            if (ts.isIdentifier(node.tag)) {
                var tag = substituteExpressionIdentifier(node.tag);
                if (noSubstitution[ts.getNodeId(tag)] = !0, !ts.isIdentifier(tag) && !(4096 & ts.getEmitFlags(node.tag))) return ts.addEmitFlags(factory.updateTaggedTemplateExpression(node, tag, void 0, node.template), 536870912);
            }
            return node;
        }
        function substituteExpressionIdentifier(node) {
            var _a, _b;
            if (4096 & ts.getEmitFlags(node)) {
                var externalHelpersModuleName = ts.getExternalHelpersModuleName(currentSourceFile);
                if (externalHelpersModuleName) return factory.createPropertyAccessExpression(externalHelpersModuleName, node);
            } else if (!(ts.isGeneratedIdentifier(node) && !(64 & node.autoGenerateFlags)) && !ts.isLocalName(node)) {
                var exportContainer = resolver.getReferencedExportContainer(node, ts.isExportName(node));
                if (exportContainer && 303 === exportContainer.kind) return ts.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.cloneNode(node)), node);
                var importDeclaration = resolver.getReferencedImportDeclaration(node);
                if (importDeclaration) {
                    if (ts.isImportClause(importDeclaration)) return ts.setTextRange(factory.createPropertyAccessExpression(factory.getGeneratedNameForNode(importDeclaration.parent), factory.createIdentifier("default")), node);
                    if (ts.isImportSpecifier(importDeclaration)) {
                        var name = importDeclaration.propertyName || importDeclaration.name;
                        return ts.setTextRange(factory.createPropertyAccessExpression(factory.getGeneratedNameForNode((null === (_b = null === (_a = importDeclaration.parent) || void 0 === _a ? void 0 : _a.parent) || void 0 === _b ? void 0 : _b.parent) || importDeclaration), factory.cloneNode(name)), node);
                    }
                }
            }
            return node;
        }
        function substituteBinaryExpression(node) {
            if (ts.isAssignmentOperator(node.operatorToken.kind) && ts.isIdentifier(node.left) && !ts.isGeneratedIdentifier(node.left) && !ts.isLocalName(node.left) && !ts.isDeclarationNameOfEnumOrNamespace(node.left)) {
                var exportedNames = getExports(node.left);
                if (exportedNames) {
                    for(var expression = node, _i = 0, exportedNames_3 = exportedNames; _i < exportedNames_3.length; _i++){
                        var exportName = exportedNames_3[_i];
                        noSubstitution[ts.getNodeId(expression)] = !0, expression = createExportExpression(exportName, expression, node);
                    }
                    return expression;
                }
            }
            return node;
        }
        function getExports(name) {
            if (!ts.isGeneratedIdentifier(name)) {
                var valueDeclaration = resolver.getReferencedImportDeclaration(name) || resolver.getReferencedValueDeclaration(name);
                if (valueDeclaration) return currentModuleInfo && currentModuleInfo.exportedBindings[ts.getOriginalNodeId(valueDeclaration)];
            }
        }
    };
    var dynamicImportUMDHelper = {
        name: "typescript:dynamicimport-sync-require",
        scoped: !0,
        text: "\n            var __syncRequire = typeof module === \"object\" && typeof module.exports === \"object\";"
    };
}(ts || (ts = {}));
