use std::{iter::once, sync::Arc};
use swc_atoms::js_word;
use swc_common::{
    collections::AHashSet,
    pass::{Repeat, Repeated},
    util::take::Take,
    Mark, Span, Spanned, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, IsEmpty, StmtLike, StmtOrModuleItem};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};
use swc_timer::timer;

use self::flatten::contains_import;

mod flatten;

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
pub fn ast_reducer(top_level_mark: Mark) -> impl VisitMut {
    Repeat::new(ReduceAst {
        top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
        ..Default::default()
    })
}

struct Analyzer {
    amd_requires: AHashSet<Id>,
}

impl Visit for Analyzer {
    fn visit_call_expr(&mut self, e: &CallExpr) {
        e.visit_children_with(self);

        match &e.callee {
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Ident(callee) => {
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
                                if let Some(require_arg) =
                                    fn_arg.function.params.iter().nth(require_arg_idx)
                                {
                                    match &require_arg.pat {
                                        Pat::Ident(r) => {
                                            self.amd_requires.insert(r.to_id());
                                        }

                                        _ => {}
                                    }
                                }
                            }
                        }
                    }
                }
                _ => {}
            },
            _ => {}
        }
    }
}

#[derive(Default)]
struct ScopeData {
    imported_ids: AHashSet<Id>,
    /// amd `require` modules.
    amd_requires: AHashSet<Id>,
}

impl ScopeData {
    fn analyze(items: &[ModuleItem]) -> Self {
        let mut imported_ids = AHashSet::default();

        for item in items {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(i)) => {
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

                _ => {}
            }
        }

        let mut analyzer = Analyzer {
            amd_requires: AHashSet::default(),
        };

        items.visit_with(&mut analyzer);

