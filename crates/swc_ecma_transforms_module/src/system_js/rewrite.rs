use indexmap::IndexMap;
use swc_common::{util::take::Take, Spanned, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::{
    ir::{ExportName, SystemModule},
    lower::export_names_call,
    pattern::replace_exported_pat,
    util::{context_member, context_meta},
};
use crate::path::Resolver;

pub(super) fn rewrite_special_refs(
    module: &mut SystemModule,
    context_ident: Ident,
    unresolved_ctxt: SyntaxContext,
    resolver: &Resolver,
    ignore_dynamic: bool,
    preserve_import_meta: bool,
) {
    let mut rewriter = SpecialRefRewriter {
        context_ident,
        unresolved_ctxt,
        resolver,
        ignore_dynamic,
        preserve_import_meta,
    };
    for wrapper_fn in &mut module.wrapper_fns {
        wrapper_fn.visit_mut_with(&mut rewriter);
    }
    for export_init in &mut module.export_inits {
        export_init.value.visit_mut_with(&mut rewriter);
    }
    for stmt in &mut module.execute_stmts {
        stmt.visit_mut_with(&mut rewriter);
    }
}

pub(super) fn rewrite_export_bindings(
    module: &mut SystemModule,
    rewriter: &mut ExportBindingRewriter,
) {
    for wrapper_fn in &mut module.wrapper_fns {
        wrapper_fn.visit_mut_with(rewriter);
    }
    for export_init in &mut module.export_inits {
        export_init.value.visit_mut_with(rewriter);
    }
    for stmt in &mut module.execute_stmts {
        stmt.visit_mut_with(rewriter);
    }
}

struct SpecialRefRewriter<'a> {
    context_ident: Ident,
    unresolved_ctxt: SyntaxContext,
    resolver: &'a Resolver,
    ignore_dynamic: bool,
    preserve_import_meta: bool,
}

impl VisitMut for SpecialRefRewriter<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(ident) if self.is_unresolved_module_name(ident) => {
                *n = self.module_name_expr(ident);
            }
            Expr::MetaProp(MetaPropExpr {
                kind: MetaPropKind::ImportMeta,
                ..
            }) if !self.preserve_import_meta => {
                *n = context_meta(&self.context_ident).into();
            }
            Expr::Call(CallExpr {
                callee:
                    Callee::Import(Import {
                        phase: ImportPhase::Evaluation,
                        ..
                    }),
                args,
                ..
            }) if !self.ignore_dynamic => {
                args.visit_mut_with(self);
                if let Some(ExprOrSpread { spread: None, expr }) = args.get_mut(0) {
                    if let Expr::Lit(Lit::Str(Str { value, raw, .. })) = &mut **expr {
                        let original = value.to_atom_lossy().into_owned();
                        let resolved = self.resolver.resolve(original.clone());
                        if resolved != original {
                            *value = resolved.into();
                            *raw = None;
                        }
                    }
                }

                let args = std::mem::take(args);
                *n = context_member(&self.context_ident, quote_ident!("import"))
                    .as_call(n.span(), args);
            }
            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Shorthand(ident) if self.is_unresolved_module_name(ident) => {
                let key = PropName::Ident(IdentName::new(ident.sym.clone(), ident.span));
                let value = self.module_name_expr(ident);
                *n = KeyValueProp {
                    key,
                    value: value.into(),
                }
                .into();
            }
            _ => n.visit_mut_children_with(self),
        }
    }
}

impl SpecialRefRewriter<'_> {
    fn is_unresolved_module_name(&self, ident: &Ident) -> bool {
        ident.sym == *"__moduleName" && ident.ctxt == self.unresolved_ctxt
    }

    fn module_name_expr(&self, ident: &Ident) -> Expr {
        CondExpr {
            span: ident.span,
            test: context_meta(&self.context_ident).into(),
            cons: context_meta(&self.context_ident)
                .make_member(quote_ident!("url"))
                .into(),
            alt: context_member(&self.context_ident, quote_ident!("id")).into(),
        }
        .into()
    }
}

pub(super) struct ExportBindingRewriter {
    exports: IndexMap<Id, Vec<ExportName>>,
    export_ident: Ident,
    export_setters: Ident,
    old_temp: Ident,
    needs_old_temp: bool,
    needs_export_setters: bool,
}

