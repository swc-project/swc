use self::side_effect::{ImportDetector, SideEffectVisitor};
use crate::pass::RepeatedJsPass;
use fxhash::FxHashSet;
use retain_mut::RetainMut;
use std::{any::type_name, borrow::Cow, mem::take};
use swc_atoms::JsWord;
use swc_common::{
    chain,
    pass::{CompilerPass, Repeated},
    util::move_map::MoveMap,
    Mark, Span, Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, Id, StmtLike};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};

macro_rules! preserve {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            node.span = node.span.apply_mark(self.config.used_mark);
        }
    };
}

mod side_effect;

#[derive(Debug)]
pub struct Config<'a> {
    /// If this is [None], all exports are treated as used.
    pub used: Option<Cow<'a, [Id]>>,

    /// Mark used while performing dce.
    ///
    /// Should not be `Mark::root()`. Used to reduce allocation of [Mark].
    pub used_mark: Mark,
}

impl Default for Config<'_> {
    fn default() -> Self {
        Self {
            used: None,
            used_mark: Mark::fresh(Mark::root()),
        }
    }
}

pub fn dce<'a>(config: Config<'a>) -> impl RepeatedJsPass + 'a {
    assert_ne!(
        config.used_mark,
        Mark::root(),
        "dce cannot use Mark::root() as used_mark"
    );

    let used_mark = config.used_mark;

    chain!(
        as_folder(Dce {
            config,
            dropped: false,
            included: Default::default(),
            changed: false,
            marking_phase: false,
            decl_dropping_phase: false,
        }),
        as_folder(UsedMarkRemover { used_mark })
    )
}

struct UsedMarkRemover {
    used_mark: Mark,
}

impl CompilerPass for UsedMarkRemover {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("dce-cleanup")
    }
}

impl Repeated for UsedMarkRemover {
    fn changed(&self) -> bool {
        false
    }

    fn reset(&mut self) {}
}

impl VisitMut for UsedMarkRemover {
    noop_visit_mut_type!();

    fn visit_mut_span(&mut self, s: &mut Span) {
        let mut ctxt = s.ctxt.clone(); // explicit clone
        if ctxt.remove_mark() == self.used_mark {
            s.ctxt = ctxt;
        }
    }
}

#[derive(Debug)]
struct Dce<'a> {
    changed: bool,
    config: Config<'a>,

    /// Identifiers which should be emitted.
    included: FxHashSet<Id>,

    /// If true, idents are added to [included].
    marking_phase: bool,

    /// If false, the pass **ignores** imports.
    ///
    /// It means, imports are not marked (as used) nor removed.
    decl_dropping_phase: bool,

    dropped: bool,
}

impl CompilerPass for Dce<'_> {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("dce")
    }
}

impl Repeated for Dce<'_> {
    fn changed(&self) -> bool {
        self.dropped
    }

    fn reset(&mut self) {
        self.dropped = false;
        self.included = Default::default();
    }
}

