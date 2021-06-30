use crate::{
    analyzer::{analyze, ProgramData},
    option::CompressOptions,
};
use fxhash::FxHashMap;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Optimizer invoked before invoking compressor.
///
/// - Remove parens.
pub fn single_pass_optimizer(options: CompressOptions) -> impl VisitMut {
    SinglePassOptimizer {
        options,
        data: Default::default(),
        fn_decl_count: Default::default(),
        ctx: Default::default(),
    }
}

#[derive(Debug, Default)]
struct SinglePassOptimizer {
    options: CompressOptions,
    data: ProgramData,
    fn_decl_count: FxHashMap<Id, usize>,
    ctx: Ctx,
}

#[derive(Debug, Default, Clone, Copy)]
struct Ctx {
    in_var_pat: bool,
}

impl VisitMut for SinglePassOptimizer {
    noop_visit_mut_type!();

    fn visit_mut_decl(&mut self, n: &mut Decl) {
        n.visit_mut_children_with(self);

        match n {
            Decl::Fn(FnDecl { ident, .. }) => {
                if ident.sym == js_word!("") {
                    n.take();
                }
            }
            _ => {}
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Paren(p) => {
                *e = *p.expr.take();
            }
            _ => {}
        }
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        n.visit_mut_children_with(self);

        if self.options.dead_code || self.options.unused {
            if let Some(usage) = self.data.vars.get(&n.ident.to_id()) {
                // Remove if variable with same name exists.
                if usage.var_kind.is_some() && usage.var_initialized {
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

    fn visit_mut_module(&mut self, n: &mut Module) {
        let data = analyze(&*n);
        self.data = data;

        n.visit_mut_children_with(self);
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
        n.visit_mut_children_with(self);

        n.retain(|s| match s {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            _ => true,
        });
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        let data = analyze(&*n);
        self.data = data;

        n.visit_mut_children_with(self);
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
        n.visit_mut_children_with(self);

        n.retain(|s| match s {
            Stmt::Empty(..) => false,
            _ => true,
        });
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
