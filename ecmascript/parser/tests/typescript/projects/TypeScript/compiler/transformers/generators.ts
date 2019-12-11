// Transforms generator functions into a compatible ES5 representation with similar runtime
// semantics. This is accomplished by first transforming the body of each generator
// function into an intermediate representation that is the compiled into a JavaScript
// switch statement.
//
// Many functions in this transformer will contain comments indicating the expected
// intermediate representation. For illustrative purposes, the following intermediate
// language is used to define this intermediate representation:
//
//  .nop                            - Performs no operation.
//  .local NAME, ...                - Define local variable declarations.
//  .mark LABEL                     - Mark the location of a label.
//  .br LABEL                       - Jump to a label. If jumping out of a protected
//                                    region, all .finally blocks are executed.
//  .brtrue LABEL, (x)              - Jump to a label IIF the expression `x` is truthy.
//                                    If jumping out of a protected region, all .finally
//                                    blocks are executed.
//  .brfalse LABEL, (x)             - Jump to a label IIF the expression `x` is falsey.
//                                    If jumping out of a protected region, all .finally
//                                    blocks are executed.
//  .yield (x)                      - Yield the value of the optional expression `x`.
//                                    Resume at the next label.
//  .yieldstar (x)                  - Delegate yield to the value of the optional
//                                    expression `x`. Resume at the next label.
//                                    NOTE: `x` must be an Iterator, not an Iterable.
//  .loop CONTINUE, BREAK           - Marks the beginning of a loop. Any "continue" or
//                                    "break" abrupt completions jump to the CONTINUE or
//                                    BREAK labels, respectively.
//  .endloop                        - Marks the end of a loop.
//  .with (x)                       - Marks the beginning of a WithStatement block, using
//                                    the supplied expression.
//  .endwith                        - Marks the end of a WithStatement.
//  .switch                         - Marks the beginning of a SwitchStatement.
//  .endswitch                      - Marks the end of a SwitchStatement.
//  .labeled NAME                   - Marks the beginning of a LabeledStatement with the
//                                    supplied name.
//  .endlabeled                     - Marks the end of a LabeledStatement.
//  .try TRY, CATCH, FINALLY, END   - Marks the beginning of a protected region, and the
//                                    labels for each block.
//  .catch (x)                      - Marks the beginning of a catch block.
//  .finally                        - Marks the beginning of a finally block.
//  .endfinally                     - Marks the end of a finally block.
//  .endtry                         - Marks the end of a protected region.
//  .throw (x)                      - Throws the value of the expression `x`.
//  .return (x)                     - Returns the value of the expression `x`.
//
// In addition, the illustrative intermediate representation introduces some special
// variables:
//
//  %sent%                          - Either returns the next value sent to the generator,
//                                    returns the result of a delegated yield, or throws
//                                    the exception sent to the generator.
//  %error%                         - Returns the value of the current exception in a
//                                    catch block.
//
// This intermediate representation is then compiled into JavaScript syntax. The resulting
// compilation output looks something like the following:
//
//  function f() {
//      var /*locals*/;
//      /*functions*/
//      return __generator(function (state) {
//          switch (state.label) {
//              /*cases per label*/
//          }
//      });
//  }
//
// Each of the above instructions corresponds to JavaScript emit similar to the following:
//
//  .local NAME                   | var NAME;
// -------------------------------|----------------------------------------------
//  .mark LABEL                   | case LABEL:
// -------------------------------|----------------------------------------------
//  .br LABEL                     |     return [3 /*break*/, LABEL];
// -------------------------------|----------------------------------------------
//  .brtrue LABEL, (x)            |     if (x) return [3 /*break*/, LABEL];
// -------------------------------|----------------------------------------------
//  .brfalse LABEL, (x)           |     if (!(x)) return [3, /*break*/, LABEL];
// -------------------------------|----------------------------------------------
//  .yield (x)                    |     return [4 /*yield*/, x];
//  .mark RESUME                  | case RESUME:
//      a = %sent%;               |     a = state.sent();
// -------------------------------|----------------------------------------------
//  .yieldstar (x)                |     return [5 /*yield**/, x];
//  .mark RESUME                  | case RESUME:
//      a = %sent%;               |     a = state.sent();
// -------------------------------|----------------------------------------------
//  .with (_a)                    |     with (_a) {
//      a();                      |         a();
//                                |     }
//                                |     state.label = LABEL;
//  .mark LABEL                   | case LABEL:
//                                |     with (_a) {
//      b();                      |         b();
//                                |     }
//  .endwith                      |
// -------------------------------|----------------------------------------------
//                                | case 0:
//                                |     state.trys = [];
//                                | ...
//  .try TRY, CATCH, FINALLY, END |
//  .mark TRY                     | case TRY:
//                                |     state.trys.push([TRY, CATCH, FINALLY, END]);
//  .nop                          |
//      a();                      |     a();
//  .br END                       |     return [3 /*break*/, END];
//  .catch (e)                    |
//  .mark CATCH                   | case CATCH:
//                                |     e = state.sent();
//      b();                      |     b();
//  .br END                       |     return [3 /*break*/, END];
//  .finally                      |
//  .mark FINALLY                 | case FINALLY:
//      c();                      |     c();
//  .endfinally                   |     return [7 /*endfinally*/];
//  .endtry                       |
//  .mark END                     | case END:

/*@internal*/
namespace ts {
    type Label = number;

    const enum OpCode {
        Nop,                    // No operation, used to force a new case in the state machine
        Statement,              // A regular javascript statement
        Assign,                 // An assignment
        Break,                  // A break instruction used to jump to a label
        BreakWhenTrue,          // A break instruction used to jump to a label if a condition evaluates to true
        BreakWhenFalse,         // A break instruction used to jump to a label if a condition evaluates to false
        Yield,                  // A completion instruction for the `yield` keyword
        YieldStar,              // A completion instruction for the `yield*` keyword (not implemented, but reserved for future use)
        Return,                 // A completion instruction for the `return` keyword
        Throw,                  // A completion instruction for the `throw` keyword
        Endfinally              // Marks the end of a `finally` block
    }

    type OperationArguments = [Label] | [Label, Expression] | [Statement] | [Expression | undefined] | [Expression, Expression];

    // whether a generated code block is opening or closing at the current operation for a FunctionBuilder
    const enum BlockAction {
        Open,
        Close,
    }

    // the kind for a generated code block in a FunctionBuilder
    const enum CodeBlockKind {
        Exception,
        With,
        Switch,
        Loop,
        Labeled
    }

    // the state for a generated code exception block
    const enum ExceptionBlockState {
        Try,
        Catch,
        Finally,
        Done
    }

    // A generated code block
    type CodeBlock = | ExceptionBlock | LabeledBlock | SwitchBlock | LoopBlock | WithBlock;

    // a generated exception block, used for 'try' statements
    interface ExceptionBlock {
        kind: CodeBlockKind.Exception;
        state: ExceptionBlockState;
        startLabel: Label;
        catchVariable?: Identifier;
        catchLabel?: Label;
        finallyLabel?: Label;
        endLabel: Label;
    }

    // A generated code that tracks the target for 'break' statements in a LabeledStatement.
    interface LabeledBlock {
        kind: CodeBlockKind.Labeled;
        labelText: string;
        isScript: boolean;
        breakLabel: Label;
    }

    // a generated block that tracks the target for 'break' statements in a 'switch' statement
    interface SwitchBlock {
        kind: CodeBlockKind.Switch;
        isScript: boolean;
        breakLabel: Label;
    }

    // a generated block that tracks the targets for 'break' and 'continue' statements, used for iteration statements
    interface LoopBlock {
        kind: CodeBlockKind.Loop;
        continueLabel: Label;
        isScript: boolean;
        breakLabel: Label;
    }

    // a generated block associated with a 'with' statement
    interface WithBlock {
        kind: CodeBlockKind.With;
        expression: Identifier;
        startLabel: Label;
        endLabel: Label;
    }

    // NOTE: changes to this enum should be reflected in the __generator helper.
    const enum Instruction {
        Next = 0,
        Throw = 1,
        Return = 2,
        Break = 3,
        Yield = 4,
        YieldStar = 5,
        Catch = 6,
        Endfinally = 7,
    }

    function getInstructionName(instruction: Instruction): string {
        switch (instruction) {
            case Instruction.Return: return "return";
            case Instruction.Break: return "break";
            case Instruction.Yield: return "yield";
            case Instruction.YieldStar: return "yield*";
            case Instruction.Endfinally: return "endfinally";
            default: return undefined!; // TODO: GH#18217
        }
    }

