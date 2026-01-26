use std::{
    borrow::Borrow,
    mem::take,
    ops::{Deref, DerefMut},
};

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{util::take::Take, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{Parallel, ParallelExt};
use swc_ecma_utils::{collect_decls, contains_this_expr, ExprCtx, ExprExt, Remapper};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use tracing::debug;

use super::{Ctx, Optimizer};
use crate::HEAVY_TASK_PARALLELS;

impl<'b> Optimizer<'b> {
    pub(super) fn normalize_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Seq(seq) => {
                for e in &mut seq.exprs {
                    self.normalize_expr(e);
                }

                if seq.exprs.len() == 1 {
                    *e = *seq.exprs.take().into_iter().next().unwrap();
                    self.normalize_expr(e);
                    return;
                }

                if seq.exprs.iter().any(|v| v.is_seq()) {
                    let mut new = Vec::new();

                    for e in seq.exprs.take() {
                        match *e {
                            Expr::Seq(s) => {
                                new.extend(s.exprs);
                            }
                            _ => new.push(e),
                        }
                    }

                    seq.exprs = new;
                }
            }

            Expr::Cond(cond) => {
                self.normalize_expr(&mut cond.test);
                self.normalize_expr(&mut cond.cons);
                self.normalize_expr(&mut cond.alt);
            }

            Expr::Assign(a) => {
                self.normalize_expr(&mut a.right);
            }

            _ => {}
        }
    }

    pub(super) fn access_numeric_property<'e>(
        &mut self,
        _expr: &'e mut Expr,
        _idx: usize,
    ) -> Option<&'e mut Expr> {
        None
    }

    /// Check for `/** @const */`.
    pub(super) fn has_const_ann(&self, ctxt: SyntaxContext) -> bool {
        ctxt.has_mark(self.marks.const_ann)
    }

    /// Check for `/*#__NOINLINE__*/`
    pub(super) fn has_noinline(&self, ctxt: SyntaxContext) -> bool {
        ctxt.has_mark(self.marks.noinline)
    }

    /// RAII guard to change context temporarically
    pub(super) fn with_ctx(&mut self, mut ctx: Ctx) -> WithCtx<'_, 'b> {
        let mut scope_ctxt = ctx.scope;

        if self.ctx.scope != scope_ctxt {
            if scope_ctxt.clone().remove_mark() == self.marks.fake_block {
                scope_ctxt.remove_mark();
            }
            ctx.scope = scope_ctxt;

            #[cfg(debug_assertions)]
            {
                self.data
                    .get_scope(scope_ctxt)
                    .unwrap_or_else(|| panic!("scope not found: {scope_ctxt:?}"));
            }
        }

        let orig_ctx = std::mem::replace(&mut self.ctx, ctx);
        WithCtx {
            reducer: self,
            orig_ctx,
        }
    }

    pub(super) fn try_remove_label(&mut self, s: &mut LabeledStmt) {
        if !self.options.dead_code {
            return;
        }

        let mut analyer = LabelAnalyzer {
            label: s.label.sym.clone(),
            ..Default::default()
        };

        match &mut *s.body {
            Stmt::For(ForStmt { body, .. })
            | Stmt::ForIn(ForInStmt { body, .. })
            | Stmt::ForOf(ForOfStmt { body, .. })
            | Stmt::While(WhileStmt { body, .. })
            | Stmt::DoWhile(DoWhileStmt { body, .. }) => {
                analyer.top_breakable = true;
                body.visit_mut_with(&mut analyer)
            }
            Stmt::Switch(SwitchStmt { cases, .. }) => {
                analyer.top_breakable = true;
                cases.visit_mut_with(&mut analyer)
            }
            _ => s.body.visit_mut_with(&mut analyer),
        };

        if analyer.count == 0 {
            let _label = s.label.take();
            self.changed = true;
            report_change!("Removing label `{}`", _label);
        }
    }
}

pub(super) struct WithCtx<'a, 'b> {
    reducer: &'a mut Optimizer<'b>,
    orig_ctx: Ctx,
}

