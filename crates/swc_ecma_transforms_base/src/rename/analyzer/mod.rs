use swc_common::Mark;
use swc_ecma_ast::*;
use swc_ecma_utils::stack_size::maybe_grow_default;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use self::scope::{Scope, ScopeKind};

mod reverse_map;
pub(super) mod scope;

#[derive(Debug, Default)]
pub(super) struct Analyzer {
    /// If `eval` exists for the current scope, we only rename synthesized
    /// identifiers.
    pub has_eval: bool,
    /// The [Mark] which is parent of user-specified identifiers.
    pub top_level_mark: Mark,

    pub is_pat_decl: bool,
    pub var_belong_to_fn_scope: bool,
    pub in_catch_params: bool,
    pub scope: Scope,
    /// If we try add variables declared by `var` to the block scope,
    /// variables will be added to `hoisted_vars` and merged to latest
    /// function scope in the end.
    pub hoisted_vars: Vec<Id>,
}

impl Analyzer {
    fn add_decl(&mut self, id: Id, belong_to_fn_scope: bool) {
        if belong_to_fn_scope {
            match self.scope.kind {
                ScopeKind::Fn => {
                    self.scope.add_decl(&id, self.has_eval, self.top_level_mark);
                }
                ScopeKind::Block => self.hoisted_vars.push(id),
            }
        } else {
            self.scope.add_decl(&id, self.has_eval, self.top_level_mark);
        }
    }

    fn reserve_decl(&mut self, len: usize, belong_to_fn_scope: bool) {
        if belong_to_fn_scope {
            match self.scope.kind {
                ScopeKind::Fn => {
                    self.scope.reserve_decl(len);
                }
                ScopeKind::Block => {
                    self.hoisted_vars.reserve(len);
                }
            }
        } else {
            self.scope.reserve_decl(len);
        }
    }

    fn add_usage(&mut self, id: Id) {
        self.scope.add_usage(id);
    }

    fn reserve_usage(&mut self, len: usize) {
        self.scope.reserve_usage(len);
    }

    fn with_scope<F>(&mut self, kind: ScopeKind, op: F)
    where
        F: FnOnce(&mut Analyzer),
    {
        {
            let mut v = Analyzer {
                has_eval: self.has_eval,
                top_level_mark: self.top_level_mark,

                is_pat_decl: self.is_pat_decl,
                var_belong_to_fn_scope: false,
                in_catch_params: false,
                scope: Scope {
                    kind,
                    ..Default::default()
                },
                hoisted_vars: Default::default(),
            };

            op(&mut v);
            if !v.hoisted_vars.is_empty() {
                debug_assert!(matches!(v.scope.kind, ScopeKind::Block));
                self.reserve_usage(v.hoisted_vars.len());
                v.hoisted_vars.clone().into_iter().for_each(|id| {
                    // For variables declared in block scope using `var` and `function`,
                    // We should create a fake usage in the block to prevent conflicted
                    // renaming.
                    v.add_usage(id);
                });
                match self.scope.kind {
                    ScopeKind::Fn => {
                        self.reserve_decl(v.hoisted_vars.len(), true);
                        v.hoisted_vars
                            .into_iter()
                            .for_each(|id| self.add_decl(id, true));
                    }
                    ScopeKind::Block => {
                        self.hoisted_vars.extend(v.hoisted_vars);
                    }
                }
            }
            self.scope.children.push(v.scope);
        }
    }

    fn with_fn_scope<F>(&mut self, op: F)
    where
        F: FnOnce(&mut Analyzer),
    {
        self.with_scope(ScopeKind::Fn, op)
    }

    fn visit_fn_body_within_same_scope(&mut self, body: &Option<BlockStmt>) {
        if let Some(body) = &body {
            body.visit_children_with(self);
        }
    }

    fn visit_for_body_within_same_scope(&mut self, body: &Stmt) {
        match body {
            Stmt::Block(s) => s.visit_children_with(self),
            _ => body.visit_with(self),
        }
    }
}

