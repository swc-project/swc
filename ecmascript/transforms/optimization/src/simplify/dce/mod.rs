use crate::util::Readonly;
#[cfg(feature = "concurrent")]
use rayon::prelude::*;
use std::borrow::Cow;
#[cfg(feature = "concurrent")]
use std::sync::Arc;
use swc_common::{
    collections::{AHashMap, AHashSet},
    pass::{CompilerPass, Repeated},
    util::take::Take,
    Mark, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    collect_decls, ident::IdentLike, ExprExt, Id, IsEmpty, ModuleItemLike, StmtLike, Value,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
    VisitWith,
};
use tracing::{debug, span, trace, Level};

/// Note: This becomes parallel if `concurrent` feature is enabled.
pub fn dce(config: Config) -> impl Fold + VisitMut + Repeated + CompilerPass {
    as_folder(TreeShaker {
        config,
        changed: false,
        pass: 0,
        data: Default::default(),
        par_depth: 0,
    })
}

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Config {
    /// If this [Mark] is applied to a function expression, it's treated as a
    /// separate module.
    ///
    /// **Note**: This is hack to make operation parallel while allowing invalid
    /// module produced by the `swc_bundler`.
    pub module_mark: Option<Mark>,
}

struct TreeShaker {
    config: Config,
    changed: bool,
    pass: u16,
    data: Readonly<Data>,

    #[cfg_attr(not(feature = "concurrent"), allow(dead_code))]
    /// Used to avoid cost of being overly parallel.
    par_depth: u16,
}

impl CompilerPass for TreeShaker {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("tree-shaker")
    }
}

#[derive(Default)]
struct Data {
    /// Bindings in the module.
    bindings: AHashSet<Id>,

    used_names: AHashMap<Id, VarInfo>,
}
#[derive(Debug, Default)]
struct VarInfo {
    /// This does not include self-references in a function.
    pub usage: usize,
    /// This does not include self-references in a function.
    pub assign: usize,
}

struct Analyzer<'a> {
    #[allow(dead_code)]
    config: &'a Config,
    in_var_decl: bool,
    data: &'a mut Data,
    cur_fn_id: Option<Id>,
}

impl Analyzer<'_> {
    fn add(&mut self, id: Id, assign: bool) {
        if let Some(f) = &self.cur_fn_id {
            if id == *f {
                return;
            }
        }

        if assign {
            self.data.used_names.entry(id).or_default().assign += 1;
        } else {
            self.data.used_names.entry(id).or_default().usage += 1;
        }
    }
}

impl Visit for Analyzer<'_> {
    noop_visit_type!();

    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp, _: &dyn Node) {
        n.visit_children_with(self);

        self.add(n.key.to_id(), true);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl, _: &dyn Node) {
        n.visit_children_with(self);

        if !n.class.decorators.is_empty() {
            self.add(n.ident.to_id(), false);
        }
    }

    fn visit_class_expr(&mut self, n: &ClassExpr, _: &dyn Node) {
        n.visit_children_with(self);

        if !n.class.decorators.is_empty() {
            if let Some(i) = &n.ident {
                self.add(i.to_id(), false);
            }
        }
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _: &dyn Node) {
        self.add(n.orig.to_id(), false);
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.add(i.to_id(), false);
            }
            _ => {}
        }
    }

    fn visit_fn_decl(&mut self, n: &FnDecl, _: &dyn Node) {
        let old = self.cur_fn_id.take();
        self.cur_fn_id = Some(n.ident.to_id());
        n.visit_children_with(self);
        self.cur_fn_id = old;

        if !n.function.decorators.is_empty() {
            self.add(n.ident.to_id(), false);
        }
    }

    fn visit_fn_expr(&mut self, n: &FnExpr, _: &dyn Node) {
        n.visit_children_with(self);

        if !n.function.decorators.is_empty() {
            if let Some(i) = &n.ident {
                self.add(i.to_id(), false);
            }
        }
    }

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        p.visit_children_with(self);

        if !self.in_var_decl {
            match p {
                Pat::Ident(i) => {
                    self.add(i.id.to_id(), true);
                }
                _ => {}
            }
        }
    }

    fn visit_prop(&mut self, p: &Prop, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Prop::Shorthand(i) => {
                self.add(i.to_id(), false);
            }
            _ => {}
        }
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator, _: &dyn Node) {
        let old = self.in_var_decl;

        self.in_var_decl = true;
        v.name.visit_with(v, self);

        self.in_var_decl = false;
        v.init.visit_with(v, self);

        self.in_var_decl = old;
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
    fn visit_maybe_par_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self> + Send + Sync,
        Vec<T>: VisitMutWith<Self>,
    {
        #[cfg(feature = "concurrent")]
        if self.par_depth < 2 {
            let changed = stmts
                .par_iter_mut()
                .map(|s| {
                    let mut v = TreeShaker {
                        config: self.config,
                        changed: false,
                        pass: self.pass,
                        data: Arc::clone(&self.data),
                        par_depth: self.par_depth + 1,
                    };
                    s.visit_mut_with(&mut v);

                    v.changed
                })
                .reduce(|| false, |a, b| a || b);
            self.changed |= changed;
            return;
        }

        stmts.visit_mut_children_with(self);
    }

    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self> + Send + Sync,
        Vec<T>: VisitMutWith<Self>,
    {
        self.visit_maybe_par_stmt_likes(stmts);

        stmts.retain(|s| match s.as_stmt() {
            Some(Stmt::Empty(..)) => false,
            Some(Stmt::Block(s)) if s.is_empty() => {
                debug!("Dropping an empty block statement");
                false
            }
            _ => true,
        });
    }

    fn can_drop_binding(&self, name: Id) -> bool {
        !self.data.used_names.contains_key(&name)
    }

    fn can_drop_assignment_to(&self, name: Id) -> bool {
        self.data.bindings.contains(&name)
            && self
                .data
                .used_names
                .get(&name)
                .map(|v| v.usage == 0)
                .unwrap_or_default()
    }
}

