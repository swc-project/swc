use std::borrow::Cow;

use swc_common::{
    collections::{AHashMap, AHashSet},
    pass::{CompilerPass, Repeated},
    util::take::Take,
    Mark, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    collect_decls, ident::IdentLike, ExprCtx, ExprExt, Id, IsEmpty, ModuleItemLike, StmtLike, Value,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};
use tracing::{debug, span, trace, Level};

/// Note: This becomes parallel if `concurrent` feature is enabled.
pub fn dce(
    config: Config,
    unresolved_mark: Mark,
) -> impl Fold + VisitMut + Repeated + CompilerPass {
    as_folder(TreeShaker {
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
        },
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
    ///
    /// **Note**: This is hack to make operation parallel while allowing invalid
    /// module produced by the `swc_bundler`.
    pub module_mark: Option<Mark>,
}

struct TreeShaker {
    expr_ctx: ExprCtx,

    config: Config,
    changed: bool,
    pass: u16,
    data: Data,
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

    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        n.visit_children_with(self);

        self.add(n.key.to_id(), true);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        n.visit_children_with(self);

        if !n.class.decorators.is_empty() {
            self.add(n.ident.to_id(), false);
        }
    }

    fn visit_class_expr(&mut self, n: &ClassExpr) {
        n.visit_children_with(self);

        if !n.class.decorators.is_empty() {
            if let Some(i) = &n.ident {
                self.add(i.to_id(), false);
            }
        }
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        if let ModuleExportName::Ident(orig) = &n.orig {
            self.add(orig.to_id(), false);
        }
    }

    fn visit_expr(&mut self, e: &Expr) {
        e.visit_children_with(self);

        if let Expr::Ident(i) = e {
            self.add(i.to_id(), false);
        }
    }

    fn visit_jsx_element_name(&mut self, e: &JSXElementName) {
        e.visit_children_with(self);

        if let JSXElementName::Ident(i) = e {
            self.add(i.to_id(), false);
        }
    }

    fn visit_jsx_object(&mut self, e: &JSXObject) {
        e.visit_children_with(self);

        if let JSXObject::Ident(i) = e {
            self.add(i.to_id(), false);
        }
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        let old = self.cur_fn_id.take();
        self.cur_fn_id = Some(n.ident.to_id());
        n.visit_children_with(self);
        self.cur_fn_id = old;

        if !n.function.decorators.is_empty() {
            self.add(n.ident.to_id(), false);
        }
    }

    fn visit_fn_expr(&mut self, n: &FnExpr) {
        n.visit_children_with(self);

        if !n.function.decorators.is_empty() {
            if let Some(i) = &n.ident {
                self.add(i.to_id(), false);
            }
        }
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if !self.in_var_decl {
            if let Pat::Ident(i) = p {
                self.add(i.id.to_id(), true);
            }
        }
    }

    fn visit_prop(&mut self, p: &Prop) {
        p.visit_children_with(self);

        if let Prop::Shorthand(i) = p {
            self.add(i.to_id(), false);
        }
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator) {
        let old = self.in_var_decl;

        self.in_var_decl = true;
        v.name.visit_with(self);

        self.in_var_decl = false;
        v.init.visit_with(self);

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
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self> + Send + Sync,
        Vec<T>: VisitMutWith<Self>,
    {
        stmts.visit_mut_children_with(self);

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

        if !n.right.may_have_side_effects(&self.expr_ctx) {
            if let Some(id) = n.left.as_ident() {
                if self.can_drop_assignment_to(id.to_id()) {
                    self.changed = true;
                    debug!("Dropping an assignment to `{}` because it's not used", id);

                    n.left.take();
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
                }
            }
            Decl::Class(c) => {
                if self.can_drop_binding(c.ident.to_id()) {
                    debug!("Dropping class `{}` as it's not used", c.ident);
                    self.changed = true;

                    n.take();
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

        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            args,
            ..
        }) = n
        {
            //
            if args.is_empty() {
                if let Expr::Fn(FnExpr {
                    ident: None,
                    function:
                        Function {
                            is_async: false,
                            is_generator: false,
                            params,
                            body: Some(BlockStmt { stmts: body, .. }),
                            ..
                        },
                }) = &mut **callee
                {
                    if params.is_empty() && body.len() == 1 {
                        if let Stmt::Return(ReturnStmt { arg: Some(arg), .. }) = &mut body[0] {
                            if let Expr::Object(ObjectLit { props, .. }) = &**arg {
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
                        }
                    }
                }
            }
        }

        if let Expr::Assign(a) = n {
            if match &a.left {
                PatOrExpr::Expr(l) => l.is_invalid(),
                PatOrExpr::Pat(l) => l.is_invalid(),
            } {
                *n = *a.right.take();
            }
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
            m.visit_with(&mut analyzer);
        }
        self.data = data;
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

        if let Stmt::Decl(Decl::Var(v)) = s {
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
                } else if exprs.len() == 1 {
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

        if let Stmt::If(if_stmt) = s {
            if let Value::Known(v) = if_stmt.test.as_pure_bool(&self.expr_ctx) {
                if v {
                    if if_stmt.alt.is_some() {
                        self.changed = true;
                    }

                    if_stmt.alt = None;
                    debug!("Dropping `alt` of an if statement because condition is always true");
                } else {
                    self.changed = true;
                    if let Some(alt) = if_stmt.alt.take() {
                        *s = *alt;
                        debug!(
                            "Dropping `cons` of an if statement because condition is always false"
                        );
                    } else {
                        debug!("Dropping an if statement because condition is always false");
                        *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    }
                    return;
                }
            }

            if if_stmt.alt.is_empty()
                && if_stmt.cons.is_empty()
                && !if_stmt.test.may_have_side_effects(&self.expr_ctx)
            {
                debug!("Dropping an if statement");
                self.changed = true;
                *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }
        }

        match s {
            Stmt::Expr(es) => {
                if match &*es.expr {
                    Expr::Lit(Lit::Str(..)) => false,
                    _ => !es.expr.may_have_side_effects(&self.expr_ctx),
                } {
                    debug!("Dropping an expression without side effect");
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    self.changed = true;
                }
            }

            Stmt::Decl(Decl::Var(v)) => {
                if v.decls.is_empty() {
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
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
            !init.may_have_side_effects(&self.expr_ctx)
        } else {
            true
        };

        if can_drop {
            if let Pat::Ident(i) = &v.name {
                if self.can_drop_binding(i.id.to_id()) {
                    self.changed = true;
                    debug!("Dropping {} because it's not used", i.id);
                    v.name.take();
                }
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
