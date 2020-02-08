use crate::pass::RepeatedJsPass;
use fxhash::FxHashSet;
use std::borrow::Cow;
use swc_atoms::JsWord;
use swc_common::{
    chain,
    pass::{CompilerPass, Repeated},
    util::move_map::MoveMap,
    Fold, FoldWith, Mark, Span, Spanned, Visit, VisitWith,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, ExprExt, Id, StmtLike};

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
        },
        UsedMarkRemover { used_mark }
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

impl Fold<Span> for UsedMarkRemover {
    fn fold(&mut self, s: Span) -> Span {
        let mut ctxt = s.ctxt().clone();
        if ctxt.remove_mark() == self.used_mark {
            return s.with_ctxt(ctxt);
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
    }
}

impl<T> Fold<Vec<T>> for Dce<'_>
where
    T: StmtLike + FoldWith<Self> + Spanned,
{
    fn fold(&mut self, mut items: Vec<T>) -> Vec<T> {
        loop {
            self.changed = false;
            items = items.fold_children(self);
            if !self.changed {
                break;
            }
        }

        items = items.move_flat_map(|item| {
            let item = match item.try_into_stmt() {
                Ok(stmt) => match stmt {
                    Stmt::Empty(..) => {
                        self.dropped = true;
                        return None;
                    }
                    _ => T::from_stmt(stmt),
                },
                Err(item) => item,
            };

            if !self.is_marked(item.span()) {
                self.dropped = true;

                return None;
            }
            Some(item)
        });

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

    pub fn is_exported(&self, i: &JsWord) -> bool {
        self.config.used.is_none()
            || self
                .config
                .used
                .as_ref()
                .unwrap()
                .iter()
                .any(|exported| exported.0 == *i)
    }

    pub fn fold_in_marking_phase<T>(&mut self, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        let old = self.marking_phase;
        self.marking_phase = true;
        let node = node.fold_with(self);
        self.marking_phase = old;

        node
    }
}

impl Fold<BlockStmt> for Dce<'_> {
    fn fold(&mut self, node: BlockStmt) -> BlockStmt {
        if self.is_marked(node.span) {
            return node;
        }

        let stmts = node.stmts.fold_with(self);

        let mut span = node.span;
        if stmts.iter().any(|stmt| self.is_marked(stmt.span())) {
            span = span.apply_mark(self.config.used_mark);
        }

        BlockStmt { span, stmts }
    }
}

impl Fold<IfStmt> for Dce<'_> {
    fn fold(&mut self, node: IfStmt) -> IfStmt {
        if self.is_marked(node.span) {
            return node;
        }

        let mut node: IfStmt = node.fold_children(self);

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
}

impl Fold<ImportDecl> for Dce<'_> {
    fn fold(&mut self, import: ImportDecl) -> ImportDecl {
        if self.is_marked(import.span) {
            return import;
        }

        let mut import: ImportDecl = import.fold_children(self);

        // Side effect import
        if import.specifiers.is_empty() {
            import.span = import.span.apply_mark(self.config.used_mark);
            return import;
        }

        // First run.
        if self.included.is_empty() {
            return import;
        }

        // TODO: Drop unused imports.
        //      e.g) import { foo, bar } from './foo';
        //           foo()

        let ids: Vec<Ident> = find_ids(&import.specifiers);

        for id in ids {
            for c in &self.included {
                if c.0 == id.sym && c.1 == id.span.ctxt() {
                    import.span = import.span.apply_mark(self.config.used_mark);
                    return import;
                }
            }
        }

        import
    }
}

impl Fold<ExportDecl> for Dce<'_> {
    fn fold(&mut self, mut node: ExportDecl) -> ExportDecl {
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
            Decl::Var(ref mut v) => {
                if let Some(ref exported_ids) = self.config.used {
                    v.decls.retain(|d| {
                        let mut visitor = IdentListVisitor {
                            included_ids: &self.included,
                            exported_ids: &exported_ids,
                            found: false,
                        };

                        d.visit_with(&mut visitor);

                        if !visitor.found {
                            //println!(
                            //    "Dropping variable declarator\n{:?}\n{:?}",
                            //    self.used_exports, d.name
                            //);
                        }

                        visitor.found
                    });
                }

                if !v.decls.is_empty() {
                    node.span = node.span.apply_mark(self.config.used_mark);
                    node.decl = self.fold_in_marking_phase(node.decl);
                }
                return node;
            }
        };

        if self.is_exported(&i.sym) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.decl = self.fold_in_marking_phase(node.decl);
        }

        node
    }
}

