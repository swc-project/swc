use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};

pub fn ts_remover() -> impl VisitMut {
    TsRemover {}
}

struct TsRemover {}

impl VisitMut for TsRemover {
    fn visit_mut_array_pat(&mut self, p: &mut ArrayPat) {
        p.visit_mut_children_with(self);

        p.optional = false;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::TsAs(expr) => {
                *e = *expr.expr.take();
            }

            Expr::TsConstAssertion(expr) => {
                *e = *expr.expr.take();
            }

            Expr::TsTypeAssertion(expr) => {
                *e = *expr.expr.take();
            }

            Expr::TsNonNull(expr) => {
                *e = *expr.expr.take();
            }

            Expr::TsInstantiation(expr) => {
                *e = *expr.expr.take();
            }

            _ => {}
        }
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        i.visit_mut_children_with(self);

        i.optional = false;
    }

    fn visit_mut_module_item(&mut self, s: &mut ModuleItem) {
        s.visit_mut_children_with(self);

        match s {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsInterface(_) | Decl::TsTypeAlias(_),
                ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                type_only: true, ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                type_only: true,
                ..
            })) => {
                s.take();
            }
            _ => {}
        }
    }

    fn visit_mut_object_pat(&mut self, p: &mut ObjectPat) {
        p.visit_mut_children_with(self);

        p.optional = false;
    }

    fn visit_mut_opt_ts_type(&mut self, ty: &mut Option<Box<TsType>>) {
        *ty = None;
    }

    fn visit_mut_opt_ts_type_ann(&mut self, ty: &mut Option<TsTypeAnn>) {
        *ty = None;
    }

    fn visit_mut_opt_ts_type_param_decl(&mut self, t: &mut Option<TsTypeParamDecl>) {
        *t = None;
    }

    fn visit_mut_opt_ts_type_param_instantiation(
        &mut self,
        t: &mut Option<TsTypeParamInstantiation>,
    ) {
        *t = None;
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        if let Stmt::Decl(Decl::TsTypeAlias(..) | Decl::TsInterface(..)) = s {
            s.take();
        }
    }
}