impl VisitMut for Dce<'_> {
    noop_visit_mut_type!();

    preserve!(visit_mut_debugger_stmt, DebuggerStmt);
    preserve!(visit_mut_with_stmt, WithStmt);
    preserve!(visit_mut_break_stmt, BreakStmt);
    preserve!(visit_mut_continue_stmt, ContinueStmt);

    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        if self.is_marked(node.span) {
            return;
        }
        node.stmts.visit_mut_with(self);

        if self.marking_phase || node.stmts.iter().any(|stmt| self.is_marked(stmt.span())) {
            node.span = node.span.apply_mark(self.config.used_mark);
            self.mark(&mut node.stmts);
        }
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        if self.is_marked(node.span()) {
            return;
        }

        if self.marking_phase || self.included.contains(&node.ident.to_id()) {
            node.class.span = node.class.span.apply_mark(self.config.used_mark);
            self.mark(&mut node.class.super_class);
        }

        node.visit_mut_children_with(self)
    }

    fn visit_mut_do_while_stmt(&mut self, node: &mut DoWhileStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.is_marked(node.test.span()) || self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.test);
            self.mark(&mut node.body);
        }
    }

    fn visit_mut_export_all(&mut self, node: &mut ExportAll) {
        if self.is_marked(node.span) {
            return;
        }
        node.span = node.span.apply_mark(self.config.used_mark);
    }

    fn visit_mut_export_decl(&mut self, node: &mut ExportDecl) {
        if self.is_marked(node.span) {
            return;
        }

        let i = match node.decl {
            Decl::Class(ClassDecl { ref ident, .. }) | Decl::Fn(FnDecl { ref ident, .. }) => ident,

            // Preserve types
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                node.span = node.span.apply_mark(self.config.used_mark);
                return;
            }

            // Preserve only exported variables
            Decl::Var(mut v) => {
                v.decls = v.decls.move_flat_map(|mut d| {
                    if self.is_marked(d.span()) {
                        return Some(d);
                    }

                    let names: Vec<Id> = find_ids(&d.name);
                    for name in names {
                        if self.included.iter().any(|included| *included == name)
                            || self.should_preserve_export(&name.0)
                        {
                            d.span = d.span.apply_mark(self.config.used_mark);
                            self.mark(&mut d.init);
                            return Some(d);
                        }
                    }

                    if self.decl_dropping_phase {
                        return None;
                    }
                    Some(d)
                });

                if self.decl_dropping_phase && !v.decls.is_empty() {
                    node.span = node.span.apply_mark(self.config.used_mark);
                }

                node.decl = Decl::Var(v);

                return;
            }
        };

        if self.should_preserve_export(&i.sym) {
            node.span = node.span.apply_mark(self.config.used_mark);
            self.mark(&mut node.decl);
        }
    }

    fn visit_mut_export_default_decl(&mut self, node: &mut ExportDefaultDecl) {
        if self.is_marked(node.span) {
            return;
        }

        // TODO: Export only when it's required. (i.e. check self.used_exports)

        node.span = node.span.apply_mark(self.config.used_mark);
        self.mark(&mut node.decl);
    }

    fn visit_mut_export_default_expr(&mut self, node: &mut ExportDefaultExpr) {
        if self.is_marked(node.span) {
            return;
        }

        if self.should_preserve_export(&js_word!("default")) {
            node.span = node.span.apply_mark(self.config.used_mark);
            self.mark(&mut node.expr);
        }
    }

    fn visit_mut_expr_stmt(&mut self, node: &mut ExprStmt) {
        log::debug!("ExprStmt ->");
        if self.is_marked(node.span) {
            return;
        }

        if self.should_include(&node.expr) {
            log::debug!("\tIncluded");
            node.span = node.span.apply_mark(self.config.used_mark);
            self.mark(&mut node.expr);
            return;
        }

        node.visit_mut_children_with(self)
    }

    fn visit_mut_fn_decl(&mut self, mut f: &mut FnDecl) {
        if self.is_marked(f.span()) {
            return;
        }

        if self.marking_phase || self.included.contains(&f.ident.to_id()) {
            f.function.span = f.function.span.apply_mark(self.config.used_mark);
            self.mark(&mut f.function.params);
            self.mark(&mut f.function.body);
            return;
        }

        f.visit_mut_children_with(self)
    }

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.right.visit_mut_with(self);
        node.body.visit_mut_with(self);

        if self.should_include(&node.left)
            || self.is_marked(node.left.span())
            || self.is_marked(node.right.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.left);
            self.mark(&mut node.right);
            self.mark(&mut node.body);
        }
    }

    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.right.visit_mut_with(self);
        node.body.visit_mut_with(self);

        if self.should_include(&node.left)
            || self.is_marked(node.left.span())
            || self.is_marked(node.right.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.left);
            self.mark(&mut node.right);
            self.mark(&mut node.body);
        }
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if node.test.is_none()
            || self.is_marked(node.init.span())
            || self.is_marked(node.test.span())
            || self.is_marked(node.update.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.test);
            self.mark(&mut node.init);
            self.mark(&mut node.update);
            self.mark(&mut node.body);
        }
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if self.is_marked(i.span) {
            return;
        }

        if self.marking_phase {
            if self.included.insert(i.to_id()) {
                log::info!("{} is used", i.sym);
                self.changed = true;
            }
        }
    }

    fn visit_mut_if_stmt(&mut self, node: &mut IfStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.is_marked(node.test.span())
            || self.is_marked(node.cons.span())
            || self.is_marked(node.alt.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.test);
            self.mark(&mut node.cons);
            self.mark(&mut node.alt);
        }
    }

    fn visit_mut_import_decl(&mut self, mut import: &mut ImportDecl) {
        // Do not mark import as used while ignoring imports
        if !self.decl_dropping_phase {
            return;
        }

        if self.is_marked(import.span) {
            return;
        }

        // Side effect import
        if import.specifiers.is_empty() {
            import.span = import.span.apply_mark(self.config.used_mark);
            return;
        }

        // Drop unused imports.
        log::debug!("Removing unused import specifiers");
        import.specifiers.retain(|s| self.should_include(s));

        if !import.specifiers.is_empty() {
            import.span = import.span.apply_mark(self.config.used_mark);
        }
    }

    fn visit_mut_labeled_stmt(&mut self, node: &mut LabeledStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.body.visit_mut_with(self);

        if self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);
            self.mark(&mut node.body);
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        if self.is_marked(e.span()) {
            return;
        }

        e.obj.visit_mut_with(self);
        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_named_export(&mut self, node: &mut NamedExport) {
        if self.is_marked(node.span) {
            return;
        }

        // Export only when it's required.
        node.specifiers.retain(|s| match s {
            ExportSpecifier::Namespace(s) => self.should_preserve_export(&s.name.sym),
            ExportSpecifier::Default(..) => self.should_preserve_export(&js_word!("default")),
            ExportSpecifier::Named(s) => {
                self.should_preserve_export(&s.exported.as_ref().unwrap_or_else(|| &s.orig).sym)
            }
        });

        if !node.specifiers.is_empty() {
            node.span = node.span.apply_mark(self.config.used_mark);
            self.mark(&mut node.specifiers);
        }
    }

    fn visit_mut_return_stmt(&mut self, node: &mut ReturnStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.span = node.span.apply_mark(self.config.used_mark);
        self.mark(&mut node.arg);
    }

    fn visit_mut_switch_case(&mut self, node: &mut SwitchCase) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.is_marked(node.test.span()) || node.cons.iter().any(|v| self.is_marked(v.span())) {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.test);
            self.mark(&mut node.cons);
        }
    }

    fn visit_mut_switch_stmt(&mut self, node: &mut SwitchStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        // TODO: Handle fallthrough
        //  Drop useless switch case.
        //        node.cases.retain(|case| {
        //            self.is_marked(case.span)
        //        });

        if self.is_marked(node.discriminant.span())
            || node.cases.iter().any(|case| self.is_marked(case.span))
        {
            node.span = node.span.apply_mark(self.config.used_mark);
            self.mark(&mut node.cases);
        }
    }

    fn visit_mut_throw_stmt(&mut self, node: &mut ThrowStmt) {
        if self.is_marked(node.span) {
            return;
        }
        node.span = node.span.apply_mark(self.config.used_mark);

        node.visit_mut_children_with(self);

        if self.is_marked(node.arg.span()) {
            self.mark(&mut node.arg)
        }
    }

    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.is_marked(node.block.span())
            || self.is_marked(node.handler.span())
            || self.is_marked(node.finalizer.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.block);
            self.mark(&mut node.handler);
            self.mark(&mut node.finalizer);
        }
    }

    fn visit_mut_update_expr(&mut self, node: &mut UpdateExpr) {
        if self.is_marked(node.span) {
            return;
        }

        node.span = node.span.apply_mark(self.config.used_mark);
        self.mark(&mut node.arg);
    }

    fn visit_mut_var_decl(&mut self, mut var: &mut VarDecl) {
        if self.is_marked(var.span) {
            return;
        }

        var.visit_mut_children_with(self);

        var.decls.retain_mut(|decl| {
            if self.is_marked(decl.span()) {
                return true;
            }

            if !self.should_include(&decl.name) {
                if self.decl_dropping_phase {
                    return false;
                }
                return true;
            }

            decl.span = decl.span.apply_mark(self.config.used_mark);
            self.mark(&mut decl.init);
            self.mark(&mut decl.name);
            true
        });

        if var.decls.is_empty() || !self.decl_dropping_phase {
            return;
        }

        var.span = var.span.apply_mark(self.config.used_mark);
    }

    fn visit_mut_while_stmt(&mut self, node: &mut WhileStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.is_marked(node.test.span()) || self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.test);
            self.mark(&mut node.body);
        }
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n)
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n)
    }
}