impl<'b> Deref for WithCtx<'_, 'b> {
    type Target = Optimizer<'b>;

    fn deref(&self) -> &Self::Target {
        self.reducer
    }
}

impl DerefMut for WithCtx<'_, '_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.reducer
    }
}

impl Drop for WithCtx<'_, '_> {
    fn drop(&mut self) {
        self.reducer.ctx = self.orig_ctx.clone();
    }
}

pub(crate) fn extract_class_side_effect(
    expr_ctx: ExprCtx,
    c: &mut Class,
) -> Option<Vec<&mut Box<Expr>>> {
    let mut res = Vec::new();
    if let Some(e) = &mut c.super_class {
        if e.may_have_side_effects(expr_ctx) {
            res.push(e);
        }
    }

    for m in &mut c.body {
        match m {
            ClassMember::Method(ClassMethod {
                key: PropName::Computed(key),
                ..
            }) => {
                if key.expr.may_have_side_effects(expr_ctx) {
                    res.push(&mut key.expr);
                }
            }

            ClassMember::ClassProp(p) => {
                if let PropName::Computed(key) = &mut p.key {
                    if key.expr.may_have_side_effects(expr_ctx) {
                        res.push(&mut key.expr);
                    }
                }

                if let Some(v) = &mut p.value {
                    if p.is_static && v.may_have_side_effects(expr_ctx) {
                        if contains_this_expr(v) {
                            return None;
                        }
                        res.push(v);
                    }
                }
            }
            ClassMember::PrivateProp(PrivateProp {
                value: Some(v),
                is_static: true,
                ..
            }) => {
                if v.may_have_side_effects(expr_ctx) {
                    if contains_this_expr(v) {
                        return None;
                    }
                    res.push(v);
                }
            }

            _ => {}
        }
    }

    Some(res)
}

pub(crate) fn is_valid_for_lhs(e: &Expr) -> bool {
    !matches!(e, Expr::Lit(..) | Expr::Unary(..))
}

/// A visitor responsible for inlining special kind of variables and removing
/// (some) unused variables. Due to the order of visit, the main visitor cannot
/// handle all edge cases and this type is the complement for it.
#[derive(Clone, Copy)]
pub(crate) struct Finalizer<'a> {
    pub simple_functions: &'a FxHashMap<Id, Box<Expr>>,
    pub lits: &'a FxHashMap<Id, Box<Expr>>,
    pub lits_for_cmp: &'a FxHashMap<Id, Box<Expr>>,
    pub lits_for_array_access: &'a FxHashMap<Id, Box<Expr>>,
    pub hoisted_props: &'a FxHashMap<(Id, Wtf8Atom), Ident>,

    pub vars_to_remove: &'a FxHashSet<Id>,

    pub changed: bool,
}

impl Parallel for Finalizer<'_> {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, other: Self) {
        self.changed |= other.changed;
    }
}

impl Finalizer<'_> {
    fn var(&mut self, i: &Id, mode: FinalizerMode) -> Option<Box<Expr>> {
        let mut e = match mode {
            FinalizerMode::Callee => {
                let mut value = self.simple_functions.get(i).cloned()?;
                let mut cache = FxHashMap::default();
                let mut remap = FxHashMap::default();
                let bindings: FxHashSet<Id> = collect_decls(&*value);
                let new_mark = Mark::new();

                // at this point, var usage no longer matter
                for id in bindings {
                    let new_ctxt = cache
                        .entry(id.1)
                        .or_insert_with(|| id.1.apply_mark(new_mark));

                    let new_ctxt = *new_ctxt;

                    remap.insert(id, new_ctxt);
                }

                if !remap.is_empty() {
                    let mut remapper = Remapper::new(&remap);
                    value.visit_mut_with(&mut remapper);
                }

                value
            }
            FinalizerMode::ComparisonWithLit => self.lits_for_cmp.get(i).cloned()?,
            FinalizerMode::MemberAccess => self.lits_for_array_access.get(i).cloned()?,
        };

        e.visit_mut_children_with(self);

        match &*e {
            Expr::Ident(Ident { sym, .. }) if &**sym == "eval" => Some(
                SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![0.into(), e],
                }
                .into(),
            ),
            _ => Some(e),
        }
    }

    fn check(&mut self, e: &mut Expr, mode: FinalizerMode) {
        if let Expr::Ident(i) = e {
            if let Some(new) = self.var(&i.to_id(), mode) {
                debug!("multi-replacer: Replaced `{}`", i);
                self.changed = true;

                *e = *new;
            }
        }
    }
}

