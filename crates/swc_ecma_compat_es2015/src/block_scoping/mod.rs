use std::{iter::once, mem::take};

use indexmap::IndexMap;
use smallvec::SmallVec;
use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    Mark, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    find_pat_ids, function::FnEnvHoister, prepend_stmt, private_ident, quote_ident, quote_str,
    ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    noop_visit_mut_type, visit_mut_obj_and_computed, visit_mut_pass, VisitMut, VisitMutWith,
};
use swc_trace_macro::swc_trace;

mod vars;

///
///
/// TODO(kdy1): Optimization
///
/// ```js
/// let functions = [];
/// for (let i = 0; i < 10; i++) {
///    functions.push(function() {
///        let i = 1;
///        console.log(i);
///    });
/// }
/// ```
pub fn block_scoping(unresolved_mark: Mark) -> impl Pass {
    (
        visit_mut_pass(self::vars::block_scoped_vars()),
        visit_mut_pass(BlockScoping {
            unresolved_mark,
            scope: Default::default(),
            vars: Vec::new(),
            var_decl_kind: VarDeclKind::Var,
        }),
    )
}

type ScopeStack = SmallVec<[ScopeKind; 8]>;

#[derive(Debug, PartialEq, Eq)]
enum ScopeKind {
    Loop {
        lexical_var: Vec<Id>,
        args: Vec<Id>,
        /// Produced by identifier reference and consumed by for-of/in loop.
        used: Vec<Id>,
        /// Map of original identifier to modified syntax context
        mutated: AHashMap<Id, SyntaxContext>,
    },
    Fn,
    Block,
}

impl ScopeKind {
    fn new_loop() -> Self {
        ScopeKind::Loop {
            lexical_var: Vec::new(),
            args: Vec::new(),
            used: Vec::new(),
            mutated: Default::default(),
        }
    }
}

struct BlockScoping {
    unresolved_mark: Mark,
    scope: ScopeStack,
    vars: Vec<VarDeclarator>,
    var_decl_kind: VarDeclKind,
}

impl BlockScoping {
    /// This methods remove [ScopeKind::Loop] and [ScopeKind::Fn], but not
    /// [ScopeKind::ForLetLoop]
    fn visit_mut_with_scope<T>(&mut self, kind: ScopeKind, node: &mut T)
    where
        T: VisitMutWith<Self>,
    {
        let remove = !matches!(kind, ScopeKind::Loop { .. });
        self.scope.push(kind);

        node.visit_mut_with(self);

        if remove {
            self.scope.pop();
        }
    }

    fn mark_as_used(&mut self, i: Id) {
        // Only consider the variable used in a non-ScopeKind::Loop, which means it is
        // captured in a closure
        for scope in self
            .scope
            .iter_mut()
            .rev()
            .skip_while(|scope| matches!(scope, ScopeKind::Loop { .. }))
        {
            if let ScopeKind::Loop {
                lexical_var, used, ..
            } = scope
            {
                if lexical_var.contains(&i) {
                    used.push(i);
                    return;
                }
            }
        }
    }

    fn in_loop_body(&self) -> bool {
        self.scope
            .last()
            .map(|scope| matches!(scope, ScopeKind::Loop { .. }))
            .unwrap_or(false)
    }

    fn handle_capture_of_vars(&mut self, body: &mut Box<Stmt>) {
        let body_stmt = &mut **body;

        if let Some(ScopeKind::Loop {
            args,
            used,
            mutated,
            ..
        }) = self.scope.pop()
        {
            if used.is_empty() {
                return;
            }

            let mut env_hoister =
                FnEnvHoister::new(SyntaxContext::empty().apply_mark(self.unresolved_mark));
            body_stmt.visit_mut_with(&mut env_hoister);
            let mut inits: Vec<Box<Expr>> = Vec::new();

            for mut var in env_hoister.to_decl() {
                if let Some(init) = var.init.take() {
                    inits.push(
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: var.name.clone().try_into().unwrap(),
                            right: init,
                        }
                        .into(),
                    );
                }

                self.vars.push(var);
            }

            let mut flow_helper = FlowHelper {
                all: &args,
                has_break: false,
                has_return: false,
                has_yield: false,
                has_await: false,
                label: IndexMap::new(),
                inner_label: AHashSet::default(),
                mutated,
                in_switch_case: false,
                in_nested_loop: false,
            };

            body_stmt.visit_mut_with(&mut flow_helper);

            let mut body_stmt = match &mut body_stmt.take() {
                Stmt::Block(bs) => bs.take(),
                body => BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![body.take()],
                    ..Default::default()
                },
            };

