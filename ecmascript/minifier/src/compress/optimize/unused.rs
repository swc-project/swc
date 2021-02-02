use super::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

/// Methods related to the option `unused`.
impl Optimizer {
    ///
    pub(super) fn drop_unused_vars(&mut self, name: &mut Pat) {
        if !self.options.unused
            || self.ctx.in_var_decl_of_for_in_or_of_loop
            || self.ctx.is_exported_decl
        {
            return;
        }

        if (!self.options.top_level && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            return;
        }

        match name {
            Pat::Ident(i) => {
                if self.options.top_retain.contains(&i.sym) {
                    return;
                }

                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                    .map(|v| v.ref_count == 0)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    log::trace!(
                        "unused: Dropping a variable '{}{:?}' because it is not used",
                        i.sym,
                        i.span.ctxt
                    );
                    // This will remove variable.
                    name.take();
                    return;
                }
            }
            _ => {}
        }
    }

    /// Creates an empty [VarDecl] if `decl` should be removed.
    pub(super) fn drop_unused_decl(&mut self, decl: &mut Decl) {
        if self.ctx.is_exported_decl {
            return;
        }

        if !self.options.top_level && (self.ctx.top_level || !self.ctx.in_fn_like) {
            return;
        }

        if !self.options.unused {
            return;
        }

        match decl {
            Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&ident.to_id()))
                    .map(|v| v.ref_count == 0)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    log::trace!(
                        "unused: Dropping a decl '{}{:?}' because it is not used",
                        ident.sym,
                        ident.span.ctxt
                    );
                    // This will remove the declaration.
                    decl.take();
                    return;
                }
            }

            Decl::Var(_) => {
                // Variable declarations are handled by other functions.
                return;
            }

            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                // Nothing to do. We might change this to unreachable!()
                return;
            }
        }
    }

    pub(super) fn drop_unused_assignments(&mut self, e: &mut Expr) {
        if !self.options.unused {
            return;
        }

        if self
            .data
            .as_ref()
            .map(|v| v.top.has_eval_call || v.top.has_with_stmt)
            .unwrap_or(false)
        {
            return;
        }

        if (!self.options.top_level && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            return;
        }

        let assign = match e {
            Expr::Assign(e) => e,
            _ => return,
        };

        match &mut assign.left {
            PatOrExpr::Expr(_) => return,
            PatOrExpr::Pat(left) => match &**left {
                Pat::Ident(i) => {
                    if self.options.top_retain.contains(&i.sym) {
                        return;
                    }

                    if let Some(var) = self
                        .data
                        .as_ref()
                        .and_then(|data| data.vars.get(&i.to_id()))
                    {
                        if var.usage_count == 0 {
                            log::trace!(
                                "unused: Dropping assignment to var '{}{:?}', which is never used",
                                i.sym,
                                i.span.ctxt
                            );
                            self.changed = true;
                            *e = *assign.right.take();
                            return;
                        }
                    }
                }
                _ => return,
            },
        }
    }
}

#[derive(Debug, Default)]
pub(super) struct UnreachableHandler {
    vars: Vec<Ident>,
    in_var_name: bool,
    in_hoisted_var: bool,
}

impl UnreachableHandler {
    /// Asssumes `s` is not reachable, and preserves variable declarations and
    /// function declarations in `s`.
    ///
    /// Returns true if statement is chnged.
    pub fn preserve_vars(s: &mut Stmt) -> bool {
        if s.is_empty() {
            return false;
        }
        match s {
            Stmt::Decl(Decl::Var(v)) => {
                let mut changed = false;
                for decl in &mut v.decls {
                    if decl.init.is_some() {
                        decl.init = None;
                        changed = true;
                    }
                }

                return changed;
            }
            _ => {}
        }

        let mut v = Self::default();
        s.visit_mut_with(&mut v);
        if v.vars.is_empty() {
            *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
        } else {
            *s = Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: v
                    .vars
                    .into_iter()
                    .map(Pat::Ident)
                    .map(|name| VarDeclarator {
                        span: DUMMY_SP,
                        name,
                        init: None,
                        definite: false,
                    })
                    .collect(),
            }))
        }

        true
    }
}

impl VisitMut for UnreachableHandler {
    noop_visit_mut_type!();

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        n.visit_mut_children_with(self);

        if self.in_var_name && self.in_hoisted_var {
            match n {
                Pat::Ident(i) => {
                    self.vars.push(i.clone());
                }
                _ => {}
            }
        }
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        self.in_hoisted_var = n.kind == VarDeclKind::Var;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        self.in_var_name = true;
        n.name.visit_mut_with(self);
        self.in_var_name = false;
        n.init.visit_mut_with(self);
    }

    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_function(&mut self, _: &mut Function) {}
}