impl Dce<'_> {
    fn visit_mut_stmt_like<T>(&mut self, items: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self> + Spanned + std::fmt::Debug,
        T: for<'any> VisitWith<SideEffectVisitor<'any>> + VisitWith<ImportDetector>,
        Vec<T>: VisitMutWith<Self>,
    {
        if self.marking_phase {
            items.visit_mut_children_with(self);
            return;
        }

        let old = self.changed;

        let mut preserved = FxHashSet::default();
        preserved.reserve(items.len());

        loop {
            log::info!("loop start");

            self.changed = false;
            let mut idx = 0u32;
            items.iter_mut().for_each(|item| {
                if !preserved.contains(&idx) {
                    if self.should_include(&*item) {
                        preserved.insert(idx);
                        self.changed = true;
                        item.visit_mut_with(self);
                    }
                }

                idx += 1;
            });

            if !self.changed {
                items.visit_mut_children_with(self);
            }

            if !self.changed {
                break;
            }
        }

        {
            let mut idx = 0;
            let taken = take(items);
            *items = taken.move_flat_map(|mut item| {
                self.drop_unused_decls(&mut item);
                let item = match item.try_into_stmt() {
                    Ok(stmt) => match stmt {
                        Stmt::Empty(..) => {
                            self.dropped = true;
                            idx += 1;
                            return None;
                        }
                        _ => T::from_stmt(stmt),
                    },
                    Err(item) => item,
                };

                if !preserved.contains(&idx) {
                    self.dropped = true;
                    idx += 1;
                    return None;
                }

                idx += 1;
                // Drop unused imports
                if self.is_marked(item.span()) {
                    Some(item)
                } else {
                    None
                }
            });
        }

        self.changed = old;
    }
}