impl VisitMut for TreeShaker {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        n.visit_mut_children_with(self);

        if !n.right.may_have_side_effects() {
            if let Some(id) = n.left.as_ident() {
                if self.can_drop_assignment_to(id.to_id()) {
                    self.changed = true;
                    debug!("Dropping an assignment to `{}` because it's not used", id);

                    n.left.take();
                    return;
                }
            }
        }
    }

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

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        match n {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                args,
                ..
            }) => {
                //
                if args.is_empty() {
                    match &mut **callee {
                        Expr::Fn(FnExpr {
                            ident: None,
                            function:
                                Function {
                                    is_async: false,
                                    is_generator: false,
                                    params,
                                    body: Some(BlockStmt { stmts: body, .. }),
                                    ..
                                },
                        }) => {
                            if params.is_empty() && body.len() == 1 {
                                match &mut body[0] {
                                    Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => match &**arg
                                    {
                                        Expr::Object(ObjectLit { props, .. }) => {
                                            if props.iter().all(|p| match p {
                                                PropOrSpread::Spread(_) => false,
                                                PropOrSpread::Prop(p) => match &**p {
                                                    Prop::Shorthand(_) => true,
                                                    Prop::KeyValue(p) => p.value.is_ident(),
                                                    _ => false,
                                                },
                                            }) {
                                                self.changed = true;
                                                debug!("Dropping a wrapped esm");
                                                *n = *arg.take();
                                                return;
                                            }
                                        }

                                        _ => {}
                                    },
                                    _ => {}
                                }
                            }
                        }
                        _ => {}
                    }
                }
            }

            _ => {}
        }

        match n {
            Expr::Assign(a) => {
                if match &a.left {
                    PatOrExpr::Expr(l) => l.is_invalid(),
                    PatOrExpr::Pat(l) => l.is_invalid(),
                } {
                    *n = *a.right.take();
                    return;
                }
            }
            _ => {}
        }
    }

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

        let mut data = Data {
            bindings: collect_decls(&*m),
            ..Default::default()
        };

        {
            let mut analyzer = Analyzer {
                config: &self.config,
                data: &mut data,
                in_var_decl: false,
                cur_fn_id: Default::default(),
            };
            m.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
        }
        self.data = data.into();
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
            Stmt::Decl(Decl::Var(v)) => {
                let span = v.span;
                let cnt = v.decls.len();

                // If all name is droppable, do so.
                if cnt != 0
                    && v.decls.iter().all(|vd| match &vd.name {
                        Pat::Ident(i) => self.can_drop_binding(i.to_id()),
                        _ => false,
                    })
                {
                    let exprs = v
                        .decls
                        .take()
                        .into_iter()
                        .filter_map(|v| v.init)
                        .collect::<Vec<_>>();

                    debug!(
                        count = cnt,
                        "Dropping names of variables as they are not used",
                    );
                    self.changed = true;

                    if exprs.is_empty() {
                        *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        return;
                    } else {
                        if exprs.len() == 1 {
                            *s = Stmt::Expr(ExprStmt {
                                span,
                                expr: exprs.into_iter().next().unwrap(),
                            });
                        } else {
                            *s = Stmt::Expr(ExprStmt {
                                span,
                                expr: Box::new(Expr::Seq(SeqExpr {
                                    span: DUMMY_SP,
                                    exprs,
                                })),
                            });
                        }
                    }
                }
            }

            _ => {}
        }

        match s {
            Stmt::If(if_stmt) => {
                if let Value::Known(v) = if_stmt.test.as_pure_bool() {
                    if v {
                        if if_stmt.alt.is_some() {
                            self.changed = true;
                        }

                        if_stmt.alt = None;
                        debug!(
                            "Dropping `alt` of an if statement because condition is always true"
                        );
                    } else {
                        self.changed = true;
                        if let Some(alt) = if_stmt.alt.take() {
                            *s = *alt;
                            debug!(
                                "Dropping `cons` of an if statement because condition is always \
                                 false"
                            );
                        } else {
                            debug!("Dropping an if statement because condition is always false");
                            *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        }
                        return;
                    }
                }

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
            Stmt::Expr(es) => {
                if match &*es.expr {
                    Expr::Lit(Lit::Str(..)) => false,
                    _ => !es.expr.may_have_side_effects(),
                } {
                    debug!("Dropping an expression without side effect");
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    self.changed = true;
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

    fn visit_mut_var_decl_or_expr(&mut self, n: &mut VarDeclOrExpr) {
        match n {
            VarDeclOrExpr::VarDecl(..) => {}
            VarDeclOrExpr::Expr(v) => {
                v.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_var_decl_or_pat(&mut self, n: &mut VarDeclOrPat) {
        match n {
            VarDeclOrPat::VarDecl(..) => {}
            VarDeclOrPat::Pat(v) => {
                v.visit_mut_with(self);
            }
        }
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
