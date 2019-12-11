/* @internal */
namespace ts.codefix {
    const fixId = "convertFunctionToEs6Class";
    const errorCodes = [Diagnostics.This_constructor_function_may_be_converted_to_a_class_declaration.code];
    registerCodeFix({
        errorCodes,
        getCodeActions(context: CodeFixContext) {
            const changes = textChanges.ChangeTracker.with(context, t => doChange(t, context.sourceFile, context.span.start, context.program.getTypeChecker()));
            return [createCodeFixAction(fixId, changes, Diagnostics.Convert_function_to_an_ES2015_class, fixId, Diagnostics.Convert_all_constructor_functions_to_classes)];
        },
        fixIds: [fixId],
        getAllCodeActions: context => codeFixAll(context, errorCodes, (changes, err) => doChange(changes, err.file, err.start, context.program.getTypeChecker())),
    });

    function doChange(changes: textChanges.ChangeTracker, sourceFile: SourceFile, position: number, checker: TypeChecker): void {
        const ctorSymbol = checker.getSymbolAtLocation(getTokenAtPosition(sourceFile, position))!;

        if (!ctorSymbol || !(ctorSymbol.flags & (SymbolFlags.Function | SymbolFlags.Variable))) {
            // Bad input
            return undefined;
        }

        const ctorDeclaration = ctorSymbol.valueDeclaration;

        let precedingNode: Node | undefined;
        let newClassDeclaration: ClassDeclaration | undefined;
        switch (ctorDeclaration.kind) {
            case SyntaxKind.FunctionDeclaration:
                precedingNode = ctorDeclaration;
                changes.delete(sourceFile, ctorDeclaration);
                newClassDeclaration = createClassFromFunctionDeclaration(ctorDeclaration as FunctionDeclaration);
                break;

            case SyntaxKind.VariableDeclaration:
                precedingNode = ctorDeclaration.parent.parent;
                newClassDeclaration = createClassFromVariableDeclaration(ctorDeclaration as VariableDeclaration);
                if ((<VariableDeclarationList>ctorDeclaration.parent).declarations.length === 1) {
                    copyLeadingComments(precedingNode, newClassDeclaration!, sourceFile); // TODO: GH#18217
                    changes.delete(sourceFile, precedingNode);
                }
                else {
                    changes.delete(sourceFile, ctorDeclaration);
                }
                break;
        }

        if (!newClassDeclaration) {
            return undefined;
        }

        copyLeadingComments(ctorDeclaration, newClassDeclaration, sourceFile);

        // Because the preceding node could be touched, we need to insert nodes before delete nodes.
        changes.insertNodeAfter(sourceFile, precedingNode!, newClassDeclaration);

        function createClassElementsFromSymbol(symbol: Symbol) {
            const memberElements: ClassElement[] = [];
            // all instance members are stored in the "member" array of symbol
            if (symbol.members) {
                symbol.members.forEach(member => {
                    const memberElement = createClassElement(member, /*modifiers*/ undefined);
                    if (memberElement) {
                        memberElements.push(memberElement);
                    }
                });
            }

            // all static members are stored in the "exports" array of symbol
            if (symbol.exports) {
                symbol.exports.forEach(member => {
                    const memberElement = createClassElement(member, [createToken(SyntaxKind.StaticKeyword)]);
                    if (memberElement) {
                        memberElements.push(memberElement);
                    }
                });
            }

            return memberElements;

            function shouldConvertDeclaration(_target: PropertyAccessExpression, source: Expression) {
                // Right now the only thing we can convert are function expressions - other values shouldn't get
                // transformed. We can update this once ES public class properties are available.
                return isFunctionLike(source);
            }

            function createClassElement(symbol: Symbol, modifiers: Modifier[] | undefined): ClassElement | undefined {
                // Right now the only thing we can convert are function expressions, which are marked as methods
                if (!(symbol.flags & SymbolFlags.Method)) {
                    return;
                }

                const memberDeclaration = symbol.valueDeclaration as PropertyAccessExpression;
                const assignmentBinaryExpression = memberDeclaration.parent as BinaryExpression;

                if (!shouldConvertDeclaration(memberDeclaration, assignmentBinaryExpression.right)) {
                    return;
                }

                // delete the entire statement if this expression is the sole expression to take care of the semicolon at the end
                const nodeToDelete = assignmentBinaryExpression.parent && assignmentBinaryExpression.parent.kind === SyntaxKind.ExpressionStatement
                    ? assignmentBinaryExpression.parent : assignmentBinaryExpression;
                changes.delete(sourceFile, nodeToDelete);

                if (!assignmentBinaryExpression.right) {
                    return createProperty([], modifiers, symbol.name, /*questionToken*/ undefined,
                        /*type*/ undefined, /*initializer*/ undefined);
                }

                switch (assignmentBinaryExpression.right.kind) {
                    case SyntaxKind.FunctionExpression: {
                        const functionExpression = assignmentBinaryExpression.right as FunctionExpression;
                        const fullModifiers = concatenate(modifiers, getModifierKindFromSource(functionExpression, SyntaxKind.AsyncKeyword));
                        const method = createMethod(/*decorators*/ undefined, fullModifiers, /*asteriskToken*/ undefined, memberDeclaration.name, /*questionToken*/ undefined,
                            /*typeParameters*/ undefined, functionExpression.parameters, /*type*/ undefined, functionExpression.body);
                        copyLeadingComments(assignmentBinaryExpression, method, sourceFile);
                        return method;
                    }

                    case SyntaxKind.ArrowFunction: {
                        const arrowFunction = assignmentBinaryExpression.right as ArrowFunction;
                        const arrowFunctionBody = arrowFunction.body;
                        let bodyBlock: Block;

                        // case 1: () => { return [1,2,3] }
                        if (arrowFunctionBody.kind === SyntaxKind.Block) {
                            bodyBlock = arrowFunctionBody as Block;
                        }
                        // case 2: () => [1,2,3]
                        else {
                            bodyBlock = createBlock([createReturn(arrowFunctionBody)]);
                        }
                        const fullModifiers = concatenate(modifiers, getModifierKindFromSource(arrowFunction, SyntaxKind.AsyncKeyword));
                        const method = createMethod(/*decorators*/ undefined, fullModifiers, /*asteriskToken*/ undefined, memberDeclaration.name, /*questionToken*/ undefined,
                            /*typeParameters*/ undefined, arrowFunction.parameters, /*type*/ undefined, bodyBlock);
                        copyLeadingComments(assignmentBinaryExpression, method, sourceFile);
                        return method;
                    }

                    default: {
                        // Don't try to declare members in JavaScript files
                        if (isSourceFileJS(sourceFile)) {
                            return;
                        }
                        const prop = createProperty(/*decorators*/ undefined, modifiers, memberDeclaration.name, /*questionToken*/ undefined,
                            /*type*/ undefined, assignmentBinaryExpression.right);
                        copyLeadingComments(assignmentBinaryExpression.parent, prop, sourceFile);
                        return prop;
                    }
                }
            }
        }

        function createClassFromVariableDeclaration(node: VariableDeclaration): ClassDeclaration | undefined {
            const initializer = node.initializer as FunctionExpression;
            if (!initializer || initializer.kind !== SyntaxKind.FunctionExpression) {
                return undefined;
            }

            if (node.name.kind !== SyntaxKind.Identifier) {
                return undefined;
            }

            const memberElements = createClassElementsFromSymbol(node.symbol);
            if (initializer.body) {
                memberElements.unshift(createConstructor(/*decorators*/ undefined, /*modifiers*/ undefined, initializer.parameters, initializer.body));
            }

            const modifiers = getModifierKindFromSource(precedingNode!, SyntaxKind.ExportKeyword);
            const cls = createClassDeclaration(/*decorators*/ undefined, modifiers, node.name,
                /*typeParameters*/ undefined, /*heritageClauses*/ undefined, memberElements);
            // Don't call copyComments here because we'll already leave them in place
            return cls;
        }

        function createClassFromFunctionDeclaration(node: FunctionDeclaration): ClassDeclaration {
            const memberElements = createClassElementsFromSymbol(ctorSymbol);
            if (node.body) {
                memberElements.unshift(createConstructor(/*decorators*/ undefined, /*modifiers*/ undefined, node.parameters, node.body));
            }

            const modifiers = getModifierKindFromSource(node, SyntaxKind.ExportKeyword);
            const cls = createClassDeclaration(/*decorators*/ undefined, modifiers, node.name,
                /*typeParameters*/ undefined, /*heritageClauses*/ undefined, memberElements);
            // Don't call copyComments here because we'll already leave them in place
            return cls;
        }
    }

    function getModifierKindFromSource(source: Node, kind: SyntaxKind): readonly Modifier[] | undefined {
        return filter(source.modifiers, modifier => modifier.kind === kind);
    }
}
