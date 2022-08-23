use std::{
    cell::{RefCell, RefMut},
    mem::take,
    rc::Rc,
};

use is_macro::Is;
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, util::take::Take, BytePos, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};
use tracing::debug;

/// Generator based on tsc generator at https://github.com/microsoft/TypeScript/blob/162224763681465b417274383317ca9a0a573835/src/compiler/transformers/generators.ts
pub fn generator() -> impl VisitMut + Fold {
    as_folder(Wrapper {})
}

/// Instead of saving state, we just create another instance of [Generator].
struct Wrapper {}

impl VisitMut for Wrapper {
    noop_visit_mut_type!();

    fn visit_mut_function(&mut self, f: &mut Function) {
        f.visit_mut_children_with(self);

        if f.is_generator {
            let mut v = Generator::default();
            v.transform_and_emit_stmts(f.body.as_mut().unwrap().stmts.take(), 0);
            f.is_generator = false;

            let mut stmts = v.build_stmts();
            stmts.visit_mut_with(&mut InvalidToLit {
                map: v.label_exprs.as_deref(),
            });
            let inner_fn = Function {
                span: DUMMY_SP,
                // TODO
                params: vec![Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(v.state.clone().into()),
                }],
                decorators: Default::default(),
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                }),
                is_generator: false,
                is_async: false,
                type_params: Default::default(),
                return_type: Default::default(),
            };
            let generator_object = Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: helper!(ts, ts_generator, "__generator"),
                args: vec![
                    ThisExpr { span: DUMMY_SP }.as_arg(),
                    FnExpr {
                        ident: None,
                        function: inner_fn,
                    }
                    .as_arg(),
                ],
                type_args: Default::default(),
            }));
            let mut stmts = vec![];
            if !v.hoisted_vars.is_empty() {
                stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: v.hoisted_vars.take(),
                })))
            }

            stmts.push(Stmt::Return(ReturnStmt {
                span: DUMMY_SP,
                arg: Some(generator_object),
            }));
            f.body.as_mut().unwrap().stmts = stmts;
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Label(isize);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum OpCode {
    /// No operation, used to force a new case in the state machine
    Nop,
    /// A regular javascript statement
    Statement,
    /// An assignment
    Assign,
    /// A break instruction used to jump to a label
    Break,
    /// A break instruction used to jump to a label if a condition evaluates to
    /// true
    BreakWhenTrue,
    /// A break instruction used to jump to a label if a condition evaluates to
    /// false
    BreakWhenFalse,
    /// A completion instruction for the `yield` keyword
    Yield,
    /// A completion instruction for the `yield*` keyword (not implemented, but
    /// reserved for future use)
    YieldStar,
    /// A completion instruction for the `return` keyword
    Return,
    /// A completion instruction for the `throw` keyword
    Throw,
    /// Marks the end of a `finally` block
    Endfinally,
}

#[derive(Debug, Is, Clone)]
enum OpArgs {
    Label(Label),
    LabelExpr(Label, Box<Expr>),
    Stmt(Box<Stmt>),
    OptExpr(Option<Box<Expr>>),
    PatAndExpr(PatOrExpr, Box<Expr>),
}

/// whether a generated code block is opening or closing at the current
/// operation for a FunctionBuilder
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum BlockAction {
    Open,
    Close,
}

/// the kind for a generated code block in a FunctionBuilder
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum CodeBlockKind {
    Exception,
    With,
    Switch,
    Loop,
    Labeled,
}

/// the state for a generated code exception block
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum ExceptionBlockState {
    Try,
    Catch,
    Finally,
    Done,
}

/// A generated code block
#[derive(Debug)]
enum CodeBlock {
    Exception(ExceptionBlock),
    Labeled(LabeledBlock),
    Switch(SwitchBlock),
    Loop(LoopBlock),
    With(WithBlock),
}

impl CodeBlock {
    fn is_script(&self) -> bool {
        match self {
            Self::Exception(b) => false,
            Self::Labeled(b) => b.is_script,
            Self::Switch(b) => b.is_script,
            Self::Loop(b) => b.is_script,
            Self::With(b) => false,
        }
    }

    fn label_text(&self) -> Option<JsWord> {
        match self {
            Self::Labeled(s) => Some(s.label_text.clone()),
            _ => None,
        }
    }

    fn break_label(&self) -> Option<Label> {
        Some(match self {
            Self::Labeled(b) => b.break_label,
            Self::Switch(b) => b.break_label,
            Self::Loop(b) => b.break_label,
            _ => return None,
        })
    }

    fn continue_label(&self) -> Option<Label> {
        Some(match self {
            Self::Loop(b) => b.continue_label,
            _ => return None,
        })
    }
}

/// a generated exception block, used for 'try' statements
#[derive(Debug)]
struct ExceptionBlock {
    state: ExceptionBlockState,
    start_label: Label,
    catch_variable: Option<Ident>,
    catch_label: Option<Label>,
    finally_label: Option<Label>,
    end_label: Label,
}

/// A generated code that tracks the target for 'break' statements in a
/// LabeledStatement.
#[derive(Debug)]
struct LabeledBlock {
    label_text: JsWord,
    is_script: bool,
    break_label: Label,
}

/// a generated block that tracks the target for 'break' statements in a
/// 'switch' statement
#[derive(Debug)]
struct SwitchBlock {
    is_script: bool,
    break_label: Label,
}

/// a generated block that tracks the targets for 'break' and 'continue'
/// statements, used for iteration statements

#[derive(Debug)]
struct LoopBlock {
    continue_label: Label,
    is_script: bool,
    break_label: Label,
}

/// a generated block associated with a 'with' statement

#[derive(Debug)]
struct WithBlock {
    expression: Ident,
    start_label: Label,
    end_label: Label,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
enum Instruction {
    Next = 0,
    Throw = 1,
    Return = 2,
    Break = 3,
    Yield = 4,
    YieldStar = 5,
    Catch = 6,
    Endfinally = 7,
}

impl Instruction {
    fn name(self) -> Option<&'static str> {
        match self {
            Instruction::Return => Some("return"),
            Instruction::Break => Some("break"),
            Instruction::Yield => Some("yield"),
            Instruction::YieldStar => Some("yield*"),
            Instruction::Endfinally => Some("endfinally"),
            _ => None,
        }
    }
}

struct Generator {
    renamed_catch_variables: AHashMap<JsWord, bool>,
    renamed_catch_variables_declaration: Vec<Ident>,

    is_generator_function_body: bool,
    in_statement_containing_yield: bool,

    blocks: Option<Vec<Ptr<CodeBlock>>>,
    block_offsets: Option<Vec<usize>>,
    block_actions: Option<Vec<BlockAction>>,
    /// Index to `blocks`
    block_stack: Option<Vec<Ptr<CodeBlock>>>,

    label_offsets: Option<Vec<i32>>,
    label_exprs: Option<Vec<Vec<Loc>>>,
    next_label_id: usize,

    operations: Option<Vec<OpCode>>,
    operation_args: Option<Vec<Option<OpArgs>>>,
    operation_locs: Option<Vec<Span>>,

    state: Ident,

    block_index: usize,
    label_number: usize,
    label_numbers: Option<Vec<Vec<usize>>>,
    last_operation_was_abrupt: bool,
    last_operation_was_completion: bool,
    clauses: Option<Vec<SwitchCase>>,
    stmts: Option<Vec<Stmt>>,
    /// Index to `blocks`
    exception_block_stack: Vec<Ptr<CodeBlock>>,
    /// Index to `blocks`
    current_exception_block: Option<Ptr<CodeBlock>>,
    /// Index to `blocks`
    with_block_stack: Option<Vec<Ptr<CodeBlock>>>,

    temp_vars: Vec<VarDeclarator>,
    hoisted_vars: Vec<VarDeclarator>,
}

type Ptr<T> = Rc<RefCell<T>>;

impl Default for Generator {
    fn default() -> Self {
        Self {
            renamed_catch_variables: Default::default(),
            renamed_catch_variables_declaration: Default::default(),
            is_generator_function_body: Default::default(),
            in_statement_containing_yield: Default::default(),
            blocks: Default::default(),
            block_offsets: Default::default(),
            block_actions: Default::default(),
            block_stack: Default::default(),
            label_offsets: Default::default(),
            label_exprs: Default::default(),
            next_label_id: Default::default(),
            operations: Default::default(),
            operation_args: Default::default(),
            operation_locs: Default::default(),
            state: private_ident!("_state"),
            block_index: Default::default(),
            label_number: Default::default(),
            label_numbers: Default::default(),
            last_operation_was_abrupt: Default::default(),
            last_operation_was_completion: Default::default(),
            clauses: Default::default(),
            stmts: Default::default(),
            exception_block_stack: Default::default(),
            current_exception_block: Default::default(),
            with_block_stack: Default::default(),
            temp_vars: Default::default(),
            hoisted_vars: Default::default(),
        }
    }
}

impl VisitMut for Generator {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Yield(node) => {
                // [source]
                //      x = yield a();
                //
                // [intermediate]
                //  .yield resumeLabel, (a())
                //  .mark resumeLabel
                //      x = %sent%;

                let resume_label = self.define_label();
                node.arg.visit_mut_with(self);
                if node.delegate {
                    self.emit_yield_star(node.arg.take(), Some(node.span))
                } else {
                    self.emit_yield(node.arg.take(), Some(node.span));
                }

                self.mark_label(resume_label);

                *e = *self.create_generator_resume(Some(node.span));
            }
            _ => {
                e.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        if !node.callee.is_import() && node.args.iter().any(contains_yield) {
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

            // TODO(kdy1):
            // const { target, thisArg } = factory.createCallBinding(
            //     node.expression,
            //     hoistVariableDeclaration,
            //     languageVersion,
            //     /*cacheIdentifiers*/ true
            // );
            // return setOriginalNode(
            //     setTextRange(
            //         factory.createFunctionApplyCall(
            //             cacheExpression(
            //                 visitNode(target, visitor,
            // isLeftHandSideExpression)             ),
            //             thisArg,
            //             visitElements(node.arguments)
            //         ),
            //         node
            //     ),
            //     node
            // );
        }

        node.visit_mut_children_with(self);
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        if self.in_statement_containing_yield {
            self.begin_script_loop_block();
        }

        if let Some(VarDeclOrExpr::VarDecl(initializer)) = &mut node.init {
            for variable in initializer.decls.iter_mut() {
                self.hoist_variable_declaration(variable.name.as_ident().unwrap());
            }

            let variables = self.get_initialized_variables(initializer);

            node.init = if variables.is_empty() {
                None
            } else {
                Some(VarDeclOrExpr::VarDecl(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: variables
                        .into_iter()
                        .map(|v| self.transform_initialized_variable(v.take()))
                        .collect(),
                    declare: Default::default(),
                }))
            };
            node.test.visit_mut_with(self);
            node.update.visit_mut_with(self);
            node.body.visit_mut_with(self);
        } else {
            node.visit_mut_children_with(self);
        }

        if self.in_statement_containing_yield {
            self.end_loop_block();
        }
    }

    fn visit_mut_do_while_stmt(&mut self, node: &mut DoWhileStmt) {
        if self.in_statement_containing_yield {
            self.begin_script_loop_block();
            node.visit_mut_children_with(self);
            self.end_loop_block();
        } else {
            node.visit_mut_children_with(self);
        }
    }

    fn visit_mut_while_stmt(&mut self, node: &mut WhileStmt) {
        if self.in_statement_containing_yield {
            self.begin_script_loop_block();
            node.visit_mut_children_with(self);
            self.end_loop_block();
        } else {
            node.visit_mut_children_with(self);
        }
    }

    fn visit_mut_return_stmt(&mut self, node: &mut ReturnStmt) {
        node.arg.visit_mut_with(self);

        *node = self.create_inline_return(node.arg.take(), Some(node.span));
    }

    fn visit_mut_switch_stmt(&mut self, node: &mut SwitchStmt) {
        if self.in_statement_containing_yield {
            self.begin_script_switch_block();
        }

        node.visit_mut_children_with(self);

        if self.in_statement_containing_yield {
            self.end_switch_block();
        }
    }

    fn visit_mut_labeled_stmt(&mut self, node: &mut LabeledStmt) {
        if self.in_statement_containing_yield {
            self.begin_script_labeled_block(node.label.sym.clone());
        }

        node.visit_mut_children_with(self);

        if self.in_statement_containing_yield {
            self.end_labeled_block();
        }
    }

    // TODO(kdy1):
    // fn visit_mut_array_lit(&mut self, node: &mut ArrayLit) {
    //     self.visit_elements(&mut node.elems, None, None);
    // }

    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        match node {
            Stmt::Break(b) => {
                if self.in_statement_containing_yield {
                    let label = self.find_break_target(b.label.as_ref().map(|l| l.sym.clone()));
                    if label.0 > 0 {
                        *node = Stmt::Return(self.create_inline_break(label, Some(b.span)));
                        return;
                    }
                }

                node.visit_mut_children_with(self);
            }
            Stmt::Continue(s) => {
                if self.in_statement_containing_yield {
                    let label = self.find_continue_target(s.label.as_ref().map(|l| l.sym.clone()));
                    if label.0 > 0 {
                        *node = self.create_inline_break(label, Some(s.span)).into();
                        return;
                    }
                }

                node.visit_mut_children_with(self);
            }
            _ => {
                node.visit_mut_children_with(self);
            }
        }
    }
}

