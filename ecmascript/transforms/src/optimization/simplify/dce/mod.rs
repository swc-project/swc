use self::side_effect::{ImportDetector, SideEffectVisitor};
use crate::pass::RepeatedJsPass;
use fxhash::FxHashSet;
use std::{any::type_name, borrow::Cow};
use swc_atoms::JsWord;
use swc_common::{
    chain,
    pass::{CompilerPass, Repeated},
    util::move_map::MoveMap,
    Mark, Span, Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, Id, StmtLike};
use swc_ecma_visit::{
    as_folder, noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitWith,
};

macro_rules! preserve {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, mut node: $T) -> $T {
            node.span = node.span.apply_mark(self.config.used_mark);
            node
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
        Dce {
            config,
            dropped: false,
            included: Default::default(),
            changed: false,
            marking_phase: false,
            decl_dropping_phase: false,
        },
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

        s
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

impl Fold for Dce<'_> {
    noop_fold_type!();

    preserve!(fold_debugger_stmt, DebuggerStmt);
    preserve!(fold_with_stmt, WithStmt);
    preserve!(fold_break_stmt, BreakStmt);
    preserve!(fold_continue_stmt, ContinueStmt);

    preserve!(fold_ts_export_assignment, TsExportAssignment);

    fn fold_block_stmt(&mut self, node: BlockStmt) -> BlockStmt {
        if self.is_marked(node.span) {
            return node;
        }

        let mut stmts = node.stmts.fold_with(self);

        let mut span = node.span;
        if self.marking_phase || stmts.iter().any(|stmt| self.is_marked(stmt.span())) {
            span = span.apply_mark(self.config.used_mark);
            stmts = self.fold_in_marking_phase(stmts);
        }

        BlockStmt { span, stmts }
    }

    fn fold_class_decl(&mut self, mut node: ClassDecl) -> ClassDecl {
        if self.is_marked(node.span()) {
            return node;
        }

        if self.marking_phase || self.included.contains(&node.ident.to_id()) {
            node.class.span = node.class.span.apply_mark(self.config.used_mark);
            node.class.super_class = self.fold_in_marking_phase(node.class.super_class);
        }

        node.fold_children_with(self)
    }

    fn fold_do_while_stmt(&mut self, mut node: DoWhileStmt) -> DoWhileStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if self.is_marked(node.test.span()) || self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_export_all(&mut self, mut node: ExportAll) -> ExportAll {
        if self.is_marked(node.span) {
            return node;
        }
        node.span = node.span.apply_mark(self.config.used_mark);
        node
    }

    fn fold_export_decl(&mut self, mut node: ExportDecl) -> ExportDecl {
        if self.is_marked(node.span) {
            return node;
        }

        let i = match node.decl {
            Decl::Class(ClassDecl { ref ident, .. }) | Decl::Fn(FnDecl { ref ident, .. }) => ident,

            // Preserve types
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                node.span = node.span.apply_mark(self.config.used_mark);
                return node;
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
                            d.init = self.fold_in_marking_phase(d.init);
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

                return node;
            }
        };

        if self.should_preserve_export(&i.sym) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.decl = self.fold_in_marking_phase(node.decl);
        }

        node
    }

    fn fold_export_default_decl(&mut self, mut node: ExportDefaultDecl) -> ExportDefaultDecl {
        if self.is_marked(node.span) {
            return node;
        }

        // TODO: Export only when it's required. (i.e. check self.used_exports)

        node.span = node.span.apply_mark(self.config.used_mark);
        node.decl = self.fold_in_marking_phase(node.decl);

        node
    }

    fn fold_export_default_expr(&mut self, mut node: ExportDefaultExpr) -> ExportDefaultExpr {
        if self.is_marked(node.span) {
            return node;
        }

        if self.should_preserve_export(&js_word!("default")) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.expr = self.fold_in_marking_phase(node.expr);
        }

        node
    }

    fn fold_expr_stmt(&mut self, node: ExprStmt) -> ExprStmt {
        log::debug!("ExprStmt ->");
        if self.is_marked(node.span) {
            return node;
        }

        if self.should_include(&node.expr) {
            log::debug!("\tIncluded");
            let stmt = ExprStmt {
                span: node.span.apply_mark(self.config.used_mark),
                expr: self.fold_in_marking_phase(node.expr),
            };
            return stmt;
        }

        node.fold_children_with(self)
    }

    fn fold_fn_decl(&mut self, mut f: FnDecl) -> FnDecl {
        if self.is_marked(f.span()) {
            return f;
        }

        if self.marking_phase || self.included.contains(&f.ident.to_id()) {
            f.function.span = f.function.span.apply_mark(self.config.used_mark);
            f.function.params = self.fold_in_marking_phase(f.function.params);
            f.function.body = self.fold_in_marking_phase(f.function.body);
            return f;
        }

        f.fold_children_with(self)
    }

    fn fold_for_in_stmt(&mut self, mut node: ForInStmt) -> ForInStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = ForInStmt {
            span: node.span,
            left: node.left,
            right: node.right.fold_with(self),
            body: node.body.fold_with(self),
        };

        if self.should_include(&node.left)
            || self.is_marked(node.left.span())
            || self.is_marked(node.right.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.left = self.fold_in_marking_phase(node.left);
            node.right = self.fold_in_marking_phase(node.right);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_for_of_stmt(&mut self, mut node: ForOfStmt) -> ForOfStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = ForOfStmt {
            span: node.span,
            await_token: node.await_token,
            left: node.left,
            right: node.right.fold_with(self),
            body: node.body.fold_with(self),
        };

        if self.should_include(&node.left)
            || self.is_marked(node.left.span())
            || self.is_marked(node.right.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.left = self.fold_in_marking_phase(node.left);
            node.right = self.fold_in_marking_phase(node.right);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_for_stmt(&mut self, mut node: ForStmt) -> ForStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if node.test.is_none()
            || self.is_marked(node.init.span())
            || self.is_marked(node.test.span())
            || self.is_marked(node.update.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.init = self.fold_in_marking_phase(node.init);
            node.update = self.fold_in_marking_phase(node.update);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_ident(&mut self, i: Ident) -> Ident {
        if self.is_marked(i.span) {
            return i;
        }

        if self.marking_phase {
            if self.included.insert(i.to_id()) {
                log::info!("{} is used", i.sym);
                self.changed = true;
            }
        }

        i
    }

    fn fold_if_stmt(&mut self, node: IfStmt) -> IfStmt {
        if self.is_marked(node.span) {
            return node;
        }

        let mut node: IfStmt = node.fold_children_with(self);

        if self.is_marked(node.test.span())
            || self.is_marked(node.cons.span())
            || self.is_marked(node.alt.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.cons = self.fold_in_marking_phase(node.cons);
            node.alt = self.fold_in_marking_phase(node.alt);
        }

        node
    }

    fn fold_import_decl(&mut self, mut import: ImportDecl) -> ImportDecl {
        // Do not mark import as used while ignoring imports
        if !self.decl_dropping_phase {
            return import;
        }

        if self.is_marked(import.span) {
            return import;
        }

        // Side effect import
        if import.specifiers.is_empty() {
            import.span = import.span.apply_mark(self.config.used_mark);
            return import;
        }

        // Drop unused imports.
        log::debug!("Removing unused import specifiers");
        import.specifiers.retain(|s| self.should_include(s));

        if !import.specifiers.is_empty() {
            import.span = import.span.apply_mark(self.config.used_mark);
        }

        import
    }

    fn fold_labeled_stmt(&mut self, mut node: LabeledStmt) -> LabeledStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node.body = node.body.fold_with(self);

        if self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_member_expr(&mut self, mut e: MemberExpr) -> MemberExpr {
        if self.is_marked(e.span()) {
            return e;
        }

        e.obj = e.obj.fold_with(self);
        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }

    fn fold_named_export(&mut self, mut node: NamedExport) -> NamedExport {
        if self.is_marked(node.span) {
            return node;
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
            node.specifiers = self.fold_in_marking_phase(node.specifiers);
        }

        node
    }

    fn fold_return_stmt(&mut self, mut node: ReturnStmt) -> ReturnStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node.span = node.span.apply_mark(self.config.used_mark);
        node.arg = self.fold_in_marking_phase(node.arg);

        node
    }

    fn fold_switch_case(&mut self, mut node: SwitchCase) -> SwitchCase {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if self.is_marked(node.test.span()) || node.cons.iter().any(|v| self.is_marked(v.span())) {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.cons = self.fold_in_marking_phase(node.cons);
        }

        node
    }

    fn fold_switch_stmt(&mut self, mut node: SwitchStmt) -> SwitchStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        // TODO: Handle fallthrough
        //  Drop useless switch case.
        //        node.cases.retain(|case| {
        //            self.is_marked(case.span)
        //        });

        if self.is_marked(node.discriminant.span())
            || node.cases.iter().any(|case| self.is_marked(case.span))
        {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.cases = self.fold_in_marking_phase(node.cases);
        }

        node
    }

    fn fold_throw_stmt(&mut self, mut node: ThrowStmt) -> ThrowStmt {
        if self.is_marked(node.span) {
            return node;
        }
        node.span = node.span.apply_mark(self.config.used_mark);

        let mut node = node.fold_children_with(self);

        if self.is_marked(node.arg.span()) {
            node.arg = self.fold_in_marking_phase(node.arg)
        }

        node
    }

    fn fold_try_stmt(&mut self, mut node: TryStmt) -> TryStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if self.is_marked(node.block.span())
            || self.is_marked(node.handler.span())
            || self.is_marked(node.finalizer.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.block = self.fold_in_marking_phase(node.block);
            node.handler = self.fold_in_marking_phase(node.handler);
            node.finalizer = self.fold_in_marking_phase(node.finalizer);
        }

        node
    }

    fn fold_update_expr(&mut self, mut node: UpdateExpr) -> UpdateExpr {
        if self.is_marked(node.span) {
            return node;
        }

        node.span = node.span.apply_mark(self.config.used_mark);
        node.arg = self.fold_in_marking_phase(node.arg);

        node
    }

    fn fold_var_decl(&mut self, mut var: VarDecl) -> VarDecl {
        if self.is_marked(var.span) {
            return var;
        }

        var = var.fold_children_with(self);

        var.decls = var.decls.move_flat_map(|decl| {
            if self.is_marked(decl.span()) {
                return Some(decl);
            }

            if !self.should_include(&decl.name) {
                if self.decl_dropping_phase {
                    return None;
                }
                return Some(decl);
            }

            Some(VarDeclarator {
                span: decl.span.apply_mark(self.config.used_mark),
                init: self.fold_in_marking_phase(decl.init),
                name: self.fold_in_marking_phase(decl.name),
                ..decl
            })
        });

        if var.decls.is_empty() || !self.decl_dropping_phase {
            return var;
        }

        return VarDecl {
            span: var.span.apply_mark(self.config.used_mark),
            ..var
        };
    }

    fn fold_while_stmt(&mut self, mut node: WhileStmt) -> WhileStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if self.is_marked(node.test.span()) || self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl Dce<'_> {
    fn fold_stmt_like<T>(&mut self, mut items: Vec<T>) -> Vec<T>
    where
        T: StmtLike + FoldWith<Self> + Spanned + std::fmt::Debug,
        T: for<'any> VisitWith<SideEffectVisitor<'any>> + VisitWith<ImportDetector>,
    {
        if self.marking_phase {
            return items.move_map(|item| self.fold_in_marking_phase(item));
        }

        let old = self.changed;

        let mut preserved = FxHashSet::default();
        preserved.reserve(items.len());

        loop {
            log::info!("loop start");

            self.changed = false;
            let mut idx = 0u32;
            items = items.move_map(|mut item| {
                let item = if preserved.contains(&idx) {
                    item
                } else {
                    if self.should_include(&item) {
                        preserved.insert(idx);
                        self.changed = true;
                        item = item.fold_with(self);
                    }
                    item
                };

                idx += 1;
                item
            });

            if !self.changed {
                items = items.move_map(|item| item.fold_with(self));
            }

            if !self.changed {
                break;
            }
        }

        {
            let mut idx = 0;
            items = items.move_flat_map(|item| {
                let item = self.drop_unused_decls(item);
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

        items
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

    pub fn fold_in_marking_phase<T>(&mut self, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        let old = self.marking_phase;
        self.marking_phase = true;
        log::info!("Marking: {}", type_name::<T>());
        let node = node.fold_with(self);
        self.marking_phase = old;

        node
    }

    pub fn drop_unused_decls<T>(&mut self, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        let old = self.decl_dropping_phase;
        self.decl_dropping_phase = true;
        let node = node.fold_with(self);
        self.decl_dropping_phase = old;

        node
    }
}