impl Dce<'_> {
    pub fn is_marked(&self, span: Span) -> bool {
        let mut ctxt = span.ctxt().clone();

        loop {
            let mark = ctxt.remove_mark();

            if mark == Mark::root() {
                return false;
            }

            if mark == self.config.used_mark {
                return true;
            }
        }
    }

    pub fn should_preserve_export(&self, i: &JsWord) -> bool {
        self.config.used.is_none()
            || self
                .config
                .used
                .as_ref()
                .unwrap()
                .iter()
                .any(|exported| exported.0 == *i)
    }

    //    pub fn with_child<T, F>(&mut self, op: F) -> T
    //    where
    //        F: for<'any> FnOnce(&mut Dce<'any>) -> T,
    //    {
    //        let mut child = Dce {
    //            changed: false,
    //            config: Config {
    //                used: self.config.used.as_ref().map(|v| Cow::Borrowed(&**v)),
    //                ..self.config
    //            },
    //            included: Default::default(),
    //            marking_phase: false,
    //            dropped: false,
    //        };
    //
    //        let ret = op(&mut child);
    //
    //        self.changed |= child.changed;
    //        self.dropped |= child.dropped;
    //        self.included.extend(child.included);
    //
    //        ret
    //    }

    pub fn mark<T>(&mut self, node: &mut T)
    where
        T: VisitMutWith<Self>,
    {
        let old = self.marking_phase;
        self.marking_phase = true;
        log::info!("Marking: {}", type_name::<T>());
        node.visit_mut_with(self);
        self.marking_phase = old;
    }

    pub fn drop_unused_decls<T>(&mut self, node: &mut T)
    where
        T: VisitMutWith<Self>,
    {
        let old = self.decl_dropping_phase;
        self.decl_dropping_phase = true;
        node.visit_mut_with(self);
        self.decl_dropping_phase = old;
    }
}
