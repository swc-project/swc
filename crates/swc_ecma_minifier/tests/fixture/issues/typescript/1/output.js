!function(ts1) {
    ts1.transformModule = function(context) {
        var currentSourceFile, currentModuleInfo, needUMDDynamicImportHelper, factory = context.factory, emitHelpers = context.getEmitHelperFactory, startLexicalEnvironment = context.startLexicalEnvironment, endLexicalEnvironment = context.endLexicalEnvironment, hoistVariableDeclaration = context.hoistVariableDeclaration, compilerOptions = context.getCompilerOptions(), resolver = context.getEmitResolver(), host = context.getEmitHost(), languageVersion = ts1.getEmitScriptTarget(compilerOptions), moduleKind = ts1.getEmitModuleKind(compilerOptions), previousOnSubstituteNode = context.onSubstituteNode, previousOnEmitNode = context.onEmitNode;
        context.onSubstituteNode = function(hint, node) {
            return (node = previousOnSubstituteNode(hint, node)).id && noSubstitution[node.id] ? node : 1 === hint ? function(node) {
                switch(node.kind){
                    case 79:
                        return substituteExpressionIdentifier(node);
                    case 207:
                        return function(node) {
                            if (ts1.isIdentifier(node.expression)) {
                                var expression = substituteExpressionIdentifier(node.expression);
                                if (noSubstitution[ts1.getNodeId(expression)] = !0, !ts1.isIdentifier(expression) && !(4096 & ts1.getEmitFlags(node.expression))) return ts1.addEmitFlags(factory.updateCallExpression(node, expression, void 0, node.arguments), 536870912);
                            }
                            return node;
                        }(node);
                    case 209:
                        return function(node) {
                            if (ts1.isIdentifier(node.tag)) {
                                var tag = substituteExpressionIdentifier(node.tag);
                                if (noSubstitution[ts1.getNodeId(tag)] = !0, !ts1.isIdentifier(tag) && !(4096 & ts1.getEmitFlags(node.tag))) return ts1.addEmitFlags(factory.updateTaggedTemplateExpression(node, tag, void 0, node.template), 536870912);
                            }
                            return node;
                        }(node);
                    case 220:
                        return function(node) {
                            if (ts1.isAssignmentOperator(node.operatorToken.kind) && ts1.isIdentifier(node.left) && !ts1.isGeneratedIdentifier(node.left) && !ts1.isLocalName(node.left) && !ts1.isDeclarationNameOfEnumOrNamespace(node.left)) {
                                var exportedNames = getExports(node.left);
                                if (exportedNames) {
                                    for(var expression = node, _i = 0; _i < exportedNames.length; _i++){
                                        var exportName = exportedNames[_i];
                                        noSubstitution[ts1.getNodeId(expression)] = !0, expression = createExportExpression(exportName, expression, node);
                                    }
                                    return expression;
                                }
                            }
                            return node;
                        }(node);
                }
                return node;
            }(node) : ts1.isShorthandPropertyAssignment(node) ? function(node) {
                var name = node.name, exportedOrImportedName = substituteExpressionIdentifier(name);
                if (exportedOrImportedName !== name) {
                    if (node.objectAssignmentInitializer) {
                        var initializer = factory.createAssignment(exportedOrImportedName, node.objectAssignmentInitializer);
                        return ts1.setTextRange(factory.createPropertyAssignment(name, initializer), node);
                    }
                    return ts1.setTextRange(factory.createPropertyAssignment(name, exportedOrImportedName), node);
                }
                return node;
            }(node) : node;
        }, context.onEmitNode = function(hint, node, emitCallback) {
            303 === node.kind ? (currentSourceFile = node, currentModuleInfo = moduleInfoMap[ts1.getOriginalNodeId(currentSourceFile)], previousOnEmitNode(hint, node, emitCallback), currentSourceFile = void 0, currentModuleInfo = void 0) : previousOnEmitNode(hint, node, emitCallback);
        }, context.enableSubstitution(207), context.enableSubstitution(209), context.enableSubstitution(79), context.enableSubstitution(220), context.enableSubstitution(295), context.enableEmitNotification(303);
        var moduleInfoMap = [], deferredExports = [], noSubstitution = [];
        return ts1.chainBundle(context, function(node) {
            if (node.isDeclarationFile || !(ts1.isEffectiveExternalModule(node, compilerOptions) || 4194304 & node.transformFlags || ts1.isJsonSourceFile(node) && ts1.hasJsonModuleEmitEnabled(compilerOptions) && ts1.outFile(compilerOptions))) return node;
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
        function transformCommonJSModule(node) {
            startLexicalEnvironment();
            var statements = [], ensureUseStrict = ts1.getStrictOptionValue(compilerOptions, "alwaysStrict") || !compilerOptions.noImplicitUseStrict && ts1.isExternalModule(currentSourceFile), statementOffset = factory.copyPrologue(node.statements, statements, ensureUseStrict && !ts1.isJsonSourceFile(node), topLevelVisitor);
            if (shouldEmitUnderscoreUnderscoreESModule() && ts1.append(statements, createUnderscoreUnderscoreESModule()), ts1.length(currentModuleInfo.exportedNames)) for(var i = 0; i < currentModuleInfo.exportedNames.length; i += 50)ts1.append(statements, factory.createExpressionStatement(ts1.reduceLeft(currentModuleInfo.exportedNames.slice(i, i + 50), function(prev, nextId) {
                return factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.createIdentifier(ts1.idText(nextId))), prev);
            }, factory.createVoidZero())));
            ts1.append(statements, ts1.visitNode(currentModuleInfo.externalHelpersImportDeclaration, topLevelVisitor, ts1.isStatement)), ts1.addRange(statements, ts1.visitNodes(node.statements, topLevelVisitor, ts1.isStatement, statementOffset)), addExportEqualsIfNeeded(statements, !1), ts1.insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
            var updated = factory.updateSourceFile(node, ts1.setTextRange(factory.createNodeArray(statements), node.statements));
            return ts1.addEmitHelpers(updated, context.readEmitHelpers()), updated;
        }
        function transformAMDModule(node) {
            var define = factory.createIdentifier("define"), moduleName = ts1.tryGetModuleNameFromFile(factory, node, host, compilerOptions), jsonSourceFile = ts1.isJsonSourceFile(node) && node, _a = collectAsynchronousDependencies(node, !0), aliasedModuleNames = _a.aliasedModuleNames, unaliasedModuleNames = _a.unaliasedModuleNames, importAliasNames = _a.importAliasNames, updated = factory.updateSourceFile(node, ts1.setTextRange(factory.createNodeArray([
                factory.createExpressionStatement(factory.createCallExpression(define, void 0, __spreadArray(__spreadArray([], moduleName ? [
                    moduleName
                ] : [], !0), [
                    factory.createArrayLiteralExpression(jsonSourceFile ? ts1.emptyArray : __spreadArray(__spreadArray([
                        factory.createStringLiteral("require"),
                        factory.createStringLiteral("exports")
                    ], aliasedModuleNames, !0), unaliasedModuleNames, !0)),
                    jsonSourceFile ? jsonSourceFile.statements.length ? jsonSourceFile.statements[0].expression : factory.createObjectLiteralExpression() : factory.createFunctionExpression(void 0, void 0, void 0, void 0, __spreadArray([
                        factory.createParameterDeclaration(void 0, void 0, void 0, "require"),
                        factory.createParameterDeclaration(void 0, void 0, void 0, "exports")
                    ], importAliasNames, !0), void 0, transformAsynchronousModuleBody(node))
                ], !1)))
            ]), node.statements));
            return ts1.addEmitHelpers(updated, context.readEmitHelpers()), updated;
        }
        function transformUMDModule(node) {
            var _a = collectAsynchronousDependencies(node, !1), aliasedModuleNames = _a.aliasedModuleNames, unaliasedModuleNames = _a.unaliasedModuleNames, importAliasNames = _a.importAliasNames, moduleName = ts1.tryGetModuleNameFromFile(factory, node, host, compilerOptions), umdHeader = factory.createFunctionExpression(void 0, void 0, void 0, void 0, [
                factory.createParameterDeclaration(void 0, void 0, void 0, "factory")
            ], void 0, ts1.setTextRange(factory.createBlock([
                factory.createIfStatement(factory.createLogicalAnd(factory.createTypeCheck(factory.createIdentifier("module"), "object"), factory.createTypeCheck(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), "object")), factory.createBlock([
                    factory.createVariableStatement(void 0, [
                        factory.createVariableDeclaration("v", void 0, void 0, factory.createCallExpression(factory.createIdentifier("factory"), void 0, [
                            factory.createIdentifier("require"),
                            factory.createIdentifier("exports")
                        ]))
                    ]),
                    ts1.setEmitFlags(factory.createIfStatement(factory.createStrictInequality(factory.createIdentifier("v"), factory.createIdentifier("undefined")), factory.createExpressionStatement(factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), factory.createIdentifier("v")))), 1)
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
            ], !0), void 0)), updated = factory.updateSourceFile(node, ts1.setTextRange(factory.createNodeArray([
                factory.createExpressionStatement(factory.createCallExpression(umdHeader, void 0, [
                    factory.createFunctionExpression(void 0, void 0, void 0, void 0, __spreadArray([
                        factory.createParameterDeclaration(void 0, void 0, void 0, "require"),
                        factory.createParameterDeclaration(void 0, void 0, void 0, "exports")
                    ], importAliasNames, !0), void 0, transformAsynchronousModuleBody(node))
                ]))
            ]), node.statements));
            return ts1.addEmitHelpers(updated, context.readEmitHelpers()), updated;
        }
        function collectAsynchronousDependencies(node, includeNonAmdDependencies) {
            for(var aliasedModuleNames = [], unaliasedModuleNames = [], importAliasNames = [], _i = 0, _a = node.amdDependencies; _i < _a.length; _i++){
                var amdDependency = _a[_i];
                amdDependency.name ? (aliasedModuleNames.push(factory.createStringLiteral(amdDependency.path)), importAliasNames.push(factory.createParameterDeclaration(void 0, void 0, void 0, amdDependency.name))) : unaliasedModuleNames.push(factory.createStringLiteral(amdDependency.path));
            }
            for(var _b = 0, _c = currentModuleInfo.externalImports; _b < _c.length; _b++){
                var importNode = _c[_b], externalModuleName = ts1.getExternalModuleNameLiteral(factory, importNode, currentSourceFile, host, resolver, compilerOptions), importAliasName = ts1.getLocalNameForExternalImport(factory, importNode, currentSourceFile);
                externalModuleName && (includeNonAmdDependencies && importAliasName ? (ts1.setEmitFlags(importAliasName, 4), aliasedModuleNames.push(externalModuleName), importAliasNames.push(factory.createParameterDeclaration(void 0, void 0, void 0, importAliasName))) : unaliasedModuleNames.push(externalModuleName));
            }
            return {
                aliasedModuleNames: aliasedModuleNames,
                unaliasedModuleNames: unaliasedModuleNames,
                importAliasNames: importAliasNames
            };
        }
        function getAMDImportExpressionForImport(node) {
            if (!(ts1.isImportEqualsDeclaration(node) || ts1.isExportDeclaration(node)) && ts1.getExternalModuleNameLiteral(factory, node, currentSourceFile, host, resolver, compilerOptions)) {
                var name = ts1.getLocalNameForExternalImport(factory, node, currentSourceFile), expr = getHelperExpressionForImport(node, name);
                if (expr !== name) return factory.createExpressionStatement(factory.createAssignment(name, expr));
            }
        }
        function transformAsynchronousModuleBody(node) {
            startLexicalEnvironment();
            var statements = [], statementOffset = factory.copyPrologue(node.statements, statements, !compilerOptions.noImplicitUseStrict, topLevelVisitor);
            shouldEmitUnderscoreUnderscoreESModule() && ts1.append(statements, createUnderscoreUnderscoreESModule()), ts1.length(currentModuleInfo.exportedNames) && ts1.append(statements, factory.createExpressionStatement(ts1.reduceLeft(currentModuleInfo.exportedNames, function(prev, nextId) {
                return factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.createIdentifier(ts1.idText(nextId))), prev);
            }, factory.createVoidZero()))), ts1.append(statements, ts1.visitNode(currentModuleInfo.externalHelpersImportDeclaration, topLevelVisitor, ts1.isStatement)), moduleKind === ts1.ModuleKind.AMD && ts1.addRange(statements, ts1.mapDefined(currentModuleInfo.externalImports, getAMDImportExpressionForImport)), ts1.addRange(statements, ts1.visitNodes(node.statements, topLevelVisitor, ts1.isStatement, statementOffset)), addExportEqualsIfNeeded(statements, !0), ts1.insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
            var body = factory.createBlock(statements, !0);
            return needUMDDynamicImportHelper && ts1.addEmitHelper(body, dynamicImportUMDHelper), body;
        }
        function addExportEqualsIfNeeded(statements, emitAsReturn) {
            if (currentModuleInfo.exportEquals) {
                var expressionResult = ts1.visitNode(currentModuleInfo.exportEquals.expression, visitor);
                if (expressionResult) {
                    if (emitAsReturn) {
                        var statement = factory.createReturnStatement(expressionResult);
                        ts1.setTextRange(statement, currentModuleInfo.exportEquals), ts1.setEmitFlags(statement, 1920), statements.push(statement);
                    } else {
                        var statement = factory.createExpressionStatement(factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), expressionResult));
                        ts1.setTextRange(statement, currentModuleInfo.exportEquals), ts1.setEmitFlags(statement, 1536), statements.push(statement);
                    }
                }
            }
        }
        function topLevelVisitor(node) {
            switch(node.kind){
                case 265:
                    return function(node) {
                        var statements, namespaceDeclaration = ts1.getNamespaceDeclarationNode(node);
                        if (moduleKind !== ts1.ModuleKind.AMD) {
                            if (!node.importClause) return ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createRequireCall(node)), node), node);
                            var variables = [];
                            namespaceDeclaration && !ts1.isDefaultImport(node) ? variables.push(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), void 0, void 0, getHelperExpressionForImport(node, createRequireCall(node)))) : (variables.push(factory.createVariableDeclaration(factory.getGeneratedNameForNode(node), void 0, void 0, getHelperExpressionForImport(node, createRequireCall(node)))), namespaceDeclaration && ts1.isDefaultImport(node) && variables.push(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), void 0, void 0, factory.getGeneratedNameForNode(node)))), statements = ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createVariableStatement(void 0, factory.createVariableDeclarationList(variables, languageVersion >= 2 ? 2 : 0)), node), node));
                        } else namespaceDeclaration && ts1.isDefaultImport(node) && (statements = ts1.append(statements, factory.createVariableStatement(void 0, factory.createVariableDeclarationList([
                            ts1.setOriginalNode(ts1.setTextRange(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name), void 0, void 0, factory.getGeneratedNameForNode(node)), node), node)
                        ], languageVersion >= 2 ? 2 : 0))));
                        if (hasAssociatedEndOfDeclarationMarker(node)) {
                            var id = ts1.getOriginalNodeId(node);
                            deferredExports[id] = appendExportsOfImportDeclaration(deferredExports[id], node);
                        } else statements = appendExportsOfImportDeclaration(statements, node);
                        return ts1.singleOrMany(statements);
                    }(node);
                case 264:
                    return function(node) {
                        if (ts1.Debug.assert(ts1.isExternalModuleImportEqualsDeclaration(node), "import= for internal module references should be handled in an earlier transformer."), moduleKind !== ts1.ModuleKind.AMD ? statements = ts1.hasSyntacticModifier(node, 1) ? ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createExportExpression(node.name, createRequireCall(node))), node), node)) : ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createVariableStatement(void 0, factory.createVariableDeclarationList([
                            factory.createVariableDeclaration(factory.cloneNode(node.name), void 0, void 0, createRequireCall(node))
                        ], languageVersion >= 2 ? 2 : 0)), node), node)) : ts1.hasSyntacticModifier(node, 1) && (statements = ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createExportExpression(factory.getExportName(node), factory.getLocalName(node))), node), node))), hasAssociatedEndOfDeclarationMarker(node)) {
                            var statements, id = ts1.getOriginalNodeId(node);
                            deferredExports[id] = appendExportsOfImportEqualsDeclaration(deferredExports[id], node);
                        } else statements = appendExportsOfImportEqualsDeclaration(statements, node);
                        return ts1.singleOrMany(statements);
                    }(node);
                case 271:
                    return function(node) {
                        if (node.moduleSpecifier) {
                            var innerExpr, generatedName = factory.getGeneratedNameForNode(node);
                            if (node.exportClause && ts1.isNamedExports(node.exportClause)) {
                                var statements = [];
                                moduleKind !== ts1.ModuleKind.AMD && statements.push(ts1.setOriginalNode(ts1.setTextRange(factory.createVariableStatement(void 0, factory.createVariableDeclarationList([
                                    factory.createVariableDeclaration(generatedName, void 0, void 0, createRequireCall(node))
                                ])), node), node));
                                for(var _i = 0, _a = node.exportClause.elements; _i < _a.length; _i++){
                                    var specifier = _a[_i];
                                    if (0 === languageVersion) statements.push(ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(emitHelpers().createCreateBindingHelper(generatedName, factory.createStringLiteralFromNode(specifier.propertyName || specifier.name), specifier.propertyName ? factory.createStringLiteralFromNode(specifier.name) : void 0)), specifier), specifier));
                                    else {
                                        var exportNeedsImportDefault = !!ts1.getESModuleInterop(compilerOptions) && !(67108864 & ts1.getEmitFlags(node)) && "default" === ts1.idText(specifier.propertyName || specifier.name), exportedValue = factory.createPropertyAccessExpression(exportNeedsImportDefault ? emitHelpers().createImportDefaultHelper(generatedName) : generatedName, specifier.propertyName || specifier.name);
                                        statements.push(ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createExportExpression(factory.getExportName(specifier), exportedValue, void 0, !0)), specifier), specifier));
                                    }
                                }
                                return ts1.singleOrMany(statements);
                            }
                            if (!node.exportClause) return ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(emitHelpers().createExportStarHelper(moduleKind !== ts1.ModuleKind.AMD ? createRequireCall(node) : generatedName)), node), node);
                            var statements = [];
                            return statements.push(ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(createExportExpression(factory.cloneNode(node.exportClause.name), (innerExpr = moduleKind !== ts1.ModuleKind.AMD ? createRequireCall(node) : ts1.isExportNamespaceAsDefaultDeclaration(node) ? generatedName : factory.createIdentifier(ts1.idText(node.exportClause.name)), !ts1.getESModuleInterop(compilerOptions) || 67108864 & ts1.getEmitFlags(node) ? innerExpr : ts1.getExportNeedsImportStarHelper(node) ? emitHelpers().createImportStarHelper(innerExpr) : innerExpr))), node), node)), ts1.singleOrMany(statements);
                        }
                    }(node);
                case 270:
                    return function(node) {
                        if (!node.isExportEquals) {
                            var statements, original = node.original;
                            if (original && hasAssociatedEndOfDeclarationMarker(original)) {
                                var id = ts1.getOriginalNodeId(node);
                                deferredExports[id] = appendExportStatement(deferredExports[id], factory.createIdentifier("default"), ts1.visitNode(node.expression, visitor), node, !0);
                            } else statements = appendExportStatement(statements, factory.createIdentifier("default"), ts1.visitNode(node.expression, visitor), node, !0);
                            return ts1.singleOrMany(statements);
                        }
                    }(node);
                case 236:
                    return function(node) {
                        if (ts1.hasSyntacticModifier(node, 1)) {
                            for(var statements, variables, expressions, modifiers = void 0, removeCommentsOnExpressions = !1, _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++){
                                var variable = _a[_i];
                                if (ts1.isIdentifier(variable.name) && ts1.isLocalName(variable.name)) modifiers || (modifiers = ts1.visitNodes(node.modifiers, modifierVisitor, ts1.isModifier)), variables = ts1.append(variables, variable);
                                else if (variable.initializer) {
                                    if (!ts1.isBindingPattern(variable.name) && (ts1.isArrowFunction(variable.initializer) || ts1.isFunctionExpression(variable.initializer) || ts1.isClassExpression(variable.initializer))) {
                                        var expression = factory.createAssignment(ts1.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), variable.name), variable.name), factory.createIdentifier(ts1.getTextOfIdentifierOrLiteral(variable.name))), updatedVariable = factory.createVariableDeclaration(variable.name, variable.exclamationToken, variable.type, ts1.visitNode(variable.initializer, visitor));
                                        variables = ts1.append(variables, updatedVariable), expressions = ts1.append(expressions, expression), removeCommentsOnExpressions = !0;
                                    } else expressions = ts1.append(expressions, ts1.isBindingPattern(variable.name) ? ts1.flattenDestructuringAssignment(ts1.visitNode(variable, visitor), void 0, context, 0, !1, createAllExportExpressions) : factory.createAssignment(ts1.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), variable.name), variable.name), variable.initializer ? ts1.visitNode(variable.initializer, visitor) : factory.createVoidZero()));
                                }
                            }
                            if (variables && (statements = ts1.append(statements, factory.updateVariableStatement(node, modifiers, factory.updateVariableDeclarationList(node.declarationList, variables)))), expressions) {
                                var statement = ts1.setOriginalNode(ts1.setTextRange(factory.createExpressionStatement(factory.inlineExpressions(expressions)), node), node);
                                removeCommentsOnExpressions && ts1.removeAllComments(statement), statements = ts1.append(statements, statement);
                            }
                        } else statements = ts1.append(statements, ts1.visitEachChild(node, visitor, context));
                        if (hasAssociatedEndOfDeclarationMarker(node)) {
                            var id = ts1.getOriginalNodeId(node);
                            deferredExports[id] = appendExportsOfVariableStatement(deferredExports[id], node);
                        } else statements = appendExportsOfVariableStatement(statements, node);
                        return ts1.singleOrMany(statements);
                    }(node);
                case 255:
                    return function(node) {
                        var statements;
                        if (statements = ts1.hasSyntacticModifier(node, 1) ? ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createFunctionDeclaration(void 0, ts1.visitNodes(node.modifiers, modifierVisitor, ts1.isModifier), node.asteriskToken, factory.getDeclarationName(node, !0, !0), void 0, ts1.visitNodes(node.parameters, visitor), void 0, ts1.visitEachChild(node.body, visitor, context)), node), node)) : ts1.append(statements, ts1.visitEachChild(node, visitor, context)), hasAssociatedEndOfDeclarationMarker(node)) {
                            var id = ts1.getOriginalNodeId(node);
                            deferredExports[id] = appendExportsOfHoistedDeclaration(deferredExports[id], node);
                        } else statements = appendExportsOfHoistedDeclaration(statements, node);
                        return ts1.singleOrMany(statements);
                    }(node);
                case 256:
                    return function(node) {
                        var statements;
                        if (statements = ts1.hasSyntacticModifier(node, 1) ? ts1.append(statements, ts1.setOriginalNode(ts1.setTextRange(factory.createClassDeclaration(void 0, ts1.visitNodes(node.modifiers, modifierVisitor, ts1.isModifier), factory.getDeclarationName(node, !0, !0), void 0, ts1.visitNodes(node.heritageClauses, visitor), ts1.visitNodes(node.members, visitor)), node), node)) : ts1.append(statements, ts1.visitEachChild(node, visitor, context)), hasAssociatedEndOfDeclarationMarker(node)) {
                            var id = ts1.getOriginalNodeId(node);
                            deferredExports[id] = appendExportsOfHoistedDeclaration(deferredExports[id], node);
                        } else statements = appendExportsOfHoistedDeclaration(statements, node);
                        return ts1.singleOrMany(statements);
                    }(node);
                case 350:
                    return function(node) {
                        if (hasAssociatedEndOfDeclarationMarker(node) && 236 === node.original.kind) {
                            var id = ts1.getOriginalNodeId(node);
                            deferredExports[id] = appendExportsOfVariableStatement(deferredExports[id], node.original);
                        }
                        return node;
                    }(node);
                case 351:
                    var id, statements;
                    return (statements = deferredExports[id = ts1.getOriginalNodeId(node)]) ? (delete deferredExports[id], ts1.append(statements, node)) : node;
                default:
                    return visitor(node);
            }
        }
        function visitorWorker(node, valueIsDiscarded) {
            if (!(71307264 & node.transformFlags)) return node;
            switch(node.kind){
                case 241:
                    return factory.updateForStatement(node, ts1.visitNode(node.initializer, discardedValueVisitor, ts1.isForInitializer), ts1.visitNode(node.condition, visitor, ts1.isExpression), ts1.visitNode(node.incrementor, discardedValueVisitor, ts1.isExpression), ts1.visitIterationBody(node.statement, visitor, context));
                case 237:
                    return factory.updateExpressionStatement(node, ts1.visitNode(node.expression, discardedValueVisitor, ts1.isExpression));
                case 211:
                    return factory.updateParenthesizedExpression(node, ts1.visitNode(node.expression, valueIsDiscarded ? discardedValueVisitor : visitor, ts1.isExpression));
                case 348:
                    return factory.updatePartiallyEmittedExpression(node, ts1.visitNode(node.expression, valueIsDiscarded ? discardedValueVisitor : visitor, ts1.isExpression));
                case 207:
                    if (ts1.isImportCall(node) && void 0 === currentSourceFile.impliedNodeFormat) return function(node) {
                        var externalModuleName = ts1.getExternalModuleNameLiteral(factory, node, currentSourceFile, host, resolver, compilerOptions), firstArgument = ts1.visitNode(ts1.firstOrUndefined(node.arguments), visitor), argument = !externalModuleName || firstArgument && ts1.isStringLiteral(firstArgument) && firstArgument.text === externalModuleName.text ? firstArgument : externalModuleName, containsLexicalThis = !!(8192 & node.transformFlags);
                        switch(compilerOptions.module){
                            case ts1.ModuleKind.AMD:
                                return createImportCallExpressionAMD(argument, containsLexicalThis);
                            case ts1.ModuleKind.UMD:
                                return function(arg, containsLexicalThis) {
                                    if (needUMDDynamicImportHelper = !0, ts1.isSimpleCopiableExpression(arg)) {
                                        var argClone = ts1.isGeneratedIdentifier(arg) ? arg : ts1.isStringLiteral(arg) ? factory.createStringLiteralFromNode(arg) : ts1.setEmitFlags(ts1.setTextRange(factory.cloneNode(arg), arg), 1536);
                                        return factory.createConditionalExpression(factory.createIdentifier("__syncRequire"), void 0, createImportCallExpressionCommonJS(arg, containsLexicalThis), void 0, createImportCallExpressionAMD(argClone, containsLexicalThis));
                                    }
                                    var temp = factory.createTempVariable(hoistVariableDeclaration);
                                    return factory.createComma(factory.createAssignment(temp, arg), factory.createConditionalExpression(factory.createIdentifier("__syncRequire"), void 0, createImportCallExpressionCommonJS(temp, containsLexicalThis), void 0, createImportCallExpressionAMD(temp, containsLexicalThis)));
                                }(null != argument ? argument : factory.createVoidZero(), containsLexicalThis);
                            case ts1.ModuleKind.CommonJS:
                            default:
                                return createImportCallExpressionCommonJS(argument, containsLexicalThis);
                        }
                    }(node);
                    break;
                case 220:
                    if (ts1.isDestructuringAssignment(node)) return !function destructuringNeedsFlattening(node) {
                        if (ts1.isObjectLiteralExpression(node)) for(var _i = 0, _a = node.properties; _i < _a.length; _i++){
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
                    }(node.left) ? ts1.visitEachChild(node, visitor, context) : ts1.flattenDestructuringAssignment(node, visitor, context, 0, !valueIsDiscarded, createAllExportExpressions);
                    break;
                case 218:
                case 219:
                    return function(node, valueIsDiscarded) {
                        if ((45 === node.operator || 46 === node.operator) && ts1.isIdentifier(node.operand) && !ts1.isGeneratedIdentifier(node.operand) && !ts1.isLocalName(node.operand) && !ts1.isDeclarationNameOfEnumOrNamespace(node.operand)) {
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
            return visitorWorker(node, !1);
        }
        function discardedValueVisitor(node) {
            return visitorWorker(node, !0);
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
            languageVersion >= 2 ? func = factory.createArrowFunction(void 0, void 0, parameters, void 0, void 0, body) : (func = factory.createFunctionExpression(void 0, void 0, void 0, void 0, parameters, void 0, body), containsLexicalThis && ts1.setEmitFlags(func, 8));
            var promise = factory.createNewExpression(factory.createIdentifier("Promise"), void 0, [
                func
            ]);
            return ts1.getESModuleInterop(compilerOptions) ? factory.createCallExpression(factory.createPropertyAccessExpression(promise, factory.createIdentifier("then")), void 0, [
                emitHelpers().createImportStarCallbackHelper()
            ]) : promise;
        }
        function createImportCallExpressionCommonJS(arg, containsLexicalThis) {
            var func, promiseResolveCall = factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Promise"), "resolve"), void 0, []), requireCall = factory.createCallExpression(factory.createIdentifier("require"), void 0, arg ? [
                arg
            ] : []);
            return ts1.getESModuleInterop(compilerOptions) && (requireCall = emitHelpers().createImportStarHelper(requireCall)), languageVersion >= 2 ? func = factory.createArrowFunction(void 0, void 0, [], void 0, void 0, requireCall) : (func = factory.createFunctionExpression(void 0, void 0, void 0, void 0, [], void 0, factory.createBlock([
                factory.createReturnStatement(requireCall)
            ])), containsLexicalThis && ts1.setEmitFlags(func, 8)), factory.createCallExpression(factory.createPropertyAccessExpression(promiseResolveCall, "then"), void 0, [
                func
            ]);
        }
        function getHelperExpressionForImport(node, innerExpr) {
            return !ts1.getESModuleInterop(compilerOptions) || 67108864 & ts1.getEmitFlags(node) ? innerExpr : ts1.getImportNeedsImportStarHelper(node) ? emitHelpers().createImportStarHelper(innerExpr) : ts1.getImportNeedsImportDefaultHelper(node) ? emitHelpers().createImportDefaultHelper(innerExpr) : innerExpr;
        }
        function createRequireCall(importNode) {
            var moduleName = ts1.getExternalModuleNameLiteral(factory, importNode, currentSourceFile, host, resolver, compilerOptions), args = [];
            return moduleName && args.push(moduleName), factory.createCallExpression(factory.createIdentifier("require"), void 0, args);
        }
        function createAllExportExpressions(name, value, location) {
            var exportedNames = getExports(name);
            if (exportedNames) {
                for(var expression = ts1.isExportName(name) ? value : factory.createAssignment(name, value), _i = 0; _i < exportedNames.length; _i++){
                    var exportName = exportedNames[_i];
                    ts1.setEmitFlags(expression, 4), expression = createExportExpression(exportName, expression, location);
                }
                return expression;
            }
            return factory.createAssignment(name, value);
        }
        function hasAssociatedEndOfDeclarationMarker(node) {
            return (4194304 & ts1.getEmitFlags(node)) != 0;
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
            for(var _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++)statements = function appendExportsOfBindingElement(statements, decl) {
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
        function appendExportsOfHoistedDeclaration(statements, decl) {
            return currentModuleInfo.exportEquals || (ts1.hasSyntacticModifier(decl, 1) && (statements = appendExportStatement(statements, ts1.hasSyntacticModifier(decl, 512) ? factory.createIdentifier("default") : factory.getDeclarationName(decl), factory.getLocalName(decl), decl)), decl.name && (statements = appendExportsOfDeclaration(statements, decl))), statements;
        }
        function appendExportsOfDeclaration(statements, decl, liveBinding) {
            var name = factory.getDeclarationName(decl), exportSpecifiers = currentModuleInfo.exportSpecifiers.get(ts1.idText(name));
            if (exportSpecifiers) for(var _i = 0; _i < exportSpecifiers.length; _i++){
                var exportSpecifier = exportSpecifiers[_i];
                statements = appendExportStatement(statements, exportSpecifier.name, name, exportSpecifier.name, void 0, liveBinding);
            }
            return statements;
        }
        function appendExportStatement(statements, exportName, expression, location, allowComments, liveBinding) {
            var statement;
            return statements = ts1.append(statements, (statement = ts1.setTextRange(factory.createExpressionStatement(createExportExpression(exportName, expression, void 0, liveBinding)), location), ts1.startOnNewLine(statement), allowComments || ts1.setEmitFlags(statement, 1536), statement));
        }
        function createUnderscoreUnderscoreESModule() {
            var statement;
            return statement = 0 === languageVersion ? factory.createExpressionStatement(createExportExpression(factory.createIdentifier("__esModule"), factory.createTrue())) : factory.createExpressionStatement(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Object"), "defineProperty"), void 0, [
                factory.createIdentifier("exports"),
                factory.createStringLiteral("__esModule"),
                factory.createObjectLiteralExpression([
                    factory.createPropertyAssignment("value", factory.createTrue())
                ])
            ])), ts1.setEmitFlags(statement, 1048576), statement;
        }
        function createExportExpression(name, value, location, liveBinding) {
            return ts1.setTextRange(liveBinding && 0 !== languageVersion ? factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Object"), "defineProperty"), void 0, [
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
        function substituteExpressionIdentifier(node) {
            var _a, _b;
            if (4096 & ts1.getEmitFlags(node)) {
                var externalHelpersModuleName = ts1.getExternalHelpersModuleName(currentSourceFile);
                if (externalHelpersModuleName) return factory.createPropertyAccessExpression(externalHelpersModuleName, node);
            } else if (!(ts1.isGeneratedIdentifier(node) && !(64 & node.autoGenerateFlags)) && !ts1.isLocalName(node)) {
                var exportContainer = resolver.getReferencedExportContainer(node, ts1.isExportName(node));
                if (exportContainer && 303 === exportContainer.kind) return ts1.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.cloneNode(node)), node);
                var importDeclaration = resolver.getReferencedImportDeclaration(node);
                if (importDeclaration) {
                    if (ts1.isImportClause(importDeclaration)) return ts1.setTextRange(factory.createPropertyAccessExpression(factory.getGeneratedNameForNode(importDeclaration.parent), factory.createIdentifier("default")), node);
                    if (ts1.isImportSpecifier(importDeclaration)) {
                        var name = importDeclaration.propertyName || importDeclaration.name;
                        return ts1.setTextRange(factory.createPropertyAccessExpression(factory.getGeneratedNameForNode((null === (_b = null === (_a = importDeclaration.parent) || void 0 === _a ? void 0 : _a.parent) || void 0 === _b ? void 0 : _b.parent) || importDeclaration), factory.cloneNode(name)), node);
                    }
                }
            }
            return node;
        }
        function getExports(name) {
            if (!ts1.isGeneratedIdentifier(name)) {
                var valueDeclaration = resolver.getReferencedImportDeclaration(name) || resolver.getReferencedValueDeclaration(name);
                if (valueDeclaration) return currentModuleInfo && currentModuleInfo.exportedBindings[ts1.getOriginalNodeId(valueDeclaration)];
            }
        }
    };
    var dynamicImportUMDHelper = {
        name: "typescript:dynamicimport-sync-require",
        scoped: !0,
        text: "\n            var __syncRequire = typeof module === \"object\" && typeof module.exports === \"object\";"
    };
}(ts = {});