#[derive(Debug, Clone, Copy)]
enum FinalizerMode {
    Callee,
    ComparisonWithLit,
    MemberAccess,
}

impl VisitMut for Finalizer<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_bin_expr(&mut self, e: &mut BinExpr) {
        e.visit_mut_children_with(self);

        match e.op {
            op!("===") | op!("!==") | op!("==") | op!("!=") => {
                //
                if e.left.is_lit() {
                    self.check(&mut e.right, FinalizerMode::ComparisonWithLit);
                } else if e.right.is_lit() {
                    self.check(&mut e.left, FinalizerMode::ComparisonWithLit);
                }
            }
            _ => {}
        }
    }

    fn visit_mut_callee(&mut self, e: &mut Callee) {
        e.visit_mut_children_with(self);

        if let Callee::Expr(e) = e {
            self.check(e, FinalizerMode::Callee);
        }
    }

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, members, |v, member| {
            member.visit_mut_with(v);
        });
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(i) => {
                if let Some(expr) = self.lits.get(&i.to_id()) {
                    *n = *expr.clone();
                    return;
                }
            }
            Expr::Member(e) => {
                if let Expr::Ident(obj) = &*e.obj {
                    let sym = match &e.prop {
                        MemberProp::Ident(i) => i.sym.borrow(),
                        MemberProp::Computed(e) => match &*e.expr {
                            Expr::Ident(ident) => ident.sym.borrow(),
                            Expr::Lit(Lit::Str(s)) => &s.value,
                            _ => return,
                        },
                        _ => return,
                    };

                    if let Some(ident) = self.hoisted_props.get(&(obj.to_id(), sym.clone())) {
                        self.changed = true;
                        *n = ident.clone().into();
                        return;
                    }
                }
            }
            _ => {}
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.visit_mut_children_with(self);

        if let MemberProp::Computed(ref mut prop) = e.prop {
            if let Expr::Lit(Lit::Num(..)) = &*prop.expr {
                self.check(&mut e.obj, FinalizerMode::MemberAccess);
            }
        }
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        n.visit_mut_children_with(self);

        if let Some(VarDeclOrExpr::VarDecl(v)) = n {
            if v.decls.is_empty() {
                *n = None;
            }
        }
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_prop_or_spreads(&mut self, n: &mut Vec<PropOrSpread>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_stmt(&mut self, n: &mut Stmt) {
        n.visit_mut_children_with(self);

        if let Stmt::Decl(Decl::Var(v)) = n {
            if v.decls.is_empty() {
                n.take();
            }
        }
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.maybe_par(*HEAVY_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        n.visit_mut_children_with(self);

        if n.init.is_none() {
            if let Pat::Ident(i) = &n.name {
                if self.vars_to_remove.contains(&i.to_id()) {
                    n.name.take();
                }
            }
        }
    }

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        n.visit_mut_children_with(self);

        n.retain(|v| !v.name.is_invalid());
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        n.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = n {
            if let Some(expr) = self.lits.get(&i.to_id()) {
                let key = prop_name_from_ident(i.take());
                *n = Prop::KeyValue(KeyValueProp {
                    key,
                    value: expr.clone(),
                });
                self.changed = true;
            }
        }
    }
}

pub(crate) struct NormalMultiReplacer<'a> {
    pub vars: &'a mut FxHashMap<Id, Box<Expr>>,
    pub changed: bool,
    should_consume: bool,
}

impl<'a> NormalMultiReplacer<'a> {
    /// `worked` will be changed to `true` if any replacement is done
    pub fn new(vars: &'a mut FxHashMap<Id, Box<Expr>>, should_consume: bool) -> Self {
        NormalMultiReplacer {
            vars,
            should_consume,
            changed: false,
        }
    }

