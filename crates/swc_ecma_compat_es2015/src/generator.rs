use std::{
    cell::{RefCell, RefMut},
    iter::once,
    mem::take,
    rc::Rc,
};

use is_macro::Is;
use swc_atoms::JsWord;
use swc_common::{
    comments::Comments, util::take::Take, BytePos, EqIgnoreSpan, Mark, Span, Spanned,
    SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    function::FnEnvHoister, private_ident, prop_name_to_expr_value, quote_ident, ExprFactory,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};
use tracing::debug;

/// Generator based on tsc generator at https://github.com/microsoft/TypeScript/blob/162224763681465b417274383317ca9a0a573835/src/compiler/transformers/generators.ts
pub fn generator<C>(unresolved_mark: Mark, _comments: C) -> impl Pass
where
    C: Comments,
{
    visit_mut_pass(Wrapper {
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
    })
}

/// Instead of saving state, we just create another instance of [Generator].
struct Wrapper {
    unresolved_ctxt: SyntaxContext,
}

macro_rules! dev_span {
    ($($tt:tt)*) => {{
        if cfg!(debug_assertions) {
            Some(tracing::span!(tracing::Level::ERROR, $($tt)*).entered())
        } else {
            None
        }
    }};
}

impl VisitMut for Wrapper {
    noop_visit_mut_type!(fail);

    fn visit_mut_function(&mut self, f: &mut Function) {
        f.visit_mut_children_with(self);

        if f.is_generator {
            let mut v = Generator::default();

            let mut hoister = FnEnvHoister::new(self.unresolved_ctxt);
            hoister.disable_super();
            hoister.disable_this();

            f.visit_mut_children_with(&mut hoister);

            v.transform_and_emit_stmts(f.body.as_mut().unwrap().stmts.take(), 0);
            f.is_generator = false;

            let mut stmts = v.build_stmts();
            stmts.visit_mut_with(&mut InvalidToLit {
                map: v.label_exprs.as_deref(),
            });
            let inner_fn = Box::new(Function {
                span: DUMMY_SP,
                params: vec![Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(v.state.clone().into()),
                }],
                decorators: Default::default(),
                body: Some(BlockStmt {
                    stmts,
                    ..Default::default()
                }),
                is_generator: false,
                is_async: false,
                ..Default::default()
            });
            let generator_object = CallExpr {
                span: DUMMY_SP,
                callee: helper!(ts, ts_generator),
                args: vec![
                    ThisExpr { span: DUMMY_SP }.as_arg(),
                    FnExpr {
                        ident: None,
                        function: inner_fn,
                    }
                    .as_arg(),
                ],
                ..Default::default()
            }
            .into();
            let mut stmts = Vec::new();
            if !v.hoisted_vars.is_empty() {
                stmts.push(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: v.hoisted_vars.take(),
                        ..Default::default()
                    }
                    .into(),
                )
            }
            let vars = hoister.to_decl();
            if !vars.is_empty() {
                stmts.push(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: vars,
                        ..Default::default()
                    }
                    .into(),
                )
            }
            stmts.extend(v.hoisted_fns.into_iter().map(Decl::Fn).map(Stmt::Decl));

            stmts.push(
                ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(generator_object),
                }
                .into(),
            );
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
    PatAndExpr(AssignTarget, Box<Expr>),
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
            Self::Exception(..) => false,
            Self::Labeled(b) => b.is_script,
            Self::Switch(b) => b.is_script,
            Self::Loop(b) => b.is_script,
            Self::With(..) => false,
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
#[allow(unused)]
#[derive(Debug)]
struct WithBlock {
    expression: Ident,
    start_label: Label,
    end_label: Label,
}

#[allow(dead_code)]
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
    // fn name(self) -> Option<&'static str> {
    //     match self {
    //         Instruction::Return => Some("return"),
    //         Instruction::Break => Some("break"),
    //         Instruction::Yield => Some("yield"),
    //         Instruction::YieldStar => Some("yield*"),
    //         Instruction::Endfinally => Some("endfinally"),
    //         _ => None,
    //     }
    // }
}

struct Generator {
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
    exception_block_stack: Option<Vec<Ptr<CodeBlock>>>,
    /// Index to `blocks`
    current_exception_block: Option<Ptr<CodeBlock>>,
    /// Index to `blocks`
    with_block_stack: Option<Vec<Ptr<CodeBlock>>>,

    hoisted_vars: Vec<VarDeclarator>,
    hoisted_fns: Vec<FnDecl>,
}

type Ptr<T> = Rc<RefCell<T>>;

impl Default for Generator {
    fn default() -> Self {
        Self {
            in_statement_containing_yield: Default::default(),
            blocks: Default::default(),
            block_offsets: Default::default(),
            block_actions: Default::default(),
            block_stack: Default::default(),
            label_offsets: Default::default(),
            label_exprs: Default::default(),
            next_label_id: 1,
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
            hoisted_vars: Default::default(),
            hoisted_fns: Default::default(),
        }
    }
}

impl VisitMut for Generator {
    noop_visit_mut_type!(fail);

    fn visit_mut_arrow_expr(&mut self, e: &mut ArrowExpr) {
        e.params.visit_mut_with(self);
    }

    fn visit_mut_function(&mut self, e: &mut Function) {
        e.params.visit_mut_with(self);
    }

    fn visit_mut_getter_prop(&mut self, _: &mut GetterProp) {}

