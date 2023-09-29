use indexmap::IndexMap;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    Span,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, ident::IdentLike, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{module_ref_rewriter::ImportMap, util::ObjPropKeyIdent};

pub type Link = IndexMap<JsWord, LinkItem>;
pub type Export = AHashMap<(JsWord, Span), Ident>;

#[derive(Debug)]
pub struct ModuleDeclStrip {
    /// all imports/exports collected by path in source text order
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

    const_var_kind: VarDeclKind,
}

impl ModuleDeclStrip {
    pub fn new(const_var_kind: VarDeclKind) -> Self {
        Self {
            link: Default::default(),
            export: Default::default(),
            export_assign: Default::default(),
            has_module_decl: Default::default(),
            export_default: Default::default(),
            const_var_kind,
        }
    }
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
                                    .map(From::from),
                            ),
                            DefaultDecl::Fn(fn_expr) => list.extend(
                                fn_expr
                                    .as_fn_decl()
                                    .map(|decl| Stmt::Decl(Decl::Fn(decl)))
                                    .map(From::from),
                            ),
                            DefaultDecl::TsInterfaceDecl(_) => continue,
                        },
                        ModuleDecl::ExportDefaultExpr(..) => {
                            list.extend(self.export_default.take().map(From::from))
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
        if n.type_only {
            return;
        }

        let ImportDecl {
            specifiers, src, ..
        } = n.take();

        self.link
            .entry(src.value)
            .or_default()
            .mut_dummy_span(src.span)
            .extend(specifiers.into_iter().map(From::from));
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
        if n.type_only {
            return;
        }

        let NamedExport {
            specifiers, src, ..
        } = n.take();

        if let Some(src) = src {
            self.link
                .entry(src.value)
                .or_default()
                .mut_dummy_span(src.span)
                .extend(specifiers.into_iter().map(From::from));
        } else {
            self.export.extend(specifiers.into_iter().map(|e| match e {
                ExportSpecifier::Namespace(..) => {
                    unreachable!("`export *` without src is invalid")
                }
                ExportSpecifier::Default(..) => {
                    unreachable!("`export foo` without src is invalid")
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
                    .get_or_insert_with(|| private_ident!(n.span, "_default"))
                    .clone();

                self.export.insert((js_word!("default"), n.span), ident);
            }
            DefaultDecl::Fn(fn_expr) => {
                let ident = fn_expr
                    .ident
                    .get_or_insert_with(|| private_ident!(n.span, "_default"))
                    .clone();

                self.export.insert((js_word!("default"), n.span), ident);
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
        let ident = private_ident!(n.span, "_default");

        self.export
            .insert((js_word!("default"), n.span), ident.clone());

        self.export_default = Some(Stmt::Decl(
            n.expr
                .take()
                .into_var_decl(self.const_var_kind, ident.into())
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
        } = *n.take().src;

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
        if n.is_type_only {
            return;
        }

        let TsImportEqualsDecl {
            id,
            module_ref,
            is_export,
            ..
        } = n;

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
        self.export_assign.get_or_insert(n.expr.take());
    }
}

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum LinkSpecifier {
    ///```javascript
    /// import "mod";
    /// import {} from "mod",
    /// import { type foo } from "mod";
    /// export {} from "mod";
    /// export { type foo } from "mod";
    /// ```
    Empty,

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
                is_type_only: false,
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
                is_type_only: false,
                local,
                imported,
                ..
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
            _ => Self::Empty,
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

            ExportSpecifier::Named(ExportNamedSpecifier {
                is_type_only: false,
                orig,
                exported,
                ..
            }) => {
                let orig = match orig {
                    ModuleExportName::Ident(Ident { span, sym, .. })
                    | ModuleExportName::Str(Str {
                        span, value: sym, ..
                    }) => (sym, span.private()),
                };

                let exported = exported.map(|exported| match exported {
                    ModuleExportName::Ident(Ident { span, sym, .. })
                    | ModuleExportName::Str(Str {
                        span, value: sym, ..
                    }) => (sym, span.private()),
                });

                match orig {
                    (js_word!("default"), default_span) => {
                        let (sym, span) = exported.unwrap_or(orig);

                        Self::ExportDefaultAs(default_span, sym, span)
                    }
                    _ => Self::ExportNamed { orig, exported },
                }
            }
            _ => Self::Empty,
        }
    }
}

#[derive(Debug, Default)]
pub struct LinkItem(pub Span, pub AHashSet<LinkSpecifier>, pub LinkFlag);

use bitflags::bitflags;

bitflags! {
    #[derive(Default, Debug)]
    pub struct LinkFlag: u8 {
        const NAMED = 1 << 0;
        const DEFAULT = 1 << 1;
        const NAMESPACE = Self::NAMED.bits() | Self::DEFAULT.bits();
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
            LinkSpecifier::Empty => Self::empty(),
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
                is_type_only: false,
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

            ImportSpecifier::Named(ImportNamedSpecifier {
                is_type_only: false,
                ..
            }) => Self::NAMED,

            _ => Self::empty(),
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
                is_type_only: false,
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

            ExportSpecifier::Named(ExportNamedSpecifier {
                is_type_only: false,
                ..
            }) => Self::NAMED,

            _ => Self::empty(),
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

pub(crate) type ExportObjPropList = Vec<ObjPropKeyIdent>;

/// Reduce self to generate ImportMap and ExportObjPropList
pub(crate) trait LinkSpecifierReducer {
    fn reduce(
        self,
        import_map: &mut ImportMap,
        export_obj_prop_list: &mut ExportObjPropList,
        mod_ident: &Ident,
        raw_mod_ident: &Option<Ident>,
        ref_to_mod_ident: &mut bool,
        // do not emit `mod.default`, emit `mod` instead
        default_nowrap: bool,
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
        default_nowrap: bool,
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
                        (!default_nowrap).then(|| js_word!("default")),
                    ),
                );
            }
            LinkSpecifier::ImportStarAs(id) => {
                *ref_to_mod_ident = true;

                import_map.insert(id, (mod_ident.clone(), None));
            }
            LinkSpecifier::ExportNamed { orig, exported } => {
                *ref_to_mod_ident = true;

                // ```javascript
                // export { foo as bar } from "mod";
                //
                // import { foo } from "mod";
                // export { foo as bar };
                // ```

                // foo -> mod.foo
                import_map.insert(orig.to_id(), (mod_ident.clone(), Some(orig.0.clone())));

                let exported = exported.unwrap_or_else(|| orig.clone());

                // bar -> foo
                export_obj_prop_list.push((exported, quote_ident!(orig.1, orig.0)).into())
            }
            LinkSpecifier::ExportDefaultAs(_, key, span) => {
                *ref_to_mod_ident = true;

                // ```javascript
                // export { default as foo } from "mod";
                //
                // import { default as foo } from "mod";
                // export { foo };
                // ```

                let exported = (key.clone(), span);

                // foo -> mod.default
                import_map.insert(
                    exported.to_id(),
                    (mod_ident.clone(), Some("default".into())),
                );

                export_obj_prop_list.push((exported, quote_ident!(span, key)).into())
            }
            LinkSpecifier::ExportStarAs(key, span) => {
                *ref_to_mod_ident = true;

                export_obj_prop_list.push((key, span, mod_ident.clone()).into())
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
            LinkSpecifier::Empty => {}
        })
    }
}
