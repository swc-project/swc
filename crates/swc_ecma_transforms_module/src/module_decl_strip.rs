use indexmap::IndexMap;
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashSet, util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, is_valid_prop_ident, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::module_ref_rewriter::ImportMap;

pub type Link = IndexMap<JsWord, LinkItem>;
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

    /// `export = ` detected
    pub export_assign: Option<Box<Expr>>,

    pub has_module_decl: bool,

    /// `export default expr`
    export_default: Option<Stmt>,
}

impl VisitMut for ModuleDeclStrip {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut list = Vec::with_capacity(n.len());

        for item in n.drain(..) {
            match item {
                ModuleItem::Stmt(stmt) => list.push(stmt.into()),

                ModuleItem::ModuleDecl(mut module_decl) => {
                    // collect link meta
                    module_decl.visit_mut_with(self);
                    self.has_module_decl = true;

                    // emit stmt
                    match module_decl {
                        ModuleDecl::Import(..) => continue,
                        ModuleDecl::ExportDecl(ExportDecl { decl, .. }) => {
                            list.push(Stmt::Decl(decl).into());
                        }
                        ModuleDecl::ExportNamed(..) => continue,
                        ModuleDecl::ExportDefaultDecl(ExportDefaultDecl { decl, .. }) => match decl
                        {
                            DefaultDecl::Class(class_expr) => list.extend(
                                class_expr
                                    .as_class_decl()
                                    .map(|decl| Stmt::Decl(Decl::Class(decl)))
                                    .map(Into::into),
                            ),
                            DefaultDecl::Fn(fn_expr) => list.extend(
                                fn_expr
                                    .as_fn_decl()
                                    .map(|decl| Stmt::Decl(Decl::Fn(decl)))
                                    .map(Into::into),
                            ),
                            DefaultDecl::TsInterfaceDecl(_) => continue,
                        },
                        ModuleDecl::ExportDefaultExpr(..) => {
                            list.extend(self.export_default.take().map(Into::into))
                        }
                        ModuleDecl::ExportAll(..) => continue,
                        ModuleDecl::TsImportEquals(..) => continue,
                        ModuleDecl::TsExportAssignment(..) => continue,
                        ModuleDecl::TsNamespaceExport(..) => continue,
                    };
                }
            };
        }