    fn var(&mut self, i: &Id) -> Option<Box<Expr>> {
        let mut e = self.vars.remove(i)?;

        e.visit_mut_children_with(self);

        let e = if self.should_consume {
            e
        } else {
            let new_e = e.clone();
            self.vars.insert(i.clone(), e);

            new_e
        };

        match &*e {
            Expr::Ident(Ident { sym, .. }) if &**sym == "eval" => Some(
                SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![0.into(), e],
                }
                .into(),
            ),
            _ => Some(e),
        }
    }
}

impl VisitMut for NormalMultiReplacer<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if self.vars.is_empty() {
            return;
        }
        e.visit_mut_children_with(self);

        if self.vars.is_empty() {
            return;
        }

        if let Expr::Ident(i) = e {
            if let Some(new) = self.var(&i.to_id()) {
                debug!("multi-replacer: Replaced `{}`", i);
                self.changed = true;

                *e = *new;
            }
        }
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        if self.vars.is_empty() {
            return;
        }
        items.visit_mut_children_with(self);

        #[cfg(feature = "debug")]
        if !self.vars.is_empty() {
            let keys = self.vars.iter().map(|(k, _)| k.clone()).collect::<Vec<_>>();
            debug!("Dropping {:?}", keys);
        }
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = p {
            if let Some(value) = self.var(&i.to_id()) {
                debug!("multi-replacer: Replaced `{}` as shorthand", i);
                self.changed = true;

                let key = prop_name_from_ident(i.take());
                *p = Prop::KeyValue(KeyValueProp { key, value });
            }
        }
    }

    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        if self.vars.is_empty() {
            return;
        }

        node.visit_mut_children_with(self);
    }
}

pub(crate) fn replace_id_with_expr<N>(node: &mut N, from: Id, to: Box<Expr>) -> Option<Box<Expr>>
where
    N: VisitMutWith<ExprReplacer>,
{
    let mut v = ExprReplacer { from, to: Some(to) };
    node.visit_mut_with(&mut v);

    v.to
}

pub(crate) struct ExprReplacer {
    from: Id,
    to: Option<Box<Expr>>,
}

impl ExprReplacer {
    fn take(&mut self) -> Option<Box<Expr>> {
        let e = self.to.take()?;

        match &*e {
            Expr::Ident(Ident { sym, .. }) if &**sym == "eval" => Some(
                SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![0.into(), e],
                }
                .into(),
            ),
            _ => Some(e),
        }
    }
}

impl VisitMut for ExprReplacer {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Ident(i) = e {
            if self.from.0 == i.sym && self.from.1 == i.ctxt {
                if let Some(new) = self.take() {
                    *e = *new;
                } else {
                    unreachable!("`{}` is already taken", i)
                }
            }
        }
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = p {
            if self.from.0 == i.sym && self.from.1 == i.ctxt {
                let value = if let Some(new) = self.take() {
                    new
                } else {
                    unreachable!("`{}` is already taken", i)
                };
                let key = prop_name_from_ident(i.take());
                *p = Prop::KeyValue(KeyValueProp { key, value });
            }
        }
    }
}

#[derive(Debug, Default, PartialEq, Eq)]
pub(super) struct SynthesizedStmts(Vec<Stmt>);

impl SynthesizedStmts {
    pub fn take_stmts(&mut self) -> Vec<Stmt> {
        take(&mut self.0)
    }
}