impl Generator {
    // function transformSourceFile(node: SourceFile) {
    //     if (
    //         node.isDeclarationFile ||
    //         (node.transformFlags & TransformFlags.ContainsGenerator) === 0
    //     ) {
    //         return node;
    //     }

    //     const visited = visitEachChild(node, visitor, context);
    //     addEmitHelpers(visited, context.readEmitHelpers());
    //     return visited;
    // }

    // /**
    //  * Visits a node.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitor(node: Node): VisitResult<Node> {
    //     const transformFlags = node.transformFlags;
    //     if (inStatementContainingYield) {
    //         return visitJavaScriptInStatementContainingYield(node);
    //     } else if (inGeneratorFunctionBody) {
    //         return visitJavaScriptInGeneratorFunctionBody(node);
    //     } else if (isFunctionLikeDeclaration(node) && node.asteriskToken) {
    //         return visitGenerator(node);
    //     } else if (transformFlags & TransformFlags.ContainsGenerator) {
    //         return visitEachChild(node, visitor, context);
    //     } else {
    //         return node;
    //     }
    // }

    // /**
    //  * Visits a node that is contained within a statement that contains yield.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitJavaScriptInStatementContainingYield(
    //     node: Node
    // ): VisitResult<Node> {
    //     switch (node.kind) {
    //         case SyntaxKind.DoStatement:
    //             return visitDoStatement(node as DoStatement);
    //         case SyntaxKind.WhileStatement:
    //             return visitWhileStatement(node as WhileStatement);
    //         case SyntaxKind.SwitchStatement:
    //             return visitSwitchStatement(node as SwitchStatement);
    //         case SyntaxKind.LabeledStatement:
    //             return visitLabeledStatement(node as LabeledStatement);
    //         default:
    //             return visitJavaScriptInGeneratorFunctionBody(node);
    //     }
    // }

    // /**
    //  * Visits a node that is contained within a generator function.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitJavaScriptInGeneratorFunctionBody(
    //     node: Node
    // ): VisitResult<Node> {
    //     switch (node.kind) {
    //         case SyntaxKind.FunctionDeclaration:
    //             return visitFunctionDeclaration(node as FunctionDeclaration);
    //         case SyntaxKind.FunctionExpression:
    //             return visitFunctionExpression(node as FunctionExpression);
    //         case SyntaxKind.GetAccessor:
    //         case SyntaxKind.SetAccessor:
    //             return visitAccessorDeclaration(node as AccessorDeclaration);
    //         case SyntaxKind.VariableStatement:
    //             return visitVariableStatement(node as VariableStatement);
    //         case SyntaxKind.ForStatement:
    //             return visitForStatement(node as ForStatement);
    //         case SyntaxKind.ForInStatement:
    //             return visitForInStatement(node as ForInStatement);
    //         case SyntaxKind.BreakStatement:
    //             return visitBreakStatement(node as BreakStatement);
    //         case SyntaxKind.ContinueStatement:
    //             return visitContinueStatement(node as ContinueStatement);
    //         case SyntaxKind.ReturnStatement:
    //             return visitReturnStatement(node as ReturnStatement);
    //         default:
    //             if (node.transformFlags & TransformFlags.ContainsYield) {
    //                 return visitJavaScriptContainingYield(node);
    //             } else if (
    //                 node.transformFlags &
    //                 (TransformFlags.ContainsGenerator |
    //                     TransformFlags.ContainsHoistedDeclarationOrCompletion)
    //             ) {
    //                 return visitEachChild(node, visitor, context);
    //             } else {
    //                 return node;
    //             }
    //     }
    // }

    // /**
    //  * Visits a node that contains a YieldExpression.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitJavaScriptContainingYield(node: Node): VisitResult<Node> {
    //     switch (node.kind) {
    //         case SyntaxKind.BinaryExpression:
    //             return visitBinaryExpression(node as BinaryExpression);
    //         case SyntaxKind.CommaListExpression:
    //             return visitCommaListExpression(node as CommaListExpression);
    //         case SyntaxKind.ConditionalExpression:
    //             return visitConditionalExpression(
    //                 node as ConditionalExpression
    //             );
    //         case SyntaxKind.YieldExpression:
    //             return visitYieldExpression(node as YieldExpression);
    //         case SyntaxKind.ArrayLiteralExpression:
    //             return visitArrayLiteralExpression(
    //                 node as ArrayLiteralExpression
    //             );
    //         case SyntaxKind.ObjectLiteralExpression:
    //             return visitObjectLiteralExpression(
    //                 node as ObjectLiteralExpression
    //             );
    //         case SyntaxKind.ElementAccessExpression:
    //             return visitElementAccessExpression(
    //                 node as ElementAccessExpression
    //             );
    //         case SyntaxKind.CallExpression:
    //             return visitCallExpression(node as CallExpression);
    //         case SyntaxKind.NewExpression:
    //             return visitNewExpression(node as NewExpression);
    //         default:
    //             return visitEachChild(node, visitor, context);
    //     }
    // }

    // /**
    //  * Visits a generator function.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitGenerator(node: Node): VisitResult<Node> {
    //     switch (node.kind) {
    //         case SyntaxKind.FunctionDeclaration:
    //             return visitFunctionDeclaration(node as FunctionDeclaration);

    //         case SyntaxKind.FunctionExpression:
    //             return visitFunctionExpression(node as FunctionExpression);

    //         default:
    //             return Debug.failBadSyntaxKind(node);
    //     }
    // }

    // /**
    //  * Visits a function declaration.
    //  *
    //  * This will be called when one of the following conditions are met:
    //  * - The function declaration is a generator function.
    //  * - The function declaration is contained within the body of a generator
    //    function.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitFunctionDeclaration(
    //     node: FunctionDeclaration
    // ): Statement | undefined {
    //     // Currently, we only support generators that were originally async
    // functions.     if (node.asteriskToken) {
    //         node = setOriginalNode(
    //             setTextRange(
    //                 factory.createFunctionDeclaration(
    //                     node.modifiers,
    //                     /*asteriskToken*/ undefined,
    //                     node.name,
    //                     /*typeParameters*/ undefined,
    //                     visitParameterList(node.parameters, visitor, context),
    //                     /*type*/ undefined,
    //                     transformGeneratorFunctionBody(node.body!)
    //                 ),
    //                 /*location*/ node
    //             ),
    //             node
    //         );
    //     } else {
    //         const savedInGeneratorFunctionBody = inGeneratorFunctionBody;
    //         const savedInStatementContainingYield = inStatementContainingYield;
    //         inGeneratorFunctionBody = false;
    //         inStatementContainingYield = false;
    //         node = visitEachChild(node, visitor, context);
    //         inGeneratorFunctionBody = savedInGeneratorFunctionBody;
    //         inStatementContainingYield = savedInStatementContainingYield;
    //     }

    //     if (inGeneratorFunctionBody) {
    //         // Function declarations in a generator function body are hoisted
    //         // to the top of the lexical scope and elided from the current
    // statement.         hoistFunctionDeclaration(node);
    //         return undefined;
    //     } else {
    //         return node;
    //     }
    // }

    // /**
    //  * Visits a function expression.
    //  *
    //  * This will be called when one of the following conditions are met:
    //  * - The function expression is a generator function.
    //  * - The function expression is contained within the body of a generator
    //    function.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitFunctionExpression(node: FunctionExpression): Expression {
    //     // Currently, we only support generators that were originally async
    // functions.     if (node.asteriskToken) {
    //         node = setOriginalNode(
    //             setTextRange(
    //                 factory.createFunctionExpression(
    //                     /*modifiers*/ undefined,
    //                     /*asteriskToken*/ undefined,
    //                     node.name,
    //                     /*typeParameters*/ undefined,
    //                     visitParameterList(node.parameters, visitor, context),
    //                     /*type*/ undefined,
    //                     transformGeneratorFunctionBody(node.body)
    //                 ),
    //                 /*location*/ node
    //             ),
    //             node
    //         );
    //     } else {
    //         const savedInGeneratorFunctionBody = inGeneratorFunctionBody;
    //         const savedInStatementContainingYield = inStatementContainingYield;
    //         inGeneratorFunctionBody = false;
    //         inStatementContainingYield = false;
    //         node = visitEachChild(node, visitor, context);
    //         inGeneratorFunctionBody = savedInGeneratorFunctionBody;
    //         inStatementContainingYield = savedInStatementContainingYield;
    //     }

    //     return node;
    // }

    // /**
    //  * Visits a get or set accessor declaration.
    //  *
    //  * This will be called when one of the following conditions are met:
    //  * - The accessor is contained within the body of a generator function.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitAccessorDeclaration(node: AccessorDeclaration) {
    //     const savedInGeneratorFunctionBody = inGeneratorFunctionBody;
    //     const savedInStatementContainingYield = inStatementContainingYield;
    //     inGeneratorFunctionBody = false;
    //     inStatementContainingYield = false;
    //     node = visitEachChild(node, visitor, context);
    //     inGeneratorFunctionBody = savedInGeneratorFunctionBody;
    //     inStatementContainingYield = savedInStatementContainingYield;
    //     return node;
    // }

    // /**
    //  * Transforms the body of a generator function declaration.
    //  *
    //  * @param node The function body to transform.
    //  */
    // function transformGeneratorFunctionBody(body: Block) {
    //     // Save existing generator state
    //     const statements: Statement[] = [];
    //     const savedInGeneratorFunctionBody = inGeneratorFunctionBody;
    //     const savedInStatementContainingYield = inStatementContainingYield;
    //     const savedBlocks = blocks;
    //     const savedBlockOffsets = blockOffsets;
    //     const savedBlockActions = blockActions;
    //     const savedBlockStack = blockStack;
    //     const savedLabelOffsets = labelOffsets;
    //     const savedLabelExpressions = labelExpressions;
    //     const savedNextLabelId = nextLabelId;
    //     const savedOperations = operations;
    //     const savedOperationArguments = operationArguments;
    //     const savedOperationLocations = operationLocations;
    //     const savedState = state;

    //     // Initialize generator state
    //     inGeneratorFunctionBody = true;
    //     inStatementContainingYield = false;
    //     blocks = undefined;
    //     blockOffsets = undefined;
    //     blockActions = undefined;
    //     blockStack = undefined;
    //     labelOffsets = undefined;
    //     labelExpressions = undefined;
    //     nextLabelId = 1;
    //     operations = undefined;
    //     operationArguments = undefined;
    //     operationLocations = undefined;
    //     state = factory.createTempVariable(/*recordTempVariable*/ undefined);

    //     // Build the generator
    //     resumeLexicalEnvironment();

    //     const statementOffset = factory.copyPrologue(
    //         body.statements,
    //         statements,
    //         /*ensureUseStrict*/ false,
    //         visitor
    //     );

    //     transformAndEmitStatements(body.statements, statementOffset);

    //     const buildResult = build();
    //     insertStatementsAfterStandardPrologue(
    //         statements,
    //         endLexicalEnvironment()
    //     );
    //     statements.push(factory.createReturnStatement(buildResult));

    //     // Restore previous generator state
    //     inGeneratorFunctionBody = savedInGeneratorFunctionBody;
    //     inStatementContainingYield = savedInStatementContainingYield;
    //     blocks = savedBlocks;
    //     blockOffsets = savedBlockOffsets;
    //     blockActions = savedBlockActions;
    //     blockStack = savedBlockStack;
    //     labelOffsets = savedLabelOffsets;
    //     labelExpressions = savedLabelExpressions;
    //     nextLabelId = savedNextLabelId;
    //     operations = savedOperations;
    //     operationArguments = savedOperationArguments;
    //     operationLocations = savedOperationLocations;
    //     state = savedState;

    //     return setTextRange(
    //         factory.createBlock(statements, body.multiLine),
    //         body
    //     );
    // }

    // /**
    //  * Visits a variable statement.
    //  *
    //  * This will be called when one of the following conditions are met:
    //  * - The variable statement is contained within the body of a generator
    //    function.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitVariableStatement(
    //     node: VariableStatement
    // ): Statement | undefined {
    //     if (node.transformFlags & TransformFlags.ContainsYield) {
    //         transformAndEmitVariableDeclarationList(node.declarationList);
    //         return undefined;
    //     } else {
    //         // Do not hoist custom prologues.
    //         if (getEmitFlags(node) & EmitFlags.CustomPrologue) {
    //             return node;
    //         }

