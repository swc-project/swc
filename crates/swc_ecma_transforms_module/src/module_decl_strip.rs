use indexmap::IndexMap;
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashSet, util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, private_ident};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub type Link = IndexMap<JsWord, AHashSet<Specifier>>;
pub type Export = IndexMap<(JsWord, Span), Ident>;

#[derive(Debug, Default)]
pub struct ModuleDeclStrip {
    /// all import/export ordered by path
    pub link: Link,

    /// local exported binding
    ///
    /// `export { foo as "1", bar }`
    /// -> Map("1" => foo, bar => bar)
    pub export: Export,

    stmt: Option<Stmt>,
}

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum Specifier {
    /// ```javascript
    /// import { imported as local, local } from "mod";
    /// import { "imported" as local } from "mod";
    /// ```
    ImportNamed {
        imported: Option<(JsWord, Span)>,
        local: Ident,
    },
    /// ```javascript
    /// import foo from "mod";
    /// ```
    ImportDefault(Ident),
    /// ```javascript
    /// import * as foo from "mod";
    /// ```
    ImportStarAs(Ident),
    /// ```javascript
    /// export { orig, orig as exported } from "mod";
    /// export { "orig", "orig" as "exported" } from "mod";
    /// ```
    ExportNamed {
        orig: (JsWord, Span),
        exported: Option<(JsWord, Span)>,
    },
    /// ```javascript
    /// export * as foo from "mod";
    /// export * as "bar" from "mod";
    /// ```
    ExportStarAs(JsWord, Span),
    /// ```javascript
    /// export * from "mod";
    /// ```
    ExportStar,
}

impl From<ImportSpecifier> for Specifier {
    fn from(i: ImportSpecifier) -> Self {
        match i {
            ImportSpecifier::Named(ImportNamedSpecifier {
                local, imported, ..
            }) => {
                let imported = imported.map(|e| match e {
                    ModuleExportName::Ident(Ident { span, sym, .. }) => (sym, span),
                    ModuleExportName::Str(Str { span, value, .. }) => (value, span),
                });

                Self::ImportNamed { local, imported }
            }
            ImportSpecifier::Default(ImportDefaultSpecifier { local, .. }) => {
                Self::ImportDefault(local)
            }
            ImportSpecifier::Namespace(ImportStarAsSpecifier { local, .. }) => {
                Self::ImportStarAs(local)
            }
        }
    }
}

impl From<ExportSpecifier> for Specifier {
    fn from(e: ExportSpecifier) -> Self {
        match e {
            ExportSpecifier::Namespace(ExportNamespaceSpecifier { name, .. }) => match name {
                ModuleExportName::Ident(Ident { span, sym, .. }) => Self::ExportStarAs(sym, span),
                ModuleExportName::Str(Str { span, value, .. }) => Self::ExportStarAs(value, span),
            },
            ExportSpecifier::Default(_) => {
                unreachable!("`export default` does not support re-export")
            }
            ExportSpecifier::Named(ExportNamedSpecifier { orig, exported, .. }) => {
                let orig = match orig {
                    ModuleExportName::Ident(Ident { span, sym, .. }) => (sym, span),
                    ModuleExportName::Str(Str { span, value, .. }) => (value, span),
                };

                let exported = exported.map(|exported| match exported {
                    ModuleExportName::Ident(Ident { span, sym, .. }) => (sym, span),
                    ModuleExportName::Str(Str { span, value, .. }) => (value, span),
                });

                Self::ExportNamed { orig, exported }
            }
        }
    }
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

        self.link
            .entry(src.value)
            .or_default()
            .extend(specifiers.into_iter().map(Into::into));
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
                let ident = id.clone();
                ((id.sym, id.span), ident)
            }));

        self.set_stmt(n.decl.take());
    }

    /// ```javascript
    /// export { foo, foo as bar, foo as "baz" };
    /// export { "foo", foo as bar, "foo" as "baz" } from "mod";
    /// export * as foo from "mod";
    /// export * as "bar" from "mod";
    /// ```
    fn visit_mut_named_export(&mut self, n: &mut NamedExport) {
        let NamedExport {
            specifiers, src, ..
        } = n.take();

        if let Some(src) = src {
            self.link
                .entry(src.value)
                .or_default()
                .extend(specifiers.into_iter().map(Into::into));
        } else {
            self.export.extend(specifiers.into_iter().map(|e| match e {
                ExportSpecifier::Namespace(..) => unreachable!("`export * as` without src"),
                ExportSpecifier::Default(ExportDefaultSpecifier { exported }) => {
                    ((js_word!("default"), DUMMY_SP), exported)
                }
                ExportSpecifier::Named(ExportNamedSpecifier { orig, exported, .. }) => {
                    let orig = match orig {
                        ModuleExportName::Ident(id) => id,
                        ModuleExportName::Str(_) => {
                            unreachable!(r#"`export {{ "foo" }}` is not valid"#)
                        }
                    };

                    if let Some(exported) = exported {
                        let exported = match exported {
                            ModuleExportName::Ident(Ident { span, sym, .. }) => (sym, span),
                            ModuleExportName::Str(Str { span, value, .. }) => (value, span),
                        };

                        (exported, orig)
                    } else {
                        let exported = orig.sym.clone();
                        ((exported, orig.span), orig)
                    }
                }
            }))
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
            .insert((js_word!("default"), DUMMY_SP), ident.clone());

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
            .insert((js_word!("default"), DUMMY_SP), ident.clone());

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
            .insert((js_word!("default"), DUMMY_SP), ident.clone());

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

    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {
        self.link
            .entry(n.take().src.value)
            .or_default()
            .insert(Specifier::ExportStar);
    }
}
