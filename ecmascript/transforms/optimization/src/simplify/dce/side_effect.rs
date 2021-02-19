use super::Dce;
use fxhash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, ExprExt, Id};
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{Node, Visit, VisitWith};

pub(super) struct ImportDetector {
    found: bool,
}

impl Visit for ImportDetector {
    noop_visit_type!();

    fn visit_import_decl(&mut self, _: &ImportDecl, _: &dyn Node) {
        self.found = true;
    }
}

impl Dce<'_> {
    pub(super) fn should_include<T>(&mut self, node: &T) -> bool
    where
        T: for<'any> VisitWith<SideEffectVisitor<'any>> + VisitWith<ImportDetector>,
    {
        // Preserve imports if we are not in import dropping phase
        if !self.decl_dropping_phase {
            let mut v = ImportDetector { found: false };

            node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);

            if v.found {
                return true;
            }
        }

        let mut v = SideEffectVisitor {
            included: &mut self.included,
            exports: self.config.used.as_ref().map(|v| &**v),
            found: false,
        };

        node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);

        v.found
    }
}

impl SideEffectVisitor<'_> {
    fn is_exported(&self, i: &JsWord) -> bool {
        self.exports.is_some()
            && self
                .exports
                .as_ref()
                .unwrap()
                .iter()
                .any(|exported| exported.0 == *i)
    }
}

pub(super) struct SideEffectVisitor<'a> {
    included: &'a mut FxHashSet<Id>,
    exports: Option<&'a [Id]>,
    found: bool,
}

impl SideEffectVisitor<'_> {
    fn include(&self, i: &Id) -> bool {
        let id = i.to_id();
        if self.included.contains(&id) {
            return true;
        }

        if let Some(exports) = self.exports {
            if exports.contains(&id) {
                return true;
            }
        }

        false
    }
}

impl Visit for SideEffectVisitor<'_> {
    noop_visit_type!();

    fn visit_expr(&mut self, node: &Expr, _: &dyn Node) {
        log::trace!("Visit<Expr>");

        if self.found || node.is_pure_callee() {
            return;
        }

        match node {
            Expr::Lit(..) | Expr::PrivateName(..) | Expr::TsConstAssertion(..) => return,

            _ => {}
        }

        node.visit_children_with(self)
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator, _: &dyn Node) {
        if self.found {
            return;
        }

        if n.init.is_none() {
            self.found = true;
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_assign_expr(&mut self, node: &AssignExpr, _: &dyn Node) {
        if self.found {
            return;
        }

        node.left.visit_with(node as _, self);

        match &*node.right {
            Expr::Ident(..) => {
                //TODO: Check for alias
            }
            right => right.visit_with(node as _, self),
        }
    }

    fn visit_break_stmt(&mut self, _: &BreakStmt, _: &dyn Node) {
        self.found = true;
    }

    fn visit_call_expr(&mut self, node: &CallExpr, _: &dyn Node) {
        if self.found {
            return;
        }

        match node.callee {
            ExprOrSuper::Expr(ref e) if e.is_pure_callee() => return,
            _ => {}
        }

        self.found = true;
    }

    fn visit_continue_stmt(&mut self, _: &ContinueStmt, _: &dyn Node) {
        self.found = true;
    }

    fn visit_do_while_stmt(&mut self, _: &DoWhileStmt, _: &dyn Node) {
        self.found = true;
    }

    fn visit_export_decl(&mut self, _: &ExportDecl, _: &dyn Node) {
        self.found = true
    }

    fn visit_export_all(&mut self, _: &ExportAll, _: &dyn Node) {
        self.found = true;
    }

    fn visit_export_default_decl(&mut self, _: &ExportDefaultDecl, _: &dyn Node) {
        self.found = true;
    }

    fn visit_export_default_expr(&mut self, _: &ExportDefaultExpr, _: &dyn Node) {
        self.found = true;
    }

    fn visit_export_default_specifier(&mut self, _: &ExportDefaultSpecifier, _: &dyn Node) {
        self.found = true;
    }

    fn visit_expr_or_spread(&mut self, node: &ExprOrSpread, _: &dyn Node) {
        if self.found {
            return;
        }

        if node.spread.is_some() {
            self.found = true;
        }

        if !self.found {
            node.expr.visit_with(node as _, self);
        }
    }

    fn visit_for_in_stmt(&mut self, _: &ForInStmt, _: &dyn Node) {
        self.found = true;
    }

    fn visit_for_of_stmt(&mut self, _: &ForOfStmt, _: &dyn Node) {
        self.found = true;
    }

    fn visit_for_stmt(&mut self, _: &ForStmt, _: &dyn Node) {
        self.found = true;
    }

    fn visit_ident(&mut self, node: &Ident, _: &dyn Node) {
        if self.found {
            return;
        }

        self.found |= self.include(&node.to_id());
    }

    fn visit_import_decl(&mut self, import: &ImportDecl, _: &dyn Node) {
        if self.found {
            return;
        }

        if import.specifiers.is_empty() {
            self.found = true;
            return;
        }

        import.visit_children_with(self)
    }

    fn visit_member_expr(&mut self, _: &MemberExpr, _: &dyn Node) {
        self.found = true;

        //        if self.found {
        //            return;
        //        }

        //        node.obj.visit_with(self);
        //        if node.computed {
        //            node.prop.visit_with(self);
        //        }
    }

    fn visit_named_export(&mut self, _: &NamedExport, _: &dyn Node) {
        self.found = true
    }

    fn visit_new_expr(&mut self, _: &NewExpr, _: &dyn Node) {
        if self.found {
            return;
        }

        self.found = true;
    }

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        if self.found {
            return;
        }

        match p {
            Pat::Ident(ref i) => {
                if self.included.contains(&i.to_id()) || self.is_exported(&i.id.sym) {
                    self.found = true;
                }
            }

            Pat::Rest(..) => {
                self.found = true;
            }
            Pat::Assign(..) | Pat::Expr(..) | Pat::Object(..) | Pat::Array(..) => {
                p.visit_children_with(self)
            }
            Pat::Invalid(..) => {}
        }
    }

    fn visit_tagged_tpl(&mut self, _: &TaggedTpl, _: &dyn Node) {
        self.found = true;
    }

    fn visit_return_stmt(&mut self, _: &ReturnStmt, _: &dyn Node) {
        self.found = true;
    }

    fn visit_throw_stmt(&mut self, _: &ThrowStmt, _: &dyn Node) {
        self.found = true;
    }

    fn visit_while_stmt(&mut self, _: &WhileStmt, _: &dyn Node) {
        self.found = true;
    }
}