    export function transformGenerators(context: TransformationContext) {
        const {
            resumeLexicalEnvironment,
            endLexicalEnvironment,
            hoistFunctionDeclaration,
            hoistVariableDeclaration
        } = context;

        const compilerOptions = context.getCompilerOptions();
        const languageVersion = getEmitScriptTarget(compilerOptions);
        const resolver = context.getEmitResolver();
        const previousOnSubstituteNode = context.onSubstituteNode;
        context.onSubstituteNode = onSubstituteNode;

        let renamedCatchVariables: Map<boolean>;
        let renamedCatchVariableDeclarations: Identifier[];

        let inGeneratorFunctionBody: boolean;
        let inStatementContainingYield: boolean;

        // The following three arrays store information about generated code blocks.
        // All three arrays are correlated by their index. This approach is used over allocating
        // objects to store the same information to avoid GC overhead.
        //
        let blocks: CodeBlock[] | undefined; // Information about the code block
        let blockOffsets: number[] | undefined; // The operation offset at which a code block begins or ends
        let blockActions: BlockAction[] | undefined; // Whether the code block is opened or closed
        let blockStack: CodeBlock[] | undefined; // A stack of currently open code blocks

        // Labels are used to mark locations in the code that can be the target of a Break (jump)
        // operation. These are translated into case clauses in a switch statement.
        // The following two arrays are correlated by their index. This approach is used over
        // allocating objects to store the same information to avoid GC overhead.
        //
        let labelOffsets: number[] | undefined; // The operation offset at which the label is defined.
        let labelExpressions: LiteralExpression[][] | undefined; // The NumericLiteral nodes bound to each label.
        let nextLabelId = 1; // The next label id to use.

        // Operations store information about generated code for the function body. This
        // Includes things like statements, assignments, breaks (jumps), and yields.
        // The following three arrays are correlated by their index. This approach is used over
        // allocating objects to store the same information to avoid GC overhead.
        //
        let operations: OpCode[] | undefined; // The operation to perform.
        let operationArguments: (OperationArguments | undefined)[] | undefined; // The arguments to the operation.
        let operationLocations: (TextRange | undefined)[] | undefined; // The source map location for the operation.

        let state: Identifier; // The name of the state object used by the generator at runtime.

        // The following variables store information used by the `build` function:
        //
        let blockIndex = 0; // The index of the current block.
        let labelNumber = 0; // The current label number.
        let labelNumbers: number[][] | undefined;
        let lastOperationWasAbrupt: boolean; // Indicates whether the last operation was abrupt (break/continue).
        let lastOperationWasCompletion: boolean; // Indicates whether the last operation was a completion (return/throw).
        let clauses: CaseClause[] | undefined; // The case clauses generated for labels.
        let statements: Statement[] | undefined; // The statements for the current label.
        let exceptionBlockStack: ExceptionBlock[] | undefined; // A stack of containing exception blocks.
        let currentExceptionBlock: ExceptionBlock | undefined; // The current exception block.
        let withBlockStack: WithBlock[] | undefined; // A stack containing `with` blocks.

        return chainBundle(transformSourceFile);

        function transformSourceFile(node: SourceFile) {
            if (node.isDeclarationFile || (node.transformFlags & TransformFlags.ContainsGenerator) === 0) {
                return node;
            }


            const visited = visitEachChild(node, visitor, context);
            addEmitHelpers(visited, context.readEmitHelpers());
            return visited;
        }

        /**
         * Visits a node.
         *
         * @param node The node to visit.
         */
        function visitor(node: Node): VisitResult<Node> {
            const transformFlags = node.transformFlags;
            if (inStatementContainingYield) {
                return visitJavaScriptInStatementContainingYield(node);
            }
            else if (inGeneratorFunctionBody) {
                return visitJavaScriptInGeneratorFunctionBody(node);
            }
            else if (isFunctionLikeDeclaration(node) && node.asteriskToken) {
                return visitGenerator(node);
            }
            else if (transformFlags & TransformFlags.ContainsGenerator) {
                return visitEachChild(node, visitor, context);
            }
            else {
                return node;
            }
        }

        /**
         * Visits a node that is contained within a statement that contains yield.
         *
         * @param node The node to visit.
         */
        function visitJavaScriptInStatementContainingYield(node: Node): VisitResult<Node> {
            switch (node.kind) {
                case SyntaxKind.DoStatement:
                    return visitDoStatement(<DoStatement>node);
                case SyntaxKind.WhileStatement:
                    return visitWhileStatement(<WhileStatement>node);
                case SyntaxKind.SwitchStatement:
                    return visitSwitchStatement(<SwitchStatement>node);
                case SyntaxKind.LabeledStatement:
                    return visitLabeledStatement(<LabeledStatement>node);
                default:
                    return visitJavaScriptInGeneratorFunctionBody(node);
            }
        }

        /**
         * Visits a node that is contained within a generator function.
         *
         * @param node The node to visit.
         */
        function visitJavaScriptInGeneratorFunctionBody(node: Node): VisitResult<Node> {
            switch (node.kind) {
                case SyntaxKind.FunctionDeclaration:
                    return visitFunctionDeclaration(<FunctionDeclaration>node);
                case SyntaxKind.FunctionExpression:
                    return visitFunctionExpression(<FunctionExpression>node);
                case SyntaxKind.GetAccessor:
                case SyntaxKind.SetAccessor:
                    return visitAccessorDeclaration(<AccessorDeclaration>node);
                case SyntaxKind.VariableStatement:
                    return visitVariableStatement(<VariableStatement>node);
                case SyntaxKind.ForStatement:
                    return visitForStatement(<ForStatement>node);
                case SyntaxKind.ForInStatement:
                    return visitForInStatement(<ForInStatement>node);
                case SyntaxKind.BreakStatement:
                    return visitBreakStatement(<BreakStatement>node);
                case SyntaxKind.ContinueStatement:
                    return visitContinueStatement(<ContinueStatement>node);
                case SyntaxKind.ReturnStatement:
                    return visitReturnStatement(<ReturnStatement>node);
                default:
                    if (node.transformFlags & TransformFlags.ContainsYield) {
                        return visitJavaScriptContainingYield(node);
                    }
                    else if (node.transformFlags & (TransformFlags.ContainsGenerator | TransformFlags.ContainsHoistedDeclarationOrCompletion)) {
                        return visitEachChild(node, visitor, context);
                    }
                    else {
                        return node;
                    }
            }
        }

        /**
         * Visits a node that contains a YieldExpression.
         *
         * @param node The node to visit.
         */
        function visitJavaScriptContainingYield(node: Node): VisitResult<Node> {
            switch (node.kind) {
                case SyntaxKind.BinaryExpression:
                    return visitBinaryExpression(<BinaryExpression>node);
                case SyntaxKind.ConditionalExpression:
                    return visitConditionalExpression(<ConditionalExpression>node);
                case SyntaxKind.YieldExpression:
                    return visitYieldExpression(<YieldExpression>node);
                case SyntaxKind.ArrayLiteralExpression:
                    return visitArrayLiteralExpression(<ArrayLiteralExpression>node);
                case SyntaxKind.ObjectLiteralExpression:
                    return visitObjectLiteralExpression(<ObjectLiteralExpression>node);
                case SyntaxKind.ElementAccessExpression:
                    return visitElementAccessExpression(<ElementAccessExpression>node);
                case SyntaxKind.CallExpression:
                    return visitCallExpression(<CallExpression>node);
                case SyntaxKind.NewExpression:
                    return visitNewExpression(<NewExpression>node);
                default:
                    return visitEachChild(node, visitor, context);
            }
        }

        /**
         * Visits a generator function.
         *
         * @param node The node to visit.
         */
        function visitGenerator(node: Node): VisitResult<Node> {
            switch (node.kind) {
                case SyntaxKind.FunctionDeclaration:
                    return visitFunctionDeclaration(<FunctionDeclaration>node);

                case SyntaxKind.FunctionExpression:
                    return visitFunctionExpression(<FunctionExpression>node);

                default:
                    return Debug.failBadSyntaxKind(node);
            }
        }

        /**
         * Visits a function declaration.
         *
         * This will be called when one of the following conditions are met:
         * - The function declaration is a generator function.
         * - The function declaration is contained within the body of a generator function.
         *
         * @param node The node to visit.
         */
        function visitFunctionDeclaration(node: FunctionDeclaration): Statement | undefined {
            // Currently, we only support generators that were originally async functions.
            if (node.asteriskToken) {
                node = setOriginalNode(
                    setTextRange(
                        createFunctionDeclaration(
                            /*decorators*/ undefined,
                            node.modifiers,
                            /*asteriskToken*/ undefined,
                            node.name,
                            /*typeParameters*/ undefined,
                            visitParameterList(node.parameters, visitor, context),
                            /*type*/ undefined,
                            transformGeneratorFunctionBody(node.body!)
                        ),
                        /*location*/ node
                    ),
                    node
                );
            }
            else {
                const savedInGeneratorFunctionBody = inGeneratorFunctionBody;
                const savedInStatementContainingYield = inStatementContainingYield;
                inGeneratorFunctionBody = false;
                inStatementContainingYield = false;
                node = visitEachChild(node, visitor, context);
                inGeneratorFunctionBody = savedInGeneratorFunctionBody;
                inStatementContainingYield = savedInStatementContainingYield;
            }

            if (inGeneratorFunctionBody) {
                // Function declarations in a generator function body are hoisted
                // to the top of the lexical scope and elided from the current statement.
                hoistFunctionDeclaration(node);
                return undefined;
            }
            else {
                return node;
            }
        }

        /**
         * Visits a function expression.
         *
         * This will be called when one of the following conditions are met:
         * - The function expression is a generator function.
         * - The function expression is contained within the body of a generator function.
         *
         * @param node The node to visit.
         */
        function visitFunctionExpression(node: FunctionExpression): Expression {
            // Currently, we only support generators that were originally async functions.
            if (node.asteriskToken) {
                node = setOriginalNode(
                    setTextRange(
                        createFunctionExpression(
                            /*modifiers*/ undefined,
                            /*asteriskToken*/ undefined,
                            node.name,
                            /*typeParameters*/ undefined,
                            visitParameterList(node.parameters, visitor, context),
                            /*type*/ undefined,
                            transformGeneratorFunctionBody(node.body)
                        ),
                        /*location*/ node
                    ),
                    node
                );
            }
            else {
                const savedInGeneratorFunctionBody = inGeneratorFunctionBody;
                const savedInStatementContainingYield = inStatementContainingYield;
                inGeneratorFunctionBody = false;
                inStatementContainingYield = false;
                node = visitEachChild(node, visitor, context);
                inGeneratorFunctionBody = savedInGeneratorFunctionBody;
                inStatementContainingYield = savedInStatementContainingYield;
            }

            return node;
        }

        /**
         * Visits a get or set accessor declaration.
         *
         * This will be called when one of the following conditions are met:
         * - The accessor is contained within the body of a generator function.
         *
         * @param node The node to visit.
         */
        function visitAccessorDeclaration(node: AccessorDeclaration) {
            const savedInGeneratorFunctionBody = inGeneratorFunctionBody;
            const savedInStatementContainingYield = inStatementContainingYield;
            inGeneratorFunctionBody = false;
            inStatementContainingYield = false;
            node = visitEachChild(node, visitor, context);
            inGeneratorFunctionBody = savedInGeneratorFunctionBody;
            inStatementContainingYield = savedInStatementContainingYield;
            return node;
        }

        /**
         * Transforms the body of a generator function declaration.
         *
         * @param node The function body to transform.
         */
        function transformGeneratorFunctionBody(body: Block) {
            // Save existing generator state
            const statements: Statement[] = [];
            const savedInGeneratorFunctionBody = inGeneratorFunctionBody;
            const savedInStatementContainingYield = inStatementContainingYield;
            const savedBlocks = blocks;
            const savedBlockOffsets = blockOffsets;
            const savedBlockActions = blockActions;
            const savedBlockStack = blockStack;
            const savedLabelOffsets = labelOffsets;
            const savedLabelExpressions = labelExpressions;
            const savedNextLabelId = nextLabelId;
            const savedOperations = operations;
            const savedOperationArguments = operationArguments;
            const savedOperationLocations = operationLocations;
            const savedState = state;

            // Initialize generator state
            inGeneratorFunctionBody = true;
            inStatementContainingYield = false;
            blocks = undefined;
            blockOffsets = undefined;
            blockActions = undefined;
            blockStack = undefined;
            labelOffsets = undefined;
            labelExpressions = undefined;
            nextLabelId = 1;
            operations = undefined;
            operationArguments = undefined;
            operationLocations = undefined;
            state = createTempVariable(/*recordTempVariable*/ undefined);

            // Build the generator
            resumeLexicalEnvironment();

            const statementOffset = addPrologue(statements, body.statements, /*ensureUseStrict*/ false, visitor);

            transformAndEmitStatements(body.statements, statementOffset);

            const buildResult = build();
            insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
            statements.push(createReturn(buildResult));

            // Restore previous generator state
            inGeneratorFunctionBody = savedInGeneratorFunctionBody;
            inStatementContainingYield = savedInStatementContainingYield;
            blocks = savedBlocks;
            blockOffsets = savedBlockOffsets;
            blockActions = savedBlockActions;
            blockStack = savedBlockStack;
            labelOffsets = savedLabelOffsets;
            labelExpressions = savedLabelExpressions;
            nextLabelId = savedNextLabelId;
            operations = savedOperations;
            operationArguments = savedOperationArguments;
            operationLocations = savedOperationLocations;
            state = savedState;

            return setTextRange(createBlock(statements, body.multiLine), body);
        }

        /**
         * Visits a variable statement.
         *
         * This will be called when one of the following conditions are met:
         * - The variable statement is contained within the body of a generator function.
         *
         * @param node The node to visit.
         */
        function visitVariableStatement(node: VariableStatement): Statement | undefined {
            if (node.transformFlags & TransformFlags.ContainsYield) {
                transformAndEmitVariableDeclarationList(node.declarationList);
                return undefined;
            }
            else {
                // Do not hoist custom prologues.
                if (getEmitFlags(node) & EmitFlags.CustomPrologue) {
                    return node;
                }

                for (const variable of node.declarationList.declarations) {
                    hoistVariableDeclaration(<Identifier>variable.name);
                }

                const variables = getInitializedVariables(node.declarationList);
                if (variables.length === 0) {
                    return undefined;
                }

                return setSourceMapRange(
                    createExpressionStatement(
                        inlineExpressions(
                            map(variables, transformInitializedVariable)
                        )
                    ),
                    node
                );
            }
        }

        /**
         * Visits a binary expression.
         *
         * This will be called when one of the following conditions are met:
         * - The node contains a YieldExpression.
         *
         * @param node The node to visit.
         */
        function visitBinaryExpression(node: BinaryExpression): Expression {
            const assoc = getExpressionAssociativity(node);
            switch (assoc) {
                case Associativity.Left:
                    return visitLeftAssociativeBinaryExpression(node);
                case Associativity.Right:
                    return visitRightAssociativeBinaryExpression(node);
                default:
                    return Debug.assertNever(assoc);
            }
        }

        function isCompoundAssignment(kind: BinaryOperator): kind is CompoundAssignmentOperator {
            return kind >= SyntaxKind.FirstCompoundAssignment
                && kind <= SyntaxKind.LastCompoundAssignment;
        }

        function getOperatorForCompoundAssignment(kind: CompoundAssignmentOperator): BitwiseOperatorOrHigher {
            switch (kind) {
                case SyntaxKind.PlusEqualsToken: return SyntaxKind.PlusToken;
                case SyntaxKind.MinusEqualsToken: return SyntaxKind.MinusToken;
                case SyntaxKind.AsteriskEqualsToken: return SyntaxKind.AsteriskToken;
                case SyntaxKind.AsteriskAsteriskEqualsToken: return SyntaxKind.AsteriskAsteriskToken;
                case SyntaxKind.SlashEqualsToken: return SyntaxKind.SlashToken;
                case SyntaxKind.PercentEqualsToken: return SyntaxKind.PercentToken;
                case SyntaxKind.LessThanLessThanEqualsToken: return SyntaxKind.LessThanLessThanToken;
                case SyntaxKind.GreaterThanGreaterThanEqualsToken: return SyntaxKind.GreaterThanGreaterThanToken;
                case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken: return SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
                case SyntaxKind.AmpersandEqualsToken: return SyntaxKind.AmpersandToken;
                case SyntaxKind.BarEqualsToken: return SyntaxKind.BarToken;
                case SyntaxKind.CaretEqualsToken: return SyntaxKind.CaretToken;
            }
        }

        /**
         * Visits a right-associative binary expression containing `yield`.
         *
         * @param node The node to visit.
         */
        function visitRightAssociativeBinaryExpression(node: BinaryExpression) {
            const { left, right } = node;
            if (containsYield(right)) {
                let target: Expression;
                switch (left.kind) {
                    case SyntaxKind.PropertyAccessExpression:
                        // [source]
                        //      a.b = yield;
                        //
                        // [intermediate]
                        //  .local _a
                        //      _a = a;
                        //  .yield resumeLabel
                        //  .mark resumeLabel
                        //      _a.b = %sent%;

                        target = updatePropertyAccess(
                            <PropertyAccessExpression>left,
                            cacheExpression(visitNode((<PropertyAccessExpression>left).expression, visitor, isLeftHandSideExpression)),
                            (<PropertyAccessExpression>left).name
                        );
                        break;

                    case SyntaxKind.ElementAccessExpression:
                        // [source]
                        //      a[b] = yield;
                        //
                        // [intermediate]
                        //  .local _a, _b
                        //      _a = a;
                        //      _b = b;
                        //  .yield resumeLabel
                        //  .mark resumeLabel
                        //      _a[_b] = %sent%;

                        target = updateElementAccess(<ElementAccessExpression>left,
                            cacheExpression(visitNode((<ElementAccessExpression>left).expression, visitor, isLeftHandSideExpression)),
                            cacheExpression(visitNode((<ElementAccessExpression>left).argumentExpression, visitor, isExpression))
                        );
                        break;

                    default:
                        target = visitNode(left, visitor, isExpression);
                        break;
                }

                const operator = node.operatorToken.kind;
                if (isCompoundAssignment(operator)) {
                    return setTextRange(
                        createAssignment(
                            target,
                            setTextRange(
                                createBinary(
                                    cacheExpression(target),
                                    getOperatorForCompoundAssignment(operator),
                                    visitNode(right, visitor, isExpression)
                                ),
                                node
                            )
                        ),
                        node
                    );
                }
                else {
                    return updateBinary(node, target, visitNode(right, visitor, isExpression));
                }
            }

            return visitEachChild(node, visitor, context);
        }

        function visitLeftAssociativeBinaryExpression(node: BinaryExpression) {
            if (containsYield(node.right)) {
                if (isLogicalOperator(node.operatorToken.kind)) {
                    return visitLogicalBinaryExpression(node);
                }
                else if (node.operatorToken.kind === SyntaxKind.CommaToken) {
                    return visitCommaExpression(node);
                }

                // [source]
                //      a() + (yield) + c()
                //
                // [intermediate]
                //  .local _a
                //      _a = a();
                //  .yield resumeLabel
                //      _a + %sent% + c()

                const clone = getMutableClone(node);
                clone.left = cacheExpression(visitNode(node.left, visitor, isExpression));
                clone.right = visitNode(node.right, visitor, isExpression);
                return clone;
            }

            return visitEachChild(node, visitor, context);
        }

        /**
         * Visits a logical binary expression containing `yield`.
         *
         * @param node A node to visit.
         */
        function visitLogicalBinaryExpression(node: BinaryExpression) {
            // Logical binary expressions (`&&` and `||`) are shortcutting expressions and need
            // to be transformed as such:
            //
            // [source]
            //      x = a() && yield;
            //
            // [intermediate]
            //  .local _a
            //      _a = a();
            //  .brfalse resultLabel, (_a)
            //  .yield resumeLabel
            //  .mark resumeLabel
            //      _a = %sent%;
            //  .mark resultLabel
            //      x = _a;
            //
            // [source]
            //      x = a() || yield;
            //
            // [intermediate]
            //  .local _a
            //      _a = a();
            //  .brtrue resultLabel, (_a)
            //  .yield resumeLabel
            //  .mark resumeLabel
            //      _a = %sent%;
            //  .mark resultLabel
            //      x = _a;

            const resultLabel = defineLabel();
            const resultLocal = declareLocal();

            emitAssignment(resultLocal, visitNode(node.left, visitor, isExpression), /*location*/ node.left);
            if (node.operatorToken.kind === SyntaxKind.AmpersandAmpersandToken) {
                // Logical `&&` shortcuts when the left-hand operand is falsey.
                emitBreakWhenFalse(resultLabel, resultLocal, /*location*/ node.left);
            }
            else {
                // Logical `||` shortcuts when the left-hand operand is truthy.
                emitBreakWhenTrue(resultLabel, resultLocal, /*location*/ node.left);
            }

            emitAssignment(resultLocal, visitNode(node.right, visitor, isExpression), /*location*/ node.right);
            markLabel(resultLabel);
            return resultLocal;
        }

        /**
         * Visits a comma expression containing `yield`.
         *
         * @param node The node to visit.
         */
        function visitCommaExpression(node: BinaryExpression) {
            // [source]
            //      x = a(), yield, b();
            //
            // [intermediate]
            //      a();
            //  .yield resumeLabel
            //  .mark resumeLabel
            //      x = %sent%, b();

            let pendingExpressions: Expression[] = [];
            visit(node.left);
            visit(node.right);
            return inlineExpressions(pendingExpressions);

            function visit(node: Expression) {
                if (isBinaryExpression(node) && node.operatorToken.kind === SyntaxKind.CommaToken) {
                    visit(node.left);
                    visit(node.right);
                }
                else {
                    if (containsYield(node) && pendingExpressions.length > 0) {
                        emitWorker(OpCode.Statement, [createExpressionStatement(inlineExpressions(pendingExpressions))]);
                        pendingExpressions = [];
                    }

                    pendingExpressions.push(visitNode(node, visitor, isExpression));
                }
            }
        }

        /**
         * Visits a conditional expression containing `yield`.
         *
         * @param node The node to visit.
         */
        function visitConditionalExpression(node: ConditionalExpression): Expression {
            // [source]
            //      x = a() ? yield : b();
            //
            // [intermediate]
            //  .local _a
            //  .brfalse whenFalseLabel, (a())
            //  .yield resumeLabel
            //  .mark resumeLabel
            //      _a = %sent%;
            //  .br resultLabel
            //  .mark whenFalseLabel
            //      _a = b();
            //  .mark resultLabel
            //      x = _a;

            // We only need to perform a specific transformation if a `yield` expression exists
            // in either the `whenTrue` or `whenFalse` branches.
            // A `yield` in the condition will be handled by the normal visitor.
            if (containsYield(node.whenTrue) || containsYield(node.whenFalse)) {
                const whenFalseLabel = defineLabel();
                const resultLabel = defineLabel();
                const resultLocal = declareLocal();
                emitBreakWhenFalse(whenFalseLabel, visitNode(node.condition, visitor, isExpression), /*location*/ node.condition);
                emitAssignment(resultLocal, visitNode(node.whenTrue, visitor, isExpression), /*location*/ node.whenTrue);
                emitBreak(resultLabel);
                markLabel(whenFalseLabel);
                emitAssignment(resultLocal, visitNode(node.whenFalse, visitor, isExpression), /*location*/ node.whenFalse);
                markLabel(resultLabel);
                return resultLocal;
            }

            return visitEachChild(node, visitor, context);
        }

        /**
         * Visits a `yield` expression.
         *
         * @param node The node to visit.
         */
        function visitYieldExpression(node: YieldExpression): LeftHandSideExpression {
            // [source]
            //      x = yield a();
            //
            // [intermediate]
            //  .yield resumeLabel, (a())
            //  .mark resumeLabel
            //      x = %sent%;

            const resumeLabel = defineLabel();
            const expression = visitNode(node.expression, visitor, isExpression);
            if (node.asteriskToken) {
                const iterator = (getEmitFlags(node.expression!) & EmitFlags.Iterator) === 0
                    ? createValuesHelper(context, expression, /*location*/ node)
                    : expression;
                emitYieldStar(iterator, /*location*/ node);
            }
            else {
                emitYield(expression, /*location*/ node);
            }

            markLabel(resumeLabel);
            return createGeneratorResume(/*location*/ node);
        }

        /**
         * Visits an ArrayLiteralExpression that contains a YieldExpression.
         *
         * @param node The node to visit.
         */
        function visitArrayLiteralExpression(node: ArrayLiteralExpression) {
            return visitElements(node.elements, /*leadingElement*/ undefined, /*location*/ undefined, node.multiLine);
        }

        /**
         * Visits an array of expressions containing one or more YieldExpression nodes
         * and returns an expression for the resulting value.
         *
         * @param elements The elements to visit.
         * @param multiLine Whether array literals created should be emitted on multiple lines.
         */
        function visitElements(elements: NodeArray<Expression>, leadingElement?: Expression, location?: TextRange, multiLine?: boolean) {
            // [source]
            //      ar = [1, yield, 2];
            //
            // [intermediate]
            //  .local _a
            //      _a = [1];
            //  .yield resumeLabel
            //  .mark resumeLabel
            //      ar = _a.concat([%sent%, 2]);

            const numInitialElements = countInitialNodesWithoutYield(elements);

            let temp: Identifier | undefined;
            if (numInitialElements > 0) {
                temp = declareLocal();
                const initialElements = visitNodes(elements, visitor, isExpression, 0, numInitialElements);
                emitAssignment(temp,
                    createArrayLiteral(
                        leadingElement
                            ? [leadingElement, ...initialElements]
                            : initialElements
                    )
                );
                leadingElement = undefined;
            }

            const expressions = reduceLeft(elements, reduceElement, <Expression[]>[], numInitialElements);
            return temp
                ? createArrayConcat(temp, [createArrayLiteral(expressions, multiLine)])
                : setTextRange(
                    createArrayLiteral(leadingElement ? [leadingElement, ...expressions] : expressions, multiLine),
                    location
                );

            function reduceElement(expressions: Expression[], element: Expression) {
                if (containsYield(element) && expressions.length > 0) {
                    const hasAssignedTemp = temp !== undefined;
                    if (!temp) {
                        temp = declareLocal();
                    }

                    emitAssignment(
                        temp,
                        hasAssignedTemp
                            ? createArrayConcat(
                                temp,
                                [createArrayLiteral(expressions, multiLine)]
                            )
                            : createArrayLiteral(
                                leadingElement ? [leadingElement, ...expressions] : expressions,
                                multiLine
                            )
                    );
                    leadingElement = undefined;
                    expressions = [];
                }

                expressions.push(visitNode(element, visitor, isExpression));
                return expressions;
            }
        }

        function visitObjectLiteralExpression(node: ObjectLiteralExpression) {
            // [source]
            //      o = {
            //          a: 1,
            //          b: yield,
            //          c: 2
            //      };
            //
            // [intermediate]
            //  .local _a
            //      _a = {
            //          a: 1
            //      };
            //  .yield resumeLabel
            //  .mark resumeLabel
            //      o = (_a.b = %sent%,
            //          _a.c = 2,
            //          _a);

            const properties = node.properties;
            const multiLine = node.multiLine;
            const numInitialProperties = countInitialNodesWithoutYield(properties);

            const temp = declareLocal();
            emitAssignment(temp,
                createObjectLiteral(
                    visitNodes(properties, visitor, isObjectLiteralElementLike, 0, numInitialProperties),
                    multiLine
                )
            );

            const expressions = reduceLeft(properties, reduceProperty, <Expression[]>[], numInitialProperties);
            expressions.push(multiLine ? startOnNewLine(getMutableClone(temp)) : temp);
            return inlineExpressions(expressions);

            function reduceProperty(expressions: Expression[], property: ObjectLiteralElementLike) {
                if (containsYield(property) && expressions.length > 0) {
                    emitStatement(createExpressionStatement(inlineExpressions(expressions)));
                    expressions = [];
                }

                const expression = createExpressionForObjectLiteralElementLike(node, property, temp);
                const visited = visitNode(expression, visitor, isExpression);
                if (visited) {
                    if (multiLine) {
                        startOnNewLine(visited);
                    }
                    expressions.push(visited);
                }
                return expressions;
            }
        }

        /**
         * Visits an ElementAccessExpression that contains a YieldExpression.
         *
         * @param node The node to visit.
         */
        function visitElementAccessExpression(node: ElementAccessExpression) {
            if (containsYield(node.argumentExpression)) {
                // [source]
                //      a = x[yield];
                //
                // [intermediate]
                //  .local _a
                //      _a = x;
                //  .yield resumeLabel
                //  .mark resumeLabel
                //      a = _a[%sent%]

                const clone = getMutableClone(node);
                clone.expression = cacheExpression(visitNode(node.expression, visitor, isLeftHandSideExpression));
                clone.argumentExpression = visitNode(node.argumentExpression, visitor, isExpression);
                return clone;
            }

            return visitEachChild(node, visitor, context);
        }

        function visitCallExpression(node: CallExpression) {
            if (!isImportCall(node) && forEach(node.arguments, containsYield)) {
                // [source]
                //      a.b(1, yield, 2);
                //
                // [intermediate]
                //  .local _a, _b, _c
                //      _b = (_a = a).b;
                //      _c = [1];
                //  .yield resumeLabel
                //  .mark resumeLabel
                //      _b.apply(_a, _c.concat([%sent%, 2]));
                const { target, thisArg } = createCallBinding(node.expression, hoistVariableDeclaration, languageVersion, /*cacheIdentifiers*/ true);
                return setOriginalNode(
                    createFunctionApply(
                        cacheExpression(visitNode(target, visitor, isLeftHandSideExpression)),
                        thisArg,
                        visitElements(node.arguments),
                        /*location*/ node
                    ),
                    node
                );
            }

            return visitEachChild(node, visitor, context);
        }

        function visitNewExpression(node: NewExpression) {
            if (forEach(node.arguments, containsYield)) {
                // [source]
                //      new a.b(1, yield, 2);
                //
                // [intermediate]
                //  .local _a, _b, _c
                //      _b = (_a = a.b).bind;
                //      _c = [1];
                //  .yield resumeLabel
                //  .mark resumeLabel
                //      new (_b.apply(_a, _c.concat([%sent%, 2])));

                const { target, thisArg } = createCallBinding(createPropertyAccess(node.expression, "bind"), hoistVariableDeclaration);
                return setOriginalNode(
                    setTextRange(
                        createNew(
                            createFunctionApply(
                                cacheExpression(visitNode(target, visitor, isExpression)),
                                thisArg,
                                visitElements(
                                    node.arguments!,
                                    /*leadingElement*/ createVoidZero()
                                )
                            ),
                            /*typeArguments*/ undefined,
                            []
                        ),
                        node
                    ),
                    node
                );
            }
            return visitEachChild(node, visitor, context);
        }

        function transformAndEmitStatements(statements: readonly Statement[], start = 0) {
            const numStatements = statements.length;
            for (let i = start; i < numStatements; i++) {
                transformAndEmitStatement(statements[i]);
            }
        }

        function transformAndEmitEmbeddedStatement(node: Statement) {
            if (isBlock(node)) {
                transformAndEmitStatements(node.statements);
            }
            else {
                transformAndEmitStatement(node);
            }
        }

        function transformAndEmitStatement(node: Statement): void {
            const savedInStatementContainingYield = inStatementContainingYield;
            if (!inStatementContainingYield) {
                inStatementContainingYield = containsYield(node);
            }

            transformAndEmitStatementWorker(node);
            inStatementContainingYield = savedInStatementContainingYield;
        }

        function transformAndEmitStatementWorker(node: Statement): void {
            switch (node.kind) {
                case SyntaxKind.Block:
                    return transformAndEmitBlock(<Block>node);
                case SyntaxKind.ExpressionStatement:
                    return transformAndEmitExpressionStatement(<ExpressionStatement>node);
                case SyntaxKind.IfStatement:
                    return transformAndEmitIfStatement(<IfStatement>node);
                case SyntaxKind.DoStatement:
                    return transformAndEmitDoStatement(<DoStatement>node);
                case SyntaxKind.WhileStatement:
                    return transformAndEmitWhileStatement(<WhileStatement>node);
                case SyntaxKind.ForStatement:
                    return transformAndEmitForStatement(<ForStatement>node);
                case SyntaxKind.ForInStatement:
                    return transformAndEmitForInStatement(<ForInStatement>node);
                case SyntaxKind.ContinueStatement:
                    return transformAndEmitContinueStatement(<ContinueStatement>node);
                case SyntaxKind.BreakStatement:
                    return transformAndEmitBreakStatement(<BreakStatement>node);
                case SyntaxKind.ReturnStatement:
                    return transformAndEmitReturnStatement(<ReturnStatement>node);
                case SyntaxKind.WithStatement:
                    return transformAndEmitWithStatement(<WithStatement>node);
                case SyntaxKind.SwitchStatement:
                    return transformAndEmitSwitchStatement(<SwitchStatement>node);
                case SyntaxKind.LabeledStatement:
                    return transformAndEmitLabeledStatement(<LabeledStatement>node);
                case SyntaxKind.ThrowStatement:
                    return transformAndEmitThrowStatement(<ThrowStatement>node);
                case SyntaxKind.TryStatement:
                    return transformAndEmitTryStatement(<TryStatement>node);
                default:
                    return emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function transformAndEmitBlock(node: Block): void {
            if (containsYield(node)) {
                transformAndEmitStatements(node.statements);
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function transformAndEmitExpressionStatement(node: ExpressionStatement) {
            emitStatement(visitNode(node, visitor, isStatement));
        }

        function transformAndEmitVariableDeclarationList(node: VariableDeclarationList): VariableDeclarationList | undefined {
            for (const variable of node.declarations) {
                const name = getSynthesizedClone(<Identifier>variable.name);
                setCommentRange(name, variable.name);
                hoistVariableDeclaration(name);
            }

            const variables = getInitializedVariables(node);
            const numVariables = variables.length;
            let variablesWritten = 0;
            let pendingExpressions: Expression[] = [];
            while (variablesWritten < numVariables) {
                for (let i = variablesWritten; i < numVariables; i++) {
                    const variable = variables[i];
                    if (containsYield(variable.initializer) && pendingExpressions.length > 0) {
                        break;
                    }

                    pendingExpressions.push(transformInitializedVariable(variable));
                }

                if (pendingExpressions.length) {
                    emitStatement(createExpressionStatement(inlineExpressions(pendingExpressions)));
                    variablesWritten += pendingExpressions.length;
                    pendingExpressions = [];
                }
            }

            return undefined;
        }

        function transformInitializedVariable(node: VariableDeclaration) {
            return setSourceMapRange(
                createAssignment(
                    setSourceMapRange(<Identifier>getSynthesizedClone(node.name), node.name),
                    visitNode(node.initializer, visitor, isExpression)
                ),
                node
            );
        }

        function transformAndEmitIfStatement(node: IfStatement) {
            if (containsYield(node)) {
                // [source]
                //      if (x)
                //          /*thenStatement*/
                //      else
                //          /*elseStatement*/
                //
                // [intermediate]
                //  .brfalse elseLabel, (x)
                //      /*thenStatement*/
                //  .br endLabel
                //  .mark elseLabel
                //      /*elseStatement*/
                //  .mark endLabel

                if (containsYield(node.thenStatement) || containsYield(node.elseStatement)) {
                    const endLabel = defineLabel();
                    const elseLabel = node.elseStatement ? defineLabel() : undefined;
                    emitBreakWhenFalse(node.elseStatement ? elseLabel! : endLabel, visitNode(node.expression, visitor, isExpression), /*location*/ node.expression);
                    transformAndEmitEmbeddedStatement(node.thenStatement);
                    if (node.elseStatement) {
                        emitBreak(endLabel);
                        markLabel(elseLabel!);
                        transformAndEmitEmbeddedStatement(node.elseStatement);
                    }
                    markLabel(endLabel);
                }
                else {
                    emitStatement(visitNode(node, visitor, isStatement));
                }
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function transformAndEmitDoStatement(node: DoStatement) {
            if (containsYield(node)) {
                // [source]
                //      do {
                //          /*body*/
                //      }
                //      while (i < 10);
                //
                // [intermediate]
                //  .loop conditionLabel, endLabel
                //  .mark loopLabel
                //      /*body*/
                //  .mark conditionLabel
                //  .brtrue loopLabel, (i < 10)
                //  .endloop
                //  .mark endLabel

                const conditionLabel = defineLabel();
                const loopLabel = defineLabel();
                beginLoopBlock(/*continueLabel*/ conditionLabel);
                markLabel(loopLabel);
                transformAndEmitEmbeddedStatement(node.statement);
                markLabel(conditionLabel);
                emitBreakWhenTrue(loopLabel, visitNode(node.expression, visitor, isExpression));
                endLoopBlock();
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function visitDoStatement(node: DoStatement) {
            if (inStatementContainingYield) {
                beginScriptLoopBlock();
                node = visitEachChild(node, visitor, context);
                endLoopBlock();
                return node;
            }
            else {
                return visitEachChild(node, visitor, context);
            }
        }

        function transformAndEmitWhileStatement(node: WhileStatement) {
            if (containsYield(node)) {
                // [source]
                //      while (i < 10) {
                //          /*body*/
                //      }
                //
                // [intermediate]
                //  .loop loopLabel, endLabel
                //  .mark loopLabel
                //  .brfalse endLabel, (i < 10)
                //      /*body*/
                //  .br loopLabel
                //  .endloop
                //  .mark endLabel

                const loopLabel = defineLabel();
                const endLabel = beginLoopBlock(loopLabel);
                markLabel(loopLabel);
                emitBreakWhenFalse(endLabel, visitNode(node.expression, visitor, isExpression));
                transformAndEmitEmbeddedStatement(node.statement);
                emitBreak(loopLabel);
                endLoopBlock();
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function visitWhileStatement(node: WhileStatement) {
            if (inStatementContainingYield) {
                beginScriptLoopBlock();
                node = visitEachChild(node, visitor, context);
                endLoopBlock();
                return node;
            }
            else {
                return visitEachChild(node, visitor, context);
            }
        }

        function transformAndEmitForStatement(node: ForStatement) {
            if (containsYield(node)) {
                // [source]
                //      for (var i = 0; i < 10; i++) {
                //          /*body*/
                //      }
                //
                // [intermediate]
                //  .local i
                //      i = 0;
                //  .loop incrementLabel, endLoopLabel
                //  .mark conditionLabel
                //  .brfalse endLoopLabel, (i < 10)
                //      /*body*/
                //  .mark incrementLabel
                //      i++;
                //  .br conditionLabel
                //  .endloop
                //  .mark endLoopLabel

                const conditionLabel = defineLabel();
                const incrementLabel = defineLabel();
                const endLabel = beginLoopBlock(incrementLabel);
                if (node.initializer) {
                    const initializer = node.initializer;
                    if (isVariableDeclarationList(initializer)) {
                        transformAndEmitVariableDeclarationList(initializer);
                    }
                    else {
                        emitStatement(
                            setTextRange(
                                createExpressionStatement(
                                    visitNode(initializer, visitor, isExpression)
                                ),
                                initializer
                            )
                        );
                    }
                }

                markLabel(conditionLabel);
                if (node.condition) {
                    emitBreakWhenFalse(endLabel, visitNode(node.condition, visitor, isExpression));
                }

                transformAndEmitEmbeddedStatement(node.statement);

                markLabel(incrementLabel);
                if (node.incrementor) {
                    emitStatement(
                        setTextRange(
                            createExpressionStatement(
                                visitNode(node.incrementor, visitor, isExpression)
                            ),
                            node.incrementor
                        )
                    );
                }
                emitBreak(conditionLabel);
                endLoopBlock();
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function visitForStatement(node: ForStatement) {
            if (inStatementContainingYield) {
                beginScriptLoopBlock();
            }

            const initializer = node.initializer;
            if (initializer && isVariableDeclarationList(initializer)) {
                for (const variable of initializer.declarations) {
                    hoistVariableDeclaration(<Identifier>variable.name);
                }

                const variables = getInitializedVariables(initializer);
                node = updateFor(node,
                    variables.length > 0
                        ? inlineExpressions(map(variables, transformInitializedVariable))
                        : undefined,
                    visitNode(node.condition, visitor, isExpression),
                    visitNode(node.incrementor, visitor, isExpression),
                    visitNode(node.statement, visitor, isStatement, liftToBlock)
                );
            }
            else {
                node = visitEachChild(node, visitor, context);
            }

            if (inStatementContainingYield) {
                endLoopBlock();
            }

            return node;
        }

        function transformAndEmitForInStatement(node: ForInStatement) {
            // TODO(rbuckton): Source map locations
            if (containsYield(node)) {
                // [source]
                //      for (var p in o) {
                //          /*body*/
                //      }
                //
                // [intermediate]
                //  .local _a, _b, _i
                //      _a = [];
                //      for (_b in o) _a.push(_b);
                //      _i = 0;
                //  .loop incrementLabel, endLoopLabel
                //  .mark conditionLabel
                //  .brfalse endLoopLabel, (_i < _a.length)
                //      p = _a[_i];
                //      /*body*/
                //  .mark incrementLabel
                //      _b++;
                //  .br conditionLabel
                //  .endloop
                //  .mark endLoopLabel

                const keysArray = declareLocal(); // _a
                const key = declareLocal(); // _b
                const keysIndex = createLoopVariable(); // _i
                const initializer = node.initializer;
                hoistVariableDeclaration(keysIndex);
                emitAssignment(keysArray, createArrayLiteral());

                emitStatement(
                    createForIn(
                        key,
                        visitNode(node.expression, visitor, isExpression),
                        createExpressionStatement(
                            createCall(
                                createPropertyAccess(keysArray, "push"),
                                /*typeArguments*/ undefined,
                                [key]
                            )
                        )
                    )
                );

                emitAssignment(keysIndex, createLiteral(0));

                const conditionLabel = defineLabel();
                const incrementLabel = defineLabel();
                const endLabel = beginLoopBlock(incrementLabel);

                markLabel(conditionLabel);
                emitBreakWhenFalse(endLabel, createLessThan(keysIndex, createPropertyAccess(keysArray, "length")));

                let variable: Expression;
                if (isVariableDeclarationList(initializer)) {
                    for (const variable of initializer.declarations) {
                        hoistVariableDeclaration(<Identifier>variable.name);
                    }

                    variable = <Identifier>getSynthesizedClone(initializer.declarations[0].name);
                }
                else {
                    variable = visitNode(initializer, visitor, isExpression);
                    Debug.assert(isLeftHandSideExpression(variable));
                }

                emitAssignment(variable, createElementAccess(keysArray, keysIndex));
                transformAndEmitEmbeddedStatement(node.statement);

                markLabel(incrementLabel);
                emitStatement(createExpressionStatement(createPostfixIncrement(keysIndex)));

                emitBreak(conditionLabel);
                endLoopBlock();
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function visitForInStatement(node: ForInStatement) {
            // [source]
            //      for (var x in a) {
            //          /*body*/
            //      }
            //
            // [intermediate]
            //  .local x
            //  .loop
            //      for (x in a) {
            //          /*body*/
            //      }
            //  .endloop

            if (inStatementContainingYield) {
                beginScriptLoopBlock();
            }

            const initializer = node.initializer;
            if (isVariableDeclarationList(initializer)) {
                for (const variable of initializer.declarations) {
                    hoistVariableDeclaration(<Identifier>variable.name);
                }

                node = updateForIn(node,
                    <Identifier>initializer.declarations[0].name,
                    visitNode(node.expression, visitor, isExpression),
                    visitNode(node.statement, visitor, isStatement, liftToBlock)
                );
            }
            else {
                node = visitEachChild(node, visitor, context);
            }

            if (inStatementContainingYield) {
                endLoopBlock();
            }

            return node;
        }

        function transformAndEmitContinueStatement(node: ContinueStatement): void {
            const label = findContinueTarget(node.label ? idText(node.label) : undefined);
            if (label > 0) {
                emitBreak(label, /*location*/ node);
            }
            else {
                // invalid continue without a containing loop. Leave the node as is, per #17875.
                emitStatement(node);
            }
        }

        function visitContinueStatement(node: ContinueStatement): Statement {
            if (inStatementContainingYield) {
                const label = findContinueTarget(node.label && idText(node.label));
                if (label > 0) {
                    return createInlineBreak(label, /*location*/ node);
                }
            }

            return visitEachChild(node, visitor, context);
        }

        function transformAndEmitBreakStatement(node: BreakStatement): void {
            const label = findBreakTarget(node.label ? idText(node.label) : undefined);
            if (label > 0) {
                emitBreak(label, /*location*/ node);
            }
            else {
                // invalid break without a containing loop, switch, or labeled statement. Leave the node as is, per #17875.
                emitStatement(node);
            }
        }

        function visitBreakStatement(node: BreakStatement): Statement {
            if (inStatementContainingYield) {
                const label = findBreakTarget(node.label && idText(node.label));
                if (label > 0) {
                    return createInlineBreak(label, /*location*/ node);
                }
            }

            return visitEachChild(node, visitor, context);
        }

        function transformAndEmitReturnStatement(node: ReturnStatement): void {
            emitReturn(
                visitNode(node.expression, visitor, isExpression),
                /*location*/ node
            );
        }

        function visitReturnStatement(node: ReturnStatement) {
            return createInlineReturn(
                visitNode(node.expression, visitor, isExpression),
                /*location*/ node
            );
        }

        function transformAndEmitWithStatement(node: WithStatement) {
            if (containsYield(node)) {
                // [source]
                //      with (x) {
                //          /*body*/
                //      }
                //
                // [intermediate]
                //  .with (x)
                //      /*body*/
                //  .endwith
                beginWithBlock(cacheExpression(visitNode(node.expression, visitor, isExpression)));
                transformAndEmitEmbeddedStatement(node.statement);
                endWithBlock();
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function transformAndEmitSwitchStatement(node: SwitchStatement) {
            if (containsYield(node.caseBlock)) {
                // [source]
                //      switch (x) {
                //          case a:
                //              /*caseStatements*/
                //          case b:
                //              /*caseStatements*/
                //          default:
                //              /*defaultStatements*/
                //      }
                //
                // [intermediate]
                //  .local _a
                //  .switch endLabel
                //      _a = x;
                //      switch (_a) {
                //          case a:
                //  .br clauseLabels[0]
                //      }
                //      switch (_a) {
                //          case b:
                //  .br clauseLabels[1]
                //      }
                //  .br clauseLabels[2]
                //  .mark clauseLabels[0]
                //      /*caseStatements*/
                //  .mark clauseLabels[1]
                //      /*caseStatements*/
                //  .mark clauseLabels[2]
                //      /*caseStatements*/
                //  .endswitch
                //  .mark endLabel

                const caseBlock = node.caseBlock;
                const numClauses = caseBlock.clauses.length;
                const endLabel = beginSwitchBlock();

                const expression = cacheExpression(visitNode(node.expression, visitor, isExpression));

                // Create labels for each clause and find the index of the first default clause.
                const clauseLabels: Label[] = [];
                let defaultClauseIndex = -1;
                for (let i = 0; i < numClauses; i++) {
                    const clause = caseBlock.clauses[i];
                    clauseLabels.push(defineLabel());
                    if (clause.kind === SyntaxKind.DefaultClause && defaultClauseIndex === -1) {
                        defaultClauseIndex = i;
                    }
                }

                // Emit switch statements for each run of case clauses either from the first case
                // clause or the next case clause with a `yield` in its expression, up to the next
                // case clause with a `yield` in its expression.
                let clausesWritten = 0;
                let pendingClauses: CaseClause[] = [];
                while (clausesWritten < numClauses) {
                    let defaultClausesSkipped = 0;
                    for (let i = clausesWritten; i < numClauses; i++) {
                        const clause = caseBlock.clauses[i];
                        if (clause.kind === SyntaxKind.CaseClause) {
                            if (containsYield(clause.expression) && pendingClauses.length > 0) {
                                break;
                            }

                            pendingClauses.push(
                                createCaseClause(
                                    visitNode(clause.expression, visitor, isExpression),
                                    [
                                        createInlineBreak(clauseLabels[i], /*location*/ clause.expression)
                                    ]
                                )
                            );
                        }
                        else {
                            defaultClausesSkipped++;
                        }
                    }

                    if (pendingClauses.length) {
                        emitStatement(createSwitch(expression, createCaseBlock(pendingClauses)));
                        clausesWritten += pendingClauses.length;
                        pendingClauses = [];
                    }
                    if (defaultClausesSkipped > 0) {
                        clausesWritten += defaultClausesSkipped;
                        defaultClausesSkipped = 0;
                    }
                }

                if (defaultClauseIndex >= 0) {
                    emitBreak(clauseLabels[defaultClauseIndex]);
                }
                else {
                    emitBreak(endLabel);
                }

                for (let i = 0; i < numClauses; i++) {
                    markLabel(clauseLabels[i]);
                    transformAndEmitStatements(caseBlock.clauses[i].statements);
                }

                endSwitchBlock();
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function visitSwitchStatement(node: SwitchStatement) {
            if (inStatementContainingYield) {
                beginScriptSwitchBlock();
            }

            node = visitEachChild(node, visitor, context);

            if (inStatementContainingYield) {
                endSwitchBlock();
            }

            return node;
        }

        function transformAndEmitLabeledStatement(node: LabeledStatement) {
            if (containsYield(node)) {
                // [source]
                //      x: {
                //          /*body*/
                //      }
                //
                // [intermediate]
                //  .labeled "x", endLabel
                //      /*body*/
                //  .endlabeled
                //  .mark endLabel
                beginLabeledBlock(idText(node.label));
                transformAndEmitEmbeddedStatement(node.statement);
                endLabeledBlock();
            }
            else {
                emitStatement(visitNode(node, visitor, isStatement));
            }
        }

        function visitLabeledStatement(node: LabeledStatement) {
            if (inStatementContainingYield) {
                beginScriptLabeledBlock(idText(node.label));
            }

            node = visitEachChild(node, visitor, context);

            if (inStatementContainingYield) {
                endLabeledBlock();
            }

            return node;
        }

        function transformAndEmitThrowStatement(node: ThrowStatement): void {
            emitThrow(
                visitNode(node.expression, visitor, isExpression),
                /*location*/ node
            );
        }

        function transformAndEmitTryStatement(node: TryStatement) {
            if (containsYield(node)) {
                // [source]
                //      try {
                //          /*tryBlock*/
                //      }
                //      catch (e) {
                //          /*catchBlock*/
                //      }
                //      finally {
                //          /*finallyBlock*/
                //      }
                //
                // [intermediate]
                //  .local _a
                //  .try tryLabel, catchLabel, finallyLabel, endLabel
                //  .mark tryLabel
                //  .nop
                //      /*tryBlock*/
                //  .br endLabel
                //  .catch
                //  .mark catchLabel
                //      _a = %error%;
                //      /*catchBlock*/
                //  .br endLabel
                //  .finally
                //  .mark finallyLabel
                //      /*finallyBlock*/
                //  .endfinally
                //  .endtry
                //  .mark endLabel

                beginExceptionBlock();
                transformAndEmitEmbeddedStatement(node.tryBlock);
                if (node.catchClause) {
                    beginCatchBlock(node.catchClause.variableDeclaration!); // TODO: GH#18217
                    transformAndEmitEmbeddedStatement(node.catchClause.block);
                }

                if (node.finallyBlock) {
                    beginFinallyBlock();
                    transformAndEmitEmbeddedStatement(node.finallyBlock);
                }

                endExceptionBlock();
            }
            else {
                emitStatement(visitEachChild(node, visitor, context));
            }
        }

        function containsYield(node: Node | undefined): boolean {
            return !!node && (node.transformFlags & TransformFlags.ContainsYield) !== 0;
        }

        function countInitialNodesWithoutYield(nodes: NodeArray<Node>) {
            const numNodes = nodes.length;
            for (let i = 0; i < numNodes; i++) {
                if (containsYield(nodes[i])) {
                    return i;
                }
            }

            return -1;
        }

        function onSubstituteNode(hint: EmitHint, node: Node): Node {
            node = previousOnSubstituteNode(hint, node);
            if (hint === EmitHint.Expression) {
                return substituteExpression(<Expression>node);
            }
            return node;
        }

        function substituteExpression(node: Expression): Expression {
            if (isIdentifier(node)) {
                return substituteExpressionIdentifier(node);
            }
            return node;
        }

        function substituteExpressionIdentifier(node: Identifier) {
            if (!isGeneratedIdentifier(node) && renamedCatchVariables && renamedCatchVariables.has(idText(node))) {
                const original = getOriginalNode(node);
                if (isIdentifier(original) && original.parent) {
                    const declaration = resolver.getReferencedValueDeclaration(original);
                    if (declaration) {
                        const name = renamedCatchVariableDeclarations[getOriginalNodeId(declaration)];
                        if (name) {
                            const clone = getMutableClone(name);
                            setSourceMapRange(clone, node);
                            setCommentRange(clone, node);
                            return clone;
                        }
                    }
                }
            }

            return node;
        }

        function cacheExpression(node: Expression): Identifier {
            if (isGeneratedIdentifier(node) || getEmitFlags(node) & EmitFlags.HelperName) {
                return <Identifier>node;
            }

            const temp = createTempVariable(hoistVariableDeclaration);
            emitAssignment(temp, node, /*location*/ node);
            return temp;
        }

        function declareLocal(name?: string): Identifier {
            const temp = name
                ? createUniqueName(name)
                : createTempVariable(/*recordTempVariable*/ undefined);
            hoistVariableDeclaration(temp);
            return temp;
        }

        /**
         * Defines a label, uses as the target of a Break operation.
         */
        function defineLabel(): Label {
            if (!labelOffsets) {
                labelOffsets = [];
            }

            const label = nextLabelId;
            nextLabelId++;
            labelOffsets[label] = -1;
            return label;
        }

        /**
         * Marks the current operation with the specified label.
         */
        function markLabel(label: Label): void {
            Debug.assert(labelOffsets !== undefined, "No labels were defined.");
            labelOffsets![label] = operations ? operations.length : 0;
        }

        /**
         * Begins a block operation (With, Break/Continue, Try/Catch/Finally)
         *
         * @param block Information about the block.
         */
        function beginBlock(block: CodeBlock): number {
            if (!blocks) {
                blocks = [];
                blockActions = [];
                blockOffsets = [];
                blockStack = [];
            }

            const index = blockActions!.length;
            blockActions![index] = BlockAction.Open;
            blockOffsets![index] = operations ? operations.length : 0;
            blocks[index] = block;
            blockStack!.push(block);
            return index;
        }

        /**
         * Ends the current block operation.
         */
        function endBlock(): CodeBlock {
            const block = peekBlock();
            if (block === undefined) return Debug.fail("beginBlock was never called.");

            const index = blockActions!.length;
            blockActions![index] = BlockAction.Close;
            blockOffsets![index] = operations ? operations.length : 0;
            blocks![index] = block;
            blockStack!.pop();
            return block;
        }

        /**
         * Gets the current open block.
         */
        function peekBlock() {
            return lastOrUndefined(blockStack!);
        }

        /**
         * Gets the kind of the current open block.
         */
        function peekBlockKind(): CodeBlockKind | undefined {
            const block = peekBlock();
            return block && block.kind;
        }

        /**
         * Begins a code block for a generated `with` statement.
         *
         * @param expression An identifier representing expression for the `with` block.
         */
        function beginWithBlock(expression: Identifier): void {
            const startLabel = defineLabel();
            const endLabel = defineLabel();
            markLabel(startLabel);
            beginBlock({
                kind: CodeBlockKind.With,
                expression,
                startLabel,
                endLabel
            });
        }

        /**
         * Ends a code block for a generated `with` statement.
         */
        function endWithBlock(): void {
            Debug.assert(peekBlockKind() === CodeBlockKind.With);
            const block = <WithBlock>endBlock();
            markLabel(block.endLabel);
        }

        /**
         * Begins a code block for a generated `try` statement.
         */
        function beginExceptionBlock(): Label {
            const startLabel = defineLabel();
            const endLabel = defineLabel();
            markLabel(startLabel);
            beginBlock({
                kind: CodeBlockKind.Exception,
                state: ExceptionBlockState.Try,
                startLabel,
                endLabel
            });
            emitNop();
            return endLabel;
        }

        /**
         * Enters the `catch` clause of a generated `try` statement.
         *
         * @param variable The catch variable.
         */
        function beginCatchBlock(variable: VariableDeclaration): void {
            Debug.assert(peekBlockKind() === CodeBlockKind.Exception);

            // generated identifiers should already be unique within a file
            let name: Identifier;
            if (isGeneratedIdentifier(variable.name)) {
                name = variable.name;
                hoistVariableDeclaration(variable.name);
            }
            else {
                const text = idText(<Identifier>variable.name);
                name = declareLocal(text);
                if (!renamedCatchVariables) {
                    renamedCatchVariables = createMap<boolean>();
                    renamedCatchVariableDeclarations = [];
                    context.enableSubstitution(SyntaxKind.Identifier);
                }

                renamedCatchVariables.set(text, true);
                renamedCatchVariableDeclarations[getOriginalNodeId(variable)] = name;
            }

            const exception = <ExceptionBlock>peekBlock();
            Debug.assert(exception.state < ExceptionBlockState.Catch);

            const endLabel = exception.endLabel;
            emitBreak(endLabel);

            const catchLabel = defineLabel();
            markLabel(catchLabel);
            exception.state = ExceptionBlockState.Catch;
            exception.catchVariable = name;
            exception.catchLabel = catchLabel;

            emitAssignment(name, createCall(createPropertyAccess(state, "sent"), /*typeArguments*/ undefined, []));
            emitNop();
        }

        /**
         * Enters the `finally` block of a generated `try` statement.
         */
        function beginFinallyBlock(): void {
            Debug.assert(peekBlockKind() === CodeBlockKind.Exception);

            const exception = <ExceptionBlock>peekBlock();
            Debug.assert(exception.state < ExceptionBlockState.Finally);

            const endLabel = exception.endLabel;
            emitBreak(endLabel);

            const finallyLabel = defineLabel();
            markLabel(finallyLabel);
            exception.state = ExceptionBlockState.Finally;
            exception.finallyLabel = finallyLabel;
        }

        /**
         * Ends the code block for a generated `try` statement.
         */
        function endExceptionBlock(): void {
            Debug.assert(peekBlockKind() === CodeBlockKind.Exception);
            const exception = <ExceptionBlock>endBlock();
            const state = exception.state;
            if (state < ExceptionBlockState.Finally) {
                emitBreak(exception.endLabel);
            }
            else {
                emitEndfinally();
            }

            markLabel(exception.endLabel);
            emitNop();
            exception.state = ExceptionBlockState.Done;
        }

        /**
         * Begins a code block that supports `break` or `continue` statements that are defined in
         * the source tree and not from generated code.
         *
         * @param labelText Names from containing labeled statements.
         */
        function beginScriptLoopBlock(): void {
            beginBlock({
                kind: CodeBlockKind.Loop,
                isScript: true,
                breakLabel: -1,
                continueLabel: -1
            });
        }

        /**
         * Begins a code block that supports `break` or `continue` statements that are defined in
         * generated code. Returns a label used to mark the operation to which to jump when a
         * `break` statement targets this block.
         *
         * @param continueLabel A Label used to mark the operation to which to jump when a
         *                      `continue` statement targets this block.
         */
        function beginLoopBlock(continueLabel: Label): Label {
            const breakLabel = defineLabel();
            beginBlock({
                kind: CodeBlockKind.Loop,
                isScript: false,
                breakLabel,
                continueLabel,
            });
            return breakLabel;
        }

        /**
         * Ends a code block that supports `break` or `continue` statements that are defined in
         * generated code or in the source tree.
         */
        function endLoopBlock(): void {
            Debug.assert(peekBlockKind() === CodeBlockKind.Loop);
            const block = <SwitchBlock>endBlock();
            const breakLabel = block.breakLabel;
            if (!block.isScript) {
                markLabel(breakLabel);
            }
        }

        /**
         * Begins a code block that supports `break` statements that are defined in the source
         * tree and not from generated code.
         *
         */
        function beginScriptSwitchBlock(): void {
            beginBlock({
                kind: CodeBlockKind.Switch,
                isScript: true,
                breakLabel: -1
            });
        }

        /**
         * Begins a code block that supports `break` statements that are defined in generated code.
         * Returns a label used to mark the operation to which to jump when a `break` statement
         * targets this block.
         */
        function beginSwitchBlock(): Label {
            const breakLabel = defineLabel();
            beginBlock({
                kind: CodeBlockKind.Switch,
                isScript: false,
                breakLabel,
            });
            return breakLabel;
        }

        /**
         * Ends a code block that supports `break` statements that are defined in generated code.
         */
        function endSwitchBlock(): void {
            Debug.assert(peekBlockKind() === CodeBlockKind.Switch);
            const block = <SwitchBlock>endBlock();
            const breakLabel = block.breakLabel;
            if (!block.isScript) {
                markLabel(breakLabel);
            }
        }

        function beginScriptLabeledBlock(labelText: string) {
            beginBlock({
                kind: CodeBlockKind.Labeled,
                isScript: true,
                labelText,
                breakLabel: -1
            });
        }

        function beginLabeledBlock(labelText: string) {
            const breakLabel = defineLabel();
            beginBlock({
                kind: CodeBlockKind.Labeled,
                isScript: false,
                labelText,
                breakLabel
            });
        }

        function endLabeledBlock() {
            Debug.assert(peekBlockKind() === CodeBlockKind.Labeled);
            const block = <LabeledBlock>endBlock();
            if (!block.isScript) {
                markLabel(block.breakLabel);
            }
        }

        /**
         * Indicates whether the provided block supports `break` statements.
         *
         * @param block A code block.
         */
        function supportsUnlabeledBreak(block: CodeBlock): block is SwitchBlock | LoopBlock {
            return block.kind === CodeBlockKind.Switch
                || block.kind === CodeBlockKind.Loop;
        }

        /**
         * Indicates whether the provided block supports `break` statements with labels.
         *
         * @param block A code block.
         */
        function supportsLabeledBreakOrContinue(block: CodeBlock): block is LabeledBlock {
            return block.kind === CodeBlockKind.Labeled;
        }

        /**
         * Indicates whether the provided block supports `continue` statements.
         *
         * @param block A code block.
         */
        function supportsUnlabeledContinue(block: CodeBlock): block is LoopBlock {
            return block.kind === CodeBlockKind.Loop;
        }

        function hasImmediateContainingLabeledBlock(labelText: string, start: number) {
            for (let j = start; j >= 0; j--) {
                const containingBlock = blockStack![j];
                if (supportsLabeledBreakOrContinue(containingBlock)) {
                    if (containingBlock.labelText === labelText) {
                        return true;
                    }
                }
                else {
                    break;
                }
            }

            return false;
        }

        /**
         * Finds the label that is the target for a `break` statement.
         *
         * @param labelText An optional name of a containing labeled statement.
         */
        function findBreakTarget(labelText?: string): Label {
            if (blockStack) {
                if (labelText) {
                    for (let i = blockStack.length - 1; i >= 0; i--) {
                        const block = blockStack[i];
                        if (supportsLabeledBreakOrContinue(block) && block.labelText === labelText) {
                            return block.breakLabel;
                        }
                        else if (supportsUnlabeledBreak(block) && hasImmediateContainingLabeledBlock(labelText, i - 1)) {
                            return block.breakLabel;
                        }
                    }
                }
                else {
                    for (let i = blockStack.length - 1; i >= 0; i--) {
                        const block = blockStack[i];
                        if (supportsUnlabeledBreak(block)) {
                            return block.breakLabel;
                        }
                    }
                }
            }
            return 0;
        }

        /**
         * Finds the label that is the target for a `continue` statement.
         *
         * @param labelText An optional name of a containing labeled statement.
         */
        function findContinueTarget(labelText?: string): Label {
            if (blockStack) {
                if (labelText) {
                    for (let i = blockStack.length - 1; i >= 0; i--) {
                        const block = blockStack[i];
                        if (supportsUnlabeledContinue(block) && hasImmediateContainingLabeledBlock(labelText, i - 1)) {
                            return block.continueLabel;
                        }
                    }
                }
                else {
                    for (let i = blockStack.length - 1; i >= 0; i--) {
                        const block = blockStack[i];
                        if (supportsUnlabeledContinue(block)) {
                            return block.continueLabel;
                        }
                    }
                }
            }
            return 0;
        }

        /**
         * Creates an expression that can be used to indicate the value for a label.
         *
         * @param label A label.
         */
        function createLabel(label: Label | undefined): Expression {
            if (label !== undefined && label > 0) {
                if (labelExpressions === undefined) {
                    labelExpressions = [];
                }

                const expression = createLiteral(-1);
                if (labelExpressions[label] === undefined) {
                    labelExpressions[label] = [expression];
                }
                else {
                    labelExpressions[label].push(expression);
                }

                return expression;
            }

            return createOmittedExpression();
        }

        /**
         * Creates a numeric literal for the provided instruction.
         */
        function createInstruction(instruction: Instruction): NumericLiteral {
            const literal = createLiteral(instruction);
            addSyntheticTrailingComment(literal, SyntaxKind.MultiLineCommentTrivia, getInstructionName(instruction));
            return literal;
        }

        /**
         * Creates a statement that can be used indicate a Break operation to the provided label.
         *
         * @param label A label.
         * @param location An optional source map location for the statement.
         */
        function createInlineBreak(label: Label, location?: TextRange): ReturnStatement {
            Debug.assertLessThan(0, label, "Invalid label");
            return setTextRange(
                createReturn(
                    createArrayLiteral([
                        createInstruction(Instruction.Break),
                        createLabel(label)
                    ])
                ),
                location
            );
        }

        /**
         * Creates a statement that can be used indicate a Return operation.
         *
         * @param expression The expression for the return statement.
         * @param location An optional source map location for the statement.
         */
        function createInlineReturn(expression?: Expression, location?: TextRange): ReturnStatement {
            return setTextRange(
                createReturn(
                    createArrayLiteral(expression
                        ? [createInstruction(Instruction.Return), expression]
                        : [createInstruction(Instruction.Return)]
                    )
                ),
                location
            );
        }

        /**
         * Creates an expression that can be used to resume from a Yield operation.
         */
        function createGeneratorResume(location?: TextRange): LeftHandSideExpression {
            return setTextRange(
                createCall(
                    createPropertyAccess(state, "sent"),
                    /*typeArguments*/ undefined,
                    []
                ),
                location
            );
        }

        /**
         * Emits an empty instruction.
         */
        function emitNop() {
            emitWorker(OpCode.Nop);
        }

        /**
         * Emits a Statement.
         *
         * @param node A statement.
         */
        function emitStatement(node: Statement): void {
            if (node) {
                emitWorker(OpCode.Statement, [node]);
            }
            else {
                emitNop();
            }
        }

        /**
         * Emits an Assignment operation.
         *
         * @param left The left-hand side of the assignment.
         * @param right The right-hand side of the assignment.
         * @param location An optional source map location for the assignment.
         */
        function emitAssignment(left: Expression, right: Expression, location?: TextRange): void {
            emitWorker(OpCode.Assign, [left, right], location);
        }

        /**
         * Emits a Break operation to the specified label.
         *
         * @param label A label.
         * @param location An optional source map location for the assignment.
         */
        function emitBreak(label: Label, location?: TextRange): void {
            emitWorker(OpCode.Break, [label], location);
        }

        /**
         * Emits a Break operation to the specified label when a condition evaluates to a truthy
         * value at runtime.
         *
         * @param label A label.
         * @param condition The condition.
         * @param location An optional source map location for the assignment.
         */
        function emitBreakWhenTrue(label: Label, condition: Expression, location?: TextRange): void {
            emitWorker(OpCode.BreakWhenTrue, [label, condition], location);
        }

        /**
         * Emits a Break to the specified label when a condition evaluates to a falsey value at
         * runtime.
         *
         * @param label A label.
         * @param condition The condition.
         * @param location An optional source map location for the assignment.
         */
        function emitBreakWhenFalse(label: Label, condition: Expression, location?: TextRange): void {
            emitWorker(OpCode.BreakWhenFalse, [label, condition], location);
        }

        /**
         * Emits a YieldStar operation for the provided expression.
         *
         * @param expression An optional value for the yield operation.
         * @param location An optional source map location for the assignment.
         */
        function emitYieldStar(expression?: Expression, location?: TextRange): void {
            emitWorker(OpCode.YieldStar, [expression], location);
        }

        /**
         * Emits a Yield operation for the provided expression.
         *
         * @param expression An optional value for the yield operation.
         * @param location An optional source map location for the assignment.
         */
        function emitYield(expression?: Expression, location?: TextRange): void {
            emitWorker(OpCode.Yield, [expression], location);
        }

        /**
         * Emits a Return operation for the provided expression.
         *
         * @param expression An optional value for the operation.
         * @param location An optional source map location for the assignment.
         */
        function emitReturn(expression?: Expression, location?: TextRange): void {
            emitWorker(OpCode.Return, [expression], location);
        }

        /**
         * Emits a Throw operation for the provided expression.
         *
         * @param expression A value for the operation.
         * @param location An optional source map location for the assignment.
         */
        function emitThrow(expression: Expression, location?: TextRange): void {
            emitWorker(OpCode.Throw, [expression], location);
        }

        /**
         * Emits an Endfinally operation. This is used to handle `finally` block semantics.
         */
        function emitEndfinally(): void {
            emitWorker(OpCode.Endfinally);
        }

        /**
         * Emits an operation.
         *
         * @param code The OpCode for the operation.
         * @param args The optional arguments for the operation.
         */
        function emitWorker(code: OpCode, args?: OperationArguments, location?: TextRange): void {
            if (operations === undefined) {
                operations = [];
                operationArguments = [];
                operationLocations = [];
            }

            if (labelOffsets === undefined) {
                // mark entry point
                markLabel(defineLabel());
            }

            const operationIndex = operations.length;
            operations[operationIndex] = code;
            operationArguments![operationIndex] = args;
            operationLocations![operationIndex] = location;
        }

        /**
         * Builds the generator function body.
         */
        function build() {
            blockIndex = 0;
            labelNumber = 0;
            labelNumbers = undefined;
            lastOperationWasAbrupt = false;
            lastOperationWasCompletion = false;
            clauses = undefined;
            statements = undefined;
            exceptionBlockStack = undefined;
            currentExceptionBlock = undefined;
            withBlockStack = undefined;

            const buildResult = buildStatements();
            return createGeneratorHelper(
                context,
                setEmitFlags(
                    createFunctionExpression(
                        /*modifiers*/ undefined,
                        /*asteriskToken*/ undefined,
                        /*name*/ undefined,
                        /*typeParameters*/ undefined,
                        [createParameter(/*decorators*/ undefined, /*modifiers*/ undefined, /*dotDotDotToken*/ undefined, state)],
                        /*type*/ undefined,
                        createBlock(
                            buildResult,
                            /*multiLine*/ buildResult.length > 0
                        )
                    ),
                    EmitFlags.ReuseTempVariableScope
                )
            );
        }

        /**
         * Builds the statements for the generator function body.
         */
        function buildStatements(): Statement[] {
            if (operations) {
                for (let operationIndex = 0; operationIndex < operations.length; operationIndex++) {
                    writeOperation(operationIndex);
                }

                flushFinalLabel(operations.length);
            }
            else {
                flushFinalLabel(0);
            }

            if (clauses) {
                const labelExpression = createPropertyAccess(state, "label");
                const switchStatement = createSwitch(labelExpression, createCaseBlock(clauses));
                return [startOnNewLine(switchStatement)];
            }

            if (statements) {
                return statements;
            }

            return [];
        }

        /**
         * Flush the current label and advance to a new label.
         */
        function flushLabel(): void {
            if (!statements) {
                return;
            }

            appendLabel(/*markLabelEnd*/ !lastOperationWasAbrupt);

            lastOperationWasAbrupt = false;
            lastOperationWasCompletion = false;
            labelNumber++;
        }

        /**
         * Flush the final label of the generator function body.
         */
        function flushFinalLabel(operationIndex: number): void {
            if (isFinalLabelReachable(operationIndex)) {
                tryEnterLabel(operationIndex);
                withBlockStack = undefined;
                writeReturn(/*expression*/ undefined, /*operationLocation*/ undefined);
            }

            if (statements && clauses) {
                appendLabel(/*markLabelEnd*/ false);
            }

            updateLabelExpressions();
        }

        /**
         * Tests whether the final label of the generator function body
         * is reachable by user code.
         */
        function isFinalLabelReachable(operationIndex: number) {
            // if the last operation was *not* a completion (return/throw) then
            // the final label is reachable.
            if (!lastOperationWasCompletion) {
                return true;
            }

            // if there are no labels defined or referenced, then the final label is
            // not reachable.
            if (!labelOffsets || !labelExpressions) {
                return false;
            }

            // if the label for this offset is referenced, then the final label
            // is reachable.
            for (let label = 0; label < labelOffsets.length; label++) {
                if (labelOffsets[label] === operationIndex && labelExpressions[label]) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Appends a case clause for the last label and sets the new label.
         *
         * @param markLabelEnd Indicates that the transition between labels was a fall-through
         *                     from a previous case clause and the change in labels should be
         *                     reflected on the `state` object.
         */
        function appendLabel(markLabelEnd: boolean): void {
            if (!clauses) {
                clauses = [];
            }

            if (statements) {
                if (withBlockStack) {
                    // The previous label was nested inside one or more `with` blocks, so we
                    // surround the statements in generated `with` blocks to create the same environment.
                    for (let i = withBlockStack.length - 1; i >= 0; i--) {
                        const withBlock = withBlockStack[i];
                        statements = [createWith(withBlock.expression, createBlock(statements))];
                    }
                }

                if (currentExceptionBlock) {
                    // The previous label was nested inside of an exception block, so we must
                    // indicate entry into a protected region by pushing the label numbers
                    // for each block in the protected region.
                    const { startLabel, catchLabel, finallyLabel, endLabel } = currentExceptionBlock;
                    statements.unshift(
                        createExpressionStatement(
                            createCall(
                                createPropertyAccess(createPropertyAccess(state, "trys"), "push"),
                                /*typeArguments*/ undefined,
                                [
                                    createArrayLiteral([
                                        createLabel(startLabel),
                                        createLabel(catchLabel),
                                        createLabel(finallyLabel),
                                        createLabel(endLabel)
                                    ])
                                ]
                            )
                        )
                    );

                    currentExceptionBlock = undefined;
                }

                if (markLabelEnd) {
                    // The case clause for the last label falls through to this label, so we
                    // add an assignment statement to reflect the change in labels.
                    statements.push(
                        createExpressionStatement(
                            createAssignment(
                                createPropertyAccess(state, "label"),
                                createLiteral(labelNumber + 1)
                            )
                        )
                    );
                }
            }

            clauses.push(
                createCaseClause(
                    createLiteral(labelNumber),
                    statements || []
                )
            );

            statements = undefined;
        }

        /**
         * Tries to enter into a new label at the current operation index.
         */
        function tryEnterLabel(operationIndex: number): void {
            if (!labelOffsets) {
                return;
            }

            for (let label = 0; label < labelOffsets.length; label++) {
                if (labelOffsets[label] === operationIndex) {
                    flushLabel();
                    if (labelNumbers === undefined) {
                        labelNumbers = [];
                    }
                    if (labelNumbers[labelNumber] === undefined) {
                        labelNumbers[labelNumber] = [label];
                    }
                    else {
                        labelNumbers[labelNumber].push(label);
                    }
                }
            }
        }

        /**
         * Updates literal expressions for labels with actual label numbers.
         */
        function updateLabelExpressions() {
            if (labelExpressions !== undefined && labelNumbers !== undefined) {
                for (let labelNumber = 0; labelNumber < labelNumbers.length; labelNumber++) {
                    const labels = labelNumbers[labelNumber];
                    if (labels !== undefined) {
                        for (const label of labels) {
                            const expressions = labelExpressions[label];
                            if (expressions !== undefined) {
                                for (const expression of expressions) {
                                    expression.text = String(labelNumber);
                                }
                            }
                        }
                    }
                }
            }
        }

        /**
         * Tries to enter or leave a code block.
         */
        function tryEnterOrLeaveBlock(operationIndex: number): void {
            if (blocks) {
                for (; blockIndex < blockActions!.length && blockOffsets![blockIndex] <= operationIndex; blockIndex++) {
                    const block: CodeBlock = blocks[blockIndex];
                    const blockAction = blockActions![blockIndex];
                    switch (block.kind) {
                        case CodeBlockKind.Exception:
                            if (blockAction === BlockAction.Open) {
                                if (!exceptionBlockStack) {
                                    exceptionBlockStack = [];
                                }

                                if (!statements) {
                                    statements = [];
                                }

                                exceptionBlockStack.push(currentExceptionBlock!);
                                currentExceptionBlock = block;
                            }
                            else if (blockAction === BlockAction.Close) {
                                currentExceptionBlock = exceptionBlockStack!.pop();
                            }
                            break;
                        case CodeBlockKind.With:
                            if (blockAction === BlockAction.Open) {
                                if (!withBlockStack) {
                                    withBlockStack = [];
                                }

                                withBlockStack.push(block);
                            }
                            else if (blockAction === BlockAction.Close) {
                                withBlockStack!.pop();
                            }
                            break;
                        // default: do nothing
                    }
                }
            }
        }

        /**
         * Writes an operation as a statement to the current label's statement list.
         *
         * @param operation The OpCode of the operation
         */
        function writeOperation(operationIndex: number): void {
            tryEnterLabel(operationIndex);
            tryEnterOrLeaveBlock(operationIndex);

            // early termination, nothing else to process in this label
            if (lastOperationWasAbrupt) {
                return;
            }

            lastOperationWasAbrupt = false;
            lastOperationWasCompletion = false;

            const opcode = operations![operationIndex];
            if (opcode === OpCode.Nop) {
                return;
            }
            else if (opcode === OpCode.Endfinally) {
                return writeEndfinally();
            }

            const args = operationArguments![operationIndex]!;
            if (opcode === OpCode.Statement) {
                return writeStatement(<Statement>args[0]);
            }

            const location = operationLocations![operationIndex];
            switch (opcode) {
                case OpCode.Assign:
                    return writeAssign(<Expression>args[0], <Expression>args[1], location);
                case OpCode.Break:
                    return writeBreak(<Label>args[0], location);
                case OpCode.BreakWhenTrue:
                    return writeBreakWhenTrue(<Label>args[0], <Expression>args[1], location);
                case OpCode.BreakWhenFalse:
                    return writeBreakWhenFalse(<Label>args[0], <Expression>args[1], location);
                case OpCode.Yield:
                    return writeYield(<Expression>args[0], location);
                case OpCode.YieldStar:
                    return writeYieldStar(<Expression>args[0], location);
                case OpCode.Return:
                    return writeReturn(<Expression>args[0], location);
                case OpCode.Throw:
                    return writeThrow(<Expression>args[0], location);
            }
        }

        /**
         * Writes a statement to the current label's statement list.
         *
         * @param statement A statement to write.
         */
        function writeStatement(statement: Statement): void {
            if (statement) {
                if (!statements) {
                    statements = [statement];
                }
                else {
                    statements.push(statement);
                }
            }
        }

        /**
         * Writes an Assign operation to the current label's statement list.
         *
         * @param left The left-hand side of the assignment.
         * @param right The right-hand side of the assignment.
         * @param operationLocation The source map location for the operation.
         */
        function writeAssign(left: Expression, right: Expression, operationLocation: TextRange | undefined): void {
            writeStatement(setTextRange(createExpressionStatement(createAssignment(left, right)), operationLocation));
        }

        /**
         * Writes a Throw operation to the current label's statement list.
         *
         * @param expression The value to throw.
         * @param operationLocation The source map location for the operation.
         */
        function writeThrow(expression: Expression, operationLocation: TextRange | undefined): void {
            lastOperationWasAbrupt = true;
            lastOperationWasCompletion = true;
            writeStatement(setTextRange(createThrow(expression), operationLocation));
        }

        /**
         * Writes a Return operation to the current label's statement list.
         *
         * @param expression The value to return.
         * @param operationLocation The source map location for the operation.
         */
        function writeReturn(expression: Expression | undefined, operationLocation: TextRange | undefined): void {
            lastOperationWasAbrupt = true;
            lastOperationWasCompletion = true;
            writeStatement(
                setEmitFlags(
                    setTextRange(
                        createReturn(
                            createArrayLiteral(expression
                                ? [createInstruction(Instruction.Return), expression]
                                : [createInstruction(Instruction.Return)]
                            )
                        ),
                        operationLocation
                    ),
                    EmitFlags.NoTokenSourceMaps
                )
            );
        }

        /**
         * Writes a Break operation to the current label's statement list.
         *
         * @param label The label for the Break.
         * @param operationLocation The source map location for the operation.
         */
        function writeBreak(label: Label, operationLocation: TextRange | undefined): void {
            lastOperationWasAbrupt = true;
            writeStatement(
                setEmitFlags(
                    setTextRange(
                        createReturn(
                            createArrayLiteral([
                                createInstruction(Instruction.Break),
                                createLabel(label)
                            ])
                        ),
                        operationLocation
                    ),
                    EmitFlags.NoTokenSourceMaps
                )
            );
        }

        /**
         * Writes a BreakWhenTrue operation to the current label's statement list.
         *
         * @param label The label for the Break.
         * @param condition The condition for the Break.
         * @param operationLocation The source map location for the operation.
         */
        function writeBreakWhenTrue(label: Label, condition: Expression, operationLocation: TextRange | undefined): void {
            writeStatement(
                setEmitFlags(
                    createIf(
                        condition,
                        setEmitFlags(
                            setTextRange(
                                createReturn(
                                    createArrayLiteral([
                                        createInstruction(Instruction.Break),
                                        createLabel(label)
                                    ])
                                ),
                                operationLocation
                            ),
                            EmitFlags.NoTokenSourceMaps
                        )
                    ),
                    EmitFlags.SingleLine
                )
            );
        }

        /**
         * Writes a BreakWhenFalse operation to the current label's statement list.
         *
         * @param label The label for the Break.
         * @param condition The condition for the Break.
         * @param operationLocation The source map location for the operation.
         */
        function writeBreakWhenFalse(label: Label, condition: Expression, operationLocation: TextRange | undefined): void {
            writeStatement(
                setEmitFlags(
                    createIf(
                        createLogicalNot(condition),
                        setEmitFlags(
                            setTextRange(
                                createReturn(
                                    createArrayLiteral([
                                        createInstruction(Instruction.Break),
                                        createLabel(label)
                                    ])
                                ),
                                operationLocation
                            ),
                            EmitFlags.NoTokenSourceMaps
                        )
                    ),
                    EmitFlags.SingleLine
                )
            );
        }

        /**
         * Writes a Yield operation to the current label's statement list.
         *
         * @param expression The expression to yield.
         * @param operationLocation The source map location for the operation.
         */
        function writeYield(expression: Expression, operationLocation: TextRange | undefined): void {
            lastOperationWasAbrupt = true;
            writeStatement(
                setEmitFlags(
                    setTextRange(
                        createReturn(
                            createArrayLiteral(
                                expression
                                    ? [createInstruction(Instruction.Yield), expression]
                                    : [createInstruction(Instruction.Yield)]
                            )
                        ),
                        operationLocation
                    ),
                    EmitFlags.NoTokenSourceMaps
                )
            );
        }

        /**
         * Writes a YieldStar instruction to the current label's statement list.
         *
         * @param expression The expression to yield.
         * @param operationLocation The source map location for the operation.
         */
        function writeYieldStar(expression: Expression, operationLocation: TextRange | undefined): void {
            lastOperationWasAbrupt = true;
            writeStatement(
                setEmitFlags(
                    setTextRange(
                        createReturn(
                            createArrayLiteral([
                                createInstruction(Instruction.YieldStar),
                                expression
                            ])
                        ),
                        operationLocation
                    ),
                    EmitFlags.NoTokenSourceMaps
                )
            );
        }

        /**
         * Writes an Endfinally instruction to the current label's statement list.
         */
        function writeEndfinally(): void {
            lastOperationWasAbrupt = true;
            writeStatement(
                createReturn(
                    createArrayLiteral([
                        createInstruction(Instruction.Endfinally)
                    ])
                )
            );
        }
    }

    function createGeneratorHelper(context: TransformationContext, body: FunctionExpression) {
        context.requestEmitHelper(generatorHelper);
        return createCall(
            getUnscopedHelperName("__generator"),
            /*typeArguments*/ undefined,
            [createThis(), body]);
    }

    // The __generator helper is used by down-level transformations to emulate the runtime
    // semantics of an ES2015 generator function. When called, this helper returns an
    // object that implements the Iterator protocol, in that it has `next`, `return`, and
    // `throw` methods that step through the generator when invoked.
    //
    // parameters:
    //  @param thisArg  The value to use as the `this` binding for the transformed generator body.
    //  @param body     A function that acts as the transformed generator body.
    //
    // variables:
    //  _       Persistent state for the generator that is shared between the helper and the
    //          generator body. The state object has the following members:
    //            sent() - A method that returns or throws the current completion value.
    //            label  - The next point at which to resume evaluation of the generator body.
    //            trys   - A stack of protected regions (try/catch/finally blocks).
    //            ops    - A stack of pending instructions when inside of a finally block.
    //  f       A value indicating whether the generator is executing.
    //  y       An iterator to delegate for a yield*.
    //  t       A temporary variable that holds one of the following values (note that these
    //          cases do not overlap):
    //          - The completion value when resuming from a `yield` or `yield*`.
    //          - The error value for a catch block.
    //          - The current protected region (array of try/catch/finally/end labels).
    //          - The verb (`next`, `throw`, or `return` method) to delegate to the expression
    //            of a `yield*`.
    //          - The result of evaluating the verb delegated to the expression of a `yield*`.
    //
    // functions:
    //  verb(n)     Creates a bound callback to the `step` function for opcode `n`.
    //  step(op)    Evaluates opcodes in a generator body until execution is suspended or
    //              completed.
    //
    // The __generator helper understands a limited set of instructions:
    //  0: next(value?)     - Start or resume the generator with the specified value.
    //  1: throw(error)     - Resume the generator with an exception. If the generator is
    //                        suspended inside of one or more protected regions, evaluates
    //                        any intervening finally blocks between the current label and
    //                        the nearest catch block or function boundary. If uncaught, the
    //                        exception is thrown to the caller.
    //  2: return(value?)   - Resume the generator as if with a return. If the generator is
    //                        suspended inside of one or more protected regions, evaluates any
    //                        intervening finally blocks.
    //  3: break(label)     - Jump to the specified label. If the label is outside of the
    //                        current protected region, evaluates any intervening finally
    //                        blocks.
    //  4: yield(value?)    - Yield execution to the caller with an optional value. When
    //                        resumed, the generator will continue at the next label.
    //  5: yield*(value)    - Delegates evaluation to the supplied iterator. When
    //                        delegation completes, the generator will continue at the next
    //                        label.
    //  6: catch(error)     - Handles an exception thrown from within the generator body. If
    //                        the current label is inside of one or more protected regions,
    //                        evaluates any intervening finally blocks between the current
    //                        label and the nearest catch block or function boundary. If
    //                        uncaught, the exception is thrown to the caller.
    //  7: endfinally       - Ends a finally block, resuming the last instruction prior to
    //                        entering a finally block.
    //
    // For examples of how these are used, see the comments in ./transformers/generators.ts
    export const generatorHelper: UnscopedEmitHelper = {
        name: "typescript:generator",
        importName: "__generator",
        scoped: false,
        priority: 6,
        text: `
            var __generator = (this && this.__generator) || function (thisArg, body) {
                var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                function verb(n) { return function (v) { return step([n, v]); }; }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) try {
                        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        if (y = 0, t) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0: case 1: t = op; break;
                            case 4: _.label++; return { value: op[1], done: false };
                            case 5: _.label++; y = op[1]; op = [0]; continue;
                            case 7: op = _.ops.pop(); _.trys.pop(); continue;
                            default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                if (t[2]) _.ops.pop();
                                _.trys.pop(); continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                }
            };`
    };
}