        *n = list;
    }

    // collect all static import
    fn visit_mut_import_decl(&mut self, n: &mut ImportDecl) {
        let ImportDecl {
            specifiers, src, ..
        } = n.take();

        self.link
            .entry(src.value)
            .or_default()
            .mut_dummy_span(src.span)
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
        match &n.decl {
            Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                let ident = ident.clone();

                self.export.insert((ident.sym.clone(), ident.span), ident);
            }

            Decl::Var(v) => {
                self.export
                    .extend(find_pat_ids::<_, Ident>(&v.decls).into_iter().map(|id| {
                        let ident = id.clone();
                        ((id.sym, id.span), ident)
                    }));
            }
            _ => {}
        };
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
                .mut_dummy_span(src.span)
                .extend(specifiers.into_iter().map(Into::into));
        } else {
            self.export.extend(specifiers.into_iter().map(|e| match e {
                ExportSpecifier::Namespace(..) => {
                    unreachable!("`export *` without src is invalid")
                }
                ExportSpecifier::Default(ExportDefaultSpecifier { exported }) => {
                    ((js_word!("default"), DUMMY_SP), exported)
                }
                ExportSpecifier::Named(ExportNamedSpecifier { orig, exported, .. }) => {
                    let orig = match orig {
                        ModuleExportName::Ident(id) => id,
                        ModuleExportName::Str(_) => {
                            unreachable!(r#"`export {{ "foo" }}` without src is invalid"#)
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
    /// export default function bar () {};
    /// export default function () {};
    /// ```
    /// ->
    /// ```javascript
    /// class foo {};
    /// class _default {};
    /// function bar () {};
    /// function _default () {};
    /// ```
    fn visit_mut_export_default_decl(&mut self, n: &mut ExportDefaultDecl) {
        match &mut n.decl {
            DefaultDecl::Class(class_expr) => {
                let ident = class_expr
                    .ident
                    .get_or_insert_with(|| private_ident!("_default"))
                    .clone();

                self.export.insert((js_word!("default"), DUMMY_SP), ident);
            }
            DefaultDecl::Fn(fn_expr) => {
                let ident = fn_expr
                    .ident
                    .get_or_insert_with(|| private_ident!("_default"))
                    .clone();

                self.export.insert((js_word!("default"), DUMMY_SP), ident);
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
        }
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

        self.export_default = Some(Stmt::Decl(
            n.expr
                .take()
                .into_var_decl(VarDeclKind::Var, ident.into())
                .into(),
        ));
    }

    /// ```javascript
    /// export * from "mod";
    /// ```
    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {
        let Str {
            value: src_key,
            span: src_span,
            ..
        } = n.take().src;

        self.link
            .entry(src_key)
            .or_default()
            .mut_dummy_span(src_span)
            .insert(LinkSpecifier::ExportStar);
    }

    /// ```javascript
    /// import foo = require("mod");
    /// export import foo = require("mod");
    /// ```
    fn visit_mut_ts_import_equals_decl(&mut self, n: &mut TsImportEqualsDecl) {
        let TsImportEqualsDecl {
            id,
            module_ref,
            is_export,
            declare,
            is_type_only,
            ..
        } = n;

        debug_assert!(!*declare);
        debug_assert!(!*is_type_only);

        if let TsModuleRef::TsExternalModuleRef(TsExternalModuleRef {
            expr:
                Str {
                    span,
                    value: src_key,
                    ..
                },
            ..
        }) = module_ref
        {
            if *is_export {
                self.export.insert((id.sym.clone(), id.span), id.clone());
            }

            self.link
                .entry(src_key.clone())
                .or_default()
                .mut_dummy_span(*span)
                .insert(LinkSpecifier::ImportEqual(id.to_id()));
        }
    }

    /// ```javascript
    /// export = expr;
    /// ```
    fn visit_mut_ts_export_assignment(&mut self, n: &mut TsExportAssignment) {
        self.export_assign = Some(n.expr.take());
    }
}

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum LinkSpecifier {
    /// ```javascript
    /// import { imported as local, local } from "mod";
    /// import { "imported" as local } from "mod";
    /// ```
    /// Note: imported will never be `default`
    ImportNamed { imported: Option<JsWord>, local: Id },

    /// ```javascript
    /// import foo from "mod";
    /// ```
    ImportDefault(Id),

    /// ```javascript
    /// import * as foo from "mod";
    /// ```
    ImportStarAs(Id),

    /// ```javascript
    /// export { orig, orig as exported } from "mod";
    /// export { "orig", "orig" as "exported" } from "mod";
    /// ```
    /// Note: orig will never be `default`
    ExportNamed {
        orig: (JsWord, Span),
        exported: Option<(JsWord, Span)>,
    },

    /// ```javascript
    /// export { default } from "foo";
    /// export { "default" } from "foo";
    /// export { default as foo } from "mod";
    /// ```
    /// (default_span, local_sym, local_span)
    ExportDefaultAs(Span, JsWord, Span),

    /// ```javascript
    /// export * as foo from "mod";
    /// export * as "bar" from "mod";
    /// ```
    ExportStarAs(JsWord, Span),

    /// ```javascript
    /// export * from "mod";
    /// ```
    ExportStar,

    /// ```javascript
    /// import foo = require("foo");
    /// ```
    ImportEqual(Id),
}

impl From<ImportSpecifier> for LinkSpecifier {
    fn from(i: ImportSpecifier) -> Self {
        match i {
            ImportSpecifier::Namespace(ImportStarAsSpecifier { local, .. }) => {
                Self::ImportStarAs(local.to_id())
            }

            ImportSpecifier::Default(ImportDefaultSpecifier { local, .. })
            | ImportSpecifier::Named(ImportNamedSpecifier {
                local,
                imported:
                    Some(ModuleExportName::Ident(Ident {
                        sym: js_word!("default"),
                        ..
                    }))
                    | Some(ModuleExportName::Str(Str {
                        value: js_word!("default"),
                        ..
                    })),
                ..
            }) => Self::ImportDefault(local.to_id()),

            ImportSpecifier::Named(ImportNamedSpecifier {
                local, imported, ..
            }) => {
                let imported = imported.map(|e| match e {
                    ModuleExportName::Ident(Ident { sym, .. }) => sym,
                    ModuleExportName::Str(Str { value, .. }) => value,
                });

                Self::ImportNamed {
                    local: local.to_id(),
                    imported,
                }
            }
        }
    }
}

impl From<ExportSpecifier> for LinkSpecifier {
    fn from(e: ExportSpecifier) -> Self {
        match e {
            ExportSpecifier::Namespace(ExportNamespaceSpecifier {
                name:
                    ModuleExportName::Ident(Ident { span, sym, .. })
                    | ModuleExportName::Str(Str {
                        span, value: sym, ..
                    }),
                ..
            }) => Self::ExportStarAs(sym, span),

            ExportSpecifier::Default(ExportDefaultSpecifier { exported }) => {
                // https://github.com/tc39/proposal-export-default-from
                Self::ExportDefaultAs(exported.span, exported.sym, exported.span)
            }

            ExportSpecifier::Named(ExportNamedSpecifier { orig, exported, .. }) => {
                let orig = match orig {
                    ModuleExportName::Ident(Ident { span, sym, .. })
                    | ModuleExportName::Str(Str {
                        span, value: sym, ..
                    }) => (sym, span),
                };

                let exported = exported.map(|exported| match exported {
                    ModuleExportName::Ident(Ident { span, sym, .. })
                    | ModuleExportName::Str(Str {
                        span, value: sym, ..
                    }) => (sym, span),
                });

                match orig {
                    (js_word!("default"), default_span) => {
                        let (sym, span) = exported.unwrap_or(orig);

                        Self::ExportDefaultAs(default_span, sym, span)
                    }
                    _ => Self::ExportNamed { orig, exported },
                }
            }
        }
    }
}

#[derive(Debug, Default)]
pub struct LinkItem(pub Span, pub AHashSet<LinkSpecifier>, pub LinkFlag);

use bitflags::bitflags;

bitflags! {
    #[derive(Default)]
    pub struct LinkFlag: u8 {
        const NAMED = 1 << 0;
        const DEFAULT = 1 << 1;
        const NAMESPACE = Self::NAMED.bits | Self::DEFAULT.bits;
        const EXPORT_STAR = 1 << 2;
        const IMPORT_EQUAL = 1 << 3;
    }
}

impl LinkFlag {
    pub fn interop(&self) -> bool {
        self.intersects(Self::DEFAULT)
    }

    pub fn has_named(&self) -> bool {
        self.intersects(Self::NAMED)
    }

    pub fn namespace(&self) -> bool {
        self.contains(Self::NAMESPACE)
    }

    pub fn need_raw_import(&self) -> bool {
        self.interop() && self.intersects(Self::IMPORT_EQUAL)
    }

    pub fn export_star(&self) -> bool {
        self.intersects(Self::EXPORT_STAR)
    }
}

impl From<&LinkSpecifier> for LinkFlag {
    fn from(s: &LinkSpecifier) -> Self {
        match s {
            LinkSpecifier::ImportStarAs(..) => Self::NAMESPACE,
            LinkSpecifier::ImportDefault(..) => Self::DEFAULT,
            LinkSpecifier::ImportNamed { .. } => Self::NAMED,

            LinkSpecifier::ExportStarAs(..) => Self::NAMESPACE,
            LinkSpecifier::ExportDefaultAs(..) => Self::DEFAULT,
            LinkSpecifier::ExportNamed { .. } => Self::NAMED,

            LinkSpecifier::ImportEqual(..) => Self::IMPORT_EQUAL,
            LinkSpecifier::ExportStar => Self::EXPORT_STAR,
        }
    }
}

impl From<&ImportSpecifier> for LinkFlag {
    fn from(i: &ImportSpecifier) -> Self {
        match i {
            ImportSpecifier::Namespace(..) => Self::NAMESPACE,

            ImportSpecifier::Default(ImportDefaultSpecifier { .. })
            | ImportSpecifier::Named(ImportNamedSpecifier {
                imported:
                    Some(ModuleExportName::Ident(Ident {
                        sym: js_word!("default"),
                        ..
                    }))
                    | Some(ModuleExportName::Str(Str {
                        value: js_word!("default"),
                        ..
                    })),
                ..
            }) => Self::DEFAULT,

            ImportSpecifier::Named(..) => Self::NAMED,
        }
    }
}

impl From<&ExportSpecifier> for LinkFlag {
    fn from(e: &ExportSpecifier) -> Self {
        match e {
            ExportSpecifier::Namespace(..) => Self::NAMESPACE,

            // https://github.com/tc39/proposal-export-default-from
            ExportSpecifier::Default(..)
            | ExportSpecifier::Named(ExportNamedSpecifier {
                orig:
                    ModuleExportName::Ident(Ident {
                        sym: js_word!("default"),
                        ..
                    })
                    | ModuleExportName::Str(Str {
                        value: js_word!("default"),
                        ..
                    }),
                ..
            }) => Self::DEFAULT,

            ExportSpecifier::Named(..) => Self::NAMED,
        }
    }
}

impl Extend<LinkSpecifier> for LinkItem {
    fn extend<T: IntoIterator<Item = LinkSpecifier>>(&mut self, iter: T) {
        iter.into_iter().for_each(|link| {
            self.insert(link);
        });
    }
}

impl LinkItem {
    fn mut_dummy_span(&mut self, span: Span) -> &mut Self {
        if self.0.is_dummy() {
            self.0 = span;
        }

        self
    }

    fn insert(&mut self, link: LinkSpecifier) -> bool {
        self.2 |= (&link).into();
        self.1.insert(link)
    }
}

/// (exported_name, exported_span, expr)
pub type ExportObjPropList = Vec<(JsWord, Span, Expr)>;

/// Reduce self to generate ImportMap and ExportObjPropList
pub trait LinkSpecifierReducer {
    fn reduce(
        self,
        import_map: &mut ImportMap,
        export_obj_prop_list: &mut ExportObjPropList,
        mod_ident: &Ident,
        raw_mod_ident: &Option<Ident>,
        ref_to_mod_ident: &mut bool,
        is_swc_detault_helper: bool,
    );
}

impl LinkSpecifierReducer for AHashSet<LinkSpecifier> {
    fn reduce(
        self,
        import_map: &mut ImportMap,
        export_obj_prop_list: &mut ExportObjPropList,
        mod_ident: &Ident,
        raw_mod_ident: &Option<Ident>,
        ref_to_mod_ident: &mut bool,
        is_swc_detault_helper: bool,
    ) {
        self.into_iter().for_each(|s| match s {
            LinkSpecifier::ImportNamed { imported, local } => {
                *ref_to_mod_ident = true;

                import_map.insert(
                    local.clone(),
                    (mod_ident.clone(), imported.or(Some(local.0))),
                );
            }
            LinkSpecifier::ImportDefault(id) => {
                *ref_to_mod_ident = true;

                import_map.insert(
                    id,
                    (
                        mod_ident.clone(),
                        (!is_swc_detault_helper).then(|| js_word!("default")),
                    ),
                );
            }
            LinkSpecifier::ImportStarAs(id) => {
                *ref_to_mod_ident = true;

                import_map.insert(id, (mod_ident.clone(), None));
            }
            LinkSpecifier::ExportNamed { orig, exported } => {
                *ref_to_mod_ident = true;

                let (key, span) = exported.unwrap_or_else(|| orig.clone());

                let expr = {
                    let (name, span) = orig;
                    if is_valid_prop_ident(&name) {
                        mod_ident.clone().make_member(quote_ident!(span, name))
                    } else {
                        mod_ident.clone().computed_member(Str {
                            span,
                            value: name,
                            raw: None,
                        })
                    }
                };
                export_obj_prop_list.push((key, span, expr))
            }
            LinkSpecifier::ExportDefaultAs(default_span, key, span) => {
                *ref_to_mod_ident = true;

                let expr = mod_ident
                    .clone()
                    .make_member(quote_ident!(default_span, "default"));
                export_obj_prop_list.push((key, span, expr))
            }
            LinkSpecifier::ExportStarAs(key, span) => {
                *ref_to_mod_ident = true;

                let expr = mod_ident.clone().into();
                export_obj_prop_list.push((key, span, expr))
            }
            LinkSpecifier::ExportStar => {}
            LinkSpecifier::ImportEqual(id) => {
                *ref_to_mod_ident = true;

                import_map.insert(
                    id,
                    (
                        raw_mod_ident.clone().unwrap_or_else(|| mod_ident.clone()),
                        None,
                    ),
                );
            }
        })
    }
}