impl Visit for Analyzer {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, e: &ArrowExpr) {
        self.with_fn_scope(|v| {
            let old = v.is_pat_decl;
            v.is_pat_decl = true;
            e.params.visit_with(v);
            v.is_pat_decl = false;
            e.body.visit_with(v);
            v.is_pat_decl = old;
        });
    }

    fn visit_assign_target(&mut self, n: &AssignTarget) {
        let old = self.is_pat_decl;

        self.is_pat_decl = false;
        n.visit_children_with(self);

        self.is_pat_decl = old;
    }

    fn visit_binding_ident(&mut self, i: &BindingIdent) {
        if self.is_pat_decl {
            self.add_decl(i.to_id(), self.var_belong_to_fn_scope)
        } else {
            self.add_usage(i.to_id())
        }
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        self.with_scope(ScopeKind::Block, |v| n.visit_children_with(v))
    }

    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr) {
        match n {
            // This avoid crating extra block scope for arrow function
            BlockStmtOrExpr::BlockStmt(n) => n.visit_children_with(self),
            BlockStmtOrExpr::Expr(n) => n.visit_with(self),
        }
    }

    fn visit_catch_clause(&mut self, n: &CatchClause) {
        self.with_scope(ScopeKind::Block, |v| {
            let old = v.is_pat_decl;
            let old_in_catch_params = v.in_catch_params;

            v.is_pat_decl = false;
            n.body.visit_children_with(v);

            v.is_pat_decl = true;
            v.in_catch_params = true;
            n.param.visit_with(v);

            v.is_pat_decl = old;
            v.in_catch_params = old_in_catch_params;
        })
    }

    fn visit_class_decl(&mut self, c: &ClassDecl) {
        self.add_decl(c.ident.to_id(), false);

        c.class.visit_with(self);
    }

    fn visit_class_expr(&mut self, c: &ClassExpr) {
        self.with_fn_scope(|v| {
            if let Some(id) = &c.ident {
                v.add_decl(id.to_id(), false);
            }

            c.class.visit_with(v);
        })
    }

    fn visit_class_method(&mut self, f: &ClassMethod) {
        f.key.visit_with(self);

        self.with_fn_scope(|v| {
            f.function.decorators.visit_with(v);
            f.function.params.visit_with(v);
            v.visit_fn_body_within_same_scope(&f.function.body);
        })
    }

    fn visit_constructor(&mut self, f: &Constructor) {
        self.with_fn_scope(|v| {
            f.key.visit_with(v);
            f.params.visit_with(v);
            v.visit_fn_body_within_same_scope(&f.body);
        })
    }

    fn visit_default_decl(&mut self, d: &DefaultDecl) {
        match d {
            DefaultDecl::Class(c) => {
                if let Some(id) = &c.ident {
                    self.add_decl(id.to_id(), false);
                }

                self.with_fn_scope(|v| {
                    c.class.visit_with(v);
                })
            }
            DefaultDecl::Fn(f) => {
                if let Some(id) = &f.ident {
                    self.add_decl(id.to_id(), true);
                }

                f.visit_with(self);
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
        }
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        match &n.orig {
            ModuleExportName::Ident(orig) => {
                self.add_usage(orig.to_id());
            }
            ModuleExportName::Str(..) => {}
        };
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_is_pat_decl = self.is_pat_decl;

        self.is_pat_decl = false;
        maybe_grow_default(|| e.visit_children_with(self));

        if let Expr::Ident(i) = e {
            self.add_usage(i.to_id());
        }

        self.is_pat_decl = old_is_pat_decl;
    }

    fn visit_fn_decl(&mut self, f: &FnDecl) {
        self.add_decl(f.ident.to_id(), true);

        // https://github.com/swc-project/swc/issues/6819
        //
        // We need to check for assign pattern because safari has a bug.
        // https://github.com/swc-project/swc/issues/9015
        let has_rest = f
            .function
            .params
            .iter()
            .any(|p| p.pat.is_rest() || p.pat.is_assign());
        if has_rest {
            self.add_usage(f.ident.to_id());
        }

        self.with_fn_scope(|v| {
            if has_rest {
                v.add_usage(f.ident.to_id());
            }

            f.function.decorators.visit_with(v);
            f.function.params.visit_with(v);
            // WARN: Option<BlockStmt>::visit_mut_children_wth
            // is not same with BlockStmt::visit_mut_children_wth
            v.visit_fn_body_within_same_scope(&f.function.body);
        })
    }

    fn visit_fn_expr(&mut self, f: &FnExpr) {
        if let Some(id) = &f.ident {
            self.with_fn_scope(|v| {
                v.add_decl(id.to_id(), true);
                v.with_fn_scope(|v| {
                    // https://github.com/swc-project/swc/issues/6819
                    //
                    // We need to check for assign pattern because safari has a bug.
                    // https://github.com/swc-project/swc/issues/9015
                    if f.function
                        .params
                        .iter()
                        .any(|p| p.pat.is_rest() || p.pat.is_assign())
                    {
                        v.add_usage(id.to_id());
                    }

                    f.function.decorators.visit_with(v);
                    f.function.params.visit_with(v);
                    v.visit_fn_body_within_same_scope(&f.function.body);
                });
            })
        } else {
            f.function.visit_with(self)
        }
    }

    fn visit_for_in_stmt(&mut self, n: &ForInStmt) {
        self.with_scope(ScopeKind::Block, |v| {
            n.left.visit_with(v);
            n.right.visit_with(v);

            v.with_scope(ScopeKind::Block, |v| {
                v.visit_for_body_within_same_scope(&n.body);
            })
        });
    }

    fn visit_for_of_stmt(&mut self, n: &ForOfStmt) {
        self.with_scope(ScopeKind::Block, |v| {
            n.left.visit_with(v);
            n.right.visit_with(v);

            v.with_scope(ScopeKind::Block, |v| {
                v.visit_for_body_within_same_scope(&n.body);
            })
        });
    }

    fn visit_for_stmt(&mut self, n: &ForStmt) {
        self.with_scope(ScopeKind::Block, |v| {
            n.init.visit_with(v);
            n.test.visit_with(v);
            n.update.visit_with(v);

            v.with_scope(ScopeKind::Block, |v| {
                v.visit_for_body_within_same_scope(&n.body);
            })
        });
    }

    // ensure param and function body always in same scope
    fn visit_function(&mut self, f: &Function) {
        self.with_fn_scope(|v| {
            f.decorators.visit_with(v);
            f.params.visit_with(v);
            v.visit_fn_body_within_same_scope(&f.body);
        })
    }

    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier) {
        self.add_decl(n.local.to_id(), true);
    }

    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier) {
        self.add_decl(n.local.to_id(), true);
    }

    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier) {
        self.add_decl(n.local.to_id(), true);
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);

        if let MemberProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }

    fn visit_method_prop(&mut self, f: &MethodProp) {
        f.key.visit_with(self);

        f.function.visit_with(self)
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        if n.src.is_some() {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_param(&mut self, e: &Param) {
        let old = self.is_pat_decl;
        let old_need_hoisted = self.var_belong_to_fn_scope;

        // Params belong to function scope.
        // Params in catch clause belong to block scope
        self.var_belong_to_fn_scope = !self.in_catch_params;
        self.is_pat_decl = false;
        e.decorators.visit_with(self);

        self.is_pat_decl = true;
        e.pat.visit_with(self);

        self.is_pat_decl = old;
        self.var_belong_to_fn_scope = old_need_hoisted
    }

    fn visit_prop(&mut self, p: &Prop) {
        p.visit_children_with(self);

        if let Prop::Shorthand(i) = p {
            self.add_usage(i.to_id())
        }
    }

    fn visit_static_block(&mut self, n: &StaticBlock) {
        self.with_fn_scope(|v| n.body.visit_children_with(v))
    }

    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }

    fn visit_var_decl(&mut self, n: &VarDecl) {
        let old_need_hoisted = self.var_belong_to_fn_scope;
        self.var_belong_to_fn_scope = n.kind == VarDeclKind::Var;
        n.visit_children_with(self);
        self.var_belong_to_fn_scope = old_need_hoisted;
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        v.name.visit_with(self);

        self.is_pat_decl = false;
        v.init.visit_with(self);

        self.is_pat_decl = old;
    }
}