    fn visit_mut_setter_prop(&mut self, e: &mut SetterProp) {
        e.param.visit_mut_with(self);
    }

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
                    let arg = node
                        .arg
                        .take()
                        .map(|e| CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(ts, ts_values),
                            args: vec![e.as_arg()],
                            ..Default::default()
                        })
                        .map(Expr::from)
                        .map(Box::new);
                    self.emit_yield_star(arg, Some(node.span))
                } else {
                    self.emit_yield(node.arg.take(), Some(node.span));
                }

                self.mark_label(resume_label);

                *e = *self.create_generator_resume(Some(node.span));
            }

            Expr::Cond(node) => {
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

                // We only need to perform a specific transformation if a
                // `yield` expression exists in either the
                // `whenTrue` or `whenFalse` branches. A `yield`
                // in the condition will be handled by the normal visitor.

                if contains_yield(&node.cons) || contains_yield(&node.alt) {
                    let when_false_label = self.define_label();
                    let result_label = self.define_label();
                    let result_local = self.declare_local(None);

                    node.test.visit_mut_with(self);
                    let cond_span = node.test.span();
                    self.emit_break_when_false(when_false_label, node.test.take(), Some(cond_span));

                    let cons_span = node.cons.span();
                    node.cons.visit_mut_with(self);
                    self.emit_assignment(
                        result_local.clone().into(),
                        node.cons.take(),
                        Some(cons_span),
                    );
                    self.emit_break(result_label, None);

                    self.mark_label(when_false_label);
                    let alt_span = node.cons.span();
                    node.alt.visit_mut_with(self);
                    self.emit_assignment(
                        result_local.clone().into(),
                        node.alt.take(),
                        Some(alt_span),
                    );

                    self.mark_label(result_label);

                    *e = result_local.into();
                } else {
                    node.visit_mut_with(self);
                }
            }

            Expr::Bin(node) => {
                if node.op == op!("**") {
                    todo!("right-associative binary expression")
                } else {
                    let new = self.visit_left_associative_bin_expr(node);
                    if let Some(new) = new {
                        *e = new;
                    }
                }
            }

            Expr::Seq(node) => {
                //     // flattened version of `visitCommaExpression`
                let mut pending_expressions = Vec::new();

                for mut elem in node.exprs.take() {
                    if let Expr::Seq(mut elem) = *elem {
                        elem.visit_mut_with(self);
                        pending_expressions.extend(elem.exprs.take());
                    } else {
                        if contains_yield(&elem) && !pending_expressions.is_empty() {
                            self.emit_worker(
                                OpCode::Statement,
                                Some(OpArgs::Stmt(Box::new(
                                    ExprStmt {
                                        span: DUMMY_SP,
                                        expr: if pending_expressions.len() == 1 {
                                            pending_expressions.remove(0)
                                        } else {
                                            SeqExpr {
                                                span: DUMMY_SP,
                                                exprs: pending_expressions.take(),
                                            }
                                            .into()
                                        },
                                    }
                                    .into(),
                                ))),
                                None,
                            );
                        }
                        elem.visit_mut_with(self);
                        pending_expressions.push(elem);
                    }
                }

                if pending_expressions.len() == 1 {
                    *e = *pending_expressions.remove(0);
                } else {
                    node.exprs = pending_expressions;
                }
            }

            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Computed(prop),
                ..
            }) => {
                if contains_yield(prop) {
                    // [source]
                    //      a = x[yield];
                    //
                    // [intermediate]
                    //  .local _a
                    //      _a = x;
                    //  .yield resumeLabel
                    //  .mark resumeLabel
                    //      a = _a[%sent%]

                    *obj = self.cache_expression(obj.take()).into();
                    prop.visit_mut_with(self);
                    return;
                }

                e.visit_mut_children_with(self);
            }

            Expr::Assign(node) if contains_yield(&node.right) => {
                match node.left.as_mut_simple() {
                    Some(SimpleAssignTarget::Member(left)) => {
                        match &mut left.prop {
                            MemberProp::Ident(..) | MemberProp::PrivateName(..) => {
                                //      a.b = yield;
                                //
                                // [intermediate]
                                //  .local _a
                                //      _a = a;
                                //  .yield resumeLabel
                                //  .mark resumeLabel
                                //      _a.b = %sent%;

                                left.obj.visit_mut_with(self);
                                let obj = self.cache_expression(left.obj.take());

                                left.obj = obj.into();
                            }
                            MemberProp::Computed(prop) => {
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
                                let prop_span = prop.span;

                                left.obj.visit_mut_with(self);
                                let obj = self.cache_expression(left.obj.take());

                                prop.visit_mut_with(self);
                                let prop = self.cache_expression(prop.expr.take());

                                left.obj = obj.into();
                                left.prop = MemberProp::Computed(ComputedPropName {
                                    span: prop_span,
                                    expr: prop.into(),
                                });
                            }
                        }
                        // [source]
                    }
                    _ => {
                        node.left.visit_mut_with(self);
                    }
                }
                if node.op != op!("=") {
                    let left_of_right =
                        self.cache_expression(node.left.take().expect_simple().into());

                    node.right.visit_mut_with(self);

                    *e = AssignExpr {
                        span: node.right.span(),
                        op: node.op,
                        left: left_of_right.into(),
                        right: node.right.take(),
                    }
                    .into();
                } else {
                    node.right.visit_mut_with(self);
                }
            }

            Expr::Object(node) if node.props.iter().any(contains_yield) => {
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

                let num_initial_properties = self.count_initial_nodes_without_yield(&node.props);

                let mut temp = self.declare_local(None);
                node.props
                    .iter_mut()
                    .take(num_initial_properties)
                    .for_each(|p| {
                        p.visit_mut_with(self);
                    });

                self.emit_assignment(
                    temp.clone().into(),
                    ObjectLit {
                        span: DUMMY_SP,
                        props: node
                            .props
                            .iter_mut()
                            .take(num_initial_properties)
                            .map(|v| v.take())
                            .collect(),
                    }
                    .into(),
                    None,
                );

                let mut expressions = node
                    .props
                    .iter_mut()
                    .skip(num_initial_properties)
                    .map(|v| v.take())
                    .fold(Vec::<CompiledProp>::new(), |mut props, p| {
                        match p {
                            PropOrSpread::Spread(_) => {
                                unreachable!("spread should be removed before applying generator")
                            }
                            PropOrSpread::Prop(p) => match *p {
                                Prop::Getter(p) => {
                                    if let Some(CompiledProp::Accessor(g, _)) =
                                        props.iter_mut().find(|prev| match prev {
                                            CompiledProp::Accessor(_, Some(s)) => {
                                                s.key.eq_ignore_span(&p.key)
                                            }
                                            _ => false,
                                        })
                                    {
                                        *g = Some(p);
                                    } else {
                                        props.push(CompiledProp::Accessor(Some(p), None))
                                    }
                                }
                                Prop::Setter(p) => {
                                    if let Some(CompiledProp::Accessor(_, s)) =
                                        props.iter_mut().find(|prev| match prev {
                                            CompiledProp::Accessor(Some(prev), _) => {
                                                prev.key.eq_ignore_span(&p.key)
                                            }
                                            _ => false,
                                        })
                                    {
                                        *s = Some(p);
                                    } else {
                                        props.push(CompiledProp::Accessor(None, Some(p)))
                                    }
                                }
                                p => {
                                    props.push(CompiledProp::Prop(p));
                                }
                            },
                        }

                        props
                    })
                    .into_iter()
                    .fold(Vec::new(), |exprs, property| {
                        self.reduce_property(exprs, property, &mut temp)
                    });

                expressions.push(temp.into());

                *e = *Expr::from_exprs(expressions);
            }

            Expr::Array(node) => {
                *e = self.visit_elements(&mut node.elems, None, None);
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

            node.callee.visit_mut_with(self);

            let (target, this_arg) =
                self.create_call_binding(node.callee.take().expect_expr(), false);

            let callee = self.cache_expression(target);

            let mut args = node.args.take().into_iter().map(Some).collect::<Vec<_>>();
            let arg = self.visit_elements(&mut args, None, None);

            let apply = callee.make_member(quote_ident!("apply"));

            *node = CallExpr {
                span: node.span,
                callee: apply.as_callee(),
                args: once(this_arg.as_arg()).chain(once(arg.as_arg())).collect(),
                ..Default::default()
            };
            return;
        }

        node.visit_mut_children_with(self);
    }

    fn visit_mut_new_expr(&mut self, node: &mut NewExpr) {
        if contains_yield(&node.args) {
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

            node.callee.visit_mut_with(self);

            let (target, this_arg) = self.create_call_binding(node.callee.take(), true);

            let callee = self.cache_expression(target.make_member(quote_ident!("bind")).into());

            let mut arg = if let Some(args) = node.args.take() {
                let mut args = args.into_iter().map(Some).collect::<Vec<_>>();
                Some(self.visit_elements(
                    &mut args,
                    Some(ExprOrSpread {
                        spread: None,
                        expr: Expr::undefined(DUMMY_SP),
                    }),
                    None,
                ))
            } else {
                None
            };

            let apply = callee.apply(
                node.span,
                this_arg,
                arg.take().map(|v| v.as_arg()).into_iter().collect(),
            );

            *node = NewExpr {
                span: node.span,
                callee: Box::new(apply),
                args: None,
                ..Default::default()
            };
            return;
        }

        node.visit_mut_children_with(self);
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        if self.in_statement_containing_yield {
            self.begin_script_loop_block();
        }

        if let Some(VarDeclOrExpr::VarDecl(initializer)) = &mut node.init {
            for variable in initializer.decls.iter_mut() {
                self.hoist_variable_declaration(&Ident::from(variable.name.as_ident().unwrap()));
            }

            let variables = self.get_initialized_variables(initializer);

            let mut exprs = variables
                .into_iter()
                .filter_map(|v| self.transform_initialized_variable(v.take()))
                .map(Expr::from)
                .map(Box::new)
                .collect::<Vec<_>>();
            node.init = if exprs.is_empty() {
                None
            } else {
                Some(VarDeclOrExpr::Expr(if exprs.len() == 1 {
                    exprs.remove(0)
                } else {
                    SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    }
                    .into()
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

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
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

        if self.in_statement_containing_yield {
            self.begin_script_loop_block();
        }

        if let ForHead::VarDecl(initializer) = &mut node.left {
            for variable in &initializer.decls {
                self.hoist_variable_declaration(&Ident::from(variable.name.as_ident().unwrap()));
            }

            node.right.visit_mut_with(self);
            node.body.visit_mut_with(self);
        } else {
            node.visit_mut_children_with(self);
        }

        if self.in_statement_containing_yield {
            self.end_loop_block();
        }
    }

    #[tracing::instrument(skip_all)]
    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        match node {
            Stmt::Break(b) => {
                if self.in_statement_containing_yield {
                    let label = self.find_break_target(b.label.as_ref().map(|l| l.sym.clone()));
                    if label.0 > 0 {
                        *node = self.create_inline_break(label, Some(b.span)).into();
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

            Stmt::Decl(Decl::Var(v)) => {
                if contains_yield(&*v) {
                    self.transform_and_emit_var_decl_list(v.take());
                    node.take();
                    return;
                }

                // // Do not hoist custom prologues.
                // if (getEmitFlags(node) & EmitFlags.CustomPrologue) {
                //     return node;
                // }

                for decl in v.decls.iter() {
                    self.hoist_variable_declaration(&Ident::from(decl.name.as_ident().unwrap()));
                }

                let variables = self.get_initialized_variables(v);
                if variables.is_empty() {
                    node.take();
                    return;
                }

                let mut exprs = variables
                    .into_iter()
                    .filter_map(|v| self.transform_initialized_variable(v.take()))
                    .map(Expr::from)
                    .map(Box::new)
                    .collect::<Vec<_>>();

                if exprs.is_empty() {
                    node.take();
                    return;
                }

                *node = ExprStmt {
                    span: v.span,
                    expr: if exprs.len() == 1 {
                        exprs.remove(0)
                    } else {
                        SeqExpr {
                            span: DUMMY_SP,
                            exprs,
                        }
                        .into()
                    },
                }
                .into();
            }
            Stmt::Decl(Decl::Fn(f)) => {
                self.hoisted_fns.push(f.take());
                node.take();
            }
            _ => {
                node.visit_mut_children_with(self);
            }
        }
    }
}

enum CompiledProp {
    Prop(Prop),
    Accessor(Option<GetterProp>, Option<SetterProp>),
}

impl Generator {
    fn visit_elements(
        &mut self,
        elements: &mut [Option<ExprOrSpread>],
        mut leading_element: Option<ExprOrSpread>,
        _loc: Option<Span>,
    ) -> Expr {
        // [source]
        //      ar = [1, yield, 2];
        //
        // [intermediate]
        //  .local _a
        //      _a = [1];
        //  .yield resumeLabel
        //  .mark resumeLabel
        //      ar = _a.concat([%sent%, 2]);

        let num_initial_elements = self.count_initial_nodes_without_yield(elements);

        let mut temp = None;
        if num_initial_elements > 0 {
            temp = Some(self.declare_local(None));

            elements[0..num_initial_elements]
                .iter_mut()
                .for_each(|e| e.visit_mut_with(self));

            self.emit_assignment(
                temp.clone().unwrap().into(),
                ArrayLit {
                    span: DUMMY_SP,
                    elems: leading_element
                        .take()
                        .into_iter()
                        .map(Some)
                        .chain(
                            elements
                                .iter_mut()
                                .take(num_initial_elements)
                                .map(|e| e.take()),
                        )
                        .collect(),
                }
                .into(),
                None,
            );
        }

        let expressions = elements
            .iter_mut()
            .skip(num_initial_elements)
            .map(|v| v.take())
            .fold(Vec::new(), |exprs, element| {
                self.reduce_element(exprs, element, &mut leading_element, &mut temp)
            });

        if let Some(temp) = temp {
            CallExpr {
                span: DUMMY_SP,
                callee: temp.make_member(quote_ident!("concat")).as_callee(),
                args: vec![ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Array(ArrayLit {
                        span: DUMMY_SP,
                        elems: expressions,
                    })),
                }],
                ..Default::default()
            }
            .into()
        } else {
            ArrayLit {
                span: DUMMY_SP,
                elems: leading_element
                    .take()
                    .into_iter()
                    .map(Some)
                    .chain(expressions)
                    .collect(),
            }
            .into()
        }
    }

    fn reduce_element(
        &mut self,
        mut expressions: Vec<Option<ExprOrSpread>>,
        mut element: Option<ExprOrSpread>,
        leading_element: &mut Option<ExprOrSpread>,
        temp: &mut Option<Ident>,
    ) -> Vec<Option<ExprOrSpread>> {
        if contains_yield(&element) && !expressions.is_empty() {
            let has_assigned_temp = temp.is_some();
            if temp.is_none() {
                *temp = Some(self.declare_local(None));
            }

            self.emit_assignment(
                temp.clone().unwrap().into(),
                if has_assigned_temp {
                    CallExpr {
                        span: DUMMY_SP,
                        callee: temp
                            .clone()
                            .unwrap()
                            .make_member(quote_ident!("concat"))
                            .as_callee(),
                        args: vec![Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: expressions.take(),
                        }))
                        .as_arg()],
                        ..Default::default()
                    }
                    .into()
                } else {
                    Box::new(
                        ArrayLit {
                            span: DUMMY_SP,
                            elems: leading_element
                                .take()
                                .into_iter()
                                .map(Some)
                                .chain(expressions.take())
                                .collect(),
                        }
                        .into(),
                    )
                },
                None,
            );
            *leading_element = None;
        }

        element.visit_mut_with(self);
        if element.is_some() {
            expressions.push(element);
        }
        expressions
    }

    fn reduce_property(
        &mut self,
        mut expressions: Vec<Box<Expr>>,
        property: CompiledProp,
        temp: &mut Ident,
    ) -> Vec<Box<Expr>> {
        if match &property {
            CompiledProp::Prop(p) => contains_yield(p),
            CompiledProp::Accessor(g, s) => {
                g.as_ref().map_or(false, contains_yield) || s.as_ref().map_or(false, contains_yield)
            }
        } && !expressions.is_empty()
        {
            self.emit_stmt(
                ExprStmt {
                    span: DUMMY_SP,
                    expr: Expr::from_exprs(expressions.take()),
                }
                .into(),
            );
        }

        let mut expression: Expr = match property {
            CompiledProp::Prop(p) => match p {
                Prop::Shorthand(p) => AssignExpr {
                    span: p.span,
                    op: op!("="),
                    left: MemberExpr {
                        span: DUMMY_SP,
                        obj: temp.clone().into(),
                        prop: MemberProp::Ident(p.clone().into()),
                    }
                    .into(),
                    right: p.into(),
                }
                .into(),
                Prop::KeyValue(p) => AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: MemberExpr {
                        span: DUMMY_SP,
                        obj: temp.clone().into(),
                        prop: p.key.into(),
                    }
                    .into(),
                    right: p.value,
                }
                .into(),
                Prop::Assign(_) => {
                    unreachable!("assignment property be removed before generator pass")
                }
                Prop::Getter(_) | Prop::Setter(_) => {
                    unreachable!("getter/setter property be compiled as CompiledProp::Accessor")
                }
                Prop::Method(p) => AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: MemberExpr {
                        span: DUMMY_SP,
                        obj: temp.clone().into(),
                        prop: p.key.into(),
                    }
                    .into(),
                    right: p.function.into(),
                }
                .into(),
            },
            CompiledProp::Accessor(getter, setter) => {
                let key = getter
                    .as_ref()
                    .map(|v| v.key.clone())
                    .unwrap_or_else(|| setter.as_ref().unwrap().key.clone());

                let desc = ObjectLit {
                    span: DUMMY_SP,
                    props: getter
                        .map(|g| KeyValueProp {
                            key: quote_ident!("get").into(),
                            value: Function {
                                params: Vec::new(),
                                span: g.span,
                                body: g.body,
                                is_generator: false,
                                is_async: false,
                                ..Default::default()
                            }
                            .into(),
                        })
                        .into_iter()
                        .chain(setter.map(|s| {
                            KeyValueProp {
                                key: quote_ident!("set").into(),
                                value: Function {
                                    params: vec![(*s.param).into()],
                                    span: s.span,
                                    body: s.body,
                                    is_generator: false,
                                    is_async: false,
                                    ..Default::default()
                                }
                                .into(),
                            }
                        }))
                        .map(Prop::KeyValue)
                        .map(Box::new)
                        .map(PropOrSpread::Prop)
                        .collect(),
                };

                CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(define_property),
                    args: vec![
                        temp.clone().as_arg(),
                        prop_name_to_expr_value(key).as_arg(),
                        desc.as_arg(),
                    ],
                    ..Default::default()
                }
                .into()
            }
        };

        expression.visit_mut_with(self);
        if !expression.is_invalid() {
            expressions.push(Box::new(expression));
        }
        expressions
    }

    fn visit_left_associative_bin_expr(&mut self, node: &mut BinExpr) -> Option<Expr> {
        if contains_yield(&node.right) {
            if matches!(node.op, op!("||") | op!("&&")) {
                return Some(self.visit_logical_bin_expr(node));
            }

            // [source]
            //      a() + (yield) + c()
            //
            // [intermediate]
            //  .local _a
            //      _a = a();
            //  .yield resumeLabel
            //      _a + %sent% + c()

            node.left.visit_mut_with(self);
            node.left = self.cache_expression(node.left.take()).into();
            node.right.visit_mut_with(self);
            return None;
        }

        node.visit_mut_children_with(self);
        None
    }

    fn visit_logical_bin_expr(&mut self, node: &mut BinExpr) -> Expr {
        // Logical binary expressions (`&&` and `||`) are shortcutting
        // expressions and need to be transformed as such:
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

        let result_label = self.define_label();
        let result_local = self.declare_local(None);

        let left_span = node.left.span();
        node.left.visit_mut_with(self);
        self.emit_assignment(
            result_local.clone().into(),
            node.left.take(),
            Some(left_span),
        );

        if node.op == op!("&&") {
            // Logical `&&` shortcuts when the left-hand operand is falsey.
            self.emit_break_when_false(
                result_label,
                Box::new(result_local.clone().into()),
                Some(left_span),
            )
        } else {
            // Logical `||` shortcuts when the left-hand operand is truthy.
            self.emit_break_when_true(
                result_label,
                Box::new(result_local.clone().into()),
                Some(left_span),
            )
        }

        let right_span = node.right.span();
        node.right.visit_mut_with(self);
        self.emit_assignment(
            result_local.clone().into(),
            node.right.take(),
            Some(right_span),
        );
        self.mark_label(result_label);

        result_local.into()
    }

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
        let _tracing = dev_span!("transform_and_emit_stmt");

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
            Stmt::Try(s) => self.transform_and_emit_try_stmt(*s),
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
            self.emit_stmt(node.into());
        }
    }

    fn transform_and_emit_expr_stmt(&mut self, mut node: ExprStmt) {
        node.visit_mut_with(self);

        self.emit_stmt(node.into());
    }

    fn transform_and_emit_var_decl_list(&mut self, mut node: Box<VarDecl>) {
        for variable in &node.decls {
            self.hoist_variable_declaration(&Ident::from(variable.name.as_ident().unwrap()));
        }

        let mut variables = self.get_initialized_variables(&mut node);
        let var_len = variables.len();
        let mut variables_written = 0;
        let mut pending_expressions = Vec::new();
        let mut cnt = 0;

        while variables_written < var_len {
            #[cfg(debug_assertions)]
            debug!("variables_written: {} / {}", variables_written, var_len);

            for (_i, variable) in variables.iter_mut().enumerate().skip(variables_written) {
                if contains_yield(&**variable) && cnt != 0 {
                    break;
                }

                // We use cnt because variable.init can be None.
                let expr = self.transform_initialized_variable(variable.take());

                pending_expressions.extend(expr.map(Expr::from).map(Box::new));
                cnt += 1;
            }

            if cnt > 0 {
                variables_written += cnt;
                cnt = 0;

                self.emit_stmt(
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: if pending_expressions.len() == 1 {
                            pending_expressions.pop().unwrap()
                        } else {
                            SeqExpr {
                                span: DUMMY_SP,
                                exprs: take(&mut pending_expressions),
                            }
                            .into()
                        },
                    }
                    .into(),
                )
            }
        }
    }

    fn transform_initialized_variable(&mut self, mut node: VarDeclarator) -> Option<AssignExpr> {
        node.init.visit_mut_with(self);

        node.init.map(|right| AssignExpr {
            span: node.span,
            op: op!("="),
            left: node.name.clone().try_into().unwrap(),
            right,
        })
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
                self.emit_stmt(node.into());
            }
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(node.into());
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
            self.emit_stmt(node.into());
        }
    }

    fn transform_and_emit_while_stmt(&mut self, mut node: WhileStmt) {
        let _tracing = dev_span!("transform_and_emit_while_stmt");

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
            self.transform_and_emit_embedded_stmt(*node.body);
            self.emit_break(loop_label, None);
            self.end_loop_block();
        } else {
            node.visit_mut_with(self);

            self.emit_stmt(node.into());
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
                        self.emit_stmt(
                            ExprStmt {
                                span: init.span(),
                                expr: init,
                            }
                            .into(),
                        );
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

                self.emit_stmt(
                    ExprStmt {
                        span: incrementor.span(),
                        expr: incrementor,
                    }
                    .into(),
                );
            }

            self.emit_break(condition_label, None);
            self.end_loop_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(node.into());
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
                keys_array.clone().into(),
                Box::new(ArrayLit::dummy().into()),
                None,
            );

            node.right.visit_mut_with(self);
            self.emit_stmt(
                ForInStmt {
                    span: DUMMY_SP,
                    left: ForHead::Pat(key.clone().into()),
                    right: node.right.take(),
                    body: Box::new(Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: CallExpr {
                            span: DUMMY_SP,
                            callee: keys_array
                                .clone()
                                .make_member(quote_ident!("push"))
                                .as_callee(),
                            args: vec![key.as_arg()],
                            ..Default::default()
                        }
                        .into(),
                    })),
                }
                .into(),
            );

            self.emit_assignment(keys_index.clone().into(), 0.into(), None);

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

            let variable = match node.left {
                ForHead::VarDecl(initializer) => {
                    for variable in initializer.decls.iter() {
                        self.hoist_variable_declaration(&Ident::from(
                            variable.name.as_ident().unwrap(),
                        ));
                    }

                    initializer.decls[0].name.clone()
                }
                ForHead::Pat(mut initializer) => {
                    initializer.visit_mut_with(self);
                    *initializer
                }

                ForHead::UsingDecl(..) => {
                    unreachable!("using declaration must be removed by previous pass")
                }
            };
            self.emit_assignment(
                variable.try_into().unwrap(),
                MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(keys_array.into()),
                    prop: MemberProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: Box::new(keys_index.clone().into()),
                    }),
                }
                .into(),
                None,
            );
            self.transform_and_emit_embedded_stmt(*node.body);

            self.mark_label(increment_label);
            self.emit_stmt(
                ExprStmt {
                    span: DUMMY_SP,
                    expr: UpdateExpr {
                        span: DUMMY_SP,
                        prefix: false,
                        op: op!("++"),
                        arg: Box::new(keys_index.clone().into()),
                    }
                    .into(),
                }
                .into(),
            );

            self.emit_break(condition_label, None);
            self.end_loop_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(node.into());
        }
    }

    fn transform_and_emit_continue_stmt(&mut self, node: ContinueStmt) {
        let label = self.find_continue_target(node.label.as_ref().map(|l| l.sym.clone()));
        if label.0 > 0 {
            self.emit_break(label, Some(node.span));
        } else {
            // invalid continue without a containing loop. Leave the node as is,
            // per #17875.
            self.emit_stmt(node.into())
        }
    }

    fn transform_and_emit_break_stmt(&mut self, node: BreakStmt) {
        let label = self.find_break_target(node.label.as_ref().map(|l| l.sym.clone()));
        if label.0 > 0 {
            self.emit_break(label, Some(node.span));
        } else {
            // invalid break without a containing loop. Leave the node as is,
            // per #17875.
            self.emit_stmt(node.into())
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
            self.emit_stmt(node.into());
        }
    }

    fn transform_and_emit_switch_stmt(&mut self, mut node: SwitchStmt) {
        if contains_yield(&node.cases) {
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
            let mut pending_clauses = Vec::new();

            while clauses_written < node.cases.len() {
                #[cfg(debug_assertions)]
                debug!("clauses_written: {}", clauses_written);

                let mut default_clauses_skipped = 0;

                for (i, clause) in node.cases.iter_mut().enumerate().skip(clauses_written) {
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
                    self.emit_stmt(
                        SwitchStmt {
                            span: DUMMY_SP,
                            discriminant: expression.clone().into(),
                            cases: take(&mut pending_clauses),
                        }
                        .into(),
                    );
                }

                if default_clauses_skipped > 0 {
                    clauses_written += default_clauses_skipped;
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
            self.emit_stmt(node.into())
        }
    }

    fn transform_and_emit_labeled_stmt(&mut self, mut node: LabeledStmt) {
        #[cfg(debug_assertions)]
        debug!("transform_and_emit_labeled_stmt: {:?}", node.label);

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
            self.emit_stmt(node.into());
        }
    }

    fn transform_and_emit_throw_stmt(&mut self, mut node: ThrowStmt) {
        node.arg.visit_mut_with(self);
        self.emit_throw(node.arg, Some(node.span))
    }

    fn transform_and_emit_try_stmt(&mut self, mut node: TryStmt) {
        let _tracing = dev_span!("transform_and_emit_try_stmt");

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
            self.transform_and_emit_embedded_stmt(node.block.into());
            if let Some(catch) = node.handler {
                self.begin_catch_block(VarDeclarator {
                    name: catch.param.clone().unwrap(),
                    ..Take::dummy()
                });
                self.transform_and_emit_embedded_stmt(catch.body.into());
            }

            if let Some(finalizer) = node.finalizer {
                self.begin_finally_block();
                self.transform_and_emit_embedded_stmt(finalizer.into());
            }

            self.end_exception_block();
        } else {
            node.visit_mut_with(self);
            self.emit_stmt(node.into());
        }
    }

    fn count_initial_nodes_without_yield<N>(&self, nodes: &[N]) -> usize
    where
        N: VisitWith<YieldFinder>,
    {
        for (i, node) in nodes.iter().enumerate() {
            if contains_yield(node) {
                return i;
            }
        }

        0
    }

    fn cache_expression(&mut self, node: Box<Expr>) -> Ident {
        match *node {
            Expr::Ident(i) => i,
            _ => {
                let span = node.span();

                let temp = self.create_temp_variable();
                self.emit_assignment(temp.clone().into(), node, Some(span));
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

        let label = Label(self.next_label_id as _);
        self.next_label_id += 1;
        #[cfg(debug_assertions)]
        debug!("define_label: {:?}", label);

        if label.0 as usize >= self.label_offsets.as_ref().unwrap().len() {
            self.label_offsets
                .as_mut()
                .unwrap()
                .resize(label.0 as usize + 1, 0);
        }
        self.label_offsets.as_mut().unwrap()[label.0 as usize] = -1;
        label
    }

    /// Marks the current operation with the specified label.
    fn mark_label(&mut self, label: Label) {
        debug_assert!(self.label_offsets.is_some(), "No labels were defined.");

        if label.0 as usize >= self.label_offsets.as_ref().unwrap().len() {
            self.label_offsets
                .as_mut()
                .unwrap()
                .resize(label.0 as usize + 1, Default::default());
        }

        self.label_offsets.as_mut().unwrap()[label.0 as usize] =
            self.operations.as_deref().map_or(0, |v| v.len() as _);

        #[cfg(debug_assertions)]
        debug!(
            "mark_label: {:?}; offset: {}",
            label,
            self.label_offsets.as_mut().unwrap()[label.0 as usize]
        );
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
        } else {
            unreachable!()
        }
    }

    /// Begins a code block for a generated `try` statement.
    fn begin_exception_block(&mut self) -> Label {
        let _tracing = dev_span!("begin_exception_block");

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

        let name = variable.name.expect_ident().into();
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
            name.clone().into(),
            CallExpr {
                span: DUMMY_SP,
                callee: self
                    .state
                    .clone()
                    .make_member(quote_ident!("sent"))
                    .as_callee(),
                args: Vec::new(),
                ..Default::default()
            }
            .into(),
            None,
        );

        self.emit_nop();
    }

    /// Enters the `finally` block of a generated `try` statement.
    fn begin_finally_block(&mut self) {
        let _tracing = dev_span!("begin_finally_block");

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
        } else {
            unreachable!()
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
        } else {
            unreachable!()
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
        let _tracing = dev_span!("begin_loop_block");

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
        } else {
            unreachable!()
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
        } else {
            unreachable!()
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
        for i in (0..=start).rev() {
            let block = self.block_stack.as_ref().unwrap()[i].clone();
            if self.supports_labeled_break_or_continue(&block.borrow()) {
                if let CodeBlock::Labeled(block) = &*block.borrow() {
                    if block.label_text == *label_text {
                        return true;
                    }
                } else {
                    unreachable!()
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
        #[cfg(debug_assertions)]
        debug!("find_break_target: label_text={:?}", label_text);

        if let Some(block_stack) = &self.block_stack {
            if let Some(label_text) = label_text {
                for i in (0..=block_stack.len() - 1).rev() {
                    let block = &block_stack[i];
                    if (self.supports_labeled_break_or_continue(&block.borrow())
                        && block.borrow().label_text().unwrap() == label_text)
                        || (self.supports_unlabeled_break(&block.borrow())
                            && self.has_immediate_containing_labeled_block(&label_text, i - 1))
                    {
                        return block.borrow().break_label().unwrap();
                    }
                }
            } else {
                for i in (0..=block_stack.len() - 1).rev() {
                    let block = &block_stack[i];
                    if self.supports_unlabeled_break(&block.borrow()) {
                        return block.borrow().break_label().unwrap();
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
                for i in (0..=block_stack.len() - 1).rev() {
                    let block = &block_stack[i];
                    if self.supports_unlabeled_continue(&block.borrow())
                        && self.has_immediate_containing_labeled_block(&label_text, i - 1)
                    {
                        return block.borrow().continue_label().unwrap();
                    }
                }
            } else {
                for i in (0..=block_stack.len() - 1).rev() {
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
                #[cfg(debug_assertions)]
                debug!("create_label: label={:?}", label);

                if self.label_exprs.is_none() {
                    self.label_exprs = Some(Default::default());
                }
                let label_expressions = self.label_exprs.as_mut().unwrap();
                let expr = Loc {
                    pos: BytePos(label.0 as _),
                    value: -1,
                };
                if label_expressions.get(label.0 as usize).is_none() {
                    if label.0 as usize >= label_expressions.len() {
                        label_expressions.resize(label.0 as usize + 1, Vec::new());
                    }

                    label_expressions[label.0 as usize] = vec![expr];
                } else {
                    label_expressions
                        .get_mut(label.0 as usize)
                        .unwrap()
                        .push(expr);
                }
                return Invalid {
                    span: Span::new(BytePos(label.0 as _), BytePos(label.0 as _)),
                }
                .into();
            }
        }

        Box::new(Invalid { span: DUMMY_SP }.into())
    }

    /// Creates a numeric literal for the provided instruction.
    fn create_instruction(&mut self, instruction: Instruction) -> Number {
        // TODO(kdy1):
        // self.add_synthetic_trailing_comment(
        //     literal,
        //     SyntaxKind::MultiLineCommentTrivia,
        //     get_instruction_name(instruction),
        // );
        Number {
            span: DUMMY_SP,
            value: instruction as u16 as _,
            raw: None,
        }
    }

    /// Creates a statement that can be used indicate a Break operation to the
    /// provided label.
    ///
    /// - `label`: A label.
    /// - `location`: An optional source map location for the statement.
    fn create_inline_break(&mut self, label: Label, span: Option<Span>) -> ReturnStmt {
        debug_assert!(label.0 >= 0, "Invalid label");
        let args = vec![
            Some(self.create_instruction(Instruction::Break).as_arg()),
            Some(self.create_label(Some(label)).as_arg()),
        ];
        ReturnStmt {
            span: span.unwrap_or(DUMMY_SP),
            arg: Some(
                ArrayLit {
                    span: DUMMY_SP,
                    elems: args,
                }
                .into(),
            ),
        }
    }

    /// Creates a statement that can be used indicate a Return operation.
    ///
    /// - `expr`: The expression for the return statement.
    /// - `loc`: An optional source map location for the statement.
    fn create_inline_return(&mut self, expr: Option<Box<Expr>>, loc: Option<Span>) -> ReturnStmt {
        ReturnStmt {
            span: loc.unwrap_or(DUMMY_SP),
            arg: Some(
                ArrayLit {
                    span: DUMMY_SP,
                    elems: match expr {
                        Some(expr) => vec![
                            Some(self.create_instruction(Instruction::Return).as_arg()),
                            Some(expr.as_arg()),
                        ],
                        None => vec![Some(self.create_instruction(Instruction::Return).as_arg())],
                    },
                }
                .into(),
            ),
        }
    }

    /// Creates an expression that can be used to resume from a Yield operation.
    fn create_generator_resume(&mut self, loc: Option<Span>) -> Box<Expr> {
        CallExpr {
            span: loc.unwrap_or(DUMMY_SP),
            callee: self
                .state
                .clone()
                .make_member(quote_ident!("sent"))
                .as_callee(),
            args: Vec::new(),
            ..Default::default()
        }
        .into()
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
    fn emit_assignment(&mut self, left: AssignTarget, right: Box<Expr>, loc: Option<Span>) {
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
            self.operations = Some(Vec::new());
            self.operation_args = Some(Vec::new());
            self.operation_locs = Some(Vec::new());
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

        self.operations.as_mut().unwrap().push(code);
        self.operation_args.as_mut().unwrap().push(args);
        self.operation_locs
            .as_mut()
            .unwrap()
            .push(loc.unwrap_or(DUMMY_SP));
    }

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
                discriminant: label_expr.into(),
                cases: clauses,
            };
            return vec![Stmt::Switch(switch_stmt)];
        }

        if let Some(stmts) = self.stmts.take() {
            return stmts;
        }

        Vec::new()
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
        if cfg!(debug_assertions) {
            debug!(mark_label_end = mark_label_end, "append_label");
        }

        if self.clauses.is_none() {
            self.clauses = Some(Default::default());
        }

        #[allow(clippy::manual_unwrap_or_default)]
        let stmts = if let Some(mut stmts) = self.stmts.take() {
            if self.with_block_stack.is_some() {
                // The previous label was nested inside one or more `with`
                // blocks, so we surround the statements in
                // generated `with` blocks to create the same environment.

                for (_i, with_block) in self
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
                            ..Default::default()
                        })),
                    })];
                }
            }

            if cfg!(debug_assertions) {
                debug!(
                    "current_exception_block = {:?}",
                    self.current_exception_block
                );
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
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: CallExpr {
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
                            ..Default::default()
                        }
                        .into(),
                    }
                    .into(),
                );
            }

            if mark_label_end {
                // The case clause for the last label falls through to this
                // label, so we add an assignment statement to
                // reflect the change in labels.

                stmts.push(
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: self.state.clone().make_member(quote_ident!("label")).into(),
                            right: (self.label_number + 1).into(),
                        }
                        .into(),
                    }
                    .into(),
                );
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

    #[tracing::instrument(skip(self))]
    fn try_enter_label(&mut self, op_index: usize) {
        if self.label_offsets.is_none() {
            return;
        }

        for (label, label_offset) in self.label_offsets.clone().unwrap().into_iter().enumerate() {
            if label_offset as usize == op_index {
                self.flush_label();

                if self.label_numbers.is_none() {
                    self.label_numbers = Some(Vec::new());
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
                            .resize(self.label_number + 1, Vec::new());
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
                            #[cfg(debug_assertions)]
                            debug!("Label {:?} = {:?} ({:?})", label, expr.value, expr.pos);
                        }
                    }
                }
            }
        }
    }

    /// Tries to enter or leave a code block.
    #[tracing::instrument(skip(self))]
    fn try_enter_or_leave_block(&mut self, op_index: usize) {
        if let Some(blocks) = &self.blocks {
            while self.block_index < self.block_actions.as_ref().unwrap().len()
                && self.block_offsets.as_ref().unwrap()[self.block_index] <= op_index
            {
                #[cfg(debug_assertions)]
                debug!("try_enter_or_leave_block: iter");

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
                                .get_or_insert_with(Default::default)
                                .extend(self.current_exception_block.clone());

                            // https://github.com/swc-project/swc/issues/5913
                            if self.stmts.is_none() {
                                self.stmts = Some(Default::default());
                            }

                            #[cfg(debug_assertions)]
                            debug!("Current exception block: open = Some({:?})", block);
                            self.current_exception_block = Some(block.clone());
                        } else if block_action == BlockAction::Close {
                            self.current_exception_block =
                                self.exception_block_stack.as_mut().unwrap().pop();
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
    #[tracing::instrument(skip(self))]
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

        let args = self.operation_args.as_mut().unwrap()[op_index]
            .take()
            .expect("failed to take operation arguments");
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
    fn write_assign(&mut self, left: AssignTarget, right: Box<Expr>, op_loc: Option<Span>) {
        self.write_stmt(
            ExprStmt {
                span: op_loc.unwrap_or(DUMMY_SP),
                expr: AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left,
                    right,
                }
                .into(),
            }
            .into(),
        )
    }

    /// Writes a Throw operation to the current label's statement list.
    ///
    /// @param expr The value to throw
    /// @param operationLocation The source map location for the operation.
    fn write_throw(&mut self, expr: Box<Expr>, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;
        self.last_operation_was_completion = true;

        // let inst = self.create_instruction(Instruction::Return);
        self.write_stmt(
            ThrowStmt {
                span: op_loc.unwrap_or(DUMMY_SP),
                arg: expr,
            }
            .into(),
        )
    }

    /// Writes a Return operation to the current label's statement list.
    ///
    /// @param label The label for the Break.
    /// @param operationLocation The source map location for the operation.
    fn write_return(&mut self, expr: Option<Box<Expr>>, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;
        self.last_operation_was_completion = true;

        let inst = self.create_instruction(Instruction::Return);
        self.write_stmt(
            ReturnStmt {
                span: op_loc.unwrap_or(DUMMY_SP),
                arg: Some(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: match expr {
                            Some(expr) => {
                                vec![Some(inst.as_arg()), Some(expr.as_arg())]
                            }
                            _ => {
                                vec![Some(inst.as_arg())]
                            }
                        },
                    }
                    .into(),
                ),
            }
            .into(),
        )
    }

    /// Writes a Break operation to the current label's statement list.
    ///
    /// @param label The label for the Break.
    /// @param operationLocation The source map location for the operation.
    fn write_break(&mut self, label: Label, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;

        let inst = self.create_instruction(Instruction::Break);
        let label = self.create_label(Some(label));
        self.write_stmt(
            ReturnStmt {
                span: op_loc.unwrap_or(DUMMY_SP),
                arg: Some(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![Some(inst.as_arg()), Some(label.as_arg())],
                    }
                    .into(),
                ),
            }
            .into(),
        )
    }

    /// Writes a BreakWhenTrue operation to the current label's statement list.
    ///
    /// @param label The label for the Break.
    /// @param condition The condition for the Break.
    /// @param operationLocation The source map location for the operation.
    fn write_break_when_true(&mut self, label: Label, cond: Box<Expr>, op_loc: Option<Span>) {
        let inst = self.create_instruction(Instruction::Break);
        let label = self.create_label(Some(label));
        self.write_stmt(
            IfStmt {
                span: DUMMY_SP,
                test: cond,
                cons: Box::new(Stmt::Return(ReturnStmt {
                    span: op_loc.unwrap_or(DUMMY_SP),
                    arg: Some(
                        ArrayLit {
                            span: DUMMY_SP,
                            elems: vec![Some(inst.as_arg()), Some(label.as_arg())],
                        }
                        .into(),
                    ),
                })),
                alt: None,
            }
            .into(),
        )
    }

    /// Writes a BreakWhenFalse operation to the current label's statement list.
    ///
    /// @param label The label for the Break.
    /// @param condition The condition for the Break.
    /// @param operationLocation The source map location for the operation.
    fn write_break_when_false(&mut self, label: Label, cond: Box<Expr>, op_loc: Option<Span>) {
        let inst = self.create_instruction(Instruction::Break);
        let label = self.create_label(Some(label));
        self.write_stmt(
            IfStmt {
                span: DUMMY_SP,
                test: UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: cond,
                }
                .into(),
                cons: Box::new(Stmt::Return(ReturnStmt {
                    span: op_loc.unwrap_or(DUMMY_SP),
                    arg: Some(
                        ArrayLit {
                            span: DUMMY_SP,
                            elems: vec![Some(inst.as_arg()), Some(label.as_arg())],
                        }
                        .into(),
                    ),
                })),
                alt: None,
            }
            .into(),
        )
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
        self.write_stmt(
            ReturnStmt {
                span: op_loc.unwrap_or(DUMMY_SP),
                arg: Some(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems,
                    }
                    .into(),
                ),
            }
            .into(),
        );
    }

    /// Writes a YieldStar instruction to the current label's statement list.
    ///
    /// - expr: The expression to yield.
    /// - op_loc: The source map location for the operation.
    fn write_yield_star(&mut self, expr: Box<Expr>, op_loc: Option<Span>) {
        self.last_operation_was_abrupt = true;

        let arg1 = self.create_instruction(Instruction::YieldStar);
        self.write_stmt(
            ReturnStmt {
                span: op_loc.unwrap_or(DUMMY_SP),
                arg: Some(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![Some(arg1.as_arg()), Some(expr.as_arg())],
                    }
                    .into(),
                ),
            }
            .into(),
        )
    }

    /// Writes an Endfinally instruction to the current label's statement list.
    fn write_end_finally(&mut self) {
        self.last_operation_was_abrupt = true;

        let arg = self.create_instruction(Instruction::Endfinally);
        self.write_stmt(
            ReturnStmt {
                span: DUMMY_SP,
                arg: Some(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![Some(arg.as_arg())],
                    }
                    .into(),
                ),
            }
            .into(),
        )
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

        self.hoisted_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: i.clone().into(),
            init: None,
            definite: Default::default(),
        });

        i
    }

    /// Returns `(target, this_arg)`
    fn create_call_binding(
        &mut self,
        expr: Box<Expr>,
        is_new_call: bool,
    ) -> (Box<Expr>, Box<Expr>) {
        let mut callee = expr;

        match &mut *callee {
            Expr::Ident(..) => (
                callee.clone(),
                if is_new_call {
                    callee
                } else {
                    Expr::undefined(DUMMY_SP)
                },
            ),

            Expr::Member(MemberExpr { obj, .. }) if !is_new_call => {
                if obj.is_ident() {
                    let this_arg = obj.clone();
                    return (callee, this_arg);
                }

                let this_arg = self.create_temp_variable();
                *obj = Box::new(obj.take().make_assign_to(op!("="), this_arg.clone().into()));

                (callee, this_arg.into())
            }

            _ => {
                if !is_new_call {
                    (callee, Expr::undefined(DUMMY_SP))
                } else {
                    let this_arg = self.create_temp_variable();
                    let target = callee.make_assign_to(op!("="), this_arg.clone().into());
                    (Box::new(target), this_arg.into())
                }
            }
        }
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
    noop_visit_type!(fail);

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
    noop_visit_mut_type!(fail);

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