            if !flow_helper.mutated.is_empty() {
                let no_modification = flow_helper.mutated.is_empty();
                let mut v = MutationHandler {
                    map: &mut flow_helper.mutated,
                    in_function: false,
                };

                // Modifies identifiers, and add reassignments to break / continue / return
                body_stmt.visit_mut_with(&mut v);

                if !no_modification
                    && body_stmt
                        .stmts
                        .last()
                        .map(|s| !matches!(s, Stmt::Return(..)))
                        .unwrap_or(true)
                {
                    body_stmt.stmts.push(v.make_reassignment(None).into_stmt());
                }
            }

            let var_name = private_ident!("_loop");

            self.vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: var_name.clone().into(),
                init: Some(
                    Function {
                        span: DUMMY_SP,
                        params: args
                            .iter()
                            .map(|i| {
                                let ctxt = flow_helper.mutated.get(i).copied().unwrap_or(i.1);

                                Param {
                                    span: DUMMY_SP,
                                    decorators: Default::default(),
                                    pat: Ident::new(i.0.clone(), DUMMY_SP, ctxt).into(),
                                }
                            })
                            .collect(),
                        decorators: Default::default(),
                        body: Some(body_stmt),
                        is_generator: flow_helper.has_yield,
                        is_async: flow_helper.has_await,
                        ..Default::default()
                    }
                    .into(),
                ),
                definite: false,
            });

            let mut call: Expr = CallExpr {
                span: DUMMY_SP,
                callee: var_name.as_callee(),
                args: args
                    .iter()
                    .cloned()
                    .map(|i| Ident::new(i.0, DUMMY_SP, i.1).as_arg())
                    .collect(),
                ..Default::default()
            }
            .into();

            if flow_helper.has_await {
                call = AwaitExpr {
                    span: DUMMY_SP,
                    arg: call.into(),
                }
                .into();
            }

            if flow_helper.has_yield {
                call = YieldExpr {
                    span: DUMMY_SP,
                    arg: Some(call.into()),
                    delegate: true,
                }
                .into();
            }

            if !inits.is_empty() {
                call = SeqExpr {
                    span: DUMMY_SP,
                    exprs: inits.into_iter().chain(once(Box::new(call))).collect(),
                }
                .into()
            }

            if flow_helper.has_return || flow_helper.has_break || !flow_helper.label.is_empty() {
                let ret = private_ident!("_ret");

                let mut stmts = vec![
                    // var _ret = _loop(i);
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: ret.clone().into(),
                            init: Some(Box::new(call.take())),
                            definite: false,
                        }],
                        ..Default::default()
                    }
                    .into(),
                ];

                if flow_helper.has_return {
                    // if (_type_of(_ret) === "object") return _ret.v;
                    stmts.push(
                        IfStmt {
                            span: DUMMY_SP,
                            test: BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: {
                                    // _type_of(_ret)
                                    let callee = helper!(type_of);

                                    CallExpr {
                                        span: Default::default(),
                                        callee,
                                        args: vec![ret.clone().as_arg()],
                                        ..Default::default()
                                    }
                                    .into()
                                },
                                //"object"
                                right: "object".into(),
                            }
                            .into(),
                            cons: Box::new(
                                ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(ret.clone().make_member(quote_ident!("v")).into()),
                                }
                                .into(),
                            ),
                            alt: None,
                        }
                        .into(),
                    )
                }

                if flow_helper.has_break {
                    stmts.push(
                        IfStmt {
                            span: DUMMY_SP,
                            test: ret.clone().make_eq(quote_str!("break")).into(),
                            cons: BreakStmt {
                                span: DUMMY_SP,
                                label: None,
                            }
                            .into(),
                            alt: None,
                        }
                        .into(),
                    );
                }

                if !flow_helper.label.is_empty() {
                    stmts.push(
                        SwitchStmt {
                            span: DUMMY_SP,
                            discriminant: Box::new(ret.into()),
                            cases: flow_helper
                                .label
                                .into_iter()
                                .map(|(key, label)| SwitchCase {
                                    span: DUMMY_SP,
                                    test: Some(Box::new(key.into())),
                                    cons: vec![match label {
                                        Label::Break(id) => Stmt::Break(BreakStmt {
                                            span: DUMMY_SP,
                                            label: Some(id),
                                        }),

                                        Label::Continue(id) => Stmt::Continue(ContinueStmt {
                                            span: DUMMY_SP,
                                            label: Some(id),
                                        }),
                                    }],
                                })
                                .collect(),
                        }
                        .into(),
                    );
                }

                *body = Box::new(
                    BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                        ..Default::default()
                    }
                    .into(),
                );
                return;
            }

            *body = Box::new(call.take().into_stmt());
        }
    }

    /// This method will turn stmt like
    /// ```js
    /// for (let i in [1, 2])
    ///   for (let j in [1, 2])
    ///     console.log(i, j)
    /// ```
    /// into
    /// ```js
    /// for (let i in [1, 2]) {
    ///   for (let j in [1, 2]) {
    ///     console.log(i, j)
    ///   }
    /// }
    /// ```
    /// which fixes https://github.com/swc-project/swc/issues/6573
    fn blockify_for_stmt_body(&self, body: &mut Box<Stmt>) -> bool {
        if !body.is_block() {
            *body = Box::new(
                BlockStmt {
                    span: Default::default(),
                    stmts: vec![*body.take()],
                    ..Default::default()
                }
                .into(),
            );
            true
        } else {
            false
        }
    }

    fn undo_blockify_for_stmt_body(&self, body: &mut Box<Stmt>, blockifyed: bool) {
        if blockifyed {
            let stmt = body
                .as_mut_block()
                .and_then(|block| (block.stmts.len() == 1).then(|| block.stmts[0].take()));
            if let Some(stmt) = stmt {
                *body = Box::new(stmt)
            }
        }
    }
}