    //         for (const variable of node.declarationList.declarations) {
    //             hoistVariableDeclaration(variable.name as Identifier);
    //         }

    //         const variables = getInitializedVariables(node.declarationList);
    //         if (variables.length === 0) {
    //             return undefined;
    //         }

    //         return setSourceMapRange(
    //             factory.createExpressionStatement(
    //                 factory.inlineExpressions(
    //                     map(variables, transformInitializedVariable)
    //                 )
    //             ),
    //             node
    //         );
    //     }
    // }

    // /**
    //  * Visits a binary expression.
    //  *
    //  * This will be called when one of the following conditions are met:
    //  * - The node contains a YieldExpression.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitBinaryExpression(node: BinaryExpression): Expression {
    //     const assoc = getExpressionAssociativity(node);
    //     switch (assoc) {
    //         case Associativity.Left:
    //             return visitLeftAssociativeBinaryExpression(node);
    //         case Associativity.Right:
    //             return visitRightAssociativeBinaryExpression(node);
    //         default:
    //             return Debug.assertNever(assoc);
    //     }
    // }

    // /**
    //  * Visits a right-associative binary expression containing `yield`.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitRightAssociativeBinaryExpression(node: BinaryExpression) {
    //     const { left, right } = node;
    //     if (containsYield(right)) {
    //         let target: Expression;
    //         switch (left.kind) {
    //             case SyntaxKind.PropertyAccessExpression:
    //                 // [source]
    //                 //      a.b = yield;
    //                 //
    //                 // [intermediate]
    //                 //  .local _a
    //                 //      _a = a;
    //                 //  .yield resumeLabel
    //                 //  .mark resumeLabel
    //                 //      _a.b = %sent%;

    //                 target = factory.updatePropertyAccessExpression(
    //                     left as PropertyAccessExpression,
    //                     cacheExpression(
    //                         visitNode(
    //                             (left as PropertyAccessExpression).expression,
    //                             visitor,
    //                             isLeftHandSideExpression
    //                         )
    //                     ),
    //                     (left as PropertyAccessExpression).name
    //                 );
    //                 break;

    //             case SyntaxKind.ElementAccessExpression:
    //                 // [source]
    //                 //      a[b] = yield;
    //                 //
    //                 // [intermediate]
    //                 //  .local _a, _b
    //                 //      _a = a;
    //                 //      _b = b;
    //                 //  .yield resumeLabel
    //                 //  .mark resumeLabel
    //                 //      _a[_b] = %sent%;

    //                 target = factory.updateElementAccessExpression(
    //                     left as ElementAccessExpression,
    //                     cacheExpression(
    //                         visitNode(
    //                             (left as ElementAccessExpression).expression,
    //                             visitor,
    //                             isLeftHandSideExpression
    //                         )
    //                     ),
    //                     cacheExpression(
    //                         visitNode(
    //                             (left as ElementAccessExpression)
    //                                 .argumentExpression,
    //                             visitor,
    //                             isExpression
    //                         )
    //                     )
    //                 );
    //                 break;

    //             default:
    //                 target = visitNode(left, visitor, isExpression);
    //                 break;
    //         }

    //         const operator = node.operatorToken.kind;
    //         if (isCompoundAssignment(operator)) {
    //             return setTextRange(
    //                 factory.createAssignment(
    //                     target,
    //                     setTextRange(
    //                         factory.createBinaryExpression(
    //                             cacheExpression(target),
    //                             getNonAssignmentOperatorForCompoundAssignment(
    //                                 operator
    //                             ),
    //                             visitNode(right, visitor, isExpression)
    //                         ),
    //                         node
    //                     )
    //                 ),
    //                 node
    //             );
    //         } else {
    //             return factory.updateBinaryExpression(
    //                 node,
    //                 target,
    //                 node.operatorToken,
    //                 visitNode(right, visitor, isExpression)
    //             );
    //         }
    //     }

    //     return visitEachChild(node, visitor, context);
    // }

    // function visitLeftAssociativeBinaryExpression(node: BinaryExpression) {
    //     if (containsYield(node.right)) {
    //         if (isLogicalOperator(node.operatorToken.kind)) {
    //             return visitLogicalBinaryExpression(node);
    //         } else if (node.operatorToken.kind === SyntaxKind.CommaToken) {
    //             return visitCommaExpression(node);
    //         }

    //         // [source]
    //         //      a() + (yield) + c()
    //         //
    //         // [intermediate]
    //         //  .local _a
    //         //      _a = a();
    //         //  .yield resumeLabel
    //         //      _a + %sent% + c()

    //         return factory.updateBinaryExpression(
    //             node,
    //             cacheExpression(visitNode(node.left, visitor, isExpression)),
    //             node.operatorToken,
    //             visitNode(node.right, visitor, isExpression)
    //         );
    //     }

    //     return visitEachChild(node, visitor, context);
    // }

    // /**
    //  * Visits a comma expression containing `yield`.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitCommaExpression(node: BinaryExpression) {
    //     // [source]
    //     //      x = a(), yield, b();
    //     //
    //     // [intermediate]
    //     //      a();
    //     //  .yield resumeLabel
    //     //  .mark resumeLabel
    //     //      x = %sent%, b();

    //     let pendingExpressions: Expression[] = [];
    //     visit(node.left);
    //     visit(node.right);
    //     return factory.inlineExpressions(pendingExpressions);

    //     function visit(node: Expression) {
    //         if (
    //             isBinaryExpression(node) &&
    //             node.operatorToken.kind === SyntaxKind.CommaToken
    //         ) {
    //             visit(node.left);
    //             visit(node.right);
    //         } else {
    //             if (containsYield(node) && pendingExpressions.length > 0) {
    //                 emitWorker(OpCode.Statement, [
    //                     factory.createExpressionStatement(
    //                         factory.inlineExpressions(pendingExpressions)
    //                     ),
    //                 ]);
    //                 pendingExpressions = [];
    //             }

    //             pendingExpressions.push(visitNode(node, visitor, isExpression));
    //         }
    //     }
    // }

    // /**
    //  * Visits a comma-list expression.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitCommaListExpression(node: CommaListExpression) {
    //     // flattened version of `visitCommaExpression`
    //     let pendingExpressions: Expression[] = [];
    //     for (const elem of node.elements) {
    //         if (
    //             isBinaryExpression(elem) &&
    //             elem.operatorToken.kind === SyntaxKind.CommaToken
    //         ) {
    //             pendingExpressions.push(visitCommaExpression(elem));
    //         } else {
    //             if (containsYield(elem) && pendingExpressions.length > 0) {
    //                 emitWorker(OpCode.Statement, [
    //                     factory.createExpressionStatement(
    //                         factory.inlineExpressions(pendingExpressions)
    //                     ),
    //                 ]);
    //                 pendingExpressions = [];
    //             }
    //             pendingExpressions.push(visitNode(elem, visitor, isExpression));
    //         }
    //     }
    //     return factory.inlineExpressions(pendingExpressions);
    // }

    // /**
    //  * Visits a logical binary expression containing `yield`.
    //  *
    //  * @param node A node to visit.
    //  */
    // function visitLogicalBinaryExpression(node: BinaryExpression) {
    //     // Logical binary expressions (`&&` and `||`) are shortcutting
    // expressions and need     // to be transformed as such:
    //     //
    //     // [source]
    //     //      x = a() && yield;
    //     //
    //     // [intermediate]
    //     //  .local _a
    //     //      _a = a();
    //     //  .brfalse resultLabel, (_a)
    //     //  .yield resumeLabel
    //     //  .mark resumeLabel
    //     //      _a = %sent%;
    //     //  .mark resultLabel
    //     //      x = _a;
    //     //
    //     // [source]
    //     //      x = a() || yield;
    //     //
    //     // [intermediate]
    //     //  .local _a
    //     //      _a = a();
    //     //  .brtrue resultLabel, (_a)
    //     //  .yield resumeLabel
    //     //  .mark resumeLabel
    //     //      _a = %sent%;
    //     //  .mark resultLabel
    //     //      x = _a;

    //     const resultLabel = defineLabel();
    //     const resultLocal = declareLocal();

    //     emitAssignment(
    //         resultLocal,
    //         visitNode(node.left, visitor, isExpression),
    //         /*location*/ node.left
    //     );
    //     if (node.operatorToken.kind === SyntaxKind.AmpersandAmpersandToken) {
    //         // Logical `&&` shortcuts when the left-hand operand is falsey.
    //         emitBreakWhenFalse(
    //             resultLabel,
    //             resultLocal,
    //             /*location*/ node.left
    //         );
    //     } else {
    //         // Logical `||` shortcuts when the left-hand operand is truthy.
    //         emitBreakWhenTrue(resultLabel, resultLocal, /*location*/ node.left);
    //     }

    //     emitAssignment(
    //         resultLocal,
    //         visitNode(node.right, visitor, isExpression),
    //         /*location*/ node.right
    //     );
    //     markLabel(resultLabel);
    //     return resultLocal;
    // }

    // /**
    //  * Visits a conditional expression containing `yield`.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitConditionalExpression(
    //     node: ConditionalExpression
    // ): Expression {
    //     // [source]
    //     //      x = a() ? yield : b();
    //     //
    //     // [intermediate]
    //     //  .local _a
    //     //  .brfalse whenFalseLabel, (a())
    //     //  .yield resumeLabel
    //     //  .mark resumeLabel
    //     //      _a = %sent%;
    //     //  .br resultLabel
    //     //  .mark whenFalseLabel
    //     //      _a = b();
    //     //  .mark resultLabel
    //     //      x = _a;

    //     // We only need to perform a specific transformation if a `yield`
    // expression exists     // in either the `whenTrue` or `whenFalse`
    // branches.     // A `yield` in the condition will be handled by the normal
    // visitor.     if (containsYield(node.whenTrue) ||
    // containsYield(node.whenFalse)) {         const whenFalseLabel =
    // defineLabel();         const resultLabel = defineLabel();
    //         const resultLocal = declareLocal();
    //         emitBreakWhenFalse(
    //             whenFalseLabel,
    //             visitNode(node.condition, visitor, isExpression),
    //             /*location*/ node.condition
    //         );
    //         emitAssignment(
    //             resultLocal,
    //             visitNode(node.whenTrue, visitor, isExpression),
    //             /*location*/ node.whenTrue
    //         );
    //         emitBreak(resultLabel);
    //         markLabel(whenFalseLabel);
    //         emitAssignment(
    //             resultLocal,
    //             visitNode(node.whenFalse, visitor, isExpression),
    //             /*location*/ node.whenFalse
    //         );
    //         markLabel(resultLabel);
    //         return resultLocal;
    //     }

    //     return visitEachChild(node, visitor, context);
    // }

    // /**
    //  * Visits an array of expressions containing one or more YieldExpression
    //    nodes
    //  * and returns an expression for the resulting value.
    //  *
    //  * @param elements The elements to visit.
    //  * @param multiLine Whether array literals created should be emitted on
    //    multiple lines.
    //  */
    // function visitElements(
    //     elements: NodeArray<Expression>,
    //     leadingElement?: Expression,
    //     location?: TextRange,
    //     multiLine?: boolean
    // ) {
    //     // [source]
    //     //      ar = [1, yield, 2];
    //     //
    //     // [intermediate]
    //     //  .local _a
    //     //      _a = [1];
    //     //  .yield resumeLabel
    //     //  .mark resumeLabel
    //     //      ar = _a.concat([%sent%, 2]);

    //     const numInitialElements = countInitialNodesWithoutYield(elements);

    //     let temp: Identifier | undefined;
    //     if (numInitialElements > 0) {
    //         temp = declareLocal();
    //         const initialElements = visitNodes(
    //             elements,
    //             visitor,
    //             isExpression,
    //             0,
    //             numInitialElements
    //         );
    //         emitAssignment(
    //             temp,
    //             factory.createArrayLiteralExpression(
    //                 leadingElement
    //                     ? [leadingElement, ...initialElements]
    //                     : initialElements
    //             )
    //         );
    //         leadingElement = undefined;
    //     }

    //     const expressions = reduceLeft(
    //         elements,
    //         reduceElement,
    //         [] as Expression[],
    //         numInitialElements
    //     );
    //     return temp
    //         ? factory.createArrayConcatCall(temp, [
    //               factory.createArrayLiteralExpression(expressions, multiLine),
    //           ])
    //         : setTextRange(
    //               factory.createArrayLiteralExpression(
    //                   leadingElement
    //                       ? [leadingElement, ...expressions]
    //                       : expressions,
    //                   multiLine
    //               ),
    //               location
    //           );

    //     function reduceElement(expressions: Expression[], element: Expression) {
    //         if (containsYield(element) && expressions.length > 0) {
    //             const hasAssignedTemp = temp !== undefined;
    //             if (!temp) {
    //                 temp = declareLocal();
    //             }