impl ExportBindingRewriter {
    pub fn new(
        exports: IndexMap<Id, Vec<ExportName>>,
        export_ident: Ident,
        export_setters: Ident,
    ) -> Self {
        Self {
            exports,
            export_ident,
            export_setters,
            old_temp: private_ident!("_old"),
            needs_old_temp: false,
            needs_export_setters: false,
        }
    }

    pub fn needs_old_temp(&self) -> bool {
        self.needs_old_temp
    }

    pub fn old_temp(&self) -> Ident {
        self.old_temp.clone()
    }

    pub fn needs_export_setters(&self) -> bool {
        self.needs_export_setters
    }
}

impl VisitMut for ExportBindingRewriter {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) if callee
                .as_ident()
                .is_some_and(|ident| ident.to_id() == self.export_ident.to_id()) => {}
            Expr::Assign(assign) => {
                assign.right.visit_mut_with(self);

                match &mut assign.left {
                    AssignTarget::Simple(SimpleAssignTarget::Ident(binding)) => {
                        if let Some(exports) = self.exports.get(&binding.id.to_id()) {
                            let ident = binding.id.clone();
                            let assign_expr: Expr = AssignExpr {
                                span: assign.span,
                                op: assign.op,
                                left: ident.clone().into(),
                                right: assign.right.take(),
                            }
                            .into();
                            let export =
                                export_names_call(&self.export_ident, exports, ident.clone());
                            *n = SeqExpr {
                                span: assign.span,
                                exprs: vec![assign_expr.into(), export.into(), ident.into()],
                            }
                            .into();
                        }
                    }
                    AssignTarget::Pat(pat) => {
                        let mut new_pat: Pat = pat.take().into();
                        if replace_exported_pat(&mut new_pat, &self.exports, &self.export_setters) {
                            self.needs_export_setters = true;
                            if let Ok(new_left) = AssignTarget::try_from(new_pat) {
                                assign.left = new_left;
                                assign.left.visit_mut_with(self);
                            }
                        } else {
                            assign.left.visit_mut_with(self);
                        }
                    }
                    _ => assign.left.visit_mut_with(self),
                }
            }
            Expr::Update(update) => {
                let Expr::Ident(ident) = &*update.arg else {
                    update.arg.visit_mut_with(self);
                    return;
                };
                let Some(exports) = self.exports.get(&ident.to_id()) else {
                    return;
                };

                let ident = ident.clone();
                let update_expr: Expr = UpdateExpr {
                    span: update.span,
                    op: update.op,
                    prefix: update.prefix,
                    arg: ident.clone().into(),
                }
                .into();
                let export = export_names_call(&self.export_ident, exports, ident.clone());

                let exprs = if update.prefix {
                    vec![update_expr.into(), export.into(), ident.into()]
                } else {
                    self.needs_old_temp = true;
                    vec![
                        update_expr
                            .make_assign_to(op!("="), self.old_temp.clone().into())
                            .into(),
                        export.into(),
                        self.old_temp.clone().into(),
                    ]
                };

                *n = SeqExpr {
                    span: update.span,
                    exprs,
                }
                .into();
            }
            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        n.right.visit_mut_with(self);
        self.rewrite_for_head(&mut n.left);
        n.body.visit_mut_with(self);
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.right.visit_mut_with(self);
        self.rewrite_for_head(&mut n.left);
        n.body.visit_mut_with(self);
    }
}

impl ExportBindingRewriter {
    fn rewrite_for_head(&mut self, head: &mut ForHead) {
        match head {
            ForHead::Pat(pat) => {
                if replace_exported_pat(pat, &self.exports, &self.export_setters) {
                    self.needs_export_setters = true;
                }
                pat.visit_mut_with(self);
            }
            ForHead::VarDecl(var_decl) => {
                for decl in &mut var_decl.decls {
                    if replace_exported_pat(&mut decl.name, &self.exports, &self.export_setters) {
                        self.needs_export_setters = true;
                    }
                    decl.name.visit_mut_with(self);
                    if let Some(init) = &mut decl.init {
                        init.visit_mut_with(self);
                    }
                }
            }
            ForHead::UsingDecl(_) => {}
            #[cfg(swc_ast_unknown)]
            _ => {}
        }
    }
}