#[swc_trace]
impl VisitMut for BlockScoping {
    noop_visit_mut_type!(fail);

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        n.params.visit_mut_with(self);
        self.visit_mut_with_scope(ScopeKind::Fn, &mut n.body);
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let vars = take(&mut self.vars);
        n.visit_mut_children_with(self);
        debug_assert_eq!(self.vars, Vec::new());
        self.vars = vars;
    }

    fn visit_mut_constructor(&mut self, f: &mut Constructor) {
        f.key.visit_mut_with(self);
        f.params.visit_mut_with(self);
        self.visit_mut_with_scope(ScopeKind::Fn, &mut f.body);
    }

    fn visit_mut_do_while_stmt(&mut self, node: &mut DoWhileStmt) {
        self.visit_mut_with_scope(ScopeKind::new_loop(), &mut node.body);

        node.test.visit_mut_with(self);
        self.handle_capture_of_vars(&mut node.body);
    }

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        let blockifyed = self.blockify_for_stmt_body(&mut node.body);
        let lexical_var = if let ForHead::VarDecl(decl) = &node.left {
            find_lexical_vars(decl)
        } else {
            Vec::new()
        };
        let args = lexical_var.clone();

        self.visit_mut_with_scope(ScopeKind::Block, &mut node.left);

        node.right.visit_mut_with(self);

        let kind = ScopeKind::Loop {
            lexical_var,
            args,
            used: Vec::new(),
            mutated: Default::default(),
        };

        self.visit_mut_with_scope(kind, &mut node.body);
        self.handle_capture_of_vars(&mut node.body);
        self.undo_blockify_for_stmt_body(&mut node.body, blockifyed);
    }

    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        let blockifyed = self.blockify_for_stmt_body(&mut node.body);
        let vars = if let ForHead::VarDecl(decl) = &node.left {
            find_lexical_vars(decl)
        } else {
            Vec::new()
        };

        self.visit_mut_with_scope(ScopeKind::Block, &mut node.left);

        let args = vars.clone();

        node.right.visit_mut_with(self);

        let kind = ScopeKind::Loop {
            lexical_var: vars,
            args,
            used: Vec::new(),
            mutated: Default::default(),
        };

        self.visit_mut_with_scope(kind, &mut node.body);
        self.handle_capture_of_vars(&mut node.body);
        self.undo_blockify_for_stmt_body(&mut node.body, blockifyed);
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        let blockifyed = self.blockify_for_stmt_body(&mut node.body);
        let lexical_var = if let Some(VarDeclOrExpr::VarDecl(decl)) = &node.init {
            find_lexical_vars(decl)
        } else {
            Vec::new()
        };

        node.init.visit_mut_with(self);
        let args = lexical_var.clone();

        node.test.visit_mut_with(self);
        node.update.visit_mut_with(self);

        let kind = ScopeKind::Loop {
            lexical_var,
            args,
            used: Vec::new(),
            mutated: Default::default(),
        };
        self.visit_mut_with_scope(kind, &mut node.body);
        self.handle_capture_of_vars(&mut node.body);
        self.undo_blockify_for_stmt_body(&mut node.body, blockifyed);
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        f.params.visit_mut_with(self);
        f.decorators.visit_mut_with(self);
        self.visit_mut_with_scope(ScopeKind::Fn, &mut f.body);
    }

    fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
        f.key.visit_mut_with(self);
        self.visit_mut_with_scope(ScopeKind::Fn, &mut f.body);
    }

    fn visit_mut_ident(&mut self, node: &mut Ident) {
        let id = node.to_id();
        self.mark_as_used(id);
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(stmts);
    }

    fn visit_mut_setter_prop(&mut self, f: &mut SetterProp) {
        f.key.visit_mut_with(self);
        f.param.visit_mut_with(self);
        self.visit_mut_with_scope(ScopeKind::Fn, &mut f.body);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_switch_case(&mut self, n: &mut SwitchCase) {
        let old_vars = self.vars.take();

        n.visit_mut_children_with(self);

        self.vars = old_vars;
    }

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        let old = self.var_decl_kind;
        self.var_decl_kind = var.kind;
        if let Some(ScopeKind::Loop { lexical_var, .. }) = self.scope.last_mut() {
            lexical_var.extend(find_lexical_vars(var));
        }

        var.visit_mut_children_with(self);

        self.var_decl_kind = old;

        var.kind = VarDeclKind::Var;
    }

    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        var.visit_mut_children_with(self);

        if self.in_loop_body() && var.init.is_none() {
            if self.var_decl_kind == VarDeclKind::Var {
                var.init = None
            } else {
                var.init = Some(Expr::undefined(var.span()))
            }
        }
    }

    fn visit_mut_while_stmt(&mut self, node: &mut WhileStmt) {
        self.visit_mut_with_scope(ScopeKind::new_loop(), &mut node.body);

        node.test.visit_mut_with(self);
        self.handle_capture_of_vars(&mut node.body);
    }
}

