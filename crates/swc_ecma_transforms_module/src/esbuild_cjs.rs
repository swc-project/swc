use std::mem::swap;

use swc_common::{collections::AHashMap, util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, private_ident, quote_ident};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn cjs() -> impl Fold + VisitMut {
    as_folder(ModuleDeclStrip::default())
}

#[derive(Default)]
pub struct ModuleDeclStrip {
    stmt: Option<Stmt>,
    /// Map<src, ImportSpecifier[]>
    pub import: AHashMap<Str, Vec<ImportSpecifier>>,
    /// Map<exported, orig>
    pub export: AHashMap<ModuleExportName, ModuleExportName>,

    export_src: Option<Str>,
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

    // collect all static import
    fn visit_mut_import_decl(&mut self, n: &mut ImportDecl) {
        let ImportDecl {
            specifiers, src, ..
        } = n.take();

        self.import.entry(src).or_default().extend(specifiers);
    }

    /// ```javascript
    /// export const foo = 1, bar = 2, { baz } = { baz: 3 };
    /// export let a = 1, [b] = [2];
    /// export function x() {}
    /// export class y {}
    /// ```
    /// ->
    /// ```javascript
    /// const foo = 1, bar = 2, { baz } = { baz: 3 };
    /// let a = 1, [b] = [2];
    /// function x() {}
    /// class y {}
    /// ```
    fn visit_mut_export_decl(&mut self, n: &mut ExportDecl) {
        self.export
            .extend(find_pat_ids::<_, Ident>(&n.decl).into_iter().map(|id| {
                (
                    ModuleExportName::Ident(id.clone()),
                    ModuleExportName::Ident(id),
                )
            }));

        self.set_stmt(n.decl.take());
    }

    fn visit_mut_named_export(&mut self, n: &mut NamedExport) {
        swap(&mut self.export_src, &mut n.src);
        n.visit_mut_children_with(self);
        swap(&mut self.export_src, &mut n.src);
    }

    /// ```javascript
    /// export { orig };
    /// export { orig as exported };
    /// ```
    ///
    /// split re-export
    /// ```javascript
    /// export { orig } from "src"
    /// export { "1" as "2" } from "y";
    /// ```
    /// ->
    /// ```javascript
    /// import { foo as _x } from "x";
    /// import { "1" as _y } from "y";
    /// export { _x as bar, _y as "2" };
    /// ```
    ///
    /// `export { "1" as "2" }` without src is invalid.
    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        if let Some(src) = &self.export_src {
            let bridge = private_ident!("_bridge");

            self.import.entry(src.clone()).or_default().push(
                ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local: bridge.clone(),
                    imported: None,
                    is_type_only: false,
                }
                .into(),
            );

            self.export.insert(
                n.exported.clone().unwrap_or_else(|| n.orig.clone()),
                bridge.into(),
            );
        } else {
            self.export.insert(
                n.exported.clone().unwrap_or_else(|| n.orig.clone()),
                n.orig.clone(),
            );
        }
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

        self.export
            .insert(quote_ident!("default").into(), ident.clone().into());

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

        self.export
            .insert(quote_ident!("default").into(), ident.clone().into());

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

        self.export
            .insert(quote_ident!("default").into(), ident.clone().into());

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
