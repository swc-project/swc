use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::{pass::Repeated, util::take::Take, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, ExprExt, Id, IsEmpty, ModuleItemLike, StmtLike};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
    VisitWith,
};
use tracing::{debug, span, trace, Level};

pub fn tree_shaker(config: Config) -> impl Fold + VisitMut + Repeated {
    as_folder(TreeShaker {
        config,
        changed: false,
        pass: 0,
        data: Default::default(),
    })
}

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Config {
    /// If this [Mark] is applied to a function expression, it's treated as a
    /// separate module.
    pub module_mark: Option<Mark>,
}

struct TreeShaker {
    config: Config,
    changed: bool,
    pass: u16,
    data: Data,
}

#[derive(Default)]
struct Data {
    used_names: FxHashMap<Id, VarInfo>,
}
#[derive(Debug, Default)]
struct VarInfo {
    pub usage: usize,
    pub assign: usize,
}

struct Analyzer<'a> {
    config: &'a Config,
    data: &'a mut Data,
}

impl Visit for Analyzer<'_> {
    noop_visit_type!();

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _: &dyn Node) {
        self.data
            .used_names
            .entry(n.orig.to_id())
            .or_default()
            .usage += 1;
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.data.used_names.entry(i.to_id()).or_default().usage += 1;
            }
            _ => {}
        }
    }

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Pat::Ident(i) => {
                self.data.used_names.entry(i.id.to_id()).or_default().assign += 1;
            }
            _ => {}
        }
    }

    fn visit_prop(&mut self, p: &Prop, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Prop::Shorthand(i) => {
                self.data.used_names.entry(i.to_id()).or_default().usage += 1;
            }
            _ => {}
        }
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator, _: &dyn Node) {
        v.init.visit_with(v, self);
    }
}

impl Repeated for TreeShaker {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.pass += 1;
        self.changed = false;
        self.data = Default::default();
    }
}

impl TreeShaker {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike,
        Vec<T>: VisitMutWith<Self>,
    {
        stmts.visit_mut_children_with(self);

        stmts.retain(|s| match s.as_stmt() {
            Some(Stmt::Empty(..)) => false,
            _ => true,
        });
    }

    fn can_drop_binding(&self, name: Id) -> bool {
        !self.data.used_names.contains_key(&name)
    }
}

impl VisitMut for TreeShaker {
    noop_visit_mut_type!();

    fn visit_mut_decl(&mut self, n: &mut Decl) {
        n.visit_mut_children_with(self);

        match n {
            Decl::Fn(f) => {
                if self.can_drop_binding(f.ident.to_id()) {
                    debug!("Dropping function `{}` as it's not used", f.ident);
                    self.changed = true;

                    n.take();
                    return;
                }
            }
            Decl::Class(c) => {
                if self.can_drop_binding(c.ident.to_id()) {
                    debug!("Dropping class `{}` as it's not used", c.ident);
                    self.changed = true;

                    n.take();
                    return;
                }
            }
            _ => {}
        }
    }

    /// Noop.
    fn visit_mut_export_decl(&mut self, _: &mut ExportDecl) {}

    /// Noop.
    fn visit_mut_export_default_decl(&mut self, _: &mut ExportDefaultDecl) {}

    fn visit_mut_import_specifiers(&mut self, ss: &mut Vec<ImportSpecifier>) {
        ss.retain(|s| {
            let local = match s {
                ImportSpecifier::Named(l) => &l.local,
                ImportSpecifier::Default(l) => &l.local,
                ImportSpecifier::Namespace(l) => &l.local,
            };

            if self.can_drop_binding(local.to_id()) {
                debug!(
                    "Dropping import specifier `{}` because it's not used",
                    local
                );
                self.changed = true;
                return false;
            }

            true
        });
    }

    fn visit_mut_module(&mut self, m: &mut Module) {
        let _tracing = span!(Level::ERROR, "tree-shaker", pass = self.pass).entered();

        {
            let mut analyzer = Analyzer {
                config: &self.config,
                data: &mut self.data,
            };
            m.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
        }
        trace!("Used = {:?}", self.data.used_names);

        m.visit_mut_children_with(self);
    }

    fn visit_mut_module_item(&mut self, n: &mut ModuleItem) {
        match n {
            ModuleItem::ModuleDecl(ModuleDecl::Import(i)) => {
                let is_for_side_effect = i.specifiers.is_empty();

                i.visit_mut_with(self);

                if !is_for_side_effect && i.specifiers.is_empty() {
                    debug!("Dropping an import because it's not used");
                    self.changed = true;
                    *n = ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }));
                    return;
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s);
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        match s {
            Stmt::If(if_stmt) => {
                if if_stmt.alt.is_empty() && if_stmt.cons.is_empty() {
                    if !if_stmt.test.may_have_side_effects() {
                        debug!("Dropping an if statement");
                        self.changed = true;
                        *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        return;
                    }
                }
            }
            _ => {}
        }

        match s {
            Stmt::Block(bs) => {
                if bs.is_empty() {
                    debug!("Dropping an empty block statement");
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    return;
                }
            }

            Stmt::Decl(Decl::Var(v)) => {
                if v.decls.is_empty() {
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    return;
                }
            }

            _ => {}
        }
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s);
    }

    fn visit_mut_var_declarator(&mut self, v: &mut VarDeclarator) {
        v.visit_mut_children_with(self);

        let can_drop = if let Some(init) = &v.init {
            !init.may_have_side_effects()
        } else {
            true
        };

        if can_drop {
            match &v.name {
                Pat::Ident(i) => {
                    if self.can_drop_binding(i.id.to_id()) {
                        self.changed = true;
                        debug!("Dropping {} because it's not used", i.id);
                        v.name.take();
                    }
                }

                _ => {}
            }
        }
    }
    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        n.visit_mut_children_with(self);

        n.retain(|v| {
            if v.name.is_invalid() {
                return false;
            }

            true
        });
    }
}