impl BlockScoping {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self>,
    {
        stmts.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend_stmt(
                stmts,
                T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: take(&mut self.vars),
                        ..Default::default()
                    }
                    .into(),
                ),
            );
        }
    }
}

fn find_lexical_vars(node: &VarDecl) -> Vec<Id> {
    if node.kind == VarDeclKind::Var {
        return Vec::new();
    }

    find_pat_ids(&node.decls)
}

struct FlowHelper<'a> {
    has_break: bool,
    has_return: bool,
    has_yield: bool,
    has_await: bool,

    // label cannot be shadowed, so it's pretty safe to use JsWord
    label: IndexMap<JsWord, Label>,
    inner_label: AHashSet<JsWord>,
    all: &'a Vec<Id>,
    mutated: AHashMap<Id, SyntaxContext>,
    in_switch_case: bool,

    in_nested_loop: bool,
}

enum Label {
    Break(Ident),
    Continue(Ident),
}

impl FlowHelper<'_> {
    fn check(&mut self, i: Id) {
        if self.all.contains(&i) {
            self.mutated.insert(
                i,
                SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root())),
            );
        }
    }

    fn has_outer_label(&self, label: &Option<Ident>) -> bool {
        match label {
            Some(l) => !self.inner_label.contains(&l.sym),
            None => false,
        }
    }
}

