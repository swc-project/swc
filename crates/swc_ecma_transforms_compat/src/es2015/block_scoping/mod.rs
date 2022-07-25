use std::mem::take;

use ahash::AHashSet;
use indexmap::IndexMap;
use smallvec::SmallVec;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    chain, collections::AHashMap, util::take::Take, Mark, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    find_pat_ids, function::FnEnvHoister, prepend_stmt, private_ident, quote_ident, quote_str,
    undefined, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, visit_mut_obj_and_computed, Fold, Visit,
    VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

mod operator;
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
#[tracing::instrument(level = "info", skip_all)]
pub fn block_scoping(unresolved_mark: Mark) -> impl VisitMut + Fold {
    as_folder(chain!(
        self::vars::block_scoped_vars(),
        BlockScoping {
            unresolved_mark,
            scope: Default::default(),
            vars: vec![],
            var_decl_kind: VarDeclKind::Var,
        }
    ))
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

#[swc_trace]
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
        for (idx, scope) in self.scope.iter_mut().rev().enumerate() {
            if let ScopeKind::Loop {
                lexical_var, used, ..
            } = scope
            {
                //
                if lexical_var.contains(&i) {
                    if idx == 0 {
                        return;
                    }

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

        {
            let mut v = FunctionFinder { found: false };
            body_stmt.visit_with(&mut v);
            if !v.found {
                self.scope.pop();
                return;
            }
        }
        {
            // This is a hack.
            // We need to revisit this
            let mut v = YieldFinder { found: false };
            body_stmt.visit_with(&mut v);
            if v.found {
                self.scope.pop();
                return;
            }
        }

        //
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
            self.vars.extend(env_hoister.to_decl());

            let mut flow_helper = FlowHelper {
                all: &args,
                has_break: false,
                has_return: false,
                label: IndexMap::new(),
                inner_label: AHashSet::new(),
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
                init: Some(Box::new(
                    FnExpr {
                        ident: None,
                        function: Function {
                            span: DUMMY_SP,
                            params: args
                                .iter()
                                .map(|i| {
                                    let ctxt = flow_helper.mutated.get(i).copied().unwrap_or(i.1);

                                    Param {
                                        span: DUMMY_SP,
                                        decorators: Default::default(),
                                        pat: Ident::new(i.0.clone(), DUMMY_SP.with_ctxt(ctxt))
                                            .into(),
                                    }
                                })
                                .collect(),
                            decorators: Default::default(),
                            body: Some(body_stmt),
                            is_generator: false,
                            is_async: false,
                            type_params: None,
                            return_type: None,
                        },
                    }
                    .into(),
                )),
                definite: false,
            });

            let mut call = CallExpr {
                span: DUMMY_SP,
                callee: var_name.as_callee(),
                args: args
                    .iter()
                    .cloned()
                    .map(|i| Ident::new(i.0, DUMMY_SP.with_ctxt(i.1)).as_arg())
                    .collect(),
                type_args: None,
            };

            if flow_helper.has_return || flow_helper.has_break || !flow_helper.label.is_empty() {
                let ret = private_ident!("_ret");

                let mut stmts = vec![
                    // var _ret = _loop(i);
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: ret.clone().into(),
                            init: Some(Box::new(call.take().into())),
                            definite: false,
                        }],
                    })),
                ];

                if flow_helper.has_return {
                    // if (_typeof(_ret) === "object") return _ret.v;
                    stmts.push(
                        IfStmt {
                            span: DUMMY_SP,
                            test: Box::new(Expr::Bin(BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: {
                                    // _typeof(_ret)
                                    let callee = helper!(type_of, "typeof");

                                    Expr::Call(CallExpr {
                                        span: Default::default(),
                                        callee,
                                        args: vec![ret.clone().as_arg()],
                                        type_args: None,
                                    })
                                    .into()
                                },
                                //"object"
                                right: js_word!("object").into(),
                            })),
                            cons: Box::new(Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(ret.clone().make_member(quote_ident!("v")).into()),
                            })),
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
                            cons: Stmt::Break(BreakStmt {
                                span: DUMMY_SP,
                                label: None,
                            })
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
                    }
                    .into(),
                );
                return;
            }

            *body = Box::new(call.take().into_stmt());
        }
    }
}

#[swc_trace]
impl VisitMut for BlockScoping {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        n.params.visit_mut_with(self);
        self.visit_mut_with_scope(ScopeKind::Fn, &mut n.body);
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let vars = take(&mut self.vars);
        n.visit_mut_children_with(self);
        debug_assert_eq!(self.vars, vec![]);
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

    fn visit_mut_while_stmt(&mut self, node: &mut WhileStmt) {
        self.visit_mut_with_scope(ScopeKind::new_loop(), &mut node.body);

        node.test.visit_mut_with(self);
        self.handle_capture_of_vars(&mut node.body);
    }

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        let lexical_var = if let VarDeclOrPat::VarDecl(decl) = &node.left {
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
            used: vec![],
            mutated: Default::default(),
        };