impl Fold<ExportDefaultExpr> for Dce<'_> {
    fn fold(&mut self, mut node: ExportDefaultExpr) -> ExportDefaultExpr {
        if self.is_marked(node.span) {
            return node;
        }

        if self.is_exported(&js_word!("default")) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.expr = self.fold_in_marking_phase(node.expr);
        }

        node
    }
}

impl Fold<NamedExport> for Dce<'_> {
    fn fold(&mut self, mut node: NamedExport) -> NamedExport {
        if self.is_marked(node.span) {
            return node;
        }

        // Export only when it's required.
        node.specifiers.retain(|s| match s {
            ExportSpecifier::Namespace(s) => self.is_exported(&s.name.sym),
            ExportSpecifier::Default(..) => self.is_exported(&js_word!("default")),
            ExportSpecifier::Named(s) => {
                self.is_exported(&s.exported.as_ref().unwrap_or_else(|| &s.orig).sym)
            }
        });

        if !node.specifiers.is_empty() {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.specifiers = self.fold_in_marking_phase(node.specifiers);
        }

        node
    }
}

impl Fold<ExportDefaultDecl> for Dce<'_> {
    fn fold(&mut self, mut node: ExportDefaultDecl) -> ExportDefaultDecl {
        if self.is_marked(node.span) {
            return node;
        }

        // TODO: Export only when it's required. (i.e. check self.used_exports)

        node.span = node.span.apply_mark(self.config.used_mark);
        node.decl = self.fold_in_marking_phase(node.decl);

        node
    }
}

impl Fold<ExportAll> for Dce<'_> {
    fn fold(&mut self, node: ExportAll) -> ExportAll {
        if self.is_marked(node.span) {
            return node;
        }

        unimplemented!("drop_unused: `export * from 'foo'`")
    }
}

impl Fold<ExprStmt> for Dce<'_> {
    fn fold(&mut self, node: ExprStmt) -> ExprStmt {
        if self.is_marked(node.span) {
            return node;
        }

        if node.expr.may_have_side_effects() {
            let stmt = ExprStmt {
                span: node.span.apply_mark(self.config.used_mark),
                expr: self.fold_in_marking_phase(node.expr),
            };
            return stmt;
        }

        node.fold_children(self)
    }
}

impl Fold<Ident> for Dce<'_> {
    fn fold(&mut self, i: Ident) -> Ident {
        if self.is_marked(i.span) {
            return i;
        }

        if self.marking_phase {
            self.included.insert(i.to_id());
            self.changed = true;
        }

        i
    }
}

impl Fold<VarDecl> for Dce<'_> {
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        if self.is_marked(var.span) {
            return var;
        }

        let var: VarDecl = var.fold_children(self);

        if self.included.is_empty() {
            return var;
        }

        let ids: Vec<Ident> = find_ids(&var.decls);

        for i in ids {
            for i1 in &self.included {
                if i1.0 == i.sym && i1.1 == i.span.ctxt() {
                    return VarDecl {
                        span: var.span.apply_mark(self.config.used_mark),
                        ..var
                    };
                }
            }
        }

        var
    }
}

impl Fold<MemberExpr> for Dce<'_> {
    fn fold(&mut self, mut e: MemberExpr) -> MemberExpr {
        if self.is_marked(e.span()) {
            return e;
        }

        e.obj = e.obj.fold_with(self);
        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }
}

impl Fold<FnDecl> for Dce<'_> {
    fn fold(&mut self, mut f: FnDecl) -> FnDecl {
        if self.is_marked(f.span()) {
            return f;
        }

        if self.marking_phase || self.included.contains(&f.ident.to_id()) {
            f.function.span = f.function.span.apply_mark(self.config.used_mark);
        }

        f.fold_children(self)
    }
}

macro_rules! simple {
    ($T:ty) => {
        impl Fold<$T> for Dce<'_> {
            fn fold(&mut self, node: $T) -> $T {
                if self.is_marked(node.span()) {
                    return node;
                }

                node.fold_children(self)
            }
        }
    };
}

simple!(Decl);
simple!(Stmt);
simple!(ModuleItem);
simple!(ModuleDecl);

#[derive(Debug)]
struct IdentListVisitor<'a> {
    included_ids: &'a FxHashSet<Id>,
    exported_ids: &'a [Id],
    found: bool,
}

impl Visit<Ident> for IdentListVisitor<'_> {
    fn visit(&mut self, node: &Ident) {
        if self.found {
            return;
        }

        if self.included_ids.contains(&node.to_id())
            || self
                .exported_ids
                .iter()
                .any(|exported| exported.0 == node.sym)
        {
            self.found = true;
            return;
        }
    }
}