#[swc_trace]
impl VisitMut for FlowHelper<'_> {
    noop_visit_mut_type!(fail);

    /// noop
    fn visit_mut_arrow_expr(&mut self, _n: &mut ArrowExpr) {}

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        match &n.left {
            AssignTarget::Simple(e) => {
                if let SimpleAssignTarget::Ident(i) = e {
                    self.check(i.to_id());
                }
            }
            AssignTarget::Pat(p) => {
                let ids: Vec<Id> = find_pat_ids(p);

                for id in ids {
                    self.check(id);
                }
            }
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_await_expr(&mut self, e: &mut AwaitExpr) {
        e.visit_mut_children_with(self);

        self.has_await = true;
    }

    /// https://github.com/swc-project/swc/pull/2916
    fn visit_mut_do_while_stmt(&mut self, s: &mut DoWhileStmt) {
        let old = self.in_nested_loop;
        self.in_nested_loop = true;
        s.visit_mut_children_with(self);
        self.in_nested_loop = old;
    }

    /// https://github.com/swc-project/swc/pull/2916
    fn visit_mut_for_in_stmt(&mut self, s: &mut ForInStmt) {
        let old = self.in_nested_loop;
        self.in_nested_loop = true;
        s.visit_mut_children_with(self);
        self.in_nested_loop = old;
    }

    /// https://github.com/swc-project/swc/pull/2916
    fn visit_mut_for_of_stmt(&mut self, s: &mut ForOfStmt) {
        let old = self.in_nested_loop;
        self.in_nested_loop = true;
        s.visit_mut_children_with(self);
        self.in_nested_loop = old;
    }

    /// https://github.com/swc-project/swc/pull/2916
    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        let old = self.in_nested_loop;
        self.in_nested_loop = true;
        s.visit_mut_children_with(self);
        self.in_nested_loop = old;
    }

    /// noop
    fn visit_mut_function(&mut self, _f: &mut Function) {}

    /// noop
    fn visit_mut_getter_prop(&mut self, _f: &mut GetterProp) {}

    /// noop
    fn visit_mut_setter_prop(&mut self, _f: &mut SetterProp) {}

    fn visit_mut_labeled_stmt(&mut self, l: &mut LabeledStmt) {
        self.inner_label.insert(l.label.sym.clone());

        l.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        let span = node.span();

        match node {
            Stmt::Continue(ContinueStmt { label, .. }) => {
                if self.in_nested_loop && !self.has_outer_label(label) {
                    return;
                }
                let value = if let Some(label) = label {
                    let value: JsWord = format!("continue|{}", label.sym).into();
                    self.label
                        .insert(value.clone(), Label::Continue(label.clone()));
                    value
                } else {
                    "continue".into()
                };

                *node = ReturnStmt {
                    span,
                    arg: Some(
                        Lit::Str(Str {
                            span,
                            value,
                            raw: None,
                        })
                        .into(),
                    ),
                }
                .into();
            }
            Stmt::Break(BreakStmt { label, .. }) => {
                if (self.in_switch_case || self.in_nested_loop) && !self.has_outer_label(label) {
                    return;
                }
                let value = if let Some(label) = label {
                    let value: JsWord = format!("break|{}", label.sym).into();
                    self.label
                        .insert(value.clone(), Label::Break(label.clone()));
                    value
                } else {
                    self.has_break = true;
                    "break".into()
                };
                *node = ReturnStmt {
                    span,
                    arg: Some(
                        Lit::Str(Str {
                            span,
                            value,
                            raw: None,
                        })
                        .into(),
                    ),
                }
                .into();
            }
            Stmt::Return(s) => {
                self.has_return = true;
                s.visit_mut_with(self);

                *node = ReturnStmt {
                    span,
                    arg: Some(
                        ObjectLit {
                            span,
                            props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                KeyValueProp {
                                    key: PropName::Ident(IdentName::new("v".into(), DUMMY_SP)),
                                    value: s.arg.take().unwrap_or_else(|| {
                                        Box::new(Expr::Unary(UnaryExpr {
                                            span: DUMMY_SP,
                                            op: op!("void"),
                                            arg: Expr::undefined(DUMMY_SP),
                                        }))
                                    }),
                                },
                            )))],
                        }
                        .into(),
                    ),
                }
                .into();
            }
            _ => node.visit_mut_children_with(self),
        }
    }

    fn visit_mut_switch_case(&mut self, n: &mut SwitchCase) {
        let old = self.in_switch_case;
        self.in_switch_case = true;

        n.visit_mut_children_with(self);

        self.in_switch_case = old;
    }

    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        if let Expr::Ident(ref i) = *n.arg {
            self.check(i.to_id())
        }
        n.visit_mut_children_with(self);
    }

    /// https://github.com/swc-project/swc/pull/2916
    fn visit_mut_while_stmt(&mut self, s: &mut WhileStmt) {
        let old = self.in_nested_loop;
        self.in_nested_loop = true;
        s.visit_mut_children_with(self);
        self.in_nested_loop = old;
    }

    fn visit_mut_yield_expr(&mut self, e: &mut YieldExpr) {
        e.visit_mut_children_with(self);

        self.has_yield = true;
    }
}

