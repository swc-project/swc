use swc_atoms::js_word;
use swc_common::{collections::AHashMap, util::take::Take};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};

use crate::{
    analyzer::{analyze, ProgramData, UsageAnalyzer},
    marks::Marks,
    option::CompressOptions,
    util::ModuleItemExt,
};

/// Optimizer invoked before invoking compressor.
///
/// - Remove parens.
pub(crate) fn precompress_optimizer(options: &CompressOptions, marks: Marks) -> impl '_ + VisitMut {
    PrecompressOptimizer {
        options,
        marks,
        data: Default::default(),
        fn_decl_count: Default::default(),
        ctx: Default::default(),
    }
}

#[derive(Debug)]
struct PrecompressOptimizer<'a> {
    options: &'a CompressOptions,
    marks: Marks,

    data: Option<ProgramData>,
    fn_decl_count: AHashMap<Id, usize>,
    ctx: Ctx,
}

#[derive(Debug, Default, Clone, Copy)]
struct Ctx {
    in_var_pat: bool,
}

impl PrecompressOptimizer<'_> {
    fn handle_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: for<'aa> VisitMutWith<PrecompressOptimizer<'aa>> + ModuleItemExt,
        Vec<T>: for<'aa> VisitMutWith<PrecompressOptimizer<'aa>> + VisitWith<UsageAnalyzer>,
    {
        if self.data.is_some() {
            stmts.visit_mut_children_with(self);
            return;
        }

        if self.data.is_none() {
            let has_decl = stmts
                .iter()
                .any(|stmt| matches!(stmt.as_module_decl(), Ok(..) | Err(Stmt::Decl(..))));

            if has_decl {
                let data = Some(analyze(&*stmts, Some(self.marks)));

                stmts.visit_mut_children_with(&mut PrecompressOptimizer {
                    options: self.options,
                    marks: self.marks,
                    data,
                    fn_decl_count: Default::default(),
                    ctx: self.ctx,
                });
                return;
            }

            for stmt in stmts {
                stmt.visit_mut_with(&mut PrecompressOptimizer {
                    options: self.options,
                    marks: self.marks,
                    data: None,
                    fn_decl_count: Default::default(),
                    ctx: self.ctx,
                })
            }
        }
    }
}

impl VisitMut for PrecompressOptimizer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_decl(&mut self, n: &mut Decl) {
        n.visit_mut_children_with(self);

        if let Decl::Fn(FnDecl { ident, .. }) = n {
            if ident.sym == js_word!("") {
                n.take();
            }
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Paren(p) = e {
            *e = *p.expr.take();
        }
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        n.visit_mut_children_with(self);

        if self.options.dead_code || self.options.unused {
            if let Some(usage) = self.data.as_ref().unwrap().vars.get(&n.ident.to_id()) {
                // Remove if variable with same name exists.
                if usage.var_kind.is_some()
                    && usage.var_initialized
                    && usage.is_fn_local
                    && !usage.cond_init
                {
                    n.ident.take();
                    return;
                }

                if usage.assign_count > 1 {
                    let v = self.fn_decl_count.entry(n.ident.to_id()).or_default();
                    *v += 1;

                    if *v == usage.assign_count {
                        n.ident.take();
                    }
                }
            }
        }
    }

    fn visit_mut_module_item(&mut self, n: &mut ModuleItem) {
        n.visit_mut_children_with(self);

        match n {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Var(var),
                ..
            })) if var.decls.is_empty() => {
                n.take();
            }
            _ => {}
        }
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.handle_stmts(n);

        n.retain(|s| !matches!(s, ModuleItem::Stmt(Stmt::Empty(..))));
    }

    fn visit_mut_stmt(&mut self, n: &mut Stmt) {
        n.visit_mut_children_with(self);

        match n {
            Stmt::Decl(Decl::Var(var)) if var.decls.is_empty() => {
                n.take();
            }
            _ => {}
        }
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.handle_stmts(n);

        n.retain(|s| !matches!(s, Stmt::Empty(..)));
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        let old = self.ctx;
        self.ctx.in_var_pat = true;
        n.name.visit_mut_with(self);

        self.ctx.in_var_pat = false;
        n.init.visit_mut_with(self);

        self.ctx = old;
    }
}
