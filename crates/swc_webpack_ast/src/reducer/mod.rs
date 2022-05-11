use std::{iter::once, sync::Arc};

use swc_atoms::js_word;
use swc_common::{
    collections::{AHashMap, AHashSet},
    pass::{Repeat, Repeated},
    util::take::Take,
    Mark, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, IsEmpty, StmtLike, StmtOrModuleItem};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};
use swc_timer::timer;

use self::{flatten::contains_import, typescript::ts_remover};

mod flatten;
mod typescript;

/// # Usage
///
/// This transform should be applied after applying resolver.
///
///
/// # Preserved nodes
///
///  - import
///  - export
///  - all imported identifiers
///  - `process.env.NODE_ENV`
///  - `require`
///  - `module`
///  - `__webpack_*`
///  - `import.meta`
///  - `import()`
///  - `define()`
///  - `require.ensure`
///
///
///
/// # Example
///
/// ## Input
///
///```js
/// import { a } from "x";
/// import b from "y";
///
/// function d() {
///   a.x.y(), console.log(b);
///   require("z");
///   module.hot.accept("x", x => { ... })
/// }
/// ```
///
/// ## Output
///
/// ```js
/// import { a } from "x";
/// import b from "y";
///
///             
/// a.x.y();             b;
/// require("z")
/// module.hot.accept("x", () => {     })
/// ```
pub fn ast_reducer(unresolved_mark: Mark) -> impl VisitMut {
    Repeat::new(ReduceAst {
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
        ..Default::default()
    })
}

#[derive(Debug, Clone, Copy, Default)]
struct BindingInfo {
    used_as_type: bool,
    used_as_var: bool,
}

struct Analyzer {
    amd_requires: AHashSet<Id>,
    used_refs: AHashMap<Id, BindingInfo>,
}

