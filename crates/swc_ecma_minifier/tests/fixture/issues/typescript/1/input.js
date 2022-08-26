var ts;
(function (ts) {
    function transformModule(context) {
        function getTransformModuleDelegate(moduleKind) {
            switch (moduleKind) {
                case ts.ModuleKind.AMD: return transformAMDModule;
                case ts.ModuleKind.UMD: return transformUMDModule;
                default: return transformCommonJSModule;
            }
        }
        var factory = context.factory, emitHelpers = context.getEmitHelperFactory, startLexicalEnvironment = context.startLexicalEnvironment, endLexicalEnvironment = context.endLexicalEnvironment, hoistVariableDeclaration = context.hoistVariableDeclaration;
        var compilerOptions = context.getCompilerOptions();
        var resolver = context.getEmitResolver();
        var host = context.getEmitHost();
        var languageVersion = ts.getEmitScriptTarget(compilerOptions);
        var moduleKind = ts.getEmitModuleKind(compilerOptions);
        var previousOnSubstituteNode = context.onSubstituteNode;
        var previousOnEmitNode = context.onEmitNode;
        context.onSubstituteNode = onSubstituteNode;
        context.onEmitNode = onEmitNode;
        context.enableSubstitution(207 /* CallExpression */); // Substitute calls to imported/exported symbols to avoid incorrect `this`.
        context.enableSubstitution(209 /* TaggedTemplateExpression */); // Substitute calls to imported/exported symbols to avoid incorrect `this`.
        context.enableSubstitution(79 /* Identifier */); // Substitutes expression identifiers with imported/exported symbols.
        context.enableSubstitution(220 /* BinaryExpression */); // Substitutes assignments to exported symbols.
        context.enableSubstitution(295 /* ShorthandPropertyAssignment */); // Substitutes shorthand property assignments for imported/exported symbols.
        context.enableEmitNotification(303 /* SourceFile */); // Restore state when substituting nodes in a file.
        var moduleInfoMap = []; // The ExternalModuleInfo for each file.
        var deferredExports = []; // Exports to defer until an EndOfDeclarationMarker is found.
        var currentSourceFile; // The current file.
        var currentModuleInfo; // The ExternalModuleInfo for the current file.
        var noSubstitution = []; // Set of nodes for which substitution rules should be ignored.
        var needUMDDynamicImportHelper;
        return ts.chainBundle(context, transformSourceFile);
        /**
         * Transforms the module aspects of a SourceFile.
         *
         * @param node The SourceFile node.
         */
        function transformSourceFile(node) {
            if (node.isDeclarationFile ||
                !(ts.isEffectiveExternalModule(node, compilerOptions) ||
                    node.transformFlags & 4194304 /* ContainsDynamicImport */ ||
                    (ts.isJsonSourceFile(node) && ts.hasJsonModuleEmitEnabled(compilerOptions) && ts.outFile(compilerOptions)))) {
                return node;
            }
            currentSourceFile = node;
            currentModuleInfo = ts.collectExternalModuleInfo(context, node, resolver, compilerOptions);
            moduleInfoMap[ts.getOriginalNodeId(node)] = currentModuleInfo;
            // Perform the transformation.
            var transformModule = getTransformModuleDelegate(moduleKind);
            var updated = transformModule(node);
            currentSourceFile = undefined;
            currentModuleInfo = undefined;
            needUMDDynamicImportHelper = false;
            return updated;
        }
        function shouldEmitUnderscoreUnderscoreESModule() {
            if (!currentModuleInfo.exportEquals && ts.isExternalModule(currentSourceFile)) {
                return true;
            }
            return false;
        }
        /**
         * Transforms a SourceFile into a CommonJS module.
         *
         * @param node The SourceFile node.
         */
        function transformCommonJSModule(node) {
            startLexicalEnvironment();
            var statements = [];
            var ensureUseStrict = ts.getStrictOptionValue(compilerOptions, "alwaysStrict") || (!compilerOptions.noImplicitUseStrict && ts.isExternalModule(currentSourceFile));
            var statementOffset = factory.copyPrologue(node.statements, statements, ensureUseStrict && !ts.isJsonSourceFile(node), topLevelVisitor);
            if (shouldEmitUnderscoreUnderscoreESModule()) {
                ts.append(statements, createUnderscoreUnderscoreESModule());
            }
            if (ts.length(currentModuleInfo.exportedNames)) {
                var chunkSize = 50;
                for (var i = 0; i < currentModuleInfo.exportedNames.length; i += chunkSize) {
                    ts.append(statements, factory.createExpressionStatement(ts.reduceLeft(currentModuleInfo.exportedNames.slice(i, i + chunkSize), function (prev, nextId) { return factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.createIdentifier(ts.idText(nextId))), prev); }, factory.createVoidZero())));
                }
            }
            ts.append(statements, ts.visitNode(currentModuleInfo.externalHelpersImportDeclaration, topLevelVisitor, ts.isStatement));
            ts.addRange(statements, ts.visitNodes(node.statements, topLevelVisitor, ts.isStatement, statementOffset));
            addExportEqualsIfNeeded(statements, /*emitAsReturn*/ false);
            ts.insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
            var updated = factory.updateSourceFile(node, ts.setTextRange(factory.createNodeArray(statements), node.statements));
            ts.addEmitHelpers(updated, context.readEmitHelpers());
            return updated;
        }
        /**
         * Transforms a SourceFile into an AMD module.
         *
         * @param node The SourceFile node.
         */
        function transformAMDModule(node) {
            var define = factory.createIdentifier("define");
            var moduleName = ts.tryGetModuleNameFromFile(factory, node, host, compilerOptions);
            var jsonSourceFile = ts.isJsonSourceFile(node) && node;
            // An AMD define function has the following shape:
            //
            //     define(id?, dependencies?, factory);
            //
            // This has the shape of the following:
            //
            //     define(name, ["module1", "module2"], function (module1Alias) { ... }
            //
            // The location of the alias in the parameter list in the factory function needs to
            // match the position of the module name in the dependency list.
            //
            // To ensure this is true in cases of modules with no aliases, e.g.:
            //
            //     import "module"
            //
            // or
            //
            //     /// <amd-dependency path= "a.css" />
            //
            // we need to add modules without alias names to the end of the dependencies list
            var _a = collectAsynchronousDependencies(node, /*includeNonAmdDependencies*/ true), aliasedModuleNames = _a.aliasedModuleNames, unaliasedModuleNames = _a.unaliasedModuleNames, importAliasNames = _a.importAliasNames;
            // Create an updated SourceFile:
            //
            //     define(mofactory.updateSourceFile", "module2"], function ...
            var updated = factory.updateSourceFile(node, ts.setTextRange(factory.createNodeArray([
                factory.createExpressionStatement(factory.createCallExpression(define,
                /*typeArguments*/ undefined, __spreadArray(__spreadArray([], (moduleName ? [moduleName] : []), true), [
                    // Add the dependency array argument:
                    //
                    //     ["require", "exports", module1", "module2", ...]
                    factory.createArrayLiteralExpression(jsonSourceFile ? ts.emptyArray : __spreadArray(__spreadArray([
                        factory.createStringLiteral("require"),
                        factory.createStringLiteral("exports")
                    ], aliasedModuleNames, true), unaliasedModuleNames, true)),
                    // Add the module body function argument:
                    //
                    //     function (require, exports, module1, module2) ...
                    jsonSourceFile ?
                        jsonSourceFile.statements.length ? jsonSourceFile.statements[0].expression : factory.createObjectLiteralExpression() :
                        factory.createFunctionExpression(
                        /*modifiers*/ undefined,
                        /*asteriskToken*/ undefined,
                        /*name*/ undefined,
                        /*typeParameters*/ undefined, __spreadArray([
                            factory.createParameterDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, "require"),
                            factory.createParameterDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, "exports")
                        ], importAliasNames, true),
                        /*type*/ undefined, transformAsynchronousModuleBody(node))
                ], false)))
            ]),
            /*location*/ node.statements));
            ts.addEmitHelpers(updated, context.readEmitHelpers());
            return updated;
        }
        /**
         * Transforms a SourceFile into a UMD module.
         *
         * @param node The SourceFile node.
         */
        function transformUMDModule(node) {
            var _a = collectAsynchronousDependencies(node, /*includeNonAmdDependencies*/ false), aliasedModuleNames = _a.aliasedModuleNames, unaliasedModuleNames = _a.unaliasedModuleNames, importAliasNames = _a.importAliasNames;
            var moduleName = ts.tryGetModuleNameFromFile(factory, node, host, compilerOptions);
            var umdHeader = factory.createFunctionExpression(
            /*modifiers*/ undefined,
            /*asteriskToken*/ undefined,
            /*name*/ undefined,
            /*typeParameters*/ undefined, [factory.createParameterDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, "factory")],
            /*type*/ undefined, ts.setTextRange(factory.createBlock([
                factory.createIfStatement(factory.createLogicalAnd(factory.createTypeCheck(factory.createIdentifier("module"), "object"), factory.createTypeCheck(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), "object")), factory.createBlock([
                    factory.createVariableStatement(
                    /*modifiers*/ undefined, [
                        factory.createVariableDeclaration("v",
                        /*exclamationToken*/ undefined,
                        /*type*/ undefined, factory.createCallExpression(factory.createIdentifier("factory"),
                        /*typeArguments*/ undefined, [
                            factory.createIdentifier("require"),
                            factory.createIdentifier("exports")
                        ]))
                    ]),
                    ts.setEmitFlags(factory.createIfStatement(factory.createStrictInequality(factory.createIdentifier("v"), factory.createIdentifier("undefined")), factory.createExpressionStatement(factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), factory.createIdentifier("v")))), 1 /* SingleLine */)
                ]), factory.createIfStatement(factory.createLogicalAnd(factory.createTypeCheck(factory.createIdentifier("define"), "function"), factory.createPropertyAccessExpression(factory.createIdentifier("define"), "amd")), factory.createBlock([
                    factory.createExpressionStatement(factory.createCallExpression(factory.createIdentifier("define"),
                    /*typeArguments*/ undefined, __spreadArray(__spreadArray([], (moduleName ? [moduleName] : []), true), [
                        factory.createArrayLiteralExpression(__spreadArray(__spreadArray([
                            factory.createStringLiteral("require"),
                            factory.createStringLiteral("exports")
                        ], aliasedModuleNames, true), unaliasedModuleNames, true)),
                        factory.createIdentifier("factory")
                    ], false)))
                ])))
            ],
            /*multiLine*/ true),
            /*location*/ undefined));
            // Create an updated SourceFile:
            //
            //  (function (factory) {
            //      if (typeof module === "object" && typeof module.exports === "object") {
            //          var v = factory(require, exports);
            //          if (v !== undefined) module.exports = v;
            //      }
            //      else if (typeof define === 'function' && define.amd) {
            //          define(["require", "exports"], factory);
            //      }
            //  })(function ...)
            var updated = factory.updateSourceFile(node, ts.setTextRange(factory.createNodeArray([
                factory.createExpressionStatement(factory.createCallExpression(umdHeader,
                /*typeArguments*/ undefined, [
                    // Add the module body function argument:
                    //
                    //     function (require, exports) ...
                    factory.createFunctionExpression(
                    /*modifiers*/ undefined,
                    /*asteriskToken*/ undefined,
                    /*name*/ undefined,
                    /*typeParameters*/ undefined, __spreadArray([
                        factory.createParameterDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, "require"),
                        factory.createParameterDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, "exports")
                    ], importAliasNames, true),
                    /*type*/ undefined, transformAsynchronousModuleBody(node))
                ]))
            ]),
            /*location*/ node.statements));
            ts.addEmitHelpers(updated, context.readEmitHelpers());
            return updated;
        }
        /**
         * Collect the additional asynchronous dependencies for the module.
         *
         * @param node The source file.
         * @param includeNonAmdDependencies A value indicating whether to include non-AMD dependencies.
         */
        function collectAsynchronousDependencies(node, includeNonAmdDependencies) {
            // names of modules with corresponding parameter in the factory function
            var aliasedModuleNames = [];
            // names of modules with no corresponding parameters in factory function
            var unaliasedModuleNames = [];
            // names of the parameters in the factory function; these
            // parameters need to match the indexes of the corresponding
            // module names in aliasedModuleNames.
            var importAliasNames = [];
            // Fill in amd-dependency tags
            for (var _i = 0, _a = node.amdDependencies; _i < _a.length; _i++) {
                var amdDependency = _a[_i];
                if (amdDependency.name) {
                    aliasedModuleNames.push(factory.createStringLiteral(amdDependency.path));
                    importAliasNames.push(factory.createParameterDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, amdDependency.name));
                }
                else {
                    unaliasedModuleNames.push(factory.createStringLiteral(amdDependency.path));
                }
            }
            for (var _b = 0, _c = currentModuleInfo.externalImports; _b < _c.length; _b++) {
                var importNode = _c[_b];
                // Find the name of the external module
                var externalModuleName = ts.getExternalModuleNameLiteral(factory, importNode, currentSourceFile, host, resolver, compilerOptions);
                // Find the name of the module alias, if there is one
                var importAliasName = ts.getLocalNameForExternalImport(factory, importNode, currentSourceFile);
                // It is possible that externalModuleName is undefined if it is not string literal.
                // This can happen in the invalid import syntax.
                // E.g : "import * from alias from 'someLib';"
                if (externalModuleName) {
                    if (includeNonAmdDependencies && importAliasName) {
                        // Set emitFlags on the name of the classDeclaration
                        // This is so that when printer will not substitute the identifier
                        ts.setEmitFlags(importAliasName, 4 /* NoSubstitution */);
                        aliasedModuleNames.push(externalModuleName);
                        importAliasNames.push(factory.createParameterDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, importAliasName));
                    }
                    else {
                        unaliasedModuleNames.push(externalModuleName);
                    }
                }
            }
            return { aliasedModuleNames: aliasedModuleNames, unaliasedModuleNames: unaliasedModuleNames, importAliasNames: importAliasNames };
        }
        function getAMDImportExpressionForImport(node) {
            if (ts.isImportEqualsDeclaration(node) || ts.isExportDeclaration(node) || !ts.getExternalModuleNameLiteral(factory, node, currentSourceFile, host, resolver, compilerOptions)) {
                return undefined;
            }
            var name = ts.getLocalNameForExternalImport(factory, node, currentSourceFile); // TODO: GH#18217
            var expr = getHelperExpressionForImport(node, name);
            if (expr === name) {
                return undefined;
            }
            return factory.createExpressionStatement(factory.createAssignment(name, expr));
        }
        /**
         * Transforms a SourceFile into an AMD or UMD module body.
         *
         * @param node The SourceFile node.
         */
        function transformAsynchronousModuleBody(node) {
            startLexicalEnvironment();
            var statements = [];
            var statementOffset = factory.copyPrologue(node.statements, statements, /*ensureUseStrict*/ !compilerOptions.noImplicitUseStrict, topLevelVisitor);
            if (shouldEmitUnderscoreUnderscoreESModule()) {
                ts.append(statements, createUnderscoreUnderscoreESModule());
            }
            if (ts.length(currentModuleInfo.exportedNames)) {
                ts.append(statements, factory.createExpressionStatement(ts.reduceLeft(currentModuleInfo.exportedNames, function (prev, nextId) { return factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.createIdentifier(ts.idText(nextId))), prev); }, factory.createVoidZero())));
            }
            // Visit each statement of the module body.
            ts.append(statements, ts.visitNode(currentModuleInfo.externalHelpersImportDeclaration, topLevelVisitor, ts.isStatement));
            if (moduleKind === ts.ModuleKind.AMD) {
                ts.addRange(statements, ts.mapDefined(currentModuleInfo.externalImports, getAMDImportExpressionForImport));
            }
            ts.addRange(statements, ts.visitNodes(node.statements, topLevelVisitor, ts.isStatement, statementOffset));
            // Append the 'export =' statement if provided.
            addExportEqualsIfNeeded(statements, /*emitAsReturn*/ true);
            // End the lexical environment for the module body
            // and merge any new lexical declarations.
            ts.insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
            var body = factory.createBlock(statements, /*multiLine*/ true);
            if (needUMDDynamicImportHelper) {
                ts.addEmitHelper(body, dynamicImportUMDHelper);
            }
            return body;
        }
        /**
         * Adds the down-level representation of `export=` to the statement list if one exists
         * in the source file.
         *
         * @param statements The Statement list to modify.
         * @param emitAsReturn A value indicating whether to emit the `export=` statement as a
         * return statement.
         */
        function addExportEqualsIfNeeded(statements, emitAsReturn) {
            if (currentModuleInfo.exportEquals) {
                var expressionResult = ts.visitNode(currentModuleInfo.exportEquals.expression, visitor);
                if (expressionResult) {
                    if (emitAsReturn) {
                        var statement = factory.createReturnStatement(expressionResult);
                        ts.setTextRange(statement, currentModuleInfo.exportEquals);
                        ts.setEmitFlags(statement, 384 /* NoTokenSourceMaps */ | 1536 /* NoComments */);
                        statements.push(statement);
                    }
                    else {
                        var statement = factory.createExpressionStatement(factory.createAssignment(factory.createPropertyAccessExpression(factory.createIdentifier("module"), "exports"), expressionResult));
                        ts.setTextRange(statement, currentModuleInfo.exportEquals);
                        ts.setEmitFlags(statement, 1536 /* NoComments */);
                        statements.push(statement);
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
         */
        function topLevelVisitor(node) {
            switch (node.kind) {
                case 265 /* ImportDeclaration */:
                    return visitImportDeclaration(node);
                case 264 /* ImportEqualsDeclaration */:
                    return visitImportEqualsDeclaration(node);
                case 271 /* ExportDeclaration */:
                    return visitExportDeclaration(node);
                case 270 /* ExportAssignment */:
                    return visitExportAssignment(node);
                case 236 /* VariableStatement */:
                    return visitVariableStatement(node);
                case 255 /* FunctionDeclaration */:
                    return visitFunctionDeclaration(node);
                case 256 /* ClassDeclaration */:
                    return visitClassDeclaration(node);
                case 350 /* MergeDeclarationMarker */:
                    return visitMergeDeclarationMarker(node);
                case 351 /* EndOfDeclarationMarker */:
                    return visitEndOfDeclarationMarker(node);
                default:
                    return visitor(node);
            }
        }
        function visitorWorker(node, valueIsDiscarded) {
            // This visitor does not need to descend into the tree if there is no dynamic import, destructuring assignment, or update expression
            // as export/import statements are only transformed at the top level of a file.
            if (!(node.transformFlags & (4194304 /* ContainsDynamicImport */ | 4096 /* ContainsDestructuringAssignment */ | 67108864 /* ContainsUpdateExpressionForIdentifier */))) {
                return node;
            }
            switch (node.kind) {
                case 241 /* ForStatement */:
                    return visitForStatement(node);
                case 237 /* ExpressionStatement */:
                    return visitExpressionStatement(node);
                case 211 /* ParenthesizedExpression */:
                    return visitParenthesizedExpression(node, valueIsDiscarded);
                case 348 /* PartiallyEmittedExpression */:
                    return visitPartiallyEmittedExpression(node, valueIsDiscarded);
                case 207 /* CallExpression */:
                    if (ts.isImportCall(node) && currentSourceFile.impliedNodeFormat === undefined) {
                        return visitImportCallExpression(node);
                    }
                    break;
                case 220 /* BinaryExpression */:
                    if (ts.isDestructuringAssignment(node)) {
                        return visitDestructuringAssignment(node, valueIsDiscarded);
                    }
                    break;
                case 218 /* PrefixUnaryExpression */:
                case 219 /* PostfixUnaryExpression */:
                    return visitPreOrPostfixUnaryExpression(node, valueIsDiscarded);
            }
            return ts.visitEachChild(node, visitor, context);
        }
        function visitor(node) {
            return visitorWorker(node, /*valueIsDiscarded*/ false);
        }
        function discardedValueVisitor(node) {
            return visitorWorker(node, /*valueIsDiscarded*/ true);
        }
        function destructuringNeedsFlattening(node) {
            if (ts.isObjectLiteralExpression(node)) {
                for (var _i = 0, _a = node.properties; _i < _a.length; _i++) {
                    var elem = _a[_i];
                    switch (elem.kind) {
                        case 294 /* PropertyAssignment */:
                            if (destructuringNeedsFlattening(elem.initializer)) {
                                return true;
                            }
                            break;
                        case 295 /* ShorthandPropertyAssignment */:
                            if (destructuringNeedsFlattening(elem.name)) {
                                return true;
                            }
                            break;
                        case 296 /* SpreadAssignment */:
                            if (destructuringNeedsFlattening(elem.expression)) {
                                return true;
                            }
                            break;
                        case 168 /* MethodDeclaration */:
                        case 171 /* GetAccessor */:
                        case 172 /* SetAccessor */:
                            return false;
                        default: ts.Debug.assertNever(elem, "Unhandled object member kind");
                    }
                }
            }
            else if (ts.isArrayLiteralExpression(node)) {
                for (var _b = 0, _c = node.elements; _b < _c.length; _b++) {
                    var elem = _c[_b];
                    if (ts.isSpreadElement(elem)) {
                        if (destructuringNeedsFlattening(elem.expression)) {
                            return true;
                        }
                    }
                    else if (destructuringNeedsFlattening(elem)) {
                        return true;
                    }
                }
            }
            else if (ts.isIdentifier(node)) {
                return ts.length(getExports(node)) > (ts.isExportName(node) ? 1 : 0);
            }
            return false;
        }
        function visitDestructuringAssignment(node, valueIsDiscarded) {
            if (destructuringNeedsFlattening(node.left)) {
                return ts.flattenDestructuringAssignment(node, visitor, context, 0 /* All */, !valueIsDiscarded, createAllExportExpressions);
            }
            return ts.visitEachChild(node, visitor, context);
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
            // When we see a prefix or postfix increment expression whose operand is an exported
            // symbol, we should ensure all exports of that symbol are updated with the correct
            // value.
            //
            // - We do not transform generated identifiers for any reason.
            // - We do not transform identifiers tagged with the LocalName flag.
            // - We do not transform identifiers that were originally the name of an enum or
            //   namespace due to how they are transformed in TypeScript.
            // - We only transform identifiers that are exported at the top level.
            if ((node.operator === 45 /* PlusPlusToken */ || node.operator === 46 /* MinusMinusToken */)
                && ts.isIdentifier(node.operand)
                && !ts.isGeneratedIdentifier(node.operand)
                && !ts.isLocalName(node.operand)
                && !ts.isDeclarationNameOfEnumOrNamespace(node.operand)) {
                var exportedNames = getExports(node.operand);
                if (exportedNames) {
                    var temp = void 0;
                    var expression = ts.visitNode(node.operand, visitor, ts.isExpression);
                    if (ts.isPrefixUnaryExpression(node)) {
                        expression = factory.updatePrefixUnaryExpression(node, expression);
                    }
                    else {
                        expression = factory.updatePostfixUnaryExpression(node, expression);
                        if (!valueIsDiscarded) {
                            temp = factory.createTempVariable(hoistVariableDeclaration);
                            expression = factory.createAssignment(temp, expression);
                            ts.setTextRange(expression, node);
                        }
                        expression = factory.createComma(expression, factory.cloneNode(node.operand));
                        ts.setTextRange(expression, node);
                    }
                    for (var _i = 0, exportedNames_1 = exportedNames; _i < exportedNames_1.length; _i++) {
                        var exportName = exportedNames_1[_i];
                        noSubstitution[ts.getNodeId(expression)] = true;
                        expression = createExportExpression(exportName, expression);
                        ts.setTextRange(expression, node);
                    }
                    if (temp) {
                        noSubstitution[ts.getNodeId(expression)] = true;
                        expression = factory.createComma(expression, temp);
                        ts.setTextRange(expression, node);
                    }
                    return expression;
                }
            }
            return ts.visitEachChild(node, visitor, context);
        }
        function visitImportCallExpression(node) {
            var externalModuleName = ts.getExternalModuleNameLiteral(factory, node, currentSourceFile, host, resolver, compilerOptions);
            var firstArgument = ts.visitNode(ts.firstOrUndefined(node.arguments), visitor);
            // Only use the external module name if it differs from the first argument. This allows us to preserve the quote style of the argument on output.
            var argument = externalModuleName && (!firstArgument || !ts.isStringLiteral(firstArgument) || firstArgument.text !== externalModuleName.text) ? externalModuleName : firstArgument;
            var containsLexicalThis = !!(node.transformFlags & 8192 /* ContainsLexicalThis */);
            switch (compilerOptions.module) {
                case ts.ModuleKind.AMD:
                    return createImportCallExpressionAMD(argument, containsLexicalThis);
                case ts.ModuleKind.UMD:
                    return createImportCallExpressionUMD(argument !== null && argument !== void 0 ? argument : factory.createVoidZero(), containsLexicalThis);
                case ts.ModuleKind.CommonJS:
                default:
                    return createImportCallExpressionCommonJS(argument, containsLexicalThis);
            }
        }
        function createImportCallExpressionUMD(arg, containsLexicalThis) {
            // (function (factory) {
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
            needUMDDynamicImportHelper = true;
            if (ts.isSimpleCopiableExpression(arg)) {
                var argClone = ts.isGeneratedIdentifier(arg) ? arg : ts.isStringLiteral(arg) ? factory.createStringLiteralFromNode(arg) : ts.setEmitFlags(ts.setTextRange(factory.cloneNode(arg), arg), 1536 /* NoComments */);
                return factory.createConditionalExpression(
                /*condition*/ factory.createIdentifier("__syncRequire"),
                /*questionToken*/ undefined,
                /*whenTrue*/ createImportCallExpressionCommonJS(arg, containsLexicalThis),
                /*colonToken*/ undefined,
                /*whenFalse*/ createImportCallExpressionAMD(argClone, containsLexicalThis));
            }
            else {
                var temp = factory.createTempVariable(hoistVariableDeclaration);
                return factory.createComma(factory.createAssignment(temp, arg), factory.createConditionalExpression(
                /*condition*/ factory.createIdentifier("__syncRequire"),
                /*questionToken*/ undefined,
                /*whenTrue*/ createImportCallExpressionCommonJS(temp, containsLexicalThis),
                /*colonToken*/ undefined,
                /*whenFalse*/ createImportCallExpressionAMD(temp, containsLexicalThis)));
            }
        }
        function createImportCallExpressionAMD(arg, containsLexicalThis) {
            // improt("./blah")
            // emit as
            // define(["require", "exports", "blah"], function (require, exports) {
            //     ...
            //     new Promise(function (_a, _b) { require([x], _a, _b); }); /*Amd Require*/
            // });
            var resolve = factory.createUniqueName("resolve");
            var reject = factory.createUniqueName("reject");
            var parameters = [
                factory.createParameterDeclaration(/*decorator*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, /*name*/ resolve),
                factory.createParameterDeclaration(/*decorator*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, /*name*/ reject)
            ];
            var body = factory.createBlock([
                factory.createExpressionStatement(factory.createCallExpression(factory.createIdentifier("require"),
                /*typeArguments*/ undefined, [factory.createArrayLiteralExpression([arg || factory.createOmittedExpression()]), resolve, reject]))
            ]);
            var func;
            if (languageVersion >= 2 /* ES2015 */) {
                func = factory.createArrowFunction(
                /*modifiers*/ undefined,
                /*typeParameters*/ undefined, parameters,
                /*type*/ undefined,
                /*equalsGreaterThanToken*/ undefined, body);
            }
            else {
                func = factory.createFunctionExpression(
                /*modifiers*/ undefined,
                /*asteriskToken*/ undefined,
                /*name*/ undefined,
                /*typeParameters*/ undefined, parameters,
                /*type*/ undefined, body);
                // if there is a lexical 'this' in the import call arguments, ensure we indicate
                // that this new function expression indicates it captures 'this' so that the
                // es2015 transformer will properly substitute 'this' with '_this'.
                if (containsLexicalThis) {
                    ts.setEmitFlags(func, 8 /* CapturesThis */);
                }
            }
            var promise = factory.createNewExpression(factory.createIdentifier("Promise"), /*typeArguments*/ undefined, [func]);
            if (ts.getESModuleInterop(compilerOptions)) {
                return factory.createCallExpression(factory.createPropertyAccessExpression(promise, factory.createIdentifier("then")), /*typeArguments*/ undefined, [emitHelpers().createImportStarCallbackHelper()]);
            }
            return promise;
        }
        function createImportCallExpressionCommonJS(arg, containsLexicalThis) {
            // import("./blah")
            // emit as
            // Promise.resolve().then(function () { return require(x); }) /*CommonJs Require*/
            // We have to wrap require in then callback so that require is done in asynchronously
            // if we simply do require in resolve callback in Promise constructor. We will execute the loading immediately
            var promiseResolveCall = factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Promise"), "resolve"), /*typeArguments*/ undefined, /*argumentsArray*/[]);
            var requireCall = factory.createCallExpression(factory.createIdentifier("require"), /*typeArguments*/ undefined, arg ? [arg] : []);
            if (ts.getESModuleInterop(compilerOptions)) {
                requireCall = emitHelpers().createImportStarHelper(requireCall);
            }
            var func;
            if (languageVersion >= 2 /* ES2015 */) {
                func = factory.createArrowFunction(
                /*modifiers*/ undefined,
                /*typeParameters*/ undefined,
                /*parameters*/[],
                /*type*/ undefined,
                /*equalsGreaterThanToken*/ undefined, requireCall);
            }
            else {
                func = factory.createFunctionExpression(
                /*modifiers*/ undefined,
                /*asteriskToken*/ undefined,
                /*name*/ undefined,
                /*typeParameters*/ undefined,
                /*parameters*/[],
                /*type*/ undefined, factory.createBlock([factory.createReturnStatement(requireCall)]));
                // if there is a lexical 'this' in the import call arguments, ensure we indicate
                // that this new function expression indicates it captures 'this' so that the
                // es2015 transformer will properly substitute 'this' with '_this'.
                if (containsLexicalThis) {
                    ts.setEmitFlags(func, 8 /* CapturesThis */);
                }
            }
            return factory.createCallExpression(factory.createPropertyAccessExpression(promiseResolveCall, "then"), /*typeArguments*/ undefined, [func]);
        }
        function getHelperExpressionForExport(node, innerExpr) {
            if (!ts.getESModuleInterop(compilerOptions) || ts.getEmitFlags(node) & 67108864 /* NeverApplyImportHelper */) {
                return innerExpr;
            }
            if (ts.getExportNeedsImportStarHelper(node)) {
                return emitHelpers().createImportStarHelper(innerExpr);
            }
            return innerExpr;
        }
        function getHelperExpressionForImport(node, innerExpr) {
            if (!ts.getESModuleInterop(compilerOptions) || ts.getEmitFlags(node) & 67108864 /* NeverApplyImportHelper */) {
                return innerExpr;
            }
            if (ts.getImportNeedsImportStarHelper(node)) {
                return emitHelpers().createImportStarHelper(innerExpr);
            }
            if (ts.getImportNeedsImportDefaultHelper(node)) {
                return emitHelpers().createImportDefaultHelper(innerExpr);
            }
            return innerExpr;
        }
        /**
         * Visits an ImportDeclaration node.
         *
         * @param node The node to visit.
         */
        function visitImportDeclaration(node) {
            var statements;
            var namespaceDeclaration = ts.getNamespaceDeclarationNode(node);
            if (moduleKind !== ts.ModuleKind.AMD) {
                if (!node.importClause) {
                    // import "mod";
                    return ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createRequireCall(node)), node), node);
                }
                else {
                    var variables = [];
                    if (namespaceDeclaration && !ts.isDefaultImport(node)) {
                        // import * as n from "mod";
                        variables.push(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name),
                        /*exclamationToken*/ undefined,
                        /*type*/ undefined, getHelperExpressionForImport(node, createRequireCall(node))));
                    }
                    else {
                        // import d from "mod";
                        // import { x, y } from "mod";
                        // import d, { x, y } from "mod";
                        // import d, * as n from "mod";
                        variables.push(factory.createVariableDeclaration(factory.getGeneratedNameForNode(node),
                        /*exclamationToken*/ undefined,
                        /*type*/ undefined, getHelperExpressionForImport(node, createRequireCall(node))));
                        if (namespaceDeclaration && ts.isDefaultImport(node)) {
                            variables.push(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name),
                            /*exclamationToken*/ undefined,
                            /*type*/ undefined, factory.getGeneratedNameForNode(node)));
                        }
                    }
                    statements = ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createVariableStatement(
                    /*modifiers*/ undefined, factory.createVariableDeclarationList(variables, languageVersion >= 2 /* ES2015 */ ? 2 /* Const */ : 0 /* None */)),
                    /*location*/ node),
                    /*original*/ node));
                }
            }
            else if (namespaceDeclaration && ts.isDefaultImport(node)) {
                // import d, * as n from "mod";
                statements = ts.append(statements, factory.createVariableStatement(
                /*modifiers*/ undefined, factory.createVariableDeclarationList([
                    ts.setOriginalNode(ts.setTextRange(factory.createVariableDeclaration(factory.cloneNode(namespaceDeclaration.name),
                    /*exclamationToken*/ undefined,
                    /*type*/ undefined, factory.getGeneratedNameForNode(node)),
                    /*location*/ node),
                    /*original*/ node)
                ], languageVersion >= 2 /* ES2015 */ ? 2 /* Const */ : 0 /* None */)));
            }
            if (hasAssociatedEndOfDeclarationMarker(node)) {
                // Defer exports until we encounter an EndOfDeclarationMarker node
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfImportDeclaration(deferredExports[id], node);
            }
            else {
                statements = appendExportsOfImportDeclaration(statements, node);
            }
            return ts.singleOrMany(statements);
        }
        /**
         * Creates a `require()` call to import an external module.
         *
         * @param importNode The declararation to import.
         */
        function createRequireCall(importNode) {
            var moduleName = ts.getExternalModuleNameLiteral(factory, importNode, currentSourceFile, host, resolver, compilerOptions);
            var args = [];
            if (moduleName) {
                args.push(moduleName);
            }
            return factory.createCallExpression(factory.createIdentifier("require"), /*typeArguments*/ undefined, args);
        }
        /**
         * Visits an ImportEqualsDeclaration node.
         *
         * @param node The node to visit.
         */
        function visitImportEqualsDeclaration(node) {
            ts.Debug.assert(ts.isExternalModuleImportEqualsDeclaration(node), "import= for internal module references should be handled in an earlier transformer.");
            var statements;
            if (moduleKind !== ts.ModuleKind.AMD) {
                if (ts.hasSyntacticModifier(node, 1 /* Export */)) {
                    statements = ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createExportExpression(node.name, createRequireCall(node))), node), node));
                }
                else {
                    statements = ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createVariableStatement(
                    /*modifiers*/ undefined, factory.createVariableDeclarationList([
                        factory.createVariableDeclaration(factory.cloneNode(node.name),
                        /*exclamationToken*/ undefined,
                        /*type*/ undefined, createRequireCall(node))
                    ],
                    /*flags*/ languageVersion >= 2 /* ES2015 */ ? 2 /* Const */ : 0 /* None */)), node), node));
                }
            }
            else {
                if (ts.hasSyntacticModifier(node, 1 /* Export */)) {
                    statements = ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createExportExpression(factory.getExportName(node), factory.getLocalName(node))), node), node));
                }
            }
            if (hasAssociatedEndOfDeclarationMarker(node)) {
                // Defer exports until we encounter an EndOfDeclarationMarker node
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfImportEqualsDeclaration(deferredExports[id], node);
            }
            else {
                statements = appendExportsOfImportEqualsDeclaration(statements, node);
            }
            return ts.singleOrMany(statements);
        }
        /**
         * Visits an ExportDeclaration node.
         *
         * @param The node to visit.
         */
        function visitExportDeclaration(node) {
            if (!node.moduleSpecifier) {
                // Elide export declarations with no module specifier as they are handled
                // elsewhere.
                return undefined;
            }
            var generatedName = factory.getGeneratedNameForNode(node);
            if (node.exportClause && ts.isNamedExports(node.exportClause)) {
                var statements = [];
                // export { x, y } from "mod";
                if (moduleKind !== ts.ModuleKind.AMD) {
                    statements.push(ts.setOriginalNode(ts.setTextRange(factory.createVariableStatement(
                    /*modifiers*/ undefined, factory.createVariableDeclarationList([
                        factory.createVariableDeclaration(generatedName,
                        /*exclamationToken*/ undefined,
                        /*type*/ undefined, createRequireCall(node))
                    ])),
                    /*location*/ node),
                    /* original */ node));
                }
                for (var _i = 0, _a = node.exportClause.elements; _i < _a.length; _i++) {
                    var specifier = _a[_i];
                    if (languageVersion === 0 /* ES3 */) {
                        statements.push(ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(emitHelpers().createCreateBindingHelper(generatedName, factory.createStringLiteralFromNode(specifier.propertyName || specifier.name), specifier.propertyName ? factory.createStringLiteralFromNode(specifier.name) : undefined)), specifier), specifier));
                    }
                    else {
                        var exportNeedsImportDefault = !!ts.getESModuleInterop(compilerOptions) &&
                            !(ts.getEmitFlags(node) & 67108864 /* NeverApplyImportHelper */) &&
                            ts.idText(specifier.propertyName || specifier.name) === "default";
                        var exportedValue = factory.createPropertyAccessExpression(exportNeedsImportDefault ? emitHelpers().createImportDefaultHelper(generatedName) : generatedName, specifier.propertyName || specifier.name);
                        statements.push(ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createExportExpression(factory.getExportName(specifier), exportedValue, /* location */ undefined, /* liveBinding */ true)), specifier), specifier));
                    }
                }
                return ts.singleOrMany(statements);
            }
            else if (node.exportClause) {
                var statements = [];
                // export * as ns from "mod";
                // export * as default from "mod";
                statements.push(ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(createExportExpression(factory.cloneNode(node.exportClause.name), getHelperExpressionForExport(node, moduleKind !== ts.ModuleKind.AMD ?
                    createRequireCall(node) :
                    ts.isExportNamespaceAsDefaultDeclaration(node) ? generatedName :
                        factory.createIdentifier(ts.idText(node.exportClause.name))))), node), node));
                return ts.singleOrMany(statements);
            }
            else {
                // export * from "mod";
                return ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(emitHelpers().createExportStarHelper(moduleKind !== ts.ModuleKind.AMD ? createRequireCall(node) : generatedName)), node), node);
            }
        }
        /**
         * Visits an ExportAssignment node.
         *
         * @param node The node to visit.
         */
        function visitExportAssignment(node) {
            if (node.isExportEquals) {
                return undefined;
            }
            var statements;
            var original = node.original;
            if (original && hasAssociatedEndOfDeclarationMarker(original)) {
                // Defer exports until we encounter an EndOfDeclarationMarker node
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportStatement(deferredExports[id], factory.createIdentifier("default"), ts.visitNode(node.expression, visitor), /*location*/ node, /*allowComments*/ true);
            }
            else {
                statements = appendExportStatement(statements, factory.createIdentifier("default"), ts.visitNode(node.expression, visitor), /*location*/ node, /*allowComments*/ true);
            }
            return ts.singleOrMany(statements);
        }
        /**
         * Visits a FunctionDeclaration node.
         *
         * @param node The node to visit.
         */
        function visitFunctionDeclaration(node) {
            var statements;
            if (ts.hasSyntacticModifier(node, 1 /* Export */)) {
                statements = ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createFunctionDeclaration(
                /*decorators*/ undefined, ts.visitNodes(node.modifiers, modifierVisitor, ts.isModifier), node.asteriskToken, factory.getDeclarationName(node, /*allowComments*/ true, /*allowSourceMaps*/ true),
                /*typeParameters*/ undefined, ts.visitNodes(node.parameters, visitor),
                /*type*/ undefined, ts.visitEachChild(node.body, visitor, context)),
                /*location*/ node),
                /*original*/ node));
            }
            else {
                statements = ts.append(statements, ts.visitEachChild(node, visitor, context));
            }
            if (hasAssociatedEndOfDeclarationMarker(node)) {
                // Defer exports until we encounter an EndOfDeclarationMarker node
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfHoistedDeclaration(deferredExports[id], node);
            }
            else {
                statements = appendExportsOfHoistedDeclaration(statements, node);
            }
            return ts.singleOrMany(statements);
        }
        /**
         * Visits a ClassDeclaration node.
         *
         * @param node The node to visit.
         */
        function visitClassDeclaration(node) {
            var statements;
            if (ts.hasSyntacticModifier(node, 1 /* Export */)) {
                statements = ts.append(statements, ts.setOriginalNode(ts.setTextRange(factory.createClassDeclaration(
                /*decorators*/ undefined, ts.visitNodes(node.modifiers, modifierVisitor, ts.isModifier), factory.getDeclarationName(node, /*allowComments*/ true, /*allowSourceMaps*/ true),
                /*typeParameters*/ undefined, ts.visitNodes(node.heritageClauses, visitor), ts.visitNodes(node.members, visitor)), node), node));
            }
            else {
                statements = ts.append(statements, ts.visitEachChild(node, visitor, context));
            }
            if (hasAssociatedEndOfDeclarationMarker(node)) {
                // Defer exports until we encounter an EndOfDeclarationMarker node
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfHoistedDeclaration(deferredExports[id], node);
            }
            else {
                statements = appendExportsOfHoistedDeclaration(statements, node);
            }
            return ts.singleOrMany(statements);
        }
        /**
         * Visits a VariableStatement node.
         *
         * @param node The node to visit.
         */
        function visitVariableStatement(node) {
            var statements;
            var variables;
            var expressions;
            if (ts.hasSyntacticModifier(node, 1 /* Export */)) {
                var modifiers = void 0;
                var removeCommentsOnExpressions = false;
                // If we're exporting these variables, then these just become assignments to 'exports.x'.
                for (var _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++) {
                    var variable = _a[_i];
                    if (ts.isIdentifier(variable.name) && ts.isLocalName(variable.name)) {
                        if (!modifiers) {
                            modifiers = ts.visitNodes(node.modifiers, modifierVisitor, ts.isModifier);
                        }
                        variables = ts.append(variables, variable);
                    }
                    else if (variable.initializer) {
                        if (!ts.isBindingPattern(variable.name) && (ts.isArrowFunction(variable.initializer) || ts.isFunctionExpression(variable.initializer) || ts.isClassExpression(variable.initializer))) {
                            var expression = factory.createAssignment(ts.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), variable.name),
                            /*location*/ variable.name), factory.createIdentifier(ts.getTextOfIdentifierOrLiteral(variable.name)));
                            var updatedVariable = factory.createVariableDeclaration(variable.name, variable.exclamationToken, variable.type, ts.visitNode(variable.initializer, visitor));
                            variables = ts.append(variables, updatedVariable);
                            expressions = ts.append(expressions, expression);
                            removeCommentsOnExpressions = true;
                        }
                        else {
                            expressions = ts.append(expressions, transformInitializedVariable(variable));
                        }
                    }
                }
                if (variables) {
                    statements = ts.append(statements, factory.updateVariableStatement(node, modifiers, factory.updateVariableDeclarationList(node.declarationList, variables)));
                }
                if (expressions) {
                    var statement = ts.setOriginalNode(ts.setTextRange(factory.createExpressionStatement(factory.inlineExpressions(expressions)), node), node);
                    if (removeCommentsOnExpressions) {
                        ts.removeAllComments(statement);
                    }
                    statements = ts.append(statements, statement);
                }
            }
            else {
                statements = ts.append(statements, ts.visitEachChild(node, visitor, context));
            }
            if (hasAssociatedEndOfDeclarationMarker(node)) {
                // Defer exports until we encounter an EndOfDeclarationMarker node
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfVariableStatement(deferredExports[id], node);
            }
            else {
                statements = appendExportsOfVariableStatement(statements, node);
            }
            return ts.singleOrMany(statements);
        }
        function createAllExportExpressions(name, value, location) {
            var exportedNames = getExports(name);
            if (exportedNames) {
                // For each additional export of the declaration, apply an export assignment.
                var expression = ts.isExportName(name) ? value : factory.createAssignment(name, value);
                for (var _i = 0, exportedNames_2 = exportedNames; _i < exportedNames_2.length; _i++) {
                    var exportName = exportedNames_2[_i];
                    // Mark the node to prevent triggering substitution.
                    ts.setEmitFlags(expression, 4 /* NoSubstitution */);
                    expression = createExportExpression(exportName, expression, /*location*/ location);
                }
                return expression;
            }
            return factory.createAssignment(name, value);
        }
        /**
         * Transforms an exported variable with an initializer into an expression.
         *
         * @param node The node to transform.
         */
        function transformInitializedVariable(node) {
            if (ts.isBindingPattern(node.name)) {
                return ts.flattenDestructuringAssignment(ts.visitNode(node, visitor),
                /*visitor*/ undefined, context, 0 /* All */,
                /*needsValue*/ false, createAllExportExpressions);
            }
            else {
                return factory.createAssignment(ts.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), node.name),
                /*location*/ node.name), node.initializer ? ts.visitNode(node.initializer, visitor) : factory.createVoidZero());
            }
        }
        /**
         * Visits a MergeDeclarationMarker used as a placeholder for the beginning of a merged
         * and transformed declaration.
         *
         * @param node The node to visit.
         */
        function visitMergeDeclarationMarker(node) {
            // For an EnumDeclaration or ModuleDeclaration that merges with a preceeding
            // declaration we do not emit a leading variable declaration. To preserve the
            // begin/end semantics of the declararation and to properly handle exports
            // we wrapped the leading variable declaration in a `MergeDeclarationMarker`.
            //
            // To balance the declaration, add the exports of the elided variable
            // statement.
            if (hasAssociatedEndOfDeclarationMarker(node) && node.original.kind === 236 /* VariableStatement */) {
                var id = ts.getOriginalNodeId(node);
                deferredExports[id] = appendExportsOfVariableStatement(deferredExports[id], node.original);
            }
            return node;
        }
        /**
         * Determines whether a node has an associated EndOfDeclarationMarker.
         *
         * @param node The node to test.
         */
        function hasAssociatedEndOfDeclarationMarker(node) {
            return (ts.getEmitFlags(node) & 4194304 /* HasEndOfDeclarationMarker */) !== 0;
        }
        /**
         * Visits a DeclarationMarker used as a placeholder for the end of a transformed
         * declaration.
         *
         * @param node The node to visit.
         */
        function visitEndOfDeclarationMarker(node) {
            // For some transformations we emit an `EndOfDeclarationMarker` to mark the actual
            // end of the transformed declaration. We use this marker to emit any deferred exports
            // of the declaration.
            var id = ts.getOriginalNodeId(node);
            var statements = deferredExports[id];
            if (statements) {
                delete deferredExports[id];
                return ts.append(statements, node);
            }
            return node;
        }
        /**
         * Appends the exports of an ImportDeclaration to a statement list, returning the
         * statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param decl The declaration whose exports are to be recorded.
         */
        function appendExportsOfImportDeclaration(statements, decl) {
            if (currentModuleInfo.exportEquals) {
                return statements;
            }
            var importClause = decl.importClause;
            if (!importClause) {
                return statements;
            }
            if (importClause.name) {
                statements = appendExportsOfDeclaration(statements, importClause);
            }
            var namedBindings = importClause.namedBindings;
            if (namedBindings) {
                switch (namedBindings.kind) {
                    case 267 /* NamespaceImport */:
                        statements = appendExportsOfDeclaration(statements, namedBindings);
                        break;
                    case 268 /* NamedImports */:
                        for (var _i = 0, _a = namedBindings.elements; _i < _a.length; _i++) {
                            var importBinding = _a[_i];
                            statements = appendExportsOfDeclaration(statements, importBinding, /* liveBinding */ true);
                        }
                        break;
                }
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
         */
        function appendExportsOfImportEqualsDeclaration(statements, decl) {
            if (currentModuleInfo.exportEquals) {
                return statements;
            }
            return appendExportsOfDeclaration(statements, decl);
        }
        /**
         * Appends the exports of a VariableStatement to a statement list, returning the statement
         * list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param node The VariableStatement whose exports are to be recorded.
         */
        function appendExportsOfVariableStatement(statements, node) {
            if (currentModuleInfo.exportEquals) {
                return statements;
            }
            for (var _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++) {
                var decl = _a[_i];
                statements = appendExportsOfBindingElement(statements, decl);
            }
            return statements;
        }
        /**
         * Appends the exports of a VariableDeclaration or BindingElement to a statement list,
         * returning the statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param decl The declaration whose exports are to be recorded.
         */
        function appendExportsOfBindingElement(statements, decl) {
            if (currentModuleInfo.exportEquals) {
                return statements;
            }
            if (ts.isBindingPattern(decl.name)) {
                for (var _i = 0, _a = decl.name.elements; _i < _a.length; _i++) {
                    var element = _a[_i];
                    if (!ts.isOmittedExpression(element)) {
                        statements = appendExportsOfBindingElement(statements, element);
                    }
                }
            }
            else if (!ts.isGeneratedIdentifier(decl.name)) {
                statements = appendExportsOfDeclaration(statements, decl);
            }
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
         */
        function appendExportsOfHoistedDeclaration(statements, decl) {
            if (currentModuleInfo.exportEquals) {
                return statements;
            }
            if (ts.hasSyntacticModifier(decl, 1 /* Export */)) {
                var exportName = ts.hasSyntacticModifier(decl, 512 /* Default */) ? factory.createIdentifier("default") : factory.getDeclarationName(decl);
                statements = appendExportStatement(statements, exportName, factory.getLocalName(decl), /*location*/ decl);
            }
            if (decl.name) {
                statements = appendExportsOfDeclaration(statements, decl);
            }
            return statements;
        }
        /**
         * Appends the exports of a declaration to a statement list, returning the statement list.
         *
         * @param statements A statement list to which the down-level export statements are to be
         * appended. If `statements` is `undefined`, a new array is allocated if statements are
         * appended.
         * @param decl The declaration to export.
         */
        function appendExportsOfDeclaration(statements, decl, liveBinding) {
            var name = factory.getDeclarationName(decl);
            var exportSpecifiers = currentModuleInfo.exportSpecifiers.get(ts.idText(name));
            if (exportSpecifiers) {
                for (var _i = 0, exportSpecifiers_1 = exportSpecifiers; _i < exportSpecifiers_1.length; _i++) {
                    var exportSpecifier = exportSpecifiers_1[_i];
                    statements = appendExportStatement(statements, exportSpecifier.name, name, /*location*/ exportSpecifier.name, /* allowComments */ undefined, liveBinding);
                }
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
         */
        function appendExportStatement(statements, exportName, expression, location, allowComments, liveBinding) {
            statements = ts.append(statements, createExportStatement(exportName, expression, location, allowComments, liveBinding));
            return statements;
        }
        function createUnderscoreUnderscoreESModule() {
            var statement;
            if (languageVersion === 0 /* ES3 */) {
                statement = factory.createExpressionStatement(createExportExpression(factory.createIdentifier("__esModule"), factory.createTrue()));
            }
            else {
                statement = factory.createExpressionStatement(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Object"), "defineProperty"),
                /*typeArguments*/ undefined, [
                    factory.createIdentifier("exports"),
                    factory.createStringLiteral("__esModule"),
                    factory.createObjectLiteralExpression([
                        factory.createPropertyAssignment("value", factory.createTrue())
                    ])
                ]));
            }
            ts.setEmitFlags(statement, 1048576 /* CustomPrologue */);
            return statement;
        }
        /**
         * Creates a call to the current file's export function to export a value.
         *
         * @param name The bound name of the export.
         * @param value The exported value.
         * @param location The location to use for source maps and comments for the export.
         * @param allowComments An optional value indicating whether to emit comments for the statement.
         */
        function createExportStatement(name, value, location, allowComments, liveBinding) {
            var statement = ts.setTextRange(factory.createExpressionStatement(createExportExpression(name, value, /* location */ undefined, liveBinding)), location);
            ts.startOnNewLine(statement);
            if (!allowComments) {
                ts.setEmitFlags(statement, 1536 /* NoComments */);
            }
            return statement;
        }
        /**
         * Creates a call to the current file's export function to export a value.
         *
         * @param name The bound name of the export.
         * @param value The exported value.
         * @param location The location to use for source maps and comments for the export.
         */
        function createExportExpression(name, value, location, liveBinding) {
            return ts.setTextRange(liveBinding && languageVersion !== 0 /* ES3 */ ? factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("Object"), "defineProperty"),
            /*typeArguments*/ undefined, [
                factory.createIdentifier("exports"),
                factory.createStringLiteralFromNode(name),
                factory.createObjectLiteralExpression([
                    factory.createPropertyAssignment("enumerable", factory.createTrue()),
                    factory.createPropertyAssignment("get", factory.createFunctionExpression(
                    /*modifiers*/ undefined,
                    /*asteriskToken*/ undefined,
                    /*name*/ undefined,
                    /*typeParameters*/ undefined,
                    /*parameters*/[],
                    /*type*/ undefined, factory.createBlock([factory.createReturnStatement(value)])))
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
         */
        function modifierVisitor(node) {
            // Elide module-specific modifiers.
            switch (node.kind) {
                case 93 /* ExportKeyword */:
                case 88 /* DefaultKeyword */:
                    return undefined;
            }
            return node;
        }
        //
        // Emit Notification
        //
        /**
         * Hook for node emit notifications.
         *
         * @param hint A hint as to the intended usage of the node.
         * @param node The node to emit.
         * @param emit A callback used to emit the node in the printer.
         */
        function onEmitNode(hint, node, emitCallback) {
            if (node.kind === 303 /* SourceFile */) {
                currentSourceFile = node;
                currentModuleInfo = moduleInfoMap[ts.getOriginalNodeId(currentSourceFile)];
                previousOnEmitNode(hint, node, emitCallback);
                currentSourceFile = undefined;
                currentModuleInfo = undefined;
            }
            else {
                previousOnEmitNode(hint, node, emitCallback);
            }
        }
        //
        // Substitutions
        //
        /**
         * Hooks node substitutions.
         *
         * @param hint A hint as to the intended usage of the node.
         * @param node The node to substitute.
         */
        function onSubstituteNode(hint, node) {
            node = previousOnSubstituteNode(hint, node);
            if (node.id && noSubstitution[node.id]) {
                return node;
            }
            if (hint === 1 /* Expression */) {
                return substituteExpression(node);
            }
            else if (ts.isShorthandPropertyAssignment(node)) {
                return substituteShorthandPropertyAssignment(node);
            }
            return node;
        }
        /**
         * Substitution for a ShorthandPropertyAssignment whose declaration name is an imported
         * or exported symbol.
         *
         * @param node The node to substitute.
         */
        function substituteShorthandPropertyAssignment(node) {
            var name = node.name;
            var exportedOrImportedName = substituteExpressionIdentifier(name);
            if (exportedOrImportedName !== name) {
                // A shorthand property with an assignment initializer is probably part of a
                // destructuring assignment
                if (node.objectAssignmentInitializer) {
                    var initializer = factory.createAssignment(exportedOrImportedName, node.objectAssignmentInitializer);
                    return ts.setTextRange(factory.createPropertyAssignment(name, initializer), node);
                }
                return ts.setTextRange(factory.createPropertyAssignment(name, exportedOrImportedName), node);
            }
            return node;
        }
        /**
         * Substitution for an Expression that may contain an imported or exported symbol.
         *
         * @param node The node to substitute.
         */
        function substituteExpression(node) {
            switch (node.kind) {
                case 79 /* Identifier */:
                    return substituteExpressionIdentifier(node);
                case 207 /* CallExpression */:
                    return substituteCallExpression(node);
                case 209 /* TaggedTemplateExpression */:
                    return substituteTaggedTemplateExpression(node);
                case 220 /* BinaryExpression */:
                    return substituteBinaryExpression(node);
            }
            return node;
        }
        function substituteCallExpression(node) {
            if (ts.isIdentifier(node.expression)) {
                var expression = substituteExpressionIdentifier(node.expression);
                noSubstitution[ts.getNodeId(expression)] = true;
                if (!ts.isIdentifier(expression) && !(ts.getEmitFlags(node.expression) & 4096 /* HelperName */)) {
                    return ts.addEmitFlags(factory.updateCallExpression(node, expression,
                    /*typeArguments*/ undefined, node.arguments), 536870912 /* IndirectCall */);
                }
            }
            return node;
        }
        function substituteTaggedTemplateExpression(node) {
            if (ts.isIdentifier(node.tag)) {
                var tag = substituteExpressionIdentifier(node.tag);
                noSubstitution[ts.getNodeId(tag)] = true;
                if (!ts.isIdentifier(tag) && !(ts.getEmitFlags(node.tag) & 4096 /* HelperName */)) {
                    return ts.addEmitFlags(factory.updateTaggedTemplateExpression(node, tag,
                    /*typeArguments*/ undefined, node.template), 536870912 /* IndirectCall */);
                }
            }
            return node;
        }
        /**
         * Substitution for an Identifier expression that may contain an imported or exported
         * symbol.
         *
         * @param node The node to substitute.
         */
        function substituteExpressionIdentifier(node) {
            var _a, _b;
            if (ts.getEmitFlags(node) & 4096 /* HelperName */) {
                var externalHelpersModuleName = ts.getExternalHelpersModuleName(currentSourceFile);
                if (externalHelpersModuleName) {
                    return factory.createPropertyAccessExpression(externalHelpersModuleName, node);
                }
                return node;
            }
            else if (!(ts.isGeneratedIdentifier(node) && !(node.autoGenerateFlags & 64 /* AllowNameSubstitution */)) && !ts.isLocalName(node)) {
                var exportContainer = resolver.getReferencedExportContainer(node, ts.isExportName(node));
                if (exportContainer && exportContainer.kind === 303 /* SourceFile */) {
                    return ts.setTextRange(factory.createPropertyAccessExpression(factory.createIdentifier("exports"), factory.cloneNode(node)),
                    /*location*/ node);
                }
                var importDeclaration = resolver.getReferencedImportDeclaration(node);
                if (importDeclaration) {
                    if (ts.isImportClause(importDeclaration)) {
                        return ts.setTextRange(factory.createPropertyAccessExpression(factory.getGeneratedNameForNode(importDeclaration.parent), factory.createIdentifier("default")),
                        /*location*/ node);
                    }
                    else if (ts.isImportSpecifier(importDeclaration)) {
                        var name = importDeclaration.propertyName || importDeclaration.name;
                        return ts.setTextRange(factory.createPropertyAccessExpression(factory.getGeneratedNameForNode(((_b = (_a = importDeclaration.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.parent) || importDeclaration), factory.cloneNode(name)),
                        /*location*/ node);
                    }
                }
            }
            return node;
        }
        /**
         * Substitution for a BinaryExpression that may contain an imported or exported symbol.
         *
         * @param node The node to substitute.
         */
        function substituteBinaryExpression(node) {
            // When we see an assignment expression whose left-hand side is an exported symbol,
            // we should ensure all exports of that symbol are updated with the correct value.
            //
            // - We do not substitute generated identifiers for any reason.
            // - We do not substitute identifiers tagged with the LocalName flag.
            // - We do not substitute identifiers that were originally the name of an enum or
            //   namespace due to how they are transformed in TypeScript.
            // - We only substitute identifiers that are exported at the top level.
            if (ts.isAssignmentOperator(node.operatorToken.kind)
                && ts.isIdentifier(node.left)
                && !ts.isGeneratedIdentifier(node.left)
                && !ts.isLocalName(node.left)
                && !ts.isDeclarationNameOfEnumOrNamespace(node.left)) {
                var exportedNames = getExports(node.left);
                if (exportedNames) {
                    // For each additional export of the declaration, apply an export assignment.
                    var expression = node;
                    for (var _i = 0, exportedNames_3 = exportedNames; _i < exportedNames_3.length; _i++) {
                        var exportName = exportedNames_3[_i];
                        // Mark the node to prevent triggering this rule again.
                        noSubstitution[ts.getNodeId(expression)] = true;
                        expression = createExportExpression(exportName, expression, /*location*/ node);
                    }
                    return expression;
                }
            }
            return node;
        }
        /**
         * Gets the additional exports of a name.
         *
         * @param name The name.
         */
        function getExports(name) {
            if (!ts.isGeneratedIdentifier(name)) {
                var valueDeclaration = resolver.getReferencedImportDeclaration(name)
                    || resolver.getReferencedValueDeclaration(name);
                if (valueDeclaration) {
                    return currentModuleInfo
                        && currentModuleInfo.exportedBindings[ts.getOriginalNodeId(valueDeclaration)];
                }
            }
        }
    }
    ts.transformModule = transformModule;
    // emit helper for dynamic import
    var dynamicImportUMDHelper = {
        name: "typescript:dynamicimport-sync-require",
        scoped: true,
        text: "\n            var __syncRequire = typeof module === \"object\" && typeof module.exports === \"object\";"
    };
})(ts || (ts = {}));