        ScopeData {
            imported_ids,
            amd_requires: analyzer.amd_requires,
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
    top_level_ctxt: SyntaxContext,

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
            Ok(Stmt::Empty(..)) => return false,
            Ok(Stmt::Expr(es)) => return !self.can_remove(&es.expr, true),
            _ => true,
        });

        *stmts = new;
    }

    /// `ignore_expr`, but use `null` instead of [Expr::Invalid].
    fn ignore_expr_as_null(&mut self, e: &mut Expr) {
        let span = e.span();
        self.ignore_expr(e);
        if e.is_invalid() {
            *e = null_expr(span);
        }
    }

    fn ignore_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Lit(..) => {
                e.take();
                return;
            }
            Expr::This(..)
            | Expr::Member(MemberExpr {
                obj: ExprOrSuper::Super(..),
                computed: false,
                ..
            })
            | Expr::Yield(YieldExpr { arg: None, .. }) => {
                self.changed = true;
                e.take();
                return;
            }

            Expr::Ident(i) => {
                if !self.data.should_preserve(&*i) {
                    self.changed = true;
                    e.take();
                }
                return;
            }

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed,
                ..
            }) => {
                self.ignore_expr(obj);
                if *computed {
                    self.ignore_expr(prop);
                }

                match (self.can_remove(&obj, false), self.can_remove(&prop, false)) {
                    (true, true) => {
                        e.take();
                        return;
                    }
                    (true, false) => {
                        if *computed {
                            *e = *prop.take();
                        } else {
                            e.take();
                            return;
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
                    return;
                }
            }

            Expr::Object(obj) => {
                if obj.props.is_empty() {
                    self.changed = true;
                    e.take();
                    return;
                }
            }

            Expr::Seq(seq) => {
                // visit_mut_seq_expr handles the elements other than last one.
                if let Some(e) = seq.exprs.last_mut() {
                    self.ignore_expr(&mut **e);
                }
                seq.exprs.retain(|e| !e.is_invalid());
                if seq.exprs.is_empty() {
                    e.take();
                    return;
                }
                if seq.exprs.len() == 1 {
                    *e = *seq.exprs.pop().unwrap();
                    return;
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

    fn is_safe_to_flatten(&self, s: &Stmt) -> bool {
        !contains_import(&s)
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
            self.ignore_expr(&mut **v);
            if v.is_invalid() {
                p.value = None;
            }
        }
    }

    fn visit_mut_class(&mut self, c: &mut Class) {
        c.visit_mut_children_with(self);

        if let Some(s) = &c.super_class {
            if self.can_remove(&s, true) {
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
                    if !p.computed
                        && p.decorators.is_empty()
                        && self.can_remove(&p.key, false)
                        && p.value
                            .as_deref()
                            .map(|e| self.can_remove(e, true))
                            .unwrap_or(true)
                    {
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
                    if self.can_remove(&value, true) {
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
                if is_related_to_process(&left) || is_related_to_process(&right) {
                    return;
                }
            }

            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &**arg {
                Expr::Lit(..) => {}

                Expr::Call(CallExpr {
                    callee: ExprOrSuper::Expr(callee),
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
                callee: ExprOrSuper::Expr(callee),
                args,
                ..
            })
            | Expr::New(NewExpr {
                span,

                callee,
                args: Some(args),
                ..
            }) => {
                self.ignore_expr(callee);

                let is_define = match &**callee {
                    Expr::Ident(callee) => &*callee.sym == "define",
                    _ => false,
                };

                if is_define {
                    for arg in args {
                        match &mut *arg.expr {
                            Expr::Fn(f) => {
                                f.function.body.visit_mut_with(self);
                            }
                            _ => {}
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

        match e {
            Expr::Seq(seq) => {
                if seq.exprs.is_empty() {
                    *e = null_expr(seq.span);
                    return;
                }

                if seq.exprs.len() == 1 {
                    *e = *seq.exprs.pop().unwrap();
                }
            }
            _ => {}
        }

        match e {
            Expr::Paren(p) => {
                *e = *p.expr.take();
            }

            Expr::Ident(i) => {
                if self.data.should_preserve(&i) {
                    return;
                }

                *e = null_expr(i.span);
                return;
            }

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                computed: false,
                ..
            }) => {
                if let Some(left) = left_most(&obj) {
                    if self.data.should_preserve(&left) {
                        return;
                    }
                }
                *e = *obj.take();
                return;
            }

            Expr::OptChain(opt) => {
                *e = *opt.expr.take();
            }

            Expr::Await(expr) => {
                *e = *expr.arg.take();
            }

            Expr::Yield(expr) => {
                if let Some(arg) = expr.arg.take() {
                    *e = *arg;
                } else {
                    *e = null_expr(expr.span);
                    return;
                }
            }

            Expr::Unary(expr) => {
                *e = *expr.arg.take();
            }

            Expr::Update(expr) => {
                *e = *expr.arg.take();
            }

            Expr::TsAs(expr) => {
                *e = *expr.expr.take();
            }

            Expr::TsConstAssertion(expr) => {
                *e = *expr.expr.take();
            }

            Expr::TsTypeAssertion(expr) => {
                *e = *expr.expr.take();
            }

            Expr::TsNonNull(expr) => {
                *e = *expr.expr.take();
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

                self.ignore_expr_as_null(&mut expr.right);

                match &mut expr.left {
                    PatOrExpr::Pat(pat) => match &mut **pat {
                        Pat::Expr(left) => {
                            let left = left_most(&left);

                            if let Some(left) = left {
                                if self.data.should_preserve(&left) {
                                    return;
                                }
                            }
                        }
                        _ => {}
                    },
                    PatOrExpr::Expr(left) => {
                        let left = left_most(&left);

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
                    return;
                }
            }

            Expr::Bin(expr) => {
                let mut exprs = Vec::with_capacity(2);

                exprs.push(expr.left.take());
                exprs.push(expr.right.take());

                let mut seq = Expr::Seq(SeqExpr {
                    span: expr.span,
                    exprs,
                });

                seq.visit_mut_with(self);

                *e = seq;
            }

            Expr::Cond(expr) => {
                let mut exprs = Vec::with_capacity(3);

                exprs.push(expr.test.take());
                exprs.push(expr.cons.take());
                exprs.push(expr.alt.take());

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
                    PropOrSpread::Prop(prop) => match &**prop {
                        Prop::Shorthand(..) | Prop::KeyValue(..) | Prop::Assign(..) => true,
                        _ => false,
                    },
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
                    return;
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
                    return;
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
                    return;
                }
            }

            Expr::New(NewExpr {
                span, callee, args, ..
            }) => {
                let mut exprs = vec![];
                exprs.push(callee.take());
                exprs.extend(args.take().into_iter().flatten().map(|v| v.expr));

                *e = Expr::Seq(SeqExpr { span: *span, exprs });
                self.changed = true;
                return;
            }

            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Super(..),
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

        self.ignore_expr(&mut s.expr);
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
                if self.can_remove(&init, true) {
                    s.init = None;
                }
            }
            _ => {}
        }

        if let Some(test) = &mut s.test {
            self.ignore_expr(&mut **test);

            if self.can_remove(&test, true) {
                s.test = None;
            }
        }

        if let Some(update) = &mut s.update {
            self.ignore_expr(&mut **update);

            if self.can_remove(&update, true) {
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

        self.ignore_expr_as_null(&mut s.test);
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
                                if self.can_remove(&e, false) {
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
            match &mut el.children[0] {
                JSXElementChild::JSXElement(c) => {
                    *el = *c.take();
                }
                _ => {}
            }
        }
    }

    fn visit_mut_jsx_element_children(&mut self, v: &mut Vec<JSXElementChild>) {
        v.visit_mut_children_with(self);

        v.retain(|c| match c {
            JSXElementChild::JSXText(_)
            | JSXElementChild::JSXExprContainer(JSXExprContainer {
                expr: JSXExpr::JSXEmptyExpr(..),
                ..
            }) => return false,
            JSXElementChild::JSXExprContainer(JSXExprContainer {
                expr: JSXExpr::Expr(expr),
                ..
            }) => return !self.can_remove(&expr, false),

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

        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        if !self.collected_data {
            let _timer = timer!("analyze before reducing");
            self.collected_data = true;
            self.data = Arc::new(ScopeData::analyze(&stmts));
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
                if self.can_remove_pat {
                    if p.value.is_none() {
                        return false;
                    }
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
        match pat {
            Pat::Rest(rest) => {
                *pat = *rest.arg.take();
            }
            _ => {}
        }

        match pat {
            Pat::Assign(..) => {}
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
                if p.id.span.ctxt != self.top_level_ctxt {
                    pat.take();
                    return;
                }
            }

            Pat::Array(arr) => {
                if arr.elems.is_empty() {
                    pat.take();
                    return;
                }
            }

            Pat::Object(obj) => {
                if obj.props.is_empty() {
                    pat.take();
                    return;
                }
            }

            Pat::Assign(a) => {
                if self.can_remove(&a.right, false) {
                    a.left.visit_mut_with(self);

                    *pat = *a.left.take();
                    self.changed = true;
                    return;
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

        match p {
            Prop::Shorthand(i) => {
                if !self.data.should_preserve(&*i) {
                    i.take();
                    return;
                }
            }
            _ => {}
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

            self.ignore_expr(&mut **elem);
        }

        e.exprs.retain(|e| !self.can_remove(&e, false));
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
                *stmt = Stmt::Empty(EmptyStmt { span: stmt.span() });
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
                if self.is_safe_to_flatten(&s.cons)
                    && s.alt
                        .as_deref()
                        .map(|s| self.is_safe_to_flatten(&s))
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
                if self.is_safe_to_flatten(&s.body) {
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
                if self.is_safe_to_flatten(&s.body) {
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

        match stmt {
            Stmt::Labeled(l) => {
                *stmt = *l.body.take();
            }

            _ => {}
        }

        match stmt {
            Stmt::Expr(e) => {
                if e.expr.is_invalid() {
                    self.changed = true;
                    *stmt = Stmt::Empty(EmptyStmt { span: e.span });
                    return;
                }

                match &mut *e.expr {
                    // Optimize IIFE
                    Expr::Call(CallExpr {
                        span,
                        callee: ExprOrSuper::Expr(callee),
                        args,
                        ..
                    }) => match &mut **callee {
                        Expr::Fn(callee) => {
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

                                exprs.extend(args.into_iter().map(|arg| arg.expr.take()));

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
                            return;
                        }
                        _ => {}
                    },

                    _ => {}
                }
            }

            Stmt::Block(block) => {
                if block.stmts.is_empty() {
                    *stmt = Stmt::Empty(EmptyStmt { span: block.span });
                    return;
                }
                if block.stmts.len() == 1 {
                    match &block.stmts[0] {
                        Stmt::Decl(..) => {
                            return;
                        }
                        _ => {}
                    }
                    *stmt = block.stmts.take().into_iter().next().unwrap();
                    return;
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
                    return;
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
                    return;
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
                    return;
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
                    return;
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
                return;
            }

            Stmt::Switch(s) => {
                if s.cases.is_empty() {
                    *stmt = Stmt::Expr(ExprStmt {
                        span: s.span,
                        expr: s.discriminant.take(),
                    });
                    self.changed = true;
                    return;
                }
            }

            Stmt::Decl(Decl::Class(c)) => {
                // Remove trivial classes
                if c.class.super_class.is_none()
                    && c.class.decorators.is_empty()
                    && c.class.body.is_empty()
                {
                    stmt.take();
                    return;
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
                return;
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
                return;
            }

            // TODO: Flatten loops
            // TODO: Flatten try catch
            _ => {}
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(stmts);
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

                self.ignore_expr(&mut ap.right);

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
            self.ignore_expr(&mut **e);

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
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(obj),
            ..
        }) => is_related_to_process(&obj),
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
    match p {
        PropName::Computed(e) => {
            exprs.push(e.expr);
        }
        _ => {}
    }
}

fn left_most(e: &Expr) -> Option<Ident> {
    match e {
        Expr::Ident(i) => Some(i.clone()),
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(obj),
            computed: false,
            ..
        }) => left_most(obj),

        _ => None,
    }
}

fn null_expr(span: Span) -> Expr {
    Expr::Lit(Lit::Null(Null { span }))
}