    //             emitAssignment(
    //                 temp,
    //                 hasAssignedTemp
    //                     ? factory.createArrayConcatCall(temp, [
    //                           factory.createArrayLiteralExpression(
    //                               expressions,
    //                               multiLine
    //                           ),
    //                       ])
    //                     : factory.createArrayLiteralExpression(
    //                           leadingElement
    //                               ? [leadingElement, ...expressions]
    //                               : expressions,
    //                           multiLine
    //                       )
    //             );
    //             leadingElement = undefined;
    //             expressions = [];
    //         }

    //         expressions.push(visitNode(element, visitor, isExpression));
    //         return expressions;
    //     }
    // }

    // function visitObjectLiteralExpression(node: ObjectLiteralExpression) {
    //     // [source]
    //     //      o = {
    //     //          a: 1,
    //     //          b: yield,
    //     //          c: 2
    //     //      };
    //     //
    //     // [intermediate]
    //     //  .local _a
    //     //      _a = {
    //     //          a: 1
    //     //      };
    //     //  .yield resumeLabel
    //     //  .mark resumeLabel
    //     //      o = (_a.b = %sent%,
    //     //          _a.c = 2,
    //     //          _a);

    //     const properties = node.properties;
    //     const multiLine = node.multiLine;
    //     const numInitialProperties = countInitialNodesWithoutYield(properties);

    //     const temp = declareLocal();
    //     emitAssignment(
    //         temp,
    //         factory.createObjectLiteralExpression(
    //             visitNodes(
    //                 properties,
    //                 visitor,
    //                 isObjectLiteralElementLike,
    //                 0,
    //                 numInitialProperties
    //             ),
    //             multiLine
    //         )
    //     );

    //     const expressions = reduceLeft(
    //         properties,
    //         reduceProperty,
    //         [] as Expression[],
    //         numInitialProperties
    //     );
    //     // TODO(rbuckton): Does this need to be parented?
    //     expressions.push(
    //         multiLine
    //             ? startOnNewLine(
    //                   setParent(
    //                       setTextRange(factory.cloneNode(temp), temp),
    //                       temp.parent
    //                   )
    //               )
    //             : temp
    //     );
    //     return factory.inlineExpressions(expressions);

    //     function reduceProperty(
    //         expressions: Expression[],
    //         property: ObjectLiteralElementLike
    //     ) {
    //         if (containsYield(property) && expressions.length > 0) {
    //             emitStatement(
    //                 factory.createExpressionStatement(
    //                     factory.inlineExpressions(expressions)
    //                 )
    //             );
    //             expressions = [];
    //         }

    //         const expression = createExpressionForObjectLiteralElementLike(
    //             factory,
    //             node,
    //             property,
    //             temp
    //         );
    //         const visited = visitNode(expression, visitor, isExpression);
    //         if (visited) {
    //             if (multiLine) {
    //                 startOnNewLine(visited);
    //             }
    //             expressions.push(visited);
    //         }
    //         return expressions;
    //     }
    // }

    // /**
    //  * Visits an ElementAccessExpression that contains a YieldExpression.
    //  *
    //  * @param node The node to visit.
    //  */
    // function visitElementAccessExpression(node: ElementAccessExpression) {
    //     if (containsYield(node.argumentExpression)) {
    //         // [source]
    //         //      a = x[yield];
    //         //
    //         // [intermediate]
    //         //  .local _a
    //         //      _a = x;
    //         //  .yield resumeLabel
    //         //  .mark resumeLabel
    //         //      a = _a[%sent%]

    //         return factory.updateElementAccessExpression(
    //             node,
    //             cacheExpression(
    //                 visitNode(
    //                     node.expression,
    //                     visitor,
    //                     isLeftHandSideExpression
    //                 )
    //             ),
    //             visitNode(node.argumentExpression, visitor, isExpression)
    //         );
    //     }

    //     return visitEachChild(node, visitor, context);
    // }

    // function visitNewExpression(node: NewExpression) {
    //     if (forEach(node.arguments, containsYield)) {
    //         // [source]
    //         //      new a.b(1, yield, 2);
    //         //
    //         // [intermediate]
    //         //  .local _a, _b, _c
    //         //      _b = (_a = a.b).bind;
    //         //      _c = [1];
    //         //  .yield resumeLabel
    //         //  .mark resumeLabel
    //         //      new (_b.apply(_a, _c.concat([%sent%, 2])));

    //         const { target, thisArg } = factory.createCallBinding(
    //             factory.createPropertyAccessExpression(node.expression, "bind"),
    //             hoistVariableDeclaration
    //         );
    //         return setOriginalNode(
    //             setTextRange(
    //                 factory.createNewExpression(
    //                     factory.createFunctionApplyCall(
    //                         cacheExpression(
    //                             visitNode(target, visitor, isExpression)
    //                         ),
    //                         thisArg,
    //                         visitElements(
    //                             node.arguments!,
    //                             /*leadingElement*/ factory.createVoidZero()
    //                         )
    //                     ),
    //                     /*typeArguments*/ undefined,
    //                     []
    //                 ),
    //                 node
    //             ),
    //             node
    //         );
    //     }
    //     return visitEachChild(node, visitor, context);
    // }

    fn transform_and_emit_stmts(&mut self, stmts: Vec<Stmt>, start: usize) {
        for s in stmts.into_iter().skip(start) {
            self.transform_and_emit_stmt(s);
        }
    }

    fn transform_and_emit_embedded_stmt(&mut self, node: Stmt) {
        if let Stmt::Block(block) = node {
            self.transform_and_emit_stmts(block.stmts, 0);
        } else {
            self.transform_and_emit_stmt(node);
        }
    }

    fn transform_and_emit_stmt(&mut self, node: Stmt) {
        let saved_in_statement_containing_yield = self.in_statement_containing_yield;
        if !self.in_statement_containing_yield {
            self.in_statement_containing_yield = contains_yield(&node);
        }

        self.transform_and_emit_stmt_worker(node);
        self.in_statement_containing_yield = saved_in_statement_containing_yield;
    }

    fn transform_and_emit_stmt_worker(&mut self, mut node: Stmt) {
        match node {
            Stmt::Block(s) => self.transform_and_emit_block(s),
            Stmt::Expr(s) => self.transform_and_emit_expr_stmt(s),
            Stmt::If(s) => self.transform_and_emit_if_stmt(s),
            Stmt::DoWhile(s) => self.transform_and_emit_do_stmt(s),
            Stmt::While(s) => self.transform_and_emit_while_stmt(s),
            Stmt::For(s) => self.transform_and_emit_for_stmt(s),
            Stmt::ForIn(s) => self.transform_and_emit_for_in_stmt(s),
            Stmt::Continue(s) => self.transform_and_emit_continue_stmt(s),
            Stmt::Break(s) => self.transform_and_emit_break_stmt(s),
            Stmt::Return(s) => self.transform_and_emit_return_stmt(s),
            Stmt::With(s) => self.transform_and_emit_with_stmt(s),
            Stmt::Switch(s) => self.transform_and_emit_switch_stmt(s),
            Stmt::Labeled(s) => self.transform_and_emit_labeled_stmt(s),
            Stmt::Throw(s) => self.transform_and_emit_throw_stmt(s),
            Stmt::Try(s) => self.transform_and_emit_try_stmt(s),
            _ => {
                node.visit_mut_with(self);

                self.emit_stmt(node);
            }
        }
    }

