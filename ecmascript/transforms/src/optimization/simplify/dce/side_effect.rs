use super::Dce;
use fxhash::FxHashSet;
use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, ExprExt, Id};
use swc_ecma_visit::Visit;

pub(super) struct ImportDetector {
    found: bool,
}

noop_visit_type!(ImportDetector);

impl Visit<ImportDecl> for ImportDetector {
    fn visit(&mut self, _: &ImportDecl) {
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

            node.visit_with(&mut v);

            if v.found {
                return true;
            }
        }

        let mut v = SideEffectVisitor {
            included: &mut self.included,
            exports: self.config.used.as_ref().map(|v| &**v),
            found: false,
        };

        node.visit_with(&mut v);

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

noop_visit_type!(SideEffectVisitor<'_>);

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

impl Visit<Expr> for SideEffectVisitor<'_> {
    fn visit(&mut self, node: &Expr) {
        log::debug!("Visit<Expr>");

        if self.found || node.is_pure_callee() {
            return;
        }

        match node {
            Expr::Lit(..) | Expr::PrivateName(..) | Expr::TsConstAssertion(..) => return,

            _ => {}
        }

        node.visit_children_with(self)
    }
}

impl Visit<AssignExpr> for SideEffectVisitor<'_> {
    fn visit(&mut self, node: &AssignExpr) {
        if self.found {
            return;
        }

        node.left.visit_with(self);

        match &*node.right {
            Expr::Ident(..) => {
                //TODO: Check for alias
            }
            right => right.visit_with(self),
        }
    }
}

impl Visit<MemberExpr> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &MemberExpr) {
        self.found = true;

        //        if self.found {
        //            return;
        //        }

        //        node.obj.visit_with(self);
        //        if node.computed {
        //            node.prop.visit_with(self);
        //        }
    }
}

impl Visit<Ident> for SideEffectVisitor<'_> {
    fn visit(&mut self, node: &Ident) {
        if self.found {
            return;
        }

        self.found |= self.include(&node.to_id());
    }
}

impl Visit<CallExpr> for SideEffectVisitor<'_> {
    fn visit(&mut self, node: &CallExpr) {
        if self.found {
            return;
        }

        match node.callee {
            ExprOrSuper::Expr(ref e) if e.is_pure_callee() => return,
            _ => {}
        }

        self.found = true;
    }
}

impl Visit<NewExpr> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &NewExpr) {
        if self.found {
            return;
        }

        self.found = true;
    }
}

impl Visit<ExprOrSpread> for SideEffectVisitor<'_> {
    fn visit(&mut self, node: &ExprOrSpread) {
        if self.found {
            return;
        }

        if node.spread.is_some() {
            self.found = true;
        }

        if !self.found {
            node.expr.visit_with(self);
        }
    }
}

impl Visit<ReturnStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ReturnStmt) {
        self.found = true;
    }
}

impl Visit<ThrowStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ThrowStmt) {
        self.found = true;
    }
}

impl Visit<BreakStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &BreakStmt) {
        self.found = true;
    }
}

impl Visit<ContinueStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ContinueStmt) {
        self.found = true;
    }
}

impl Visit<ForStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ForStmt) {
        self.found = true;
    }
}

impl Visit<ForInStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ForInStmt) {
        self.found = true;
    }
}

impl Visit<ForOfStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ForOfStmt) {
        self.found = true;
    }
}

impl Visit<WhileStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &WhileStmt) {
        self.found = true;
    }
}

impl Visit<DoWhileStmt> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &DoWhileStmt) {
        self.found = true;
    }
}

impl Visit<ExportDefaultSpecifier> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ExportDefaultSpecifier) {
        self.found = true;
    }
}

impl Visit<ImportDecl> for SideEffectVisitor<'_> {
    fn visit(&mut self, import: &ImportDecl) {
        if self.found {
            return;
        }

        if import.specifiers.is_empty() {
            self.found = true;
            return;
        }

        import.visit_children_with(self)
    }
}

impl Visit<ExportDecl> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ExportDecl) {
        self.found = true
    }
}

impl Visit<ExportDefaultExpr> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ExportDefaultExpr) {
        self.found = true;
    }
}

impl Visit<NamedExport> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &NamedExport) {
        self.found = true
    }
}

impl Visit<ExportDefaultDecl> for SideEffectVisitor<'_> {
    fn visit(&mut self, _: &ExportDefaultDecl) {
        self.found = true;
    }
}

impl Visit<Pat> for SideEffectVisitor<'_> {
    fn visit(&mut self, p: &Pat) {
        if self.found {
            return;
        }

        match p {
            Pat::Ident(ref i) => {
                if self.included.contains(&i.to_id()) || self.is_exported(&i.sym) {
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
}