impl std::ops::Deref for SynthesizedStmts {
    type Target = Vec<Stmt>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl SynthesizedStmts {
    pub fn push(&mut self, stmt: Stmt) {
        self.0.push(stmt);
    }

    pub fn extend(&mut self, stmts: impl IntoIterator<Item = Stmt>) {
        self.0.extend(stmts);
    }

    pub fn append(&mut self, other: &mut SynthesizedStmts) {
        self.0.append(&mut other.0);
    }
}

impl std::ops::DerefMut for SynthesizedStmts {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl Take for SynthesizedStmts {
    fn dummy() -> Self {
        Self(Take::dummy())
    }
}

impl Drop for SynthesizedStmts {
    fn drop(&mut self) {
        if !self.0.is_empty() {
            if !std::thread::panicking() {
                panic!("We should not drop synthesized stmts");
            }
        }
    }
}

#[derive(Default)]
struct LabelAnalyzer {
    label: Atom,
    /// If top level is a normal block, labelled break must be preserved
    top_breakable: bool,
    count: usize,
    break_layer: usize,
    continue_layer: usize,
}

impl LabelAnalyzer {
    fn visit_mut_loop(&mut self, n: &mut impl VisitMutWith<LabelAnalyzer>) {
        self.break_layer += 1;
        self.continue_layer += 1;

        n.visit_mut_children_with(self);

        self.break_layer -= 1;
        self.continue_layer -= 1;
    }
}

impl VisitMut for LabelAnalyzer {
    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_class(&mut self, _: &mut Class) {}

    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_object_lit(&mut self, _: &mut ObjectLit) {}

    fn visit_mut_for_stmt(&mut self, n: &mut ForStmt) {
        self.visit_mut_loop(n)
    }

    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        self.visit_mut_loop(n)
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        self.visit_mut_loop(n)
    }

    fn visit_mut_while_stmt(&mut self, n: &mut WhileStmt) {
        self.visit_mut_loop(n)
    }

    fn visit_mut_do_while_stmt(&mut self, n: &mut DoWhileStmt) {
        self.visit_mut_loop(n)
    }

    fn visit_mut_switch_stmt(&mut self, n: &mut SwitchStmt) {
        self.break_layer += 1;

        n.visit_mut_children_with(self);

        self.break_layer -= 1;
    }

    fn visit_mut_break_stmt(&mut self, n: &mut BreakStmt) {
        if let Some(lb) = &n.label {
            if lb.sym == self.label {
                if self.break_layer > 0 || !self.top_breakable {
                    self.count += 1;
                } else {
                    n.label = None
                }
            }
        }
    }

    fn visit_mut_continue_stmt(&mut self, n: &mut ContinueStmt) {
        if let Some(lb) = &n.label {
            if lb.sym == self.label {
                if self.continue_layer > 0 {
                    self.count += 1;
                } else {
                    n.label = None
                }
            }
        }
    }
}

pub fn get_ids_of_pat(pat: &Pat) -> Vec<Id> {
    fn append(pat: &Pat, ids: &mut Vec<Id>) {
        match pat {
            Pat::Ident(binding_ident) => ids.push(binding_ident.id.to_id()),
            Pat::Array(array_pat) => {
                for pat in array_pat.elems.iter().flatten() {
                    append(pat, ids);
                }
            }
            Pat::Rest(rest_pat) => append(&rest_pat.arg, ids),
            Pat::Object(object_pat) => {
                for pat in &object_pat.props {
                    match pat {
                        ObjectPatProp::KeyValue(key_value_pat_prop) => {
                            append(&key_value_pat_prop.value, ids)
                        }
                        ObjectPatProp::Assign(assign_pat_prop) => {
                            ids.push(assign_pat_prop.key.to_id())
                        }
                        ObjectPatProp::Rest(rest_pat) => append(&rest_pat.arg, ids),
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    }
                }
            }
            Pat::Assign(assign_pat) => append(&assign_pat.left, ids),
            Pat::Invalid(_) | Pat::Expr(_) => {}
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    let mut idents = vec![];
    append(pat, &mut idents);
    idents
}

/// Creates a PropName for a shorthand property, handling the special case of
/// `__proto__`. When the property name is `__proto__`, it must be converted to
/// a computed property to preserve JavaScript semantics.
fn prop_name_from_ident(ident: Ident) -> PropName {
    if ident.sym == "__proto__" {
        PropName::Computed(ComputedPropName {
            span: ident.span,
            expr: Box::new(Expr::Lit(Lit::Str(Str {
                span: ident.span,
                value: ident.sym.clone().into(),
                raw: None,
            }))),
        })
    } else {
        ident.into()
    }
}