    fn transform_and_emit_block(&mut self, mut node: BlockStmt) {
        if contains_yield(&node) {
            self.transform_and_emit_stmts(node.stmts, 0);
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::Block(node));
        }
    }

    fn transform_and_emit_expr_stmt(&mut self, mut node: ExprStmt) {
        node.visit_mut_with(self);

        self.emit_stmt(Stmt::Expr(node));
    }

    fn transform_and_emit_var_decl_list(&mut self, mut node: VarDecl) {
        for variable in &node.decls {
            self.hoist_variable_declaration(variable.name.as_ident().unwrap());
        }

        let var_len = node.decls.len();
        let mut variables = self.get_initialized_variables(&mut node);
        let mut variables_written = 0;
        let mut pending_expressions = vec![];

        while variables_written < var_len {
            for (i, variable) in variables.iter_mut().enumerate() {
                if contains_yield(&**variable) && !pending_expressions.is_empty() {
                    break;
                }

                pending_expressions.extend(variable.init.take());
            }

            if !pending_expressions.is_empty() {
                variables_written += pending_expressions.len();

                self.emit_stmt(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: if pending_expressions.len() == 1 {
                        pending_expressions.pop().unwrap()
                    } else {
                        Box::new(Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs: take(&mut pending_expressions),
                        }))
                    },
                }))
            }
        }
    }

    fn transform_initialized_variable(&mut self, mut node: VarDeclarator) -> VarDeclarator {
        node.init.visit_mut_with(self);

        node
    }

    fn transform_and_emit_if_stmt(&mut self, mut node: IfStmt) {
        if contains_yield(&node) {
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

            if contains_yield(&node.cons) || contains_yield(&node.alt) {
                let end_label = self.define_label();
                let else_label = node.alt.as_ref().map(|_| self.define_label());

                node.test.visit_mut_with(self);
                let span = node.test.span();
                self.emit_break_when_false(else_label.unwrap_or(end_label), node.test, Some(span));

                self.transform_and_emit_embedded_stmt(*node.cons);

                if let Some(alt) = node.alt {
                    self.emit_break(end_label, None);
                    self.mark_label(else_label.unwrap());
                    self.transform_and_emit_embedded_stmt(*alt);
                }
                self.mark_label(end_label);
            } else {
                node.visit_mut_with(self);
                self.emit_stmt(Stmt::If(node));
            }
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::If(node));
        }
    }

    fn transform_and_emit_do_stmt(&mut self, mut node: DoWhileStmt) {
        if contains_yield(&node) {
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

            let condition_label = self.define_label();
            let loop_label = self.define_label();

            self.begin_loop_block(condition_label);
            self.mark_label(loop_label);
            self.transform_and_emit_embedded_stmt(*node.body);
            self.mark_label(condition_label);
            node.test.visit_mut_with(self);
            let span = node.test.span();
            self.emit_break_when_true(loop_label, node.test, Some(span));
            self.end_loop_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::DoWhile(node));
        }
    }

    fn transform_and_emit_while_stmt(&mut self, mut node: WhileStmt) {
        if contains_yield(&node) {
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

            let loop_label = self.define_label();
            let end_label = self.begin_loop_block(loop_label);
            self.mark_label(loop_label);
            node.test.visit_mut_with(self);
            self.emit_break_when_false(end_label, node.test, None);
            self.transform_and_emit_stmt(*node.body);
            self.emit_break(loop_label, None);
            self.end_loop_block();
        } else {
            self.emit_stmt(Stmt::While(node));
        }
    }

    fn transform_and_emit_for_stmt(&mut self, mut node: ForStmt) {
        if contains_yield(&node) {
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

            let condition_label = self.define_label();
            let increment_label = self.define_label();
            let end_label = self.begin_loop_block(increment_label);

            if let Some(init) = node.init {
                match init {
                    VarDeclOrExpr::VarDecl(init) => {
                        self.transform_and_emit_var_decl_list(init);
                    }
                    VarDeclOrExpr::Expr(mut init) => {
                        init.visit_mut_with(self);
                        self.emit_stmt(Stmt::Expr(ExprStmt {
                            span: init.span(),
                            expr: init,
                        }));
                    }
                }
            }

            self.mark_label(condition_label);

            if let Some(mut cond) = node.test {
                cond.visit_mut_with(self);
                self.emit_break_when_false(end_label, cond, None);
            }

            self.transform_and_emit_embedded_stmt(*node.body);

            self.mark_label(increment_label);

            if let Some(mut incrementor) = node.update {
                incrementor.visit_mut_with(self);

                self.emit_stmt(Stmt::Expr(ExprStmt {
                    span: incrementor.span(),
                    expr: incrementor,
                }));
            }

            self.emit_break(condition_label, None);
            self.end_loop_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::For(node));
        }
    }

    fn transform_and_emit_for_in_stmt(&mut self, mut node: ForInStmt) {
        if contains_yield(&node) {
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

            let keys_array = self.declare_local(None);
            let key = self.declare_local(None);
            let keys_index = private_ident!("_i");

            self.hoist_variable_declaration(&keys_index);

            self.emit_assignment(
                PatOrExpr::Pat(keys_array.clone().into()),
                Box::new(ArrayLit { ..Take::dummy() }.into()),
                None,
            );

            node.right.visit_mut_with(self);
            self.emit_stmt(Stmt::ForIn(ForInStmt {
                span: DUMMY_SP,
                left: VarDeclOrPat::Pat(key.clone().into()),
                right: node.right.take(),
                body: Box::new(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: keys_array
                            .clone()
                            .make_member(quote_ident!("push"))
                            .as_callee(),
                        args: vec![key.as_arg()],
                        type_args: Default::default(),
                    })),
                })),
            }));

            self.emit_assignment(PatOrExpr::Pat(keys_index.clone().into()), 0.into(), None);

            let condition_label = self.define_label();
            let increment_label = self.define_label();
            let end_label = self.begin_loop_block(increment_label);

            self.mark_label(condition_label);
            self.emit_break_when_false(
                end_label,
                Box::new(keys_index.clone().make_bin(
                    op!("<"),
                    keys_array.clone().make_member(quote_ident!("length")),
                )),
                None,
            );

            let variable;

            match node.left {
                VarDeclOrPat::VarDecl(initializer) => {
                    for variable in initializer.decls.iter() {
                        self.hoist_variable_declaration(variable.name.as_ident().unwrap());
                    }

                    variable = initializer.decls[0].name.clone();
                }
                VarDeclOrPat::Pat(mut initializer) => {
                    initializer.visit_mut_with(self);
                    variable = initializer;
                }
            }

            self.emit_assignment(
                PatOrExpr::Pat(Box::new(variable)),
                Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(keys_array.into()),
                    prop: MemberProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: Box::new(keys_index.clone().into()),
                    }),
                })),
                None,
            );
            self.transform_and_emit_embedded_stmt(*node.body);

            self.mark_label(increment_label);
            self.emit_stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Update(UpdateExpr {
                    span: DUMMY_SP,
                    prefix: false,
                    op: op!("++"),
                    arg: Box::new(keys_index.clone().into()),
                })),
            }));

            self.emit_break(condition_label, None);
            self.end_loop_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::ForIn(node));
        }
    }

    // function visitForInStatement(node: ForInStatement) {
    //     // [source]
    //     //      for (var x in a) {
    //     //          /*body*/
    //     //      }
    //     //
    //     // [intermediate]
    //     //  .local x
    //     //  .loop
    //     //      for (x in a) {
    //     //          /*body*/
    //     //      }
    //     //  .endloop

    //     if (inStatementContainingYield) {
    //         beginScriptLoopBlock();
    //     }

    //     const initializer = node.initializer;
    //     if (isVariableDeclarationList(initializer)) {
    //         for (const variable of initializer.declarations) {
    //             hoistVariableDeclaration(variable.name as Identifier);
    //         }

    //         node = factory.updateForInStatement(
    //             node,
    //             initializer.declarations[0].name as Identifier,
    //             visitNode(node.expression, visitor, isExpression),
    //             visitNode(
    //                 node.statement,
    //                 visitor,
    //                 isStatement,
    //                 factory.liftToBlock
    //             )
    //         );
    //     } else {
    //         node = visitEachChild(node, visitor, context);
    //     }

    //     if (inStatementContainingYield) {
    //         endLoopBlock();
    //     }

    //     return node;
    // }

    fn transform_and_emit_continue_stmt(&mut self, node: ContinueStmt) {
        let label = self.find_continue_target(node.label.as_ref().map(|l| l.sym.clone()));
        if label.0 > 0 {
            self.emit_break(label, Some(node.span));
        } else {
            // invalid continue without a containing loop. Leave the node as is,
            // per #17875.
            self.emit_stmt(Stmt::Continue(node))
        }
    }

    fn transform_and_emit_break_stmt(&mut self, node: BreakStmt) {
        let label = self.find_break_target(node.label.as_ref().map(|l| l.sym.clone()));
        if label.0 > 0 {
            self.emit_break(label, Some(node.span));
        } else {
            // invalid break without a containing loop. Leave the node as is,
            // per #17875.
            self.emit_stmt(Stmt::Break(node))
        }
    }

    fn transform_and_emit_return_stmt(&mut self, mut s: ReturnStmt) {
        s.arg.visit_mut_with(self);
        self.emit_return(s.arg, Some(s.span))
    }

    fn transform_and_emit_with_stmt(&mut self, mut node: WithStmt) {
        if contains_yield(&node) {
            // [source]
            //      with (x) {
            //          /*body*/
            //      }
            //
            // [intermediate]
            //  .with (x)
            //      /*body*/
            //  .endwith

            node.obj.visit_mut_with(self);
            let obj = self.cache_expression(node.obj);
            self.begin_with_block(obj);
            self.transform_and_emit_embedded_stmt(*node.body);
            self.end_with_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::With(node));
        }
    }

    fn transform_and_emit_switch_stmt(&mut self, mut node: SwitchStmt) {
        if contains_yield(&node) {
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

            let end_label = self.begin_switch_block();
            node.discriminant.visit_mut_with(self);
            let expression = self.cache_expression(node.discriminant);

            // Create labels for each clause and find the index of the first
            // default clause.

            let mut clause_labels = Vec::new();
            let mut default_clause_index = -1i32;

            for (i, clause) in node.cases.iter().enumerate() {
                clause_labels.push(self.define_label());
                if clause.test.is_none() && default_clause_index == -1 {
                    default_clause_index = i as _;
                }
            }

            // Emit switch statements for each run of case clauses either from
            // the first case clause or the next case clause with a
            // `yield` in its expression, up to the next case clause
            // with a `yield` in its expression.
            let mut clauses_written = 0;
            let mut pending_clauses = vec![];

            while clauses_written < node.cases.len() {
                let mut default_clauses_skipped = 0;

                for (i, clause) in node.cases.iter_mut().enumerate() {
                    if clause.test.is_some() {
                        if contains_yield(&clause.test) && !pending_clauses.is_empty() {
                            break;
                        }

                        clause.test.visit_mut_with(self);
                        let span = clause.test.span();
                        pending_clauses.push(SwitchCase {
                            span: DUMMY_SP,
                            test: clause.test.take(),
                            cons: vec![self
                                .create_inline_break(clause_labels[i], Some(span))
                                .into()],
                        })
                    } else {
                        default_clauses_skipped += 1;
                    }
                }

                if !pending_clauses.is_empty() {
                    clauses_written += pending_clauses.len();
                    self.emit_stmt(Stmt::Switch(SwitchStmt {
                        span: DUMMY_SP,
                        discriminant: Box::new(Expr::Ident(expression.clone())),
                        cases: take(&mut pending_clauses),
                    }));
                }

                if default_clauses_skipped > 0 {
                    clauses_written += default_clauses_skipped;
                    default_clauses_skipped = 0;
                }
            }

            if default_clause_index >= 0 {
                self.emit_break(clause_labels[default_clause_index as usize], None);
            } else {
                self.emit_break(end_label, None);
            }

            for (i, clause) in node.cases.into_iter().enumerate() {
                self.mark_label(clause_labels[i]);
                self.transform_and_emit_stmts(clause.cons, 0);
            }

            self.end_switch_block()
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::Switch(node))
        }
    }

    fn transform_and_emit_labeled_stmt(&mut self, mut node: LabeledStmt) {
        if contains_yield(&node) {
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
            self.begin_labeled_block(node.label.sym);
            self.transform_and_emit_embedded_stmt(*node.body);
            self.end_labeled_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::Labeled(node));
        }
    }

    fn transform_and_emit_throw_stmt(&mut self, mut node: ThrowStmt) {
        node.arg.visit_mut_with(self);
        self.emit_throw(node.arg, Some(node.span))
    }

    fn transform_and_emit_try_stmt(&mut self, mut node: TryStmt) {
        if contains_yield(&node) {
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

            self.begin_exception_block();
            self.transform_and_emit_embedded_stmt(Stmt::Block(node.block));
            if let Some(catch) = node.handler {
                self.begin_catch_block(VarDeclarator {
                    name: catch.param.clone().unwrap(),
                    ..Take::dummy()
                });
                self.transform_and_emit_embedded_stmt(Stmt::Block(catch.body));
            }

            if let Some(finalizer) = node.finalizer {
                self.begin_finally_block();
                self.transform_and_emit_embedded_stmt(Stmt::Block(finalizer));
            }

            self.end_exception_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(Stmt::Try(node));
        }
    }

    // function countInitialNodesWithoutYield(nodes: NodeArray<Node>) {
    //     const numNodes = nodes.length;
    //     for (let i = 0; i < numNodes; i++) {
    //         if (containsYield(nodes[i])) {
    //             return i;
    //         }
    //     }

    //     return -1;
    // }

    // function onSubstituteNode(hint: EmitHint, node: Node): Node {
    //     node = previousOnSubstituteNode(hint, node);
    //     if (hint === EmitHint.Expression) {
    //         return substituteExpression(node as Expression);
    //     }
    //     return node;
    // }

    // function substituteExpression(node: Expression): Expression {
    //     if (isIdentifier(node)) {
    //         return substituteExpressionIdentifier(node);
    //     }
    //     return node;
    // }

    // function substituteExpressionIdentifier(node: Identifier) {
    //     if (
    //         !isGeneratedIdentifier(node) &&
    //         renamedCatchVariables &&
    //         renamedCatchVariables.has(idText(node))
    //     ) {
    //         const original = getOriginalNode(node);
    //         if (isIdentifier(original) && original.parent) {
    //             const declaration =
    //                 resolver.getReferencedValueDeclaration(original);
    //             if (declaration) {
    //                 const name =
    //                     renamedCatchVariableDeclarations[
    //                         getOriginalNodeId(declaration)
    //                     ];
    //                 if (name) {
    //                     // TODO(rbuckton): Does this need to be parented?
    //                     const clone = setParent(
    //                         setTextRange(factory.cloneNode(name), name),
    //                         name.parent
    //                     );
    //                     setSourceMapRange(clone, node);
    //                     setCommentRange(clone, node);
    //                     return clone;
    //                 }
    //             }
    //         }
    //     }

    //     return node;
    // }

    fn cache_expression(&mut self, node: Box<Expr>) -> Ident {
        match *node {
            Expr::Ident(i) => i,
            _ => {
                let span = node.span();

                let temp = self.create_temp_variable();
                self.emit_assignment(PatOrExpr::Pat(temp.clone().into()), node, Some(span));
                temp
            }
        }
    }

    fn declare_local(&mut self, name: Option<JsWord>) -> Ident {
        let temp = name
            .map(|name| private_ident!(name))
            .unwrap_or_else(|| private_ident!("_tmp"));

        self.hoist_variable_declaration(&temp);
        temp
    }

    /// Defines a label, uses as the target of a Break operation.
    fn define_label(&mut self) -> Label {
        if self.label_offsets.is_none() {
            self.label_offsets = Some(Default::default());
        }

        debug_assert_eq!(
            self.label_offsets.as_ref().unwrap().len(),
            self.next_label_id
        );
        let label = Label(self.next_label_id as _);
        self.next_label_id += 1;
        self.label_offsets.as_mut().unwrap().push(-1);
        label
    }

    /// Marks the current operation with the specified label.
    fn mark_label(&mut self, label: Label) {
        debug_assert!(self.label_offsets.is_some(), "No labels were defined.");
        self.label_offsets.as_mut().unwrap()[label.0 as usize] =
            self.operations.as_deref().map_or(0, |v| v.len() as _);
    }

    //// Begins a block operation (With, Break/Continue, Try/Catch/Finally)
    ///
    /// - `block`: Information about the block.
    fn begin_block(&mut self, block: CodeBlock) -> Ptr<CodeBlock> {
        if self.blocks.is_none() {
            self.blocks = Some(Default::default());
            self.block_actions = Some(Default::default());
            self.block_offsets = Some(Default::default());
            self.block_stack = Some(Default::default());
        }

        let index = self.block_actions.as_ref().unwrap().len();

        #[cfg(debug_assertions)]
        if cfg!(debug_assertions) {
            debug!("Begin block {}: {:?}", index, block);
        }

        let block = Rc::new(RefCell::new(block));

        self.block_actions.as_mut().unwrap().push(BlockAction::Open);
        self.block_offsets
            .as_mut()
            .unwrap()
            .push(self.operations.as_ref().map_or(0, |v| v.len()));
        self.blocks.as_mut().unwrap().push(block.clone());
        self.block_stack.as_mut().unwrap().push(block.clone());

        block
    }

    /// Ends the current block operation.
    fn end_block(&mut self) -> Ptr<CodeBlock> {
        let block = self.peek_block().expect("beginBlock was never called.");

        let index = self.block_actions.as_ref().unwrap().len();

        #[cfg(debug_assertions)]
        debug!("End block {}", index);

        self.block_actions
            .as_mut()
            .unwrap()
            .push(BlockAction::Close);
        self.block_offsets
            .as_mut()
            .unwrap()
            .push(self.operations.as_ref().map_or(0, |v| v.len()));
        self.blocks.as_mut().unwrap().push(block.clone());
        self.block_stack.as_mut().unwrap().pop();
        block
    }

    /// Gets the current open block.
    fn peek_block(&self) -> Option<Ptr<CodeBlock>> {
        self.block_stack.as_ref().and_then(|v| v.last().cloned())
    }

    /// Gets the kind of the current open block.
    fn peek_block_kind(&self) -> Option<CodeBlockKind> {
        self.peek_block().map(|b| match &*b.borrow() {
            CodeBlock::With(..) => CodeBlockKind::With,
            CodeBlock::Exception(..) => CodeBlockKind::Exception,
            CodeBlock::Labeled(..) => CodeBlockKind::Labeled,
            CodeBlock::Switch(..) => CodeBlockKind::Switch,
            CodeBlock::Loop(..) => CodeBlockKind::Loop,
        })
    }

    /// Begins a code block for a generated `with` statement.
    ///
    /// - `expression`: An identifier representing expression for the `with`
    fn begin_with_block(&mut self, expr: Ident) {
        let start_label = self.define_label();
        let end_label = self.define_label();
        self.mark_label(start_label);
        self.begin_block(CodeBlock::With(WithBlock {
            expression: expr,
            start_label,
            end_label,
        }));
    }

    /// Ends a code block for a generated `with` statement.
    fn end_with_block(&mut self) {
        debug_assert!(self.peek_block_kind() == Some(CodeBlockKind::With));
        let block = self.end_block();
        let b = block.borrow();
        if let CodeBlock::With(block) = &*b {
            self.mark_label(block.end_label);
        }
    }

    /// Begins a code block for a generated `try` statement.
    fn begin_exception_block(&mut self) -> Label {
        let start_label = self.define_label();
        let end_label = self.define_label();
        self.mark_label(start_label);
        self.begin_block(CodeBlock::Exception(ExceptionBlock {
            state: ExceptionBlockState::Try,
            start_label,
            end_label,
            catch_variable: Default::default(),
            catch_label: Default::default(),
            finally_label: Default::default(),
        }));
        self.emit_nop();
        end_label
    }

    /**
     * Enters the `catch` clause of a generated `try` statement.
     *
     * @param variable The catch variable.
     */
    fn begin_catch_block(&mut self, variable: VarDeclarator) {
        debug_assert!(self.peek_block_kind() == Some(CodeBlockKind::Exception));

        let name = variable.name.expect_ident().id;
        self.hoist_variable_declaration(&name);

        // ExceptionBlock
        let peeked = self.peek_block().unwrap();
        let exception = peeked.borrow_mut();
        let mut exception = RefMut::map(exception, |v| match v {
            CodeBlock::Exception(v) => v,
            _ => unreachable!(),
        });
        debug_assert!(exception.state < ExceptionBlockState::Catch);

        let end_label = exception.end_label;
        self.emit_break(end_label, None);

        let catch_label = self.define_label();
        self.mark_label(catch_label);
        exception.state = ExceptionBlockState::Catch;
        exception.catch_variable = Some(name.clone());
        exception.catch_label = Some(catch_label);

        self.emit_assignment(
            PatOrExpr::Pat(name.clone().into()),
            Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: self
                    .state
                    .clone()
                    .make_member(quote_ident!("sent"))
                    .as_callee(),
                args: vec![],
                type_args: Default::default(),
            })),
            None,
        );

        self.emit_nop();
    }

    /// Enters the `finally` block of a generated `try` statement.
    fn begin_finally_block(&mut self) {
        debug_assert!(self.peek_block_kind() == Some(CodeBlockKind::Exception));

        let block = self.peek_block().unwrap();
        let mut b = block.borrow_mut();
        if let CodeBlock::Exception(block) = &mut *b {
            debug_assert!(block.state < ExceptionBlockState::Finally);

            let end_label = block.end_label;
            self.emit_break(end_label, None);

            let finally_label = self.define_label();
            self.mark_label(finally_label);
            block.state = ExceptionBlockState::Finally;
            block.finally_label = Some(finally_label);
        }
    }

    /// Ends the code block for a generated `try` statement.
    fn end_exception_block(&mut self) {
        debug_assert!(self.peek_block_kind() == Some(CodeBlockKind::Exception));
        let block = self.end_block();
        let mut b = block.borrow_mut();
        if let CodeBlock::Exception(block) = &mut *b {
            let state = block.state;
            if state < ExceptionBlockState::Finally {
                self.emit_break(block.end_label, None);
            } else {
                self.emit_endfinally();
            }
            self.mark_label(block.end_label);
            self.emit_nop();
            block.state = ExceptionBlockState::Done;
        }
    }

    /// Begins a code block that supports `break` or `continue` statements that
    /// are defined in the source tree and not from generated code.
    fn begin_script_loop_block(&mut self) {
        self.begin_block(CodeBlock::Loop(LoopBlock {
            is_script: true,
            break_label: Label(-1),
            continue_label: Label(-1),
        }));
    }

    /// Begins a code block that supports `break` or `continue` statements that
    /// are defined in generated code. Returns a label used to mark the
    /// operation to which to jump when a `break` statement targets this block.
    ///
    /// - `continue_label`: A Label used to mark the operation to which to jump
    ///   when a `continue` statement targets this block.
    fn begin_loop_block(&mut self, continue_label: Label) -> Label {
        let break_label = self.define_label();
        self.begin_block(CodeBlock::Loop(LoopBlock {
            is_script: false,
            break_label,
            continue_label,
        }));
        break_label
    }

    /// Ends a code block that supports `break` or `continue` statements that
    /// are defined in generated code or in the source tree.
    fn end_loop_block(&mut self) {
        debug_assert!(self.peek_block_kind() == Some(CodeBlockKind::Loop));
        let block = self.end_block();
        let block = block.borrow();
        if let CodeBlock::Loop(block) = &*block {
            let break_label = block.break_label;
            if !block.is_script {
                self.mark_label(break_label);
            }
        }
    }

    /// Begins a code block that supports `break` statements that are defined in
    /// the source tree and not from generated code.
    fn begin_script_switch_block(&mut self) {
        self.begin_block(CodeBlock::Switch(SwitchBlock {
            is_script: true,
            break_label: Label(-1),
        }));
    }

    /// Begins a code block that supports `break` statements that are defined in
    /// generated code.
    ///
    /// Returns a label used to mark the operation to which to jump when a
    /// `break` statement targets this block.
    fn begin_switch_block(&mut self) -> Label {
        let break_label = self.define_label();
        self.begin_block(CodeBlock::Switch(SwitchBlock {
            is_script: false,
            break_label,
        }));
        break_label
    }

    /// Ends a code block that supports `break` statements that are defined in
    /// generated code.
    fn end_switch_block(&mut self) {
        debug_assert!(self.peek_block_kind() == Some(CodeBlockKind::Switch));
        let block = self.end_block();
        let block = block.borrow();
        if let CodeBlock::Switch(block) = &*block {
            let break_label = block.break_label;
            if !block.is_script {
                self.mark_label(break_label);
            }
        }
    }

    fn begin_script_labeled_block(&mut self, label_text: JsWord) {
        self.begin_block(CodeBlock::Labeled(LabeledBlock {
            is_script: true,
            label_text,
            break_label: Label(-1),
        }));
    }

    fn begin_labeled_block(&mut self, label_text: JsWord) {
        let break_label = self.define_label();
        self.begin_block(CodeBlock::Labeled(LabeledBlock {
            is_script: false,
            label_text,
            break_label,
        }));
    }

    fn end_labeled_block(&mut self) {
        let block = self.end_block();
        if !block.borrow().is_script() {
            let break_label = match &*block.borrow() {
                CodeBlock::Labeled(block) => block.break_label,
                _ => unreachable!(),
            };
            self.mark_label(break_label);
        }
    }

    /// Indicates whether the provided block supports `break` statements.
    fn supports_unlabeled_break(&self, block: &CodeBlock) -> bool {
        matches!(block, CodeBlock::Switch(..) | CodeBlock::Loop(..))
    }

    /// Indicates whether the provided block supports `break` statements with
    /// labels.
    fn supports_labeled_break_or_continue(&self, block: &CodeBlock) -> bool {
        matches!(block, CodeBlock::Labeled(..))
    }

    /// Indicates whether the provided block supports `continue` statements.
    fn supports_unlabeled_continue(&self, block: &CodeBlock) -> bool {
        matches!(block, CodeBlock::Loop(..))
    }

    fn has_immediate_containing_labeled_block(&self, label_text: &JsWord, start: usize) -> bool {
        for i in (0..start).rev() {
            let block = self.block_stack.as_ref().unwrap()[i].clone();
            if self.supports_labeled_break_or_continue(&block.borrow()) {
                if let CodeBlock::Labeled(block) = &*block.borrow() {
                    if block.label_text == *label_text {
                        return true;
                    }
                }
            } else {
                break;
            }
        }

        false
    }

    /// Finds the label that is the target for a `break` statement.
    ///
    ///  - `label_text`: An optional name of a containing labeled statement.
    fn find_break_target(&self, label_text: Option<JsWord>) -> Label {
        if let Some(block_stack) = &self.block_stack {
            if let Some(label_text) = label_text {
                for i in (0..block_stack.len()).rev() {
                    let block = &block_stack[i];
                    if self.supports_labeled_break_or_continue(&block.borrow()) {
                        if block.borrow().label_text().unwrap() == label_text {
                            return block.borrow().break_label().unwrap();
                        }
                    } else if self.supports_unlabeled_break(&block.borrow())
                        && self.has_immediate_containing_labeled_block(&label_text, i - 1)
                    {
                        return block.borrow().break_label().unwrap();
                    }
                }
            } else {
                for i in (0..block_stack.len()).rev() {
                    let block = &block_stack[i];
                    if self.supports_unlabeled_break(&block.borrow()) {
                        return block.borrow().continue_label().unwrap();
                    }
                }
            }
        }

        Label(0)
    }

    /// Finds the label that is the target for a `continue` statement.
    ///
    /// - `labelText` An optional name of a containing labeled statement.
    fn find_continue_target(&self, label_text: Option<JsWord>) -> Label {
        if let Some(block_stack) = &self.block_stack {
            if let Some(label_text) = label_text {
                for i in (0..block_stack.len()).rev() {
                    let block = &block_stack[i];
                    if self.supports_unlabeled_continue(&block.borrow())
                        || self.has_immediate_containing_labeled_block(&label_text, i - i)
                    {
                        return block.borrow().continue_label().unwrap();
                    } else {
                        break;
                    }
                }
            } else {
                for i in (0..block_stack.len()).rev() {
                    let block = &block_stack[i];
                    if self.supports_unlabeled_continue(&block.borrow()) {
                        return block.borrow().continue_label().unwrap();
                    }
                }
            }
        }

        Label(0)
    }

    /// Creates an expression that can be used to indicate the value for a
    /// label.
    fn create_label(&mut self, label: Option<Label>) -> Box<Expr> {
        if let Some(label) = label {
            if label.0 > 0 {
                if self.label_exprs.is_none() {
                    self.label_exprs = Some(Default::default());
                }
                let mut label_expressions = self.label_exprs.as_mut().unwrap();
                let expr = Loc {
                    pos: BytePos(label.0 as _),
                    value: -1,
                };
                if label_expressions.get(label.0 as usize).is_none() {
                    if label.0 as usize >= label_expressions.len() {
                        label_expressions.resize(label.0 as usize + 1, vec![]);
                    }

                    label_expressions[label.0 as usize] = vec![expr.clone()];
                } else {
                    label_expressions
                        .get_mut(label.0 as usize)
                        .unwrap()
                        .push(expr.clone());
                }
                return Box::new(Expr::Invalid(Invalid {
                    span: Span::new(
                        BytePos(label.0 as _),
                        BytePos(label.0 as _),
                        Default::default(),
                    ),
                }));
            }
        }

        Box::new(Invalid { span: DUMMY_SP }.into())
    }

    /// Creates a numeric literal for the provided instruction.
    fn create_instruction(&mut self, instruction: Instruction) -> Number {
        let literal = Number {
            span: DUMMY_SP,
            value: instruction as u16 as _,
            raw: None,
        };
        // TODO(kdy1):
        // self.add_synthetic_trailing_comment(
        //     literal,
        //     SyntaxKind::MultiLineCommentTrivia,
        //     get_instruction_name(instruction),
        // );
        literal
    }

    /// Creates a statement that can be used indicate a Break operation to the
    /// provided label.
    ///
    /// - `label`: A label.
    /// - `location`: An optional source map location for the statement.
    fn create_inline_break(&mut self, label: Label, span: Option<Span>) -> ReturnStmt {
        debug_assert!(label.0 >= 0, "Invalid label");
        let mut args = vec![
            Some(self.create_instruction(Instruction::Break).as_arg()),
            Some(self.create_label(Some(label)).as_arg()),
        ];
        ReturnStmt {
            span: span.unwrap_or(DUMMY_SP),
            arg: Some(Box::new(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: args,
            }))),
        }
    }

    /// Creates a statement that can be used indicate a Return operation.
    ///
    /// - `expr`: The expression for the return statement.
    /// - `loc`: An optional source map location for the statement.
    fn create_inline_return(&mut self, expr: Option<Box<Expr>>, loc: Option<Span>) -> ReturnStmt {
        ReturnStmt {
            span: loc.unwrap_or(DUMMY_SP),
            arg: Some(Box::new(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: match expr {
                    Some(expr) => vec![
                        Some(self.create_instruction(Instruction::Return).as_arg()),
                        Some(expr.as_arg()),
                    ],
                    None => vec![Some(self.create_instruction(Instruction::Return).as_arg())],
                },
            }))),
        }
    }

    /// Creates an expression that can be used to resume from a Yield operation.
    fn create_generator_resume(&mut self, loc: Option<Span>) -> Box<Expr> {
        Box::new(Expr::Call(CallExpr {
            span: loc.unwrap_or(DUMMY_SP),
            callee: self
                .state
                .clone()
                .make_member(quote_ident!("sent"))
                .as_callee(),
            args: vec![],
            type_args: Default::default(),
        }))
    }

    /// Emits an empty instruction.
    fn emit_nop(&mut self) {
        self.emit_worker(OpCode::Nop, None, None);
    }

    /// Emits a Statement.
    ///
    /// - `stmt`: A statement.
    fn emit_stmt(&mut self, stmt: Stmt) {
        if stmt.is_empty() {
            self.emit_nop();
        } else {
            self.emit_worker(OpCode::Statement, Some(OpArgs::Stmt(Box::new(stmt))), None);
        }
    }

    /// Emits an Assignment operation.
    ///
    /// - `left`: The left-hand side of the assignment.
    /// - `right`: The right-hand side of the assignment.
    /// - `loc`: An optional source map location for the assignment.
    fn emit_assignment(&mut self, left: PatOrExpr, right: Box<Expr>, loc: Option<Span>) {
        self.emit_worker(OpCode::Assign, Some(OpArgs::PatAndExpr(left, right)), loc);
    }

    /// Emits a Break operation to the specified label.
    ///
    /// - `label`: A label.
    /// - `loc`: An optional source map location for the assignment.
    fn emit_break(&mut self, label: Label, loc: Option<Span>) {
        self.emit_worker(OpCode::Break, Some(OpArgs::Label(label)), loc);
    }

    /// Emits a Break operation to the specified label when a condition
    /// evaluates to a truthy value at runtime.
    ///
    /// - `label`: A label.
    /// - `condition`: The condition.
    /// - `loc`: An optional source map location for the assignment.
    fn emit_break_when_true(&mut self, label: Label, condition: Box<Expr>, loc: Option<Span>) {
        self.emit_worker(
            OpCode::BreakWhenTrue,
            Some(OpArgs::LabelExpr(label, condition)),
            loc,
        );
    }

    /// Emits a Break to the specified label when a condition evaluates to a
    /// falsy value at runtime
    ///
    /// - `label`: A label.
    /// - `condition`: The condition.
    /// - `loc`: An optional source map location for the assignment.
    fn emit_break_when_false(&mut self, label: Label, condition: Box<Expr>, loc: Option<Span>) {
        self.emit_worker(
            OpCode::BreakWhenFalse,
            Some(OpArgs::LabelExpr(label, condition)),
            loc,
        );
    }

    /// Emits a YieldStar operation for the provided expression.
    ///
    /// - `expr`: An optional value for the yield operation.
    /// - `loc`: An optional source map location for the assignment.
    fn emit_yield_star(&mut self, expr: Option<Box<Expr>>, loc: Option<Span>) {
        self.emit_worker(OpCode::YieldStar, Some(OpArgs::OptExpr(expr)), loc);
    }

    /// Emits a Yield operation for the provided expression.
    ///
    /// - `expr`: An optional value for the yield operation.
    /// - `loc`: An optional source map location for the assignment.
    fn emit_yield(&mut self, expr: Option<Box<Expr>>, loc: Option<Span>) {
        self.emit_worker(OpCode::Yield, Some(OpArgs::OptExpr(expr)), loc);
    }

    ///  Emits a Return operation for the provided expression.
    ///
    /// - `expr`: An optional value for the operation.
    /// - `loc`: An optional source map location for the assignment.
    fn emit_return(&mut self, expr: Option<Box<Expr>>, loc: Option<Span>) {
        self.emit_worker(OpCode::Return, Some(OpArgs::OptExpr(expr)), loc);
    }

    /// Emits a Throw operation for the provided expression.
    ///
    /// - `expr`: A value for the operation.
    /// - `loc`: An optional source map location for the assignment.
    fn emit_throw(&mut self, expr: Box<Expr>, loc: Option<Span>) {
        self.emit_worker(OpCode::Throw, Some(OpArgs::OptExpr(Some(expr))), loc);
    }

    /// Emits an Endfinally operation. This is used to handle `finally` block
    /// semantics.
    fn emit_endfinally(&mut self) {
        self.emit_worker(OpCode::Endfinally, None, None);
    }

    /// Emits an operation.
    ///
    /// - `code`: The OpCode for the operation.
    /// - `args`: The optional arguments for the operation.
    fn emit_worker(&mut self, code: OpCode, args: Option<OpArgs>, loc: Option<Span>) {
        if self.operations.is_none() {
            self.operations = Some(vec![]);
            self.operation_args = Some(vec![]);
            self.operation_locs = Some(vec![]);
        }
        if self.label_offsets.is_none() {
            // mark entry point
            let label = self.define_label();
            self.mark_label(label);
        }
        debug_assert!(self.operations.is_some());
        debug_assert_eq!(
            self.operations.as_ref().unwrap().len(),
            self.operation_args.as_ref().unwrap().len()
        );
        debug_assert_eq!(
            self.operations.as_ref().unwrap().len(),
            self.operation_locs.as_ref().unwrap().len()
        );

        let operation_index = self.operations.as_mut().unwrap().len();
        self.operations.as_mut().unwrap().push(code);
        self.operation_args.as_mut().unwrap().push(args);
        self.operation_locs
            .as_mut()
            .unwrap()
            .push(loc.unwrap_or(DUMMY_SP));
    }

    // /**
    //  * Builds the generator function body.
    //  */
    // function build() {
    //     blockIndex = 0;
    //     labelNumber = 0;
    //     labelNumbers = undefined;
    //     lastOperationWasAbrupt = false;
    //     lastOperationWasCompletion = false;
    //     clauses = undefined;
    //     statements = undefined;
    //     exceptionBlockStack = undefined;
    //     currentExceptionBlock = undefined;
    //     withBlockStack = undefined;

    //     const buildResult = buildStatements();
    //     return emitHelpers().createGeneratorHelper(
    //         setEmitFlags(
    //             factory.createFunctionExpression(
    //                 /*modifiers*/ undefined,
    //                 /*asteriskToken*/ undefined,
    //                 /*name*/ undefined,
    //                 /*typeParameters*/ undefined,
    //                 [
    //                     factory.createParameterDeclaration(
    //                         /*modifiers*/ undefined,
    //                         /*dotDotDotToken*/ undefined,
    //                         state
    //                     ),
    //                 ],
    //                 /*type*/ undefined,
    //                 factory.createBlock(
    //                     buildResult,
    //                     /*multiLine*/ buildResult.length > 0
    //                 )
    //             ),
    //             EmitFlags.ReuseTempVariableScope
    //         )
    //     );
    // }

    /// Builds the statements for the generator function body.
    fn build_stmts(&mut self) -> Vec<Stmt> {
        if let Some(ops) = self.operations.clone() {
            for (op_index, _) in ops.iter().enumerate() {
                self.write_operation(op_index);
            }

            self.flush_final_label(ops.len());
        } else {
            self.flush_final_label(0);
        }

        if let Some(clauses) = self.clauses.take() {
            let label_expr = self.state.clone().make_member(quote_ident!("label"));
            let switch_stmt = SwitchStmt {
                span: DUMMY_SP,
                discriminant: Box::new(label_expr),
                cases: clauses,
            };
            return vec![Stmt::Switch(switch_stmt)];
        }

        if let Some(stmts) = self.stmts.take() {
            return stmts;
        }

        vec![]
    }

    /// Flush the current label and advance to a new label.
    fn flush_label(&mut self) {
        if self.stmts.is_none() {
            return;
        }

        self.append_label(!self.last_operation_was_abrupt);

        self.last_operation_was_abrupt = false;
        self.last_operation_was_completion = false;
        self.label_number += 1;
    }

    /// Flush the final label of the generator function body.
    fn flush_final_label(&mut self, op_index: usize) {
        if self.is_final_label_reachable(op_index) {
            self.try_enter_label(op_index);
            self.with_block_stack = None;
            self.write_return(None, None);
        }

        if self.stmts.is_some() && self.clauses.is_some() {
            self.append_label(false);
        }

        self.update_label_expression();
    }

    /// Tests whether the final label of the generator function body is
    /// reachable by user code.
    fn is_final_label_reachable(&self, op_index: usize) -> bool {
        // if the last operation was *not* a completion (return/throw) then
        // the final label is reachable.
        if !self.last_operation_was_completion {
            return true;
        }

        // if there are no labels defined or referenced, then the final label is not
        // reachable.
        if self.label_offsets.is_none() || self.label_exprs.is_none() {
            return false;
        }

        // if the label for this offset is referenced, then the final label
        // is reachable.
        for (label, label_offset) in self
            .label_offsets
            .as_ref()
            .unwrap()
            .iter()
            .copied()
            .enumerate()
        {
            if label_offset as usize == op_index
                && self.label_exprs.as_ref().unwrap().get(label).is_some()
            {
                return true;
            }
        }

        false
    }

    /// Appends a case clause for the last label and sets the new label.
    ///
    /// @param markLabelEnd Indicates that the transition between labels was a
    /// fall-through from a previous case clause and the change in labels should
    /// be reflected on the `state` object.
    fn append_label(&mut self, mark_label_end: bool) {
        if self.clauses.is_none() {
            self.clauses = Some(Default::default());
        }

        let stmts = if let Some(mut stmts) = self.stmts.take() {
            if self.with_block_stack.is_some() {
                // The previous label was nested inside one or more `with`
                // blocks, so we surround the statements in
                // generated `with` blocks to create the same environment.

                for (i, with_block) in self
                    .with_block_stack
                    .as_ref()
                    .unwrap()
                    .iter()
                    .enumerate()
                    .rev()
                {
                    let b = with_block.borrow();
                    let with_block = match &*b {
                        CodeBlock::With(v) => v,
                        _ => {
                            unreachable!()
                        }
                    };

                    stmts = vec![Stmt::With(WithStmt {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(with_block.expression.clone())),
                        body: Box::new(Stmt::Block(BlockStmt {
                            span: DUMMY_SP,
                            stmts,
                        })),
                    })];
                }
            }

            if let Some(current_exception_block) = self.current_exception_block.take() {
                let b = current_exception_block.borrow();
                let ExceptionBlock {
                    start_label,
                    catch_label,
                    finally_label,
                    end_label,
                    ..
                } = match &*b {
                    CodeBlock::Exception(v) => v,
                    _ => {
                        unreachable!()
                    }
                };

                let start_label = self.create_label(Some(*start_label));
                let catch_label = self.create_label(*catch_label);
                let finally_label = self.create_label(*finally_label);
                let end_label = self.create_label(Some(*end_label));

                stmts.insert(
                    0,
                    Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: self
                                .state
                                .clone()
                                .make_member(quote_ident!("trys"))
                                .make_member(quote_ident!("push"))
                                .as_callee(),
                            args: vec![ArrayLit {
                                span: DUMMY_SP,
                                elems: vec![
                                    Some(start_label.as_arg()),
                                    Some(catch_label.as_arg()),
                                    Some(finally_label.as_arg()),
                                    Some(end_label.as_arg()),
                                ],
                            }
                            .as_arg()],
                            type_args: Default::default(),
                        })),
                    }),
                );
            }

            if mark_label_end {
                // The case clause for the last label falls through to this
                // label, so we add an assignment statement to
                // reflect the change in labels.

                stmts.push(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Expr(Box::new(
                            self.state.clone().make_member(quote_ident!("label")),
                        )),
                        right: (self.label_number + 1).into(),
                    })),
                }));
            }

            stmts
        } else {
            Default::default()
        };

        self.clauses.as_mut().unwrap().push(SwitchCase {
            span: DUMMY_SP,
            test: Some(self.label_number.into()),
            cons: stmts,
        });
    }

    #[cfg_attr(debug_assertions, tracing::instrument(skip(self)))]
    fn try_enter_label(&mut self, op_index: usize) {
        if self.label_offsets.is_none() {
            return;
        }

        for (label, label_offset) in self.label_offsets.clone().unwrap().into_iter().enumerate() {
            if label_offset as usize == op_index {
                self.flush_label();

                if self.label_numbers.is_none() {
                    self.label_numbers = Some(vec![]);
                }

                if let Some(v) = self
                    .label_numbers
                    .as_mut()
                    .unwrap()
                    .get_mut(self.label_number)
                {
                    v.push(label);
                } else {
                    if self.label_number >= self.label_numbers.as_ref().unwrap().len() {
                        self.label_numbers
                            .as_mut()
                            .unwrap()
                            .resize(self.label_number + 1, vec![]);
                    }

                    self.label_numbers.as_mut().unwrap()[self.label_number] = vec![label];
                }
            }
        }
    }

    /// Updates literal expressions for labels with actual label numbers.
    fn update_label_expression(&mut self) {
        if self.label_exprs.is_some() && self.label_numbers.is_some() {
            for (label_number, labels) in self.label_numbers.as_ref().unwrap().iter().enumerate() {
                for &label in labels {
                    let exprs = self.label_exprs.as_mut().unwrap().get_mut(label);
                    if let Some(exprs) = exprs {
                        for expr in exprs {
                            expr.value = label_number as _;
                        }
                    }
                }
            }
        }
    }

    /// Tries to enter or leave a code block.
    #[cfg_attr(debug_assertions, tracing::instrument(skip(self)))]
    fn try_enter_or_leave_block(&mut self, op_index: usize) {
        if let Some(blocks) = &self.blocks {
            while self.block_index < self.block_actions.as_ref().unwrap().len()
                && self.block_offsets.as_ref().unwrap()[self.block_index] <= op_index
            {
                let block_index = self.block_index;
                self.block_index += 1;

                if cfg!(debug_assertions) {
                    debug!(block_index = block_index, "try_enter_or_leave_block")
                }

                //
                let block = blocks[block_index].clone();
                let block_action = self.block_actions.as_ref().unwrap()[block_index];

                let b = block.borrow();
                match &*b {
                    CodeBlock::Exception(_) => {
                        if block_action == BlockAction::Open {
                            self.exception_block_stack
                                .extend(self.current_exception_block.clone());

                            #[cfg(debug_assertions)]
                            debug!("Current exception block: open = Some({:?})", block);
                            self.current_exception_block = Some(block.clone());
                        } else if block_action == BlockAction::Close {
                            self.current_exception_block = self.exception_block_stack.pop();
                            #[cfg(debug_assertions)]
                            debug!(
                                "Current exception block: close = {:?}",
                                self.current_exception_block
                            );
                        }
                    }

                    CodeBlock::With(_) => {
                        if block_action == BlockAction::Open {
                            if self.with_block_stack.is_none() {
                                self.with_block_stack = Some(Default::default());
                            }

                            self.with_block_stack.as_mut().unwrap().push(block.clone());
                        } else if block_action == BlockAction::Close {
                            self.with_block_stack.as_mut().unwrap().pop();
                        }
                    }

                    _ => {}
                }
            }
        }
    }

    /// Writes an operation as a statement to the current label's statement
    /// list.
    #[cfg_attr(debug_assertions, tracing::instrument(skip(self)))]
    fn write_operation(&mut self, op_index: usize) {
        if cfg!(debug_assertions) {
            debug!("Writing operation {}", op_index);
        }

        self.try_enter_label(op_index);
        self.try_enter_or_leave_block(op_index);

        // early termination, nothing else to process in this label
        if self.last_operation_was_abrupt {
            return;
        }

        self.last_operation_was_abrupt = false;
        self.last_operation_was_completion = false;

        let opcode = self.operations.as_ref().unwrap()[op_index];
        if opcode == OpCode::Nop {
            return;
        } else if opcode == OpCode::Endfinally {
            self.write_end_finally();
            return;
        }

        // TODO(kdy1): Remove clone()
        let args = self.operation_args.as_ref().unwrap()[op_index]
            .clone()
            .unwrap();
        if opcode == OpCode::Statement {
            let args = args.expect_stmt();
            self.write_stmt(*args);
            return;
        }

        let loc = self.operation_locs.as_ref().unwrap()[op_index];

        match opcode {
            OpCode::Assign => {
                let args = args.expect_pat_and_expr();
                self.write_assign(args.0, args.1, Some(loc));
            }
            OpCode::Break => {
                let args = args.expect_label();
                self.write_break(args, Some(loc));
            }
            OpCode::BreakWhenTrue => {
                let args = args.expect_label_expr();
                self.write_break_when_true(args.0, args.1, Some(loc));
            }
            OpCode::BreakWhenFalse => {
                let args = args.expect_label_expr();
                self.write_break_when_false(args.0, args.1, Some(loc));
            }
            OpCode::Yield => {
                let args = args.expect_opt_expr();

                self.write_yield(args, Some(loc));
            }
            OpCode::YieldStar => {
                let args = args.expect_opt_expr().unwrap();

                self.write_yield_star(args, Some(loc));
            }
            OpCode::Return => {
                let args = args.expect_opt_expr();

                self.write_return(args, Some(loc));
            }
            OpCode::Throw => {
                let args = args.expect_opt_expr().unwrap();

                self.write_throw(args, Some(loc));
            }
            _ => {}
        }
    }

    /// Writes a statement to the current label's statement list.
    fn write_stmt(&mut self, stmt: Stmt) {
        if stmt.is_empty() {
            return;
        }
        match self.stmts {
            Some(ref mut stmts) => stmts.push(stmt),
            None => self.stmts = Some(vec![stmt]),
        }
    }

    /// Writes an Assign operation to the current label's statement list.
    fn write_assign(&mut self, left: PatOrExpr, right: Box<Expr>, op_loc: Option<Span>) {
        self.write_stmt(Stmt::Expr(ExprStmt {
            span: op_loc.unwrap_or(DUMMY_SP),
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left,
                right,
            })),
        }))
    }

    /// Writes a Throw operation to the current label's statement list.
    ///
    /// @param expr The value to throw
    /// @param operationLocation The source map location for the operation.
    fn write_throw(&mut self, expr: Box<Expr>, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;
        self.last_operation_was_completion = true;

        let inst = self.create_instruction(Instruction::Return);
        self.write_stmt(Stmt::Throw(ThrowStmt {
            span: op_loc.unwrap_or(DUMMY_SP),
            arg: expr,
        }))
    }

    /// Writes a Return operation to the current label's statement list.
    ///
    /// @param label The label for the Break.
    /// @param operationLocation The source map location for the operation.
    fn write_return(&mut self, expr: Option<Box<Expr>>, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;
        self.last_operation_was_completion = true;

        let inst = self.create_instruction(Instruction::Return);
        self.write_stmt(Stmt::Return(ReturnStmt {
            span: op_loc.unwrap_or(DUMMY_SP),
            arg: Some(Box::new(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: match expr {
                    Some(expr) => {
                        vec![Some(inst.as_arg()), Some(expr.as_arg())]
                    }
                    _ => {
                        vec![Some(inst.as_arg())]
                    }
                },
            }))),
        }))
    }

    /// Writes a Break operation to the current label's statement list.
    ///
    /// @param label The label for the Break.
    /// @param operationLocation The source map location for the operation.
    fn write_break(&mut self, label: Label, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;

        let inst = self.create_instruction(Instruction::Break);
        let label = self.create_label(Some(label));
        self.write_stmt(Stmt::Return(ReturnStmt {
            span: op_loc.unwrap_or(DUMMY_SP),
            arg: Some(Box::new(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: vec![Some(inst.as_arg()), Some(label.as_arg())],
            }))),
        }))
    }

    /// Writes a BreakWhenTrue operation to the current label's statement list.
    ///
    /// @param label The label for the Break.
    /// @param condition The condition for the Break.
    /// @param operationLocation The source map location for the operation.
    fn write_break_when_true(&mut self, label: Label, cond: Box<Expr>, op_loc: Option<Span>) {
        let inst = self.create_instruction(Instruction::Break);
        let label = self.create_label(Some(label));
        self.write_stmt(Stmt::If(IfStmt {
            span: DUMMY_SP,
            test: cond,
            cons: Box::new(Stmt::Return(ReturnStmt {
                span: op_loc.unwrap_or(DUMMY_SP),
                arg: Some(Box::new(Expr::Array(ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![Some(inst.as_arg()), Some(label.as_arg())],
                }))),
            })),
            alt: None,
        }))
    }

    /// Writes a BreakWhenFalse operation to the current label's statement list.
    ///
    /// @param label The label for the Break.
    /// @param condition The condition for the Break.
    /// @param operationLocation The source map location for the operation.
    fn write_break_when_false(&mut self, label: Label, cond: Box<Expr>, op_loc: Option<Span>) {
        let inst = self.create_instruction(Instruction::Break);
        let label = self.create_label(Some(label));
        self.write_stmt(Stmt::If(IfStmt {
            span: DUMMY_SP,
            test: Box::new(Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("!"),
                arg: cond,
            })),
            cons: Box::new(Stmt::Return(ReturnStmt {
                span: op_loc.unwrap_or(DUMMY_SP),
                arg: Some(Box::new(Expr::Array(ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![Some(inst.as_arg()), Some(label.as_arg())],
                }))),
            })),
            alt: None,
        }))
    }

    /// Writes a Yield operation to the current label's statement list.
    ///
    /// - expr: The expression to yield.
    /// - op_loc: The source map location for the operation.
    fn write_yield(&mut self, expr: Option<Box<Expr>>, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;

        let inst = self.create_instruction(Instruction::Yield);
        let elems = match expr {
            Some(expr) => {
                vec![Some(inst.as_arg()), Some(expr.as_arg())]
            }
            None => {
                vec![Some(inst.as_arg())]
            }
        };
        self.write_stmt(Stmt::Return(ReturnStmt {
            span: op_loc.unwrap_or(DUMMY_SP),
            arg: Some(Box::new(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems,
            }))),
        }));
    }

    /// Writes a YieldStar instruction to the current label's statement list.
    ///
    /// - expr: The expression to yield.
    /// - op_loc: The source map location for the operation.
    fn write_yield_star(&mut self, expr: Box<Expr>, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;

        let arg1 = self.create_instruction(Instruction::YieldStar);
        self.write_stmt(Stmt::Return(ReturnStmt {
            span: op_loc.unwrap_or(DUMMY_SP),
            arg: Some(Box::new(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: vec![Some(arg1.as_arg()), Some(expr.as_arg())],
            }))),
        }))
    }

    /// Writes an Endfinally instruction to the current label's statement list.
    fn write_end_finally(&mut self) {
        self.last_operation_was_abrupt = true;

        let arg = self.create_instruction(Instruction::Endfinally);
        self.write_stmt(Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: vec![Some(arg.as_arg())],
            }))),
        }))
    }

    fn hoist_variable_declaration(&mut self, id: &Ident) {
        self.hoisted_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: id.clone().into(),
            init: None,
            definite: Default::default(),
        })
    }

    fn get_initialized_variables<'a>(
        &self,
        initializer: &'a mut VarDecl,
    ) -> Vec<&'a mut VarDeclarator> {
        initializer
            .decls
            .iter_mut()
            .filter(|v| v.init.is_some())
            .collect()
    }

    fn create_temp_variable(&mut self) -> Ident {
        let i = private_ident!("_");

        self.temp_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: i.clone().into(),
            init: None,
            definite: Default::default(),
        });

        i
    }
}