impl Visit for Analyzer {
    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        self.used_refs.entry(p.key.to_id()).or_default().used_as_var = true;
    }

    fn visit_call_expr(&mut self, e: &CallExpr) {
        e.visit_children_with(self);

        if let Callee::Expr(callee) = &e.callee {
            if let Expr::Ident(callee) = &**callee {
                if &*callee.sym == "define" {
                    // find `require`

                    let require_arg_idx = e
                        .args
                        .first()
                        .and_then(|v| match &*v.expr {
                            Expr::Array(arr) => Some(&arr.elems),
                            _ => None,
                        })
                        .iter()
                        .flat_map(|v| v.iter())
                        .flatten()
                        .position(|arg| match &*arg.expr {
                            Expr::Lit(Lit::Str(s)) => &*s.value == "require",
                            _ => false,
                        });

                    let fn_arg = e.args.iter().find_map(|arg| match &*arg.expr {
                        Expr::Fn(f) => Some(f),
                        _ => None,
                    });

                    if let Some(require_arg_idx) = require_arg_idx {
                        if let Some(fn_arg) = fn_arg {
                            if let Some(require_arg) = fn_arg.function.params.get(require_arg_idx) {
                                if let Pat::Ident(r) = &require_arg.pat {
                                    self.amd_requires.insert(r.to_id());
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fn visit_expr(&mut self, e: &Expr) {
        e.visit_children_with(self);

        if let Expr::Ident(i) = e {
            self.used_refs.entry(i.to_id()).or_default().used_as_var = true;
        }
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(s) = p {
            self.used_refs.entry(s.to_id()).or_default().used_as_var = true;
        }
    }

    fn visit_prop(&mut self, p: &Prop) {
        p.visit_children_with(self);

        if let Prop::Shorthand(s) = p {
            self.used_refs.entry(s.to_id()).or_default().used_as_var = true;
        }
    }

    fn visit_ts_type_ref(&mut self, ty: &TsTypeRef) {
        fn left_most(n: &TsEntityName) -> &Ident {
            match n {
                TsEntityName::Ident(i) => i,
                TsEntityName::TsQualifiedName(q) => left_most(&q.left),
            }
        }

        ty.visit_children_with(self);

        let left = left_most(&ty.type_name);
        self.used_refs.entry(left.to_id()).or_default().used_as_type = true;
    }
}

#[derive(Default)]
struct ScopeData {
    imported_ids: AHashSet<Id>,
    /// amd `require` modules.
    amd_requires: AHashSet<Id>,

    #[allow(unused)]
    used_refs: AHashMap<Id, BindingInfo>,
}

impl ScopeData {
    fn analyze(items: &[ModuleItem]) -> Self {
        let mut imported_ids = AHashSet::default();

        for item in items {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(i)) = item {
                for s in &i.specifiers {
                    match s {
                        ImportSpecifier::Named(s) => {
                            imported_ids.insert(s.local.to_id());
                        }
                        ImportSpecifier::Default(s) => {
                            imported_ids.insert(s.local.to_id());
                        }
                        ImportSpecifier::Namespace(s) => {
                            imported_ids.insert(s.local.to_id());
                        }
                    }
                }
            }
        }

        let mut analyzer = Analyzer {
            amd_requires: Default::default(),
            used_refs: Default::default(),
        };

        items.visit_with(&mut analyzer);

        ScopeData {
            imported_ids,
            amd_requires: analyzer.amd_requires,
            used_refs: analyzer.used_refs,
        }
    }

    fn should_preserve(&self, i: &Ident) -> bool {
        if self.imported_ids.contains(&i.to_id()) || self.amd_requires.contains(&i.to_id()) {
            return true;
        }

        match &*i.sym {
            "process" | "module" | "import" | "define" | "require" | "exports" => {
                return true;
            }

            _ => {
                if i.sym.starts_with("__webpack_") {
                    return true;
                }
            }
        }

        false
    }
}

#[derive(Clone, Default)]
struct ReduceAst {
    collected_data: bool,
    data: Arc<ScopeData>,
    unresolved_ctxt: SyntaxContext,

    var_decl_kind: Option<VarDeclKind>,

    can_remove_pat: bool,
    preserve_fn: bool,
    preserve_lit: bool,

    changed: bool,
}

impl Repeated for ReduceAst {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

impl ReduceAst {
    fn flatten_stmt<T>(&mut self, to: &mut Vec<T>, item: &mut T)
    where
        T: StmtOrModuleItem + StmtLike + Take,
    {
        let item = item.take();

        match item.try_into_stmt() {
            Ok(stmt) => match stmt {
                Stmt::Block(b) => {
                    to.extend(b.stmts.into_iter().map(T::from_stmt));
                }

                // Flatten a function declaration.
                Stmt::Decl(Decl::Fn(fn_decl)) => {
                    let Function {
                        span,
                        params,
                        decorators,
                        body,
                        ..
                    } = fn_decl.function;

                    if !decorators.is_empty() {
                        let mut s = Stmt::Expr(ExprStmt {
                            span,
                            expr: Box::new(Expr::Seq(SeqExpr {
                                span,
                                exprs: decorators.into_iter().map(|d| d.expr).collect(),
                            })),
                        });
                        s.visit_mut_with(self);
                        to.push(T::from_stmt(s));
                    }

                    if !params.is_empty() {
                        let mut exprs = Vec::with_capacity(params.len());

                        for p in params {
                            exprs.extend(p.decorators.into_iter().map(|d| d.expr));

                            preserve_pat(&mut exprs, p.pat);
                        }

                        let mut s = Stmt::Expr(ExprStmt {
                            span,
                            expr: Box::new(Expr::Seq(SeqExpr { span, exprs })),
                        });
                        s.visit_mut_with(self);
                        to.push(T::from_stmt(s));
                    }

                    if let Some(body) = body {
                        to.extend(body.stmts.into_iter().map(T::from_stmt));
                    }
                }

                Stmt::ForOf(ForOfStmt {
                    span,
                    left,
                    right,
                    body,
                    ..
                })
                | Stmt::ForIn(ForInStmt {
                    span,
                    left,
                    right,
                    body,
                    ..
                }) => {
                    self.changed = true;

                    let mut exprs = vec![];

                    match left {
                        VarDeclOrPat::VarDecl(mut v) => {
                            assert_eq!(v.decls.len(), 1);
                            v.decls[0].init = Some(right);
                            to.push(T::from_stmt(Stmt::Decl(Decl::Var(v))))
                        }
                        VarDeclOrPat::Pat(p) => {
                            preserve_pat(&mut exprs, p);
                        }
                    }

                    if !exprs.is_empty() {
                        to.push(T::from_stmt(Stmt::Expr(ExprStmt {
                            span,
                            expr: Box::new(Expr::Seq(SeqExpr { span, exprs })),
                        })));
                    }
                    to.push(T::from_stmt(*body));
                }

                _ => {
                    to.push(T::from_stmt(stmt));
                }
            },
            Err(item) => {
                to.push(item);
            }
        }
    }

    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtOrModuleItem + StmtLike + VisitMutWith<Self> + Take,
        Vec<T>: VisitMutWith<Self>,
    {
        stmts.visit_mut_children_with(self);

        let mut new = Vec::with_capacity(stmts.len());
        for stmt in stmts.iter_mut() {
            self.flatten_stmt(&mut new, stmt);
        }

        // Remove empty statements
        new.retain(|stmt| match StmtOrModuleItem::as_stmt(stmt) {
            Ok(Stmt::Empty(..)) => false,
            Ok(Stmt::Expr(es)) => !self.can_remove(&es.expr, true),
            _ => true,
        });

        *stmts = new;
    }

    /// `ignore_expr`, but use `null` instead of [Expr::Invalid].
    fn ignore_expr_as_null(&mut self, e: &mut Expr, ignore_return_value: bool) {
        let span = e.span();
        self.ignore_expr(e, ignore_return_value);
        if e.is_invalid() {
            *e = null_expr(span);
        }
    }

    fn ignore_expr(&mut self, e: &mut Expr, ignore_return_value: bool) {
        if ignore_return_value && e.is_member() && is_related_to_process(e) {
            e.take();
            return;
        }

        match e {
            Expr::Lit(..) => {
                e.take();
            }
            Expr::This(..)
            | Expr::SuperProp(SuperPropExpr {
                prop: SuperProp::Ident(_),
                ..
            })
            | Expr::Yield(YieldExpr { arg: None, .. }) => {
                self.changed = true;
                e.take();
            }

            Expr::Ident(i) => {
                if !self.data.should_preserve(&*i) {
                    self.changed = true;
                    e.take();
                }
            }

            Expr::Member(MemberExpr { obj, prop, .. }) => {
                self.ignore_expr(obj, false);
                if let MemberProp::Computed(c) = prop {
                    self.ignore_expr(&mut c.expr, false);
                }

                match (
                    self.can_remove(obj, false),
                    if let MemberProp::Computed(c) = prop {
                        self.can_remove(&c.expr, false)
                    } else {
                        false
                    },
                ) {
                    (true, true) => {
                        e.take();
                    }
                    (true, false) => {
                        if let MemberProp::Computed(c) = prop {
                            *e = *c.expr.take()
                        } else {
                            e.take();
                        }
                    }
                    (false, true) => {
                        *e = *obj.take();
                    }
                    (false, false) => {}
                }
            }

            Expr::Array(a) => {
                if a.elems.is_empty() {
                    self.changed = true;
                    e.take();
                }
            }

            Expr::Object(obj) => {
                if obj.props.is_empty() {
                    self.changed = true;
                    e.take();
                }
            }

            Expr::Seq(seq) => {
                // visit_mut_seq_expr handles the elements other than last one.
                if let Some(e) = seq.exprs.last_mut() {
                    self.ignore_expr(&mut **e, ignore_return_value);
                }
                seq.exprs.retain(|e| !e.is_invalid());
                if seq.exprs.is_empty() {
                    e.take();
                    return;
                }
                if seq.exprs.len() == 1 {
                    *e = *seq.exprs.pop().unwrap();
                }
            }

            Expr::Unary(u) => {
                if ignore_return_value {
                    self.ignore_expr(&mut u.arg, ignore_return_value);
                    *e = *u.arg.take();
                }
            }

            Expr::Bin(b) => {
                if ignore_return_value {
                    self.ignore_expr_as_null(&mut b.left, ignore_return_value);
                    self.ignore_expr_as_null(&mut b.right, ignore_return_value);

                    if b.left.is_lit() && b.right.is_lit() {
                        e.take();
                    }
                }
            }

            _ => {}
        }
    }

    /// `is_standalone`: `true` for switch case.
    fn can_remove(&self, e: &Expr, is_standalone: bool) -> bool {
        match e {
            Expr::Invalid(..) => true,
            Expr::Lit(Lit::Str(..)) => is_standalone,
            Expr::Lit(..) => true,
            Expr::Seq(seq) => seq.exprs.iter().all(|e| self.can_remove(e, is_standalone)),
            _ => false,
        }
    }

    /// If webpack *may* replace this value, we should preserve it.
    fn is_safe_to_flatten_test(&self, e: &Expr) -> bool {
        match e {
            Expr::Ident(i) => {
                self.data.imported_ids.contains(&i.to_id()) || !self.data.should_preserve(i)
            }

            Expr::Paren(ParenExpr { expr: inner, .. })
            | Expr::Unary(UnaryExpr { arg: inner, .. })
            | Expr::Update(UpdateExpr { arg: inner, .. })
            | Expr::Await(AwaitExpr { arg: inner, .. }, ..)
            | Expr::Yield(YieldExpr {
                arg: Some(inner), ..
            }) => self.is_safe_to_flatten_test(inner),

            Expr::Bin(e) => {
                self.is_safe_to_flatten_test(&e.left) && self.is_safe_to_flatten_test(&e.right)
            }

            Expr::Cond(e) => {
                self.is_safe_to_flatten_test(&e.test)
                    && self.is_safe_to_flatten_test(&e.cons)
                    && self.is_safe_to_flatten_test(&e.alt)
            }

            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            })
            | Expr::New(NewExpr { callee, .. })
            | Expr::OptChain(OptChainExpr {
                base: OptChainBase::Call(OptCall { callee, .. }),
                ..
            }) => self.is_safe_to_flatten_test(callee),

            Expr::Member(MemberExpr { obj, .. })
            | Expr::OptChain(OptChainExpr {
                base: OptChainBase::Member(MemberExpr { obj, .. }, ..),
                ..
            }) => self.is_safe_to_flatten_test(obj),

            _ => true,
        }
    }

    fn is_safe_to_flatten_stmt(&self, s: &Stmt) -> bool {
        !contains_import(s)
    }
}

impl VisitMut for ReduceAst {
    fn visit_mut_arrow_expr(&mut self, e: &mut ArrowExpr) {
        let old_can_remove_pat = self.can_remove_pat;
        self.can_remove_pat = true;
        e.params.visit_mut_with(self);
        self.can_remove_pat = old_can_remove_pat;

        e.body.visit_mut_with(self);

        e.type_params.visit_mut_with(self);

        e.return_type.visit_mut_with(self);
    }

    fn visit_mut_assign_pat_prop(&mut self, p: &mut AssignPatProp) {
        p.visit_mut_children_with(self);

        if let Some(v) = &mut p.value {
            self.ignore_expr(&mut **v, false);
            if v.is_invalid() {
                p.value = None;
            }
        }
    }

    fn visit_mut_class(&mut self, c: &mut Class) {
        c.visit_mut_children_with(self);

        if let Some(s) = &c.super_class {
            if self.can_remove(s, true) {
                c.super_class = None;
            }
        }
    }

    fn visit_mut_class_members(&mut self, v: &mut Vec<ClassMember>) {
        v.visit_mut_children_with(self);

        v.retain(|m| {
            match m {
                ClassMember::PrivateProp(PrivateProp { value: None, .. })
                | ClassMember::Empty(..) => return false,

                ClassMember::ClassProp(p) => {
                    if let PropName::Computed(key) = &p.key {
                        return !(p.decorators.is_empty()
                            && self.can_remove(&key.expr, false)
                            && p.value
                                .as_deref()
                                .map(|e| self.can_remove(e, true))
                                .unwrap_or(true));
                    } else {
                        return false;
                    }
                }
                ClassMember::Method(m) => {
                    if !m.key.is_computed()
                        && m.function.decorators.is_empty()
                        && m.function.params.is_empty()
                        && m.function.body.is_empty()
                    {
                        return false;
                    }
                }

                ClassMember::Constructor(c) => {
                    if !c.key.is_computed() && c.params.is_empty() && c.body.is_empty() {
                        return false;
                    }
                }

                ClassMember::PrivateProp(PrivateProp {
                    value: Some(value), ..
                }) => {
                    if self.can_remove(value, true) {
                        return false;
                    }
                }
                _ => {}
            }

            true
        });
    }

    /// Normalize expressions.
    ///
    ///  - empty [Expr::Seq] => [Expr::Invalid]
    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(BinExpr { left, right, .. }) => {
                if is_related_to_process(left) || is_related_to_process(right) {
                    return;
                }
            }

            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &**arg {
                Expr::Lit(..) => {}

                Expr::Call(CallExpr {
                    callee: Callee::Expr(callee),
                    ..
                }) => {
                    if !callee.is_fn_expr() {
                        return;
                    }
                }
                _ => {
                    return;
                }
            },
            _ => {}
        }

        match e {
            Expr::Call(CallExpr {
                span,
                callee: Callee::Expr(callee),
                args,
                ..
            })
            | Expr::New(NewExpr {
                span,

                callee,
                args: Some(args),
                ..
            }) => {
                self.ignore_expr(callee, false);

                let is_define = match &**callee {
                    Expr::Ident(callee) => &*callee.sym == "define",
                    _ => false,
                };

                if is_define {
                    for arg in args {
                        if let Expr::Fn(f) = &mut *arg.expr {
                            f.function.body.visit_mut_with(self);
                        }
                    }

                    return;
                }

                let is_string_lit_important = match &**callee {
                    Expr::Ident(callee) => &*callee.sym == "require",
                    _ => false,
                };

                if callee.is_invalid() {
                    let mut seq = Expr::Seq(SeqExpr {
                        span: *span,
                        exprs: args.take().into_iter().map(|arg| arg.expr).collect(),
                    });

                    seq.visit_mut_with(self);

                    *e = seq;
                } else {
                    // We should preserve the arguments if the callee is not invalid.
                    let old_preserver_fn = self.preserve_fn;
                    self.preserve_fn = !callee.is_fn_expr() && !callee.is_arrow();

                    let old_preserve_lit = self.preserve_lit;
                    self.preserve_lit |= is_string_lit_important;
                    e.visit_mut_children_with(self);

                    self.preserve_lit = old_preserve_lit;
                    self.preserve_fn = old_preserver_fn;

                    return;
                }
            }

            _ => {}
        }

        if self.preserve_lit && e.is_lit() {
            return;
        }

        e.visit_mut_children_with(self);

        if let Expr::Seq(seq) = e {
            if seq.exprs.is_empty() {
                *e = null_expr(seq.span);
                return;
            }

            if seq.exprs.len() == 1 {
                *e = *seq.exprs.pop().unwrap();
            }
        }

        match e {
            Expr::Paren(p) => {
                *e = *p.expr.take();
            }

            Expr::Ident(i) => {
                if self.data.should_preserve(i) {
                    return;
                }

                *e = null_expr(i.span);
            }

            Expr::Member(MemberExpr { obj, prop, .. }) if !prop.is_computed() => {
                if let Some(left) = left_most(obj) {
                    if self.data.should_preserve(&left) {
                        return;
                    }
                }
                *e = *obj.take();
            }

            Expr::OptChain(opt) => {
                *e = opt.base.take().into();
            }

            Expr::Await(expr) => {
                *e = *expr.arg.take();
            }

            Expr::Yield(expr) => {
                if let Some(arg) = expr.arg.take() {
                    *e = *arg;
                } else {
                    *e = null_expr(expr.span);
                }
            }

            Expr::Unary(expr) => {
                *e = *expr.arg.take();
            }

            Expr::Update(expr) => {
                *e = *expr.arg.take();
            }

            Expr::TaggedTpl(expr) => {
                let mut exprs = Vec::with_capacity(expr.tpl.exprs.len() + 1);
                exprs.push(expr.tag.take());
                exprs.extend(expr.tpl.exprs.take());

                let mut seq = Expr::Seq(SeqExpr {
                    span: expr.span,
                    exprs,
                });

                seq.visit_mut_with(self);

                *e = seq;
            }

            Expr::Tpl(expr) => {
                let mut seq = Expr::Seq(SeqExpr {
                    span: expr.span,
                    exprs: expr.exprs.take(),
                });

                seq.visit_mut_with(self);

                *e = seq;
            }

            Expr::Assign(expr) => {
                // process.browser = true should be preserved.
                // Otherwise, webpack will replace it to `true`.

                self.ignore_expr_as_null(&mut expr.right, false);

                match &mut expr.left {
                    PatOrExpr::Pat(pat) => {
                        if let Pat::Expr(left) = &mut **pat {
                            let left = left_most(left);

                            if let Some(left) = left {
                                if self.data.should_preserve(&left) {
                                    return;
                                }
                            }
                        }
                    }
                    PatOrExpr::Expr(left) => {
                        let left = left_most(left);

                        if let Some(left) = left {
                            if self.data.should_preserve(&left) {
                                return;
                            }
                        }
                    }
                }

                let mut exprs = Vec::with_capacity(2);
                preserve_pat_or_expr(&mut exprs, expr.left.take());
                exprs.push(expr.right.take());
                let seq = Expr::Seq(SeqExpr {
                    span: expr.span,
                    exprs,
                });

                self.changed = true;

                *e = seq;
            }

            Expr::Seq(seq) => {
                if seq.exprs.is_empty() {
                    *e = Expr::Invalid(Invalid { span: seq.span });
                }
            }

            Expr::Bin(expr) => {
                let exprs = vec![expr.left.take(), expr.right.take()];

                let mut seq = Expr::Seq(SeqExpr {
                    span: expr.span,
                    exprs,
                });

                seq.visit_mut_with(self);

                *e = seq;
            }

            Expr::Cond(expr) => {
                let exprs = vec![expr.test.take(), expr.cons.take(), expr.alt.take()];

                let mut seq = Expr::Seq(SeqExpr {
                    span: expr.span,
                    exprs,
                });

                seq.visit_mut_with(self);

                *e = seq;
            }

            Expr::Array(arr) => {
                let mut seq = Expr::Seq(SeqExpr {
                    span: arr.span,
                    exprs: arr
                        .elems
                        .take()
                        .into_iter()
                        .flatten()
                        .map(|elem| elem.expr)
                        .collect(),
                });

                seq.visit_mut_with(self);

                *e = seq;
            }

            Expr::Object(obj) => {
                if obj.props.iter().all(|prop| match prop {
                    PropOrSpread::Spread(..) => true,
                    PropOrSpread::Prop(prop) => matches!(
                        &**prop,
                        Prop::Shorthand(..) | Prop::KeyValue(..) | Prop::Assign(..)
                    ),
                }) {
                    let mut exprs = Vec::with_capacity(obj.props.len());

                    for prop in obj.props.take() {
                        match prop {
                            PropOrSpread::Spread(prop) => {
                                exprs.push(prop.expr);
                            }
                            PropOrSpread::Prop(prop) => match *prop {
                                Prop::Shorthand(i) => {
                                    exprs.push(Box::new(Expr::Ident(i)));
                                }
                                Prop::KeyValue(p) => {
                                    preserve_prop_name(&mut exprs, p.key);
                                    exprs.push(p.value);
                                }
                                Prop::Assign(p) => {
                                    exprs.push(Box::new(Expr::Ident(p.key)));
                                    exprs.push(p.value);
                                }
                                _ => {
                                    unreachable!()
                                }
                            },
                        }
                    }

                    let mut seq = Expr::Seq(SeqExpr {
                        span: obj.span,
                        exprs,
                    });

                    seq.visit_mut_with(self);

                    *e = seq;
                }
            }

            Expr::JSXElement(el) => {
                // Remove empty, non-component elements.
                match &el.opening.name {
                    JSXElementName::Ident(name) => {
                        if name.sym.chars().next().unwrap().is_uppercase() {
                            if el.opening.attrs.is_empty() && el.children.is_empty() {
                                *e = Expr::Ident(name.clone());
                                return;
                            }

                            return;
                        }
                    }
                    _ => return,
                }

                if el.opening.attrs.is_empty() && el.children.is_empty() {
                    *e = null_expr(el.span);
                }
            }

            Expr::Arrow(ArrowExpr {
                span,
                params,
                body: BlockStmtOrExpr::Expr(body),
                ..
            }) => {
                let mut exprs = vec![];
                for p in params.take() {
                    preserve_pat(&mut exprs, p);
                }

                exprs.push(body.take());

                let mut seq = Expr::Seq(SeqExpr { span: *span, exprs });

                seq.visit_mut_with(self);

                *e = seq;
            }

            Expr::Fn(FnExpr { function, .. }) => {
                if !self.preserve_fn
                    && function.decorators.is_empty()
                    && function.params.is_empty()
                    && function.body.is_empty()
                {
                    *e = null_expr(function.span);
                    self.changed = true;
                }
            }

            Expr::Arrow(ArrowExpr {
                span,
                params,
                body: BlockStmtOrExpr::BlockStmt(body),
                ..
            }) => {
                if !self.preserve_fn && params.is_empty() && body.is_empty() {
                    *e = null_expr(*span);
                    self.changed = true;
                }
            }

            Expr::New(NewExpr {
                span, callee, args, ..
            }) => {
                let mut exprs = vec![callee.take()];
                exprs.extend(args.take().into_iter().flatten().map(|v| v.expr));

                *e = Expr::Seq(SeqExpr { span: *span, exprs });
                self.changed = true;
            }

            Expr::Call(CallExpr {
                span,
                callee: Callee::Super(..),
                args,
                ..
            }) => {
                self.changed = true;
                let exprs: Vec<_> = args.take().into_iter().map(|arg| arg.expr).collect();
                if exprs.is_empty() {
                    *e = null_expr(*span);
                    return;
                }
                let seq = Expr::Seq(SeqExpr { span: *span, exprs });

                *e = seq;
            }

            // TODO:
            // Expr::Class(_) => todo!(),
            // Expr::MetaProp(_) => todo!(),
            // Expr::JSXMember(_) => todo!(),
            // Expr::JSXNamespacedName(_) => todo!(),
            // Expr::JSXEmpty(_) => todo!(),
            // Expr::JSXFragment(_) => todo!(),
            // Expr::OptChain(_) => todo!(),
            _ => {}
        }
    }

    fn visit_mut_expr_or_spread(&mut self, expr: &mut ExprOrSpread) {
        expr.spread = None;
        expr.expr.visit_mut_with(self);
    }

    fn visit_mut_expr_or_spreads(&mut self, elems: &mut Vec<ExprOrSpread>) {
        elems.visit_mut_children_with(self);

        if !self.preserve_fn {
            elems.retain(|e| {
                if self.can_remove(&e.expr, false) {
                    self.changed = true;
                    return false;
                }

                true
            });
        }
    }

    fn visit_mut_expr_stmt(&mut self, s: &mut ExprStmt) {
        s.visit_mut_children_with(self);

        self.ignore_expr(&mut s.expr, true);
    }

    fn visit_mut_exprs(&mut self, exprs: &mut Vec<Box<Expr>>) {
        exprs.visit_mut_children_with(self);

        exprs.retain(|e| !e.is_invalid());
    }

    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        s.visit_mut_children_with(self);

        match &mut s.init {
            Some(VarDeclOrExpr::VarDecl(v)) => {
                self.changed = true;
                let mut exprs = vec![];

                for decl in v.decls.take() {
                    preserve_pat(&mut exprs, decl.name);
                    exprs.extend(decl.init);
                }

                if exprs.is_empty() {
                    s.init = None;
                } else {
                    s.init = Some(VarDeclOrExpr::Expr(Box::new(Expr::Seq(SeqExpr {
                        span: v.span,
                        exprs,
                    }))))
                }
            }

            Some(VarDeclOrExpr::Expr(init)) => {
                if self.can_remove(init, true) {
                    s.init = None;
                }
            }
            _ => {}
        }

        if let Some(test) = &mut s.test {
            self.ignore_expr(&mut **test, false);

            if self.can_remove(test, true) {
                s.test = None;
            }
        }

        if let Some(update) = &mut s.update {
            self.ignore_expr(&mut **update, true);

            if self.can_remove(update, true) {
                s.update = None;
            }
        }
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        f.decorators.visit_mut_with(self);

        let old_can_remove_pat = self.can_remove_pat;
        self.can_remove_pat = true;
        f.params.visit_mut_with(self);
        self.can_remove_pat = old_can_remove_pat;

        f.body.visit_mut_with(self);

        f.type_params.visit_mut_with(self);

        f.return_type.visit_mut_with(self);
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.visit_mut_children_with(self);

        self.ignore_expr_as_null(&mut s.test, false);
    }

    fn visit_mut_jsx_attr_or_spreads(&mut self, attrs: &mut Vec<JSXAttrOrSpread>) {
        attrs.visit_mut_children_with(self);

        attrs.retain(|attr| match attr {
            JSXAttrOrSpread::JSXAttr(attr) => {
                match &attr.name {
                    JSXAttrName::Ident(..) => {}
                    JSXAttrName::JSXNamespacedName(_) => {
                        // We don't handle this because no one uses it
                        return true;
                    }
                }

                // Remove jsx attributes
                match &attr.value {
                    Some(v) => match v {
                        JSXAttrValue::Lit(_) => return false,
                        JSXAttrValue::JSXExprContainer(e) => match &e.expr {
                            JSXExpr::JSXEmptyExpr(_) => {
                                return true;
                            }
                            JSXExpr::Expr(e) => {
                                if self.can_remove(e, false) {
                                    return false;
                                }
                            }
                        },
                        JSXAttrValue::JSXElement(_) => {}
                        JSXAttrValue::JSXFragment(_) => {}
                    },
                    None => return false,
                }

                true
            }
            JSXAttrOrSpread::SpreadElement(s) => {
                if self.can_remove(&s.expr, false) {
                    return false;
                }

                true
            }
        });
    }

    fn visit_mut_jsx_element(&mut self, el: &mut JSXElement) {
        el.visit_mut_children_with(self);

        // Remove empty, non-component elements.
        match &el.opening.name {
            JSXElementName::Ident(name) => {
                if name.sym.chars().next().unwrap().is_uppercase() {
                    return;
                }
            }
            _ => return,
        }

        if !el.opening.attrs.is_empty() {
            return;
        }

        if el.children.len() == 1 {
            if let JSXElementChild::JSXElement(c) = &mut el.children[0] {
                *el = *c.take();
            }
        }
    }

    fn visit_mut_jsx_element_children(&mut self, v: &mut Vec<JSXElementChild>) {
        v.visit_mut_children_with(self);

        v.retain(|c| -> bool {
            match c {
                JSXElementChild::JSXText(_)
                | JSXElementChild::JSXExprContainer(JSXExprContainer {
                    expr: JSXExpr::JSXEmptyExpr(..),
                    ..
                }) => false,
                JSXElementChild::JSXExprContainer(JSXExprContainer {
                    expr: JSXExpr::Expr(expr),
                    ..
                }) => !self.can_remove(expr, false),

                JSXElementChild::JSXElement(el) => {
                    // Remove empty, non-component elements.
                    match &el.opening.name {
                        JSXElementName::Ident(name) => {
                            if name.sym.chars().next().unwrap().is_uppercase() {
                                return true;
                            }
                        }
                        _ => return true,
                    }

                    if el.opening.attrs.is_empty() && el.children.is_empty() {
                        return false;
                    }

                    true
                }

                _ => true,
            }
        })
    }

    fn visit_mut_jsx_expr(&mut self, e: &mut JSXExpr) {
        e.visit_mut_children_with(self);

        match e {
            JSXExpr::JSXEmptyExpr(_) => {}
            JSXExpr::Expr(expr) => {
                if expr.is_invalid() {
                    *e = JSXExpr::JSXEmptyExpr(JSXEmptyExpr { span: expr.span() });
                }
            }
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if let MemberProp::Computed(c) = &mut e.prop {
            c.visit_mut_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        if !self.collected_data {
            self.collected_data = true;

            {
                let _timer = timer!("analyze before reducing");
                self.data = Arc::new(ScopeData::analyze(stmts));
            }
            {
                let _timer = timer!("remove typescript nodes");

                stmts.visit_mut_with(&mut ts_remover());
            }
        }

        let _timer = timer!("reduce ast (single pass)");

        self.visit_mut_stmt_likes(stmts);
    }

    fn visit_mut_object_pat_props(&mut self, props: &mut Vec<ObjectPatProp>) {
        props.visit_mut_children_with(self);

        props.retain(|prop| match prop {
            ObjectPatProp::Rest(p) => {
                if p.arg.is_invalid() {
                    return false;
                }

                true
            }
            ObjectPatProp::Assign(p) => {
                if self.can_remove_pat && p.value.is_none() {
                    return false;
                }

                true
            }

            ObjectPatProp::KeyValue(p) => {
                if p.value.is_invalid() {
                    return false;
                }

                true
            }
        });
    }

    fn visit_mut_opt_expr_or_spread(&mut self, e: &mut Option<ExprOrSpread>) {
        e.visit_mut_children_with(self);

        if !self.preserve_fn {
            if let Some(elem) = e {
                if self.can_remove(&elem.expr, false) {
                    *e = None;
                }
            }
        }
    }

    fn visit_mut_opt_pat(&mut self, p: &mut Option<Pat>) {
        p.visit_mut_children_with(self);

        if let Some(Pat::Invalid(..)) = &p {
            *p = None;
        }
    }

    fn visit_mut_param_or_ts_param_prop(&mut self, p: &mut ParamOrTsParamProp) {
        let old = self.can_remove_pat;
        self.can_remove_pat = match p {
            ParamOrTsParamProp::TsParamProp(TsParamProp {
                param: TsParamPropParam::Ident(..),
                ..
            }) => true,
            ParamOrTsParamProp::TsParamProp(TsParamProp {
                param: TsParamPropParam::Assign(..),
                ..
            }) => false,
            ParamOrTsParamProp::Param(_) => true,
        };
        p.visit_mut_children_with(self);
        self.can_remove_pat = old;
    }

    fn visit_mut_param_or_ts_param_props(&mut self, ps: &mut Vec<ParamOrTsParamProp>) {
        ps.visit_mut_children_with(self);

        ps.retain(|p| match p {
            ParamOrTsParamProp::TsParamProp(p) => match &p.param {
                TsParamPropParam::Ident(p) => {
                    if !self.data.should_preserve(&p.id) {
                        self.changed = true;
                        return false;
                    }

                    true
                }
                TsParamPropParam::Assign(p) => {
                    if p.left.is_invalid() && self.can_remove(&p.right, false) {
                        self.changed = true;
                        return false;
                    }

                    true
                }
            },
            ParamOrTsParamProp::Param(p) => !p.pat.is_invalid(),
        });
    }

    fn visit_mut_params(&mut self, ps: &mut Vec<Param>) {
        ps.visit_mut_children_with(self);

        ps.retain(|param| !param.pat.is_invalid());
    }

    fn visit_mut_pat(&mut self, pat: &mut Pat) {
        // We don't need rest pattern.
        if let Pat::Rest(rest) = pat {
            *pat = *rest.arg.take();
        }

        match pat {
            Pat::Assign(..) => {
                let old = self.can_remove_pat;
                self.can_remove_pat = false;
                pat.visit_mut_children_with(self);
                self.can_remove_pat = old;
            }
            _ => {
                pat.visit_mut_children_with(self);
            }
        }

        if !self.can_remove_pat {
            return;
        }

        match pat {
            Pat::Ident(p) => {
                if self.data.should_preserve(&p.id) {
                    return;
                }
                if p.id.span.ctxt != self.unresolved_ctxt {
                    pat.take();
                }
            }

            Pat::Array(arr) => {
                if arr.elems.is_empty() {
                    pat.take();
                }
            }

            Pat::Object(obj) => {
                if obj.props.is_empty() {
                    pat.take();
                }
            }

            Pat::Assign(a) => {
                if self.can_remove(&a.right, false) {
                    a.left.visit_mut_with(self);

                    *pat = *a.left.take();
                    self.changed = true;
                }
            }

            _ => {}
        }
    }

    fn visit_mut_pats(&mut self, pats: &mut Vec<Pat>) {
        pats.visit_mut_children_with(self);

        pats.retain(|pat| !pat.is_invalid());
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = p {
            if !self.data.should_preserve(&*i) {
                i.take();
            }
        }
    }

    fn visit_mut_prop_or_spreads(&mut self, props: &mut Vec<PropOrSpread>) {
        props.visit_mut_children_with(self);

        props.retain(|p| {
            match p {
                PropOrSpread::Spread(..) => {}
                PropOrSpread::Prop(p) => match &**p {
                    Prop::Shorthand(p) => {
                        if p.sym == js_word!("") {
                            return false;
                        }
                    }

                    Prop::Getter(p) => {
                        if !p.key.is_computed() && p.body.is_empty() {
                            return false;
                        }
                    }

                    Prop::Setter(p) => {
                        if !p.key.is_computed() && p.param.is_ident() && p.body.is_empty() {
                            return false;
                        }
                    }

                    _ => {}
                },
            }

            true
        });
    }

    fn visit_mut_seq_expr(&mut self, e: &mut SeqExpr) {
        e.visit_mut_children_with(self);

        let cnt = e.exprs.len();

        for (idx, elem) in e.exprs.iter_mut().enumerate() {
            if idx == cnt - 1 {
                continue;
            }

            self.ignore_expr(&mut **elem, true);
        }

        e.exprs.retain(|e| !self.can_remove(e, false));
    }

    /// Normalize statements.
    ///
    ///  - Invalid [Stmt::Expr] => [Stmt::Empty]
    ///  - Empty [Stmt::Block] => [Stmt::Empty]
    ///  - Single-item [Stmt::Block] => the item
    ///  - Invalid [Stmt::Decl] => [Stmt::Empty]
    ///  - Useless stmt => [Stmt::Empty]
    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        match stmt {
            Stmt::Debugger(_) | Stmt::Break(_) | Stmt::Continue(_) => {
                *stmt = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }

            Stmt::Return(s) => {
                if let Some(arg) = s.arg.take() {
                    self.changed = true;
                    *stmt = Stmt::Expr(ExprStmt {
                        span: s.span,
                        expr: arg,
                    });
                } else {
                    *stmt = Stmt::Empty(EmptyStmt { span: s.span });
                    return;
                }
            }
            Stmt::Throw(s) => {
                self.changed = true;
                *stmt = Stmt::Expr(ExprStmt {
                    span: s.span,
                    expr: s.arg.take(),
                });
            }

            Stmt::If(s) => {
                if self.is_safe_to_flatten_test(&s.test)
                    && self.is_safe_to_flatten_stmt(&s.cons)
                    && s.alt
                        .as_deref()
                        .map(|s| self.is_safe_to_flatten_stmt(s))
                        .unwrap_or(true)
                {
                    // Flatten if statements.
                    //
                    // This is important because webpack replaces cons or alt if condition is
                    // literal. To preserve cons/alt, we flatten if statements so webpack can't
                    // replace body with an empty string.

                    self.changed = true;
                    *stmt = Stmt::Block(BlockStmt {
                        span: s.span,
                        stmts: once(Stmt::Expr(ExprStmt {
                            span: s.test.span(),
                            expr: s.test.take(),
                        }))
                        .chain(once(*s.cons.take()))
                        .chain(s.alt.take().map(|v| *v))
                        .collect(),
                    });
                    return;
                }
            }

            Stmt::While(s) => {
                if self.is_safe_to_flatten_test(&s.test) && self.is_safe_to_flatten_stmt(&s.body) {
                    self.changed = true;
                    *stmt = Stmt::Block(BlockStmt {
                        span: s.span,
                        stmts: vec![
                            Stmt::Expr(ExprStmt {
                                span: s.test.span(),
                                expr: s.test.take(),
                            }),
                            *s.body.take(),
                        ],
                    });
                    return;
                }
            }

            Stmt::DoWhile(s) => {
                if self.is_safe_to_flatten_test(&s.test) && self.is_safe_to_flatten_stmt(&s.body) {
                    self.changed = true;
                    *stmt = Stmt::Block(BlockStmt {
                        span: s.span,
                        stmts: vec![
                            Stmt::Expr(ExprStmt {
                                span: s.test.span(),
                                expr: s.test.take(),
                            }),
                            *s.body.take(),
                        ],
                    });
                    return;
                }
            }

            _ => {}
        }

        stmt.visit_mut_children_with(self);

        if let Stmt::Labeled(l) = stmt {
            *stmt = *l.body.take();
        }

        match stmt {
            Stmt::Expr(e) => {
                if e.expr.is_invalid() {
                    self.changed = true;
                    *stmt = Stmt::Empty(EmptyStmt { span: e.span });
                    return;
                }

                if let Expr::Call(CallExpr {
                    span,
                    callee: Callee::Expr(callee),
                    args,
                    ..
                }) = &mut *e.expr
                {
                    if let Expr::Fn(callee) = &mut **callee {
                        self.changed = true;
                        let mut stmts = vec![];
                        let Function {
                            params,
                            decorators,
                            body,
                            ..
                        } = callee.function.take();

                        if !decorators.is_empty() {
                            let mut s = Stmt::Expr(ExprStmt {
                                span: *span,
                                expr: Box::new(Expr::Seq(SeqExpr {
                                    span: *span,
                                    exprs: decorators.into_iter().map(|d| d.expr).collect(),
                                })),
                            });
                            s.visit_mut_with(self);
                            stmts.push(s);
                        }

                        if !params.is_empty() {
                            let mut exprs = Vec::with_capacity(params.len());

                            for p in params {
                                exprs.extend(p.decorators.into_iter().map(|d| d.expr));

                                preserve_pat(&mut exprs, p.pat);
                            }

                            exprs.extend(args.iter_mut().map(|arg| arg.expr.take()));

                            let mut s = Stmt::Expr(ExprStmt {
                                span: *span,
                                expr: Box::new(Expr::Seq(SeqExpr { span: *span, exprs })),
                            });
                            s.visit_mut_with(self);
                            stmts.push(s);
                        }

                        if let Some(body) = body {
                            stmts.extend(body.stmts);
                        }

                        *stmt = Stmt::Block(BlockStmt { span: *span, stmts });
                    }
                }
            }

            Stmt::Block(block) => {
                if block.stmts.is_empty() {
                    *stmt = Stmt::Empty(EmptyStmt { span: block.span });
                    return;
                }
                if block.stmts.len() == 1 {
                    if let Stmt::Decl(..) = &block.stmts[0] {
                        return;
                    }
                    *stmt = block.stmts.take().into_iter().next().unwrap();
                }
            }

            Stmt::If(is) => {
                if let Some(alt) = &mut is.alt {
                    if alt.is_empty() {
                        is.alt = None;
                    }
                }

                //
                if self.can_remove(&is.test, true) {
                    if is.cons.is_empty() && is.alt.is_empty() {
                        *stmt = Stmt::Empty(EmptyStmt { span: is.span });
                        return;
                    }

                    if is.alt.is_empty() {
                        *stmt = *is.cons.take();
                        return;
                    }

                    if is.cons.is_empty() {
                        *stmt = *is.alt.take().unwrap();
                        return;
                    }
                }

                if is.cons.is_empty() && is.alt.is_empty() {
                    self.changed = true;
                    *stmt = Stmt::Expr(ExprStmt {
                        span: is.test.span(),
                        expr: is.test.take(),
                    });
                }
            }

            Stmt::While(s) => {
                if s.body.is_empty() {
                    *stmt = Stmt::Expr(ExprStmt {
                        span: s.span,
                        expr: s.test.take(),
                    });
                    self.changed = true;
                    return;
                }

                if self.can_remove(&s.test, true) {
                    *stmt = *s.body.take();
                    self.changed = true;
                }
            }

            Stmt::DoWhile(s) => {
                if s.body.is_empty() {
                    *stmt = Stmt::Expr(ExprStmt {
                        span: s.test.span(),
                        expr: s.test.take(),
                    });
                    self.changed = true;
                    return;
                }

                if self.can_remove(&s.test, true) {
                    *stmt = *s.body.take();
                    self.changed = true;
                }
            }

            Stmt::For(ForStmt {
                init: Some(VarDeclOrExpr::VarDecl(v)),
                test: None,
                update: None,
                body,
                ..
            }) => {
                if body.is_empty() {
                    *stmt = Stmt::Decl(Decl::Var(v.take()));
                    self.changed = true;
                }
            }

            Stmt::For(ForStmt {
                init: None,
                test: None,
                update: None,
                body,
                ..
            }) => {
                *stmt = *body.take();
                self.changed = true;
            }

            Stmt::Switch(s) => {
                if s.cases.is_empty() {
                    *stmt = Stmt::Expr(ExprStmt {
                        span: s.span,
                        expr: s.discriminant.take(),
                    });
                    self.changed = true;
                }
            }

            Stmt::Decl(Decl::Class(c)) => {
                // Remove trivial classes
                if c.class.super_class.is_none()
                    && c.class.decorators.is_empty()
                    && c.class.body.is_empty()
                {
                    stmt.take();
                }
            }

            Stmt::Try(ts) => {
                self.changed = true;

                let mut stmts = ts.block.stmts.take();
                if let Some(h) = ts.handler.take() {
                    if let Some(p) = h.param {
                        let p_span = p.span();
                        let mut exprs = vec![];
                        preserve_pat(&mut exprs, p);

                        if !exprs.is_empty() {
                            stmts.push(Stmt::Expr(ExprStmt {
                                span: p_span,
                                expr: Box::new(Expr::Seq(SeqExpr {
                                    span: p_span,
                                    exprs,
                                })),
                            }));
                        }
                    }
                    stmts.extend(h.body.stmts);
                }

                if let Some(f) = ts.finalizer.take() {
                    stmts.extend(f.stmts);
                }

                *stmt = Stmt::Block(BlockStmt {
                    span: ts.span,
                    stmts,
                });
            }

            Stmt::For(ForStmt {
                span,
                init,
                test,
                update,
                body,
                ..
            }) => {
                self.changed = true;
                let mut stmts = vec![];

                {
                    let mut exprs = vec![];

                    if let Some(init) = init.take() {
                        match init {
                            VarDeclOrExpr::VarDecl(v) => {
                                for d in v.decls {
                                    preserve_pat(&mut exprs, d.name);
                                    exprs.extend(d.init);
                                }
                            }
                            VarDeclOrExpr::Expr(e) => {
                                exprs.push(e);
                            }
                        }
                    }

                    exprs.extend(test.take());
                    exprs.extend(update.take());

                    if !exprs.is_empty() {
                        stmts.push(Stmt::Expr(ExprStmt {
                            span: *span,
                            expr: Box::new(Expr::Seq(SeqExpr { span: *span, exprs })),
                        }));
                    }
                }

                stmts.push(*body.take());

                *stmt = Stmt::Block(BlockStmt { span: *span, stmts });
            }

            // TODO: Flatten loops
            // TODO: Flatten try catch
            _ => {}
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(stmts);
    }

    fn visit_mut_super_prop_expr(&mut self, e: &mut SuperPropExpr) {
        if let SuperProp::Computed(c) = &mut e.prop {
            c.visit_mut_with(self);
        }
    }

    fn visit_mut_switch_cases(&mut self, cases: &mut Vec<SwitchCase>) {
        cases.visit_mut_children_with(self);

        cases.retain(|case| {
            if case
                .test
                .as_deref()
                .map(|e| self.can_remove(e, true))
                .unwrap_or(true)
                && case.cons.is_empty()
            {
                return false;
            }

            true
        })
    }

    fn visit_mut_ts_param_prop_param(&mut self, p: &mut TsParamPropParam) {
        p.visit_mut_children_with(self);

        match p {
            TsParamPropParam::Ident(_) => {}
            TsParamPropParam::Assign(ap) => {
                if ap.right.is_invalid() {
                    return;
                }

                self.ignore_expr(&mut ap.right, false);

                if ap.right.is_invalid() {
                    ap.right = Box::new(null_expr(ap.span));
                }
            }
        }
    }

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = Some(var.kind);

        var.visit_mut_children_with(self);

        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_mut_var_declarator(&mut self, v: &mut VarDeclarator) {
        let had_init = v.init.is_some();
        let expr_span = v.init.span();
        v.visit_mut_children_with(self);

        if let Some(e) = &mut v.init {
            self.ignore_expr(&mut **e, false);

            if e.is_invalid() {
                v.init = None;
            }
        }

        if had_init && v.init.is_none() && matches!(self.var_decl_kind, Some(VarDeclKind::Const)) {
            v.init = Some(Box::new(null_expr(expr_span)));
        }

        if had_init
            && v.init.is_none()
            && matches!(v.name, Pat::Array(..) | Pat::Assign(..) | Pat::Object(..))
        {
            v.init = Some(Box::new(null_expr(expr_span)));
        }
    }
}

fn is_related_to_process(right: &Expr) -> bool {
    match right {
        Expr::Ident(i) => &*i.sym == "process",
        Expr::Member(MemberExpr { obj, .. }) => is_related_to_process(obj),
        _ => false,
    }
}

fn preserve_pat_or_expr(exprs: &mut Vec<Box<Expr>>, p: PatOrExpr) {
    match p {
        PatOrExpr::Expr(e) => {
            exprs.push(e);
        }
        PatOrExpr::Pat(p) => preserve_pat(exprs, *p),
    }
}

fn preserve_pat(exprs: &mut Vec<Box<Expr>>, p: Pat) {
    match p {
        Pat::Ident(..) => {}
        Pat::Array(p) => {
            p.elems
                .into_iter()
                .flatten()
                .for_each(|elem| preserve_pat(exprs, elem));
        }
        Pat::Rest(p) => preserve_pat(exprs, *p.arg),
        Pat::Object(p) => p.props.into_iter().for_each(|p| {
            preserve_obj_pat(exprs, p);
        }),
        Pat::Assign(p) => {
            preserve_pat(exprs, *p.left);
            exprs.push(p.right)
        }
        Pat::Invalid(_) => {}
        Pat::Expr(e) => {
            exprs.push(e);
        }
    }
}

fn preserve_obj_pat(exprs: &mut Vec<Box<Expr>>, p: ObjectPatProp) {
    match p {
        ObjectPatProp::KeyValue(p) => {
            preserve_prop_name(exprs, p.key);
            preserve_pat(exprs, *p.value);
        }
        ObjectPatProp::Assign(p) => {
            exprs.extend(p.value);
        }
        ObjectPatProp::Rest(p) => preserve_pat(exprs, *p.arg),
    }
}

fn preserve_prop_name(exprs: &mut Vec<Box<Expr>>, p: PropName) {
    if let PropName::Computed(e) = p {
        exprs.push(e.expr);
    }
}

fn left_most(e: &Expr) -> Option<Ident> {
    match e {
        Expr::Ident(i) => Some(i.clone()),
        Expr::Member(MemberExpr { obj, prop, .. }) if !prop.is_computed() => left_most(obj),

        _ => None,
    }
}

fn null_expr(span: Span) -> Expr {
    Expr::Lit(Lit::Null(Null { span }))
}