        self.visit_mut_with_scope(kind, &mut node.body);
        self.handle_capture_of_vars(&mut node.body);
    }

    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        let vars = if let VarDeclOrPat::VarDecl(decl) = &node.left {
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
            used: vec![],
            mutated: Default::default(),
        };

        self.visit_mut_with_scope(kind, &mut node.body);
        self.handle_capture_of_vars(&mut node.body);
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
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
            used: vec![],
            mutated: Default::default(),
        };
        self.visit_mut_with_scope(kind, &mut node.body);
        self.handle_capture_of_vars(&mut node.body);
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
                var.init = Some(undefined(var.span()))
            }
        }
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
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: take(&mut self.vars),
                }))),
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

impl<'a> FlowHelper<'a> {
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
            Some(l) => self.inner_label.get(&l.sym).is_none(),
            None => false,
        }
    }
}

#[swc_trace]
impl VisitMut for FlowHelper<'_> {
    noop_visit_mut_type!();

    /// noop
    fn visit_mut_arrow_expr(&mut self, _n: &mut ArrowExpr) {}

    fn visit_mut_labeled_stmt(&mut self, l: &mut LabeledStmt) {
        self.inner_label.insert(l.label.sym.clone());

        l.visit_mut_children_with(self);
    }

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        match &n.left {
            PatOrExpr::Expr(e) => {
                if let Expr::Ident(i) = &**e {
                    self.check(i.to_id());
                }
            }
            PatOrExpr::Pat(p) => {
                let ids: Vec<Id> = find_pat_ids(p);

                for id in ids {
                    self.check(id);
                }
            }
        }

        n.visit_mut_children_with(self);
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

                *node = Stmt::Return(ReturnStmt {
                    span,
                    arg: Some(
                        Expr::Lit(Lit::Str(Str {
                            span,
                            value,
                            raw: None,
                        }))
                        .into(),
                    ),
                });
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
                *node = Stmt::Return(ReturnStmt {
                    span,
                    arg: Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span,
                        value,
                        raw: None,
                    })))),
                });
            }
            Stmt::Return(s) => {
                self.has_return = true;
                s.visit_mut_with(self);

                *node = Stmt::Return(ReturnStmt {
                    span,
                    arg: Some(Box::new(Expr::Object(ObjectLit {
                        span,
                        props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(Ident::new("v".into(), DUMMY_SP)),
                            value: s.arg.take().unwrap_or_else(|| {
                                Box::new(Expr::Unary(UnaryExpr {
                                    span: DUMMY_SP,
                                    op: op!("void"),
                                    arg: undefined(DUMMY_SP),
                                }))
                            }),
                        })))],
                    }))),
                });
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
}

struct MutationHandler<'a> {
    map: &'a mut AHashMap<Id, SyntaxContext>,
    in_function: bool,
}

impl MutationHandler<'_> {
    fn make_reassignment(&self, orig: Option<Box<Expr>>) -> Expr {
        if self.map.is_empty() {
            return *orig.unwrap_or_else(|| undefined(DUMMY_SP));
        }

        let mut exprs = Vec::with_capacity(self.map.len() + 1);

        for (id, ctxt) in &*self.map {
            exprs.push(Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(Ident::new(id.0.clone(), DUMMY_SP.with_ctxt(id.1)).into()),
                op: op!("="),
                right: Box::new(Expr::Ident(Ident::new(
                    id.0.clone(),
                    DUMMY_SP.with_ctxt(*ctxt),
                ))),
            })));
        }
        exprs.push(orig.unwrap_or_else(|| undefined(DUMMY_SP)));

        Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs,
        })
    }
}

#[swc_trace]
impl VisitMut for MutationHandler<'_> {
    noop_visit_mut_type!();

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
            n.span = n.span.with_ctxt(ctxt)
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

#[derive(Debug)]
struct FunctionFinder {
    found: bool,
}

impl Visit for FunctionFinder {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
        self.found = true;
    }

    /// Do not recurse into nested loop.
    ///
    /// https://github.com/swc-project/swc/issues/2622
    fn visit_do_while_stmt(&mut self, _: &DoWhileStmt) {}

    /// Do not recurse into nested loop.
    ///
    /// https://github.com/swc-project/swc/issues/2622
    fn visit_for_in_stmt(&mut self, _: &ForInStmt) {}

    /// Do not recurse into nested loop.
    ///
    /// https://github.com/swc-project/swc/issues/2622
    fn visit_for_of_stmt(&mut self, _: &ForOfStmt) {}

    /// Do not recurse into nested loop.
    ///
    /// https://github.com/swc-project/swc/issues/2622
    fn visit_for_stmt(&mut self, _: &ForStmt) {}

    fn visit_function(&mut self, _: &Function) {
        self.found = true
    }

    /// Do not recurse into nested loop.
    ///
    /// https://github.com/swc-project/swc/issues/2622
    fn visit_while_stmt(&mut self, _: &WhileStmt) {}
}

#[derive(Debug)]
struct YieldFinder {
    found: bool,
}

impl Visit for YieldFinder {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_yield_expr(&mut self, _: &YieldExpr) {
        self.found = true;
    }
}