fn contains_yield<N>(node: &N) -> bool
where
    N: VisitWith<YieldFinder>,
{
    let mut v = YieldFinder { found: false };
    node.visit_with(&mut v);
    v.found
}

struct YieldFinder {
    found: bool,
}

impl Visit for YieldFinder {
    noop_visit_type!();

    fn visit_yield_expr(&mut self, _: &YieldExpr) {
        self.found = true;
    }

    fn visit_arrow_expr(&mut self, f: &ArrowExpr) {
        f.params.visit_with(self);
    }

    fn visit_function(&mut self, f: &Function) {
        f.decorators.visit_with(self);
        f.params.visit_with(self);
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(super) struct Loc {
    pos: BytePos,
    value: i32,
}

/// Convert <invalid> to case number
struct InvalidToLit<'a> {
    // Map from loc-id to stmt index
    map: Option<&'a [Vec<Loc>]>,
}

impl VisitMut for InvalidToLit<'_> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Invalid(Invalid { span }) = e {
            if span.lo != BytePos(0) && span.lo == span.hi {
                if let Some(Loc { value, .. }) = self
                    .map
                    .iter()
                    .flat_map(|v| v.iter())
                    .flatten()
                    .find(|loc| loc.pos == span.lo)
                {
                    *e = (*value as usize).into();
                }
            }
        }
    }

    fn visit_mut_seq_expr(&mut self, e: &mut SeqExpr) {
        e.visit_mut_children_with(self);

        e.exprs.retain(|e| !e.is_invalid());
    }

    fn visit_mut_opt_expr_or_spread(&mut self, e: &mut Option<ExprOrSpread>) {
        e.visit_mut_children_with(self);

        if let Some(arg) = e {
            if arg.expr.is_invalid() {
                *e = None;
            }
        }
    }
}