struct MutationHandler<'a> {
    map: &'a mut AHashMap<Id, SyntaxContext>,
    in_function: bool,
}

impl MutationHandler<'_> {
    fn make_reassignment(&self, orig: Option<Box<Expr>>) -> Expr {
        if self.map.is_empty() {
            return *orig.unwrap_or_else(|| Expr::undefined(DUMMY_SP));
        }

        let mut exprs = Vec::with_capacity(self.map.len() + 1);

        for (id, ctxt) in &*self.map {
            exprs.push(
                AssignExpr {
                    span: DUMMY_SP,
                    left: Ident::new(id.0.clone(), DUMMY_SP, id.1).into(),
                    op: op!("="),
                    right: Box::new(Ident::new(id.0.clone(), DUMMY_SP, *ctxt).into()),
                }
                .into(),
            );
        }
        exprs.push(orig.unwrap_or_else(|| Expr::undefined(DUMMY_SP)));

        SeqExpr {
            span: DUMMY_SP,
            exprs,
        }
        .into()
    }
}

#[swc_trace]
impl VisitMut for MutationHandler<'_> {
    noop_visit_mut_type!(fail);

    visit_mut_obj_and_computed!();

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        let old = self.in_function;
        self.in_function = true;

        n.visit_mut_children_with(self);

        self.in_function = old;
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        let old = self.in_function;
        self.in_function = true;

        n.visit_mut_children_with(self);

        self.in_function = old;
    }

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        if let Some(&ctxt) = self.map.get(&n.to_id()) {
            n.ctxt = ctxt;
        }
    }

    fn visit_mut_return_stmt(&mut self, n: &mut ReturnStmt) {
        n.visit_mut_children_with(self);
        if self.in_function || self.map.is_empty() {
            return;
        }

        let val = n.arg.take();

        n.arg = Some(Box::new(self.make_reassignment(val)))
    }
}
