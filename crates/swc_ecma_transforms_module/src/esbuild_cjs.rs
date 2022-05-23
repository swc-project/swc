use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn cjs() -> impl Fold + VisitMut {
    as_folder(ModuleDeclStrip { stmt: None })
}

pub struct ModuleDeclStrip {
    stmt: Option<Stmt>,
}

impl ModuleDeclStrip {
    fn set_stmt(&mut self, stmt: impl Into<Stmt>) {
        debug_assert_eq!(self.stmt, None);

        self.stmt = Some(stmt.into());
    }
}

impl VisitMut for ModuleDeclStrip {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut list = Vec::with_capacity(n.len());

        for mut item in n.drain(..) {
            if item.is_module_decl() {
                item.visit_mut_with(self);
            }

            if item.is_stmt() {
                list.push(item)
            }
        }

        *n = list;
    }

    fn visit_mut_module_item(&mut self, n: &mut ModuleItem) {
        n.visit_mut_children_with(self);

        if let Some(stmt) = self.stmt.take() {
            *n = stmt.into();
        }
    }

    /// ```javascript
    /// export const foo = 1;
    /// export function bar () {}
    /// ```
    /// ->
    /// ```javascript
    /// var foo = 1;
    /// function bar () {}
    /// ```
    fn visit_mut_export_decl(&mut self, n: &mut ExportDecl) {
        if n.decl.is_var() {
            n.decl.visit_mut_children_with(self);
        }

        self.set_stmt(n.decl.take());
    }

    /// ```javascript
    /// export const foo = 1;
    /// export let bar = 2;
    /// ```
    /// ->
    /// ```javascript
    /// var foo = 1;
    /// var bar = 2;
    /// ```
    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        n.kind = VarDeclKind::Var;
    }

    /// ```javascript
    /// export default class foo {};
    /// export default class {};
    /// ```
    /// ->
    /// ```javascript
    /// class foo {};
    /// class _default {};
    /// ```
    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        let ClassExpr { ident, class } = n.take();
        let ident = ident.unwrap_or_else(|| private_ident!("_default"));

        self.set_stmt(Stmt::Decl(
            ClassDecl {
                ident,
                class,
                declare: false,
            }
            .into(),
        ));
    }

    /// ```javascript
    /// export default function foo () {};
    /// export default function () {};
    /// ```
    /// ->
    /// ```javascript
    /// function foo () {};
    /// function _default () {};
    /// ```
    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        let FnExpr { ident, function } = n.take();
        let ident = ident.unwrap_or_else(|| private_ident!("_default"));

        self.set_stmt(Stmt::Decl(
            FnDecl {
                ident,
                function,
                declare: false,
            }
            .into(),
        ));
    }

    /// ```javascript
    /// export default foo;
    /// export default 1
    /// ```
    /// ->
    /// ```javascript
    /// var _default = foo;
    /// var _default = 1;
    /// ```
    fn visit_mut_export_default_expr(&mut self, n: &mut ExportDefaultExpr) {
        let ident = private_ident!("_default");

        let var_declarator = VarDeclarator {
            span: DUMMY_SP,
            name: ident.into(),
            init: Some(n.expr.take()),
            definite: false,
        };

        let var_decl = VarDecl {
            decls: vec![var_declarator],
            kind: VarDeclKind::Var,
            span: DUMMY_SP,
            declare: false,
        };

        self.set_stmt(Stmt::Decl(var_decl.into()));
    }
}
