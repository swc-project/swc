use self::side_effect::{ImportDetector, SideEffectVisitor};
use fxhash::FxHashSet;
use retain_mut::RetainMut;
use std::{any::type_name, borrow::Cow, fmt::Debug, mem::take};
use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::{
    chain,
    pass::{CompilerPass, Repeated},
    util::move_map::MoveMap,
    Mark, Span, Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::pass::RepeatedJsPass;
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
            cur_defining: Default::default()
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

    /// Functions that we are currently defining.
    ///
    /// Reference to function itself in a function should not make function
    /// preserved.
    cur_defining: FxHashSet<Id>,
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

/// This is currently overly conservative.
///
/// TODO: Skip visiting key if the key of class member or property is not
/// computed.
macro_rules! normal {
    (
        $name:ident,
        $T:ty,
        $($singular_props:ident),*
    ) => {
        normal!($name, $T, [$($singular_props),*], []);
    };

    (
        $name:ident,
        $T:ty,
        [$($singular_props:ident),*],
        [$($array_like_props:ident),*]
    ) => {
        fn $name(&mut self, node: &mut $T) {
            log::trace!("Visit<{}>: marking = {}; {:?}", stringify!($T), self.marking_phase, node);
            if self.is_marked(node.span()) {
                log::trace!("Visit<{}>: Already marked", stringify!($T));
                return;
            }

            $(
                node.$singular_props.visit_mut_with(self);
            )*

            $(
                node.$array_like_props.visit_mut_with(self);
            )*

            if self.marking_phase
                $(
                    || self.is_marked(node.$singular_props.span())
                )*
                $(
                    || self.has_marked_elem(&node.$array_like_props)
                )*
            {
                log::trace!("Visit<{}>: Marking", stringify!($T));
                node.span = node.span.apply_mark(self.config.used_mark);

                $(
                    self.mark(&mut node.$singular_props);
                )*

                $(
                    self.mark(&mut node.$array_like_props);
                )*
            }
        }
    };
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

        let i = match &mut node.decl {
            Decl::Class(ClassDecl { ref ident, .. }) | Decl::Fn(FnDecl { ref ident, .. }) => ident,

            // Preserve types
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                node.span = node.span.apply_mark(self.config.used_mark);
                return;
            }

            // Preserve only exported variables
            Decl::Var(v) => {
                v.decls.retain_mut(|d| {
                    if self.is_marked(d.span()) {
                        return true;
                    }

                    let names: Vec<Id> = find_ids(&d.name);
                    for name in names {
                        if self.included.iter().any(|included| *included == name)
                            || self.should_preserve_export(&name.0)
                        {
                            d.span = d.span.apply_mark(self.config.used_mark);
                            self.mark(&mut d.init);
                            return true;
                        }
                    }

                    if self.decl_dropping_phase {
                        return false;
                    }
                    true
                });

                if self.decl_dropping_phase && !v.decls.is_empty() {
                    node.span = node.span.apply_mark(self.config.used_mark);
                }

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
        log::trace!("ExprStmt ->");
        if self.is_marked(node.span) {
            return;
        }

        if self.should_include(&node.expr) {
            log::trace!("\tIncluded");
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

        let id = f.ident.to_id();
        self.cur_defining.insert(id.clone());

        f.visit_mut_children_with(self);

        self.cur_defining.remove(&id);
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
            let id = i.to_id();
            // This is required to drop recursive functions.
            if self.cur_defining.contains(&id) {
                return;
            }

            if self.included.insert(id) {
                log::debug!("{} is used", i.sym);
                self.changed = true;
            }
        }
    }

    fn visit_mut_if_stmt(&mut self, node: &mut IfStmt) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.marking_phase
            || self.is_marked(node.test.span())
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
        log::trace!("Removing unused import specifiers");
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
            self.mark(&mut node.discriminant);
            self.mark(&mut node.cases);
        }
    }

    normal!(visit_mut_throw_stmt, ThrowStmt, arg);
    normal!(visit_mut_try_stmt, TryStmt, block, handler, finalizer);

    fn visit_mut_update_expr(&mut self, node: &mut UpdateExpr) {
        if self.is_marked(node.span) {
            return;
        }

        node.span = node.span.apply_mark(self.config.used_mark);
        self.mark(&mut node.arg);
    }

    fn visit_mut_var_declarator(&mut self, d: &mut VarDeclarator) {
        if self.is_marked(d.span) {
            return;
        }

        d.visit_mut_children_with(self);

        if self.is_marked(d.name.span()) || self.is_marked(d.init.span()) {
            d.span = d.span.apply_mark(self.config.used_mark);
        }
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

    fn visit_mut_unary_expr(&mut self, node: &mut UnaryExpr) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.marking_phase || self.is_marked(node.arg.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.arg);
        }
    }

    fn visit_mut_bin_expr(&mut self, node: &mut BinExpr) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.marking_phase
            || self.is_marked(node.left.span())
            || self.is_marked(node.right.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.left);
            self.mark(&mut node.right);
        }
    }

    fn visit_mut_new_expr(&mut self, node: &mut NewExpr) {
        if self.is_marked(node.span) {
            return;
        }

        node.span = node.span.apply_mark(self.config.used_mark);

        self.mark(&mut node.callee);
        self.mark(&mut node.args);
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        if self.is_marked(node.span) {
            return;
        }

        node.visit_mut_children_with(self);

        if self.marking_phase
            || self.is_marked(node.callee.span())
            || node.args.iter().any(|arg| self.is_marked(arg.expr.span()))
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            self.mark(&mut node.callee);
            self.mark(&mut node.args);
        }
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n)
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        if !self.decl_dropping_phase {
            n.visit_mut_children_with(self);
            return;
        }
        self.visit_mut_stmt_like(n)
    }

    fn visit_mut_private_name(&mut self, _: &mut PrivateName) {}

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        match n {
            PropName::Computed(_) => n.visit_mut_children_with(self),
            _ => {}
        }
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        if self.is_marked(node.span()) {
            return;
        }
        node.visit_mut_children_with(self);

        if self.marking_phase
            || self.included.contains(&node.ident.to_id())
            || self.is_marked(node.ident.span())
            || self.is_marked(node.class.span())
        {
            self.mark(&mut node.ident);
            self.mark(&mut node.class);
        }
    }

    // ---- ---- ----- ---- -----
    // If Spanned::span is synthesized, we should some work

    // normal!(visit_mut_assign_prop, AssignProp, key, value);
    // normal!(visit_mut_key_value_pat_prop, KeyValuePatProp, key, value);
    // normal!(visit_mut_key_value_prop, KeyValueProp, key, value);
    // fn visit_mut_spread_element(&mut self, n: &mut SpreadElement) {}

    // ---- ---- ----- ---- -----
    // If an ast node delegates Spanned::span to a field, we don't need to handle it
    // because of the way Spanned::span works.

    // normal!(visit_mut_class_expr, ClassExpr, ident, class);
    // normal!(visit_mut_method_prop, MethodProp, key, value);
    // normal!(
    //     visit_mut_export_default_specifier,
    //     ExportDefaultSpecifier,
    //     exported
    // );
    // normal!(visit_mut_fn_expr, FnExpr, ident, function);

    // ---- ---- ----- ---- -----
    // If an ast node has a span and not a declarations, use general logic.

    normal!(visit_mut_array_lit, ArrayLit, [], [elems]);
    normal!(visit_mut_array_pat, ArrayPat, [], [elems]);
    normal!(visit_mut_arrow_expr, ArrowExpr, [body], [params]);
    normal!(visit_mut_assign_expr, AssignExpr, left, right);
    normal!(visit_mut_assign_pat, AssignPat, left, right);
    normal!(visit_mut_assign_pat_prop, AssignPatProp, key, value);
    normal!(visit_mut_await_expr, AwaitExpr, arg);
    normal!(visit_mut_catch_clause, CatchClause, param, body);
    normal!(visit_mut_class, Class, [super_class], [decorators, body]);
    normal!(visit_mut_class_method, ClassMethod, key, function);
    normal!(visit_mut_class_prop, ClassProp, [key, value], [decorators]);
    normal!(visit_mut_computed_prop_name, ComputedPropName, expr);
    normal!(visit_mut_cond_expr, CondExpr, test, cons, alt);
    normal!(visit_mut_constructor, Constructor, [key, body], [params]);
    normal!(visit_mut_decorator, Decorator, expr);
    normal!(visit_mut_export_named_specifier, ExportNamedSpecifier, orig);
    normal!(
        visit_mut_export_namespace_specifier,
        ExportNamespaceSpecifier,
        name
    );
    // normal!(visit_mut_function,Function, [body], [params, decorators]);
    normal!(visit_mut_getter_prop, GetterProp, key, body);
    normal!(
        visit_mut_import_default_specifier,
        ImportDefaultSpecifier,
        local
    );
    normal!(
        visit_mut_import_named_specifier,
        ImportNamedSpecifier,
        local
    );
    normal!(
        visit_mut_import_star_as_specifier,
        ImportStarAsSpecifier,
        local
    );
    normal!(visit_mut_object_lit, ObjectLit, [], [props]);
    normal!(visit_mut_object_pat, ObjectPat, [], [props]);
    normal!(visit_mut_opt_chain_expr, OptChainExpr, expr);
    normal!(visit_mut_param, Param, [pat], [decorators]);
    normal!(visit_mut_paren_expr, ParenExpr, expr);
    normal!(visit_mut_private_method, PrivateMethod, key, function);
    normal!(
        visit_mut_private_prop,
        PrivateProp,
        [key, value],
        [decorators]
    );
    normal!(visit_mut_rest_pat, RestPat, arg);
    normal!(visit_mut_seq_expr, SeqExpr, [], [exprs]);
    normal!(visit_mut_setter_prop, SetterProp, key, param, body);
    normal!(visit_mut_tagged_tpl, TaggedTpl, tag, tpl);
    normal!(visit_mut_tpl, Tpl, [], [exprs]);
    normal!(visit_mut_yield_expr, YieldExpr, arg);
}

impl Dce<'_> {
    fn visit_mut_stmt_like<T>(&mut self, items: &mut Vec<T>)
    where
        T: Debug + StmtLike + VisitMutWith<Self> + Spanned + std::fmt::Debug,
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
            log::debug!("loop start");

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
            // We use take because of try_into_stmt
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
                    log::trace!("Dropping {}: {:?}", idx, item);
                    self.dropped = true;
                    idx += 1;
                    return None;
                }

                idx += 1;
                // Drop unused imports
                if self.is_marked(item.span()) {
                    Some(item)
                } else {
                    self.dropped = true;
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

    pub fn has_marked_elem<T>(&self, n: &[T]) -> bool
    where
        T: Spanned,
    {
        n.iter().any(|n| self.is_marked(n.span()))
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

    //    pub fn with_child<T, F>(&mut  self, op: F) -> T
    //    where
    //        F: for<'any> FnOnce(&mut  Dce<'any>) -> T,
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
        log::debug!("Marking: {}", type_name::<T>());
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
