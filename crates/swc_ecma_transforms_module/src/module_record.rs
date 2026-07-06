use std::cmp::Ordering;

use indexmap::IndexMap;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{atom, Atom, Wtf8Atom};
use swc_common::{util::take::Take, Mark, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{module_ref_rewriter::ImportMap, SpanCtx};

/// `Source Text Module Record.[[RequestedModules]]`, kept in source order for
/// deterministic emit.
///
/// By default entries are grouped by module specifier for emitters that only
/// have string dependency slots. Callers that need per-dependency metadata can
/// opt into grouping by ModuleRequest Record so import attributes stay paired
/// with the matching dependency slot.
///
/// Spec:
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-source-text-module-records
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-module-request-records
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-modulerequests
pub(crate) type RequestedModules = IndexMap<RequestedModuleKey, RequestedModule>;
/// `Source Text Module Record.[[LocalExportEntries]]`, keyed by export name.
///
/// Spec: https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-source-text-module-records
pub(crate) type LocalExportEntries = FxHashMap<Atom, LocalExportEntry>;

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub(crate) enum RequestedModuleKey {
    Specifier(Atom),
    ModuleRequest(ModuleRequestRecord),
}

impl RequestedModuleKey {
    pub fn src(&self) -> &Atom {
        match self {
            Self::Specifier(src) => src,
            Self::ModuleRequest(request) => &request.specifier,
        }
    }

    pub fn attributes(&self) -> &[ImportAttributeRecord] {
        match self {
            Self::Specifier(_) => &[],
            Self::ModuleRequest(request) => &request.attributes,
        }
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub(crate) struct ModuleRequestRecord {
    /// ModuleRequest Record [[Specifier]].
    specifier: Atom,
    /// ModuleRequest Record [[Attributes]].
    attributes: Vec<ImportAttributeRecord>,
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub(crate) struct ImportAttributeRecord {
    /// ImportAttribute Record [[Key]].
    key: Atom,
    /// ImportAttribute Record [[Value]].
    value: Wtf8Atom,
}

impl ImportAttributeRecord {
    pub fn key(&self) -> &Atom {
        &self.key
    }

    pub fn value(&self) -> &Wtf8Atom {
        &self.value
    }
}

/// Source-level module syntax split into reusable module-record data and
/// ordered body items.
///
/// This keeps extraction separate from target-specific stripping. Lowerers are
/// responsible for deciding how an exported declaration or expression becomes
/// executable code in their output format.
#[derive(Debug)]
pub struct ModuleSyntaxExtractor {
    /// Imported modules and indirect/star exports grouped by requested module
    /// key.
    pub requested_modules: RequestedModules,

    /// Local exported binding.
    ///
    /// `export { foo as "1", bar }`
    /// -> Map("1" => foo, bar => bar)
    pub local_export_entries: LocalExportEntries,

    /// `export = ` detected
    pub export_assign: Option<Box<Expr>>,

    pub has_module_syntax: bool,

    /// `export default expr`
    default_export_decl: Option<Stmt>,

    const_var_kind: VarDeclKind,
    preserve_import_attributes: bool,
}

impl ModuleSyntaxExtractor {
    pub fn new(const_var_kind: VarDeclKind) -> Self {
        Self {
            requested_modules: Default::default(),
            local_export_entries: Default::default(),
            export_assign: Default::default(),
            has_module_syntax: Default::default(),
            default_export_decl: Default::default(),
            const_var_kind,
            preserve_import_attributes: false,
        }
    }

    pub fn preserve_import_attributes(mut self) -> Self {
        self.preserve_import_attributes = true;
        self
    }

    fn request_key(
        &self,
        specifier: Atom,
        attributes: &[ImportAttributeRecord],
    ) -> RequestedModuleKey {
        if self.preserve_import_attributes {
            return RequestedModuleKey::ModuleRequest(ModuleRequestRecord {
                specifier,
                attributes: attributes.to_vec(),
            });
        }

        RequestedModuleKey::Specifier(specifier)
    }

    fn import_attributes(with: Option<Box<ObjectLit>>) -> Vec<ImportAttributeRecord> {
        let Some(with) = with else {
            return Vec::new();
        };

        let Some(mut attributes) = with
            .props
            .into_iter()
            .map(|prop| Self::import_attribute_record(&prop))
            .collect::<Option<Vec<_>>>()
        else {
            return Vec::new();
        };

        attributes.sort_unstable_by(|a, b| {
            Self::cmp_utf16(a.key.as_str(), b.key.as_str()).then_with(|| a.value.cmp(&b.value))
        });

        attributes
    }

    fn import_attribute_record(prop: &PropOrSpread) -> Option<ImportAttributeRecord> {
        let PropOrSpread::Prop(prop) = prop else {
            return None;
        };

        let Prop::KeyValue(key_value) = &**prop else {
            return None;
        };

        let key = match &key_value.key {
            PropName::Ident(key) => key.sym.clone(),
            PropName::Str(key) => key.value.as_str()?.into(),
            _ => return None,
        };

        let Expr::Lit(Lit::Str(value)) = &*key_value.value else {
            return None;
        };

        Some(ImportAttributeRecord {
            key,
            value: value.value.clone(),
        })
    }

    fn cmp_utf16(a: &str, b: &str) -> Ordering {
        a.encode_utf16().cmp(b.encode_utf16())
    }
}

impl VisitMut for ModuleSyntaxExtractor {
    noop_visit_mut_type!(fail);

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut list = Vec::with_capacity(n.len());

        for item in n.drain(..) {
            match item {
                ModuleItem::Stmt(stmt) => list.push(stmt.into()),

                ModuleItem::ModuleDecl(mut module_decl) => {
                    // Collect the source text module record entries produced
                    // by ParseModule.
                    // Spec: https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-parsemodule
                    module_decl.visit_mut_with(self);
                    self.has_module_syntax = true;

                    // emit stmt
                    match module_decl {
                        ModuleDecl::Import(..) => continue,
                        ModuleDecl::ExportDecl(ExportDecl { decl, .. }) => {
                            list.push(decl.into());
                        }
                        ModuleDecl::ExportNamed(..) => continue,
                        ModuleDecl::ExportDefaultDecl(ExportDefaultDecl { decl, .. }) => match decl
                        {
                            DefaultDecl::Class(class_expr) => {
                                list.extend(class_expr.as_class_decl().map(From::from))
                            }
                            DefaultDecl::Fn(fn_expr) => {
                                list.extend(fn_expr.as_fn_decl().map(From::from))
                            }
                            DefaultDecl::TsInterfaceDecl(_) => continue,
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        },
                        ModuleDecl::ExportDefaultExpr(..) => {
                            list.extend(self.default_export_decl.take().map(From::from))
                        }
                        ModuleDecl::ExportAll(..) => continue,
                        ModuleDecl::TsImportEquals(..) => continue,
                        ModuleDecl::TsExportAssignment(..) => continue,
                        ModuleDecl::TsNamespaceExport(..) => continue,
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    };
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            };
        }

        *n = list;
    }

    // Collect ImportEntry records from static imports.
    // Spec:
    // - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-importentries
    // - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-importentriesformodule
    fn visit_mut_import_decl(&mut self, n: &mut ImportDecl) {
        if n.type_only {
            return;
        }

        let ImportDecl {
            specifiers,
            src,
            with,
            ..
        } = n.take();

        let src_key = src.value.to_atom_lossy().into_owned();
        let attributes = Self::import_attributes(with);
        let request_key = self.request_key(src_key, &attributes);

        self.requested_modules
            .entry(request_key)
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
    /// Spec: https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-exportentries
    fn visit_mut_export_decl(&mut self, n: &mut ExportDecl) {
        match &n.decl {
            Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                self.local_export_entries.insert(
                    ident.sym.clone(),
                    LocalExportEntry::new((ident.span, ident.ctxt), ident.clone()),
                );
            }

            Decl::Var(v) => {
                self.local_export_entries.extend(
                    find_pat_ids::<_, Ident>(&v.decls).into_iter().map(|id| {
                        (
                            id.sym.clone(),
                            LocalExportEntry::new((id.span, id.ctxt), id),
                        )
                    }),
                );
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
    /// Spec:
    /// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-exportentries
    /// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-exportentriesformodule
    fn visit_mut_named_export(&mut self, n: &mut NamedExport) {
        if n.type_only {
            return;
        }

        let NamedExport {
            specifiers,
            src,
            with,
            ..
        } = n.take();

        if let Some(src) = src {
            let src_key = src.value.to_atom_lossy().into_owned();
            let attributes = Self::import_attributes(with);
            let request_key = self.request_key(src_key, &attributes);

            self.requested_modules
                .entry(request_key)
                .or_default()
                .mut_dummy_span(src.span)
                .extend(specifiers.into_iter().map(From::from));
        } else {
            self.local_export_entries
                .extend(specifiers.into_iter().map(|e| match e {
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
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        };

                        if let Some(exported) = exported {
                            let (export_name, export_name_span) = match exported {
                                ModuleExportName::Ident(Ident {
                                    ctxt, span, sym, ..
                                }) => (sym, (span, ctxt)),
                                ModuleExportName::Str(Str { span, value, .. }) => (
                                    value.to_atom_lossy().into_owned(),
                                    (span, Default::default()),
                                ),
                                #[cfg(swc_ast_unknown)]
                                _ => panic!("unable to access unknown nodes"),
                            };

                            (export_name, LocalExportEntry::new(export_name_span, orig))
                        } else {
                            (
                                orig.sym.clone(),
                                LocalExportEntry::new((orig.span, orig.ctxt), orig),
                            )
                        }
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
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

                self.local_export_entries.insert(
                    atom!("default"),
                    LocalExportEntry::new((n.span, Default::default()), ident),
                );
            }
            DefaultDecl::Fn(fn_expr) => {
                let ident = fn_expr
                    .ident
                    .get_or_insert_with(|| private_ident!(n.span, "_default"))
                    .clone();

                self.local_export_entries.insert(
                    atom!("default"),
                    LocalExportEntry::new((n.span, Default::default()), ident),
                );
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
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

        self.local_export_entries.insert(
            atom!("default"),
            LocalExportEntry::new((n.span, Default::default()), ident.clone()),
        );

        self.default_export_decl = Some(
            n.expr
                .take()
                .into_var_decl(self.const_var_kind, ident.into())
                .into(),
        );
    }

    /// ```javascript
    /// export * from "mod";
    /// ```
    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {
        let ExportAll { src, with, .. } = n.take();
        let Str {
            value: src_key,
            span: src_span,
            ..
        } = *src;

        let attributes = Self::import_attributes(with);
        let request_key = self.request_key(src_key.to_atom_lossy().into_owned(), &attributes);

        self.requested_modules
            .entry(request_key)
            .or_default()
            .mut_dummy_span(src_span)
            .insert(ModuleRecordEntry::StarExport);
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
                self.local_export_entries.insert(
                    id.sym.clone(),
                    LocalExportEntry::new((id.span, id.ctxt), id.clone()),
                );
            }

            self.requested_modules
                .entry(RequestedModuleKey::Specifier(
                    src_key.to_atom_lossy().into_owned(),
                ))
                .or_default()
                .mut_dummy_span(*span)
                .insert(ModuleRecordEntry::TsImportEquals {
                    local_name: id.to_id(),
                });
        }
    }

    /// ```javascript
    /// export = expr;
    /// ```
    fn visit_mut_ts_export_assignment(&mut self, n: &mut TsExportAssignment) {
        self.export_assign.get_or_insert(n.expr.take());
    }
}

/// ImportEntry and ExportEntry record fields used by this transform.
///
/// Spec:
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#table-importentry-record-fields
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#table-exportentry-record-fields
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-importentries
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-exportentries
#[derive(Debug, PartialEq, Eq, Hash)]
pub enum ModuleRecordEntry {
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
    /// Note: `import_name` will never be `default`.
    ImportNamed {
        import_name: Option<Atom>,
        local_name: Id,
    },

    /// ```javascript
    /// import foo from "mod";
    /// ```
    ImportDefault { local_name: Id },

    /// ```javascript
    /// import * as foo from "mod";
    /// ```
    /// The spec resolves this to a Module Namespace Exotic Object. This legacy
    /// module transform emits an interop object instead.
    /// Spec:
    /// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-getmodulenamespace
    /// - https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects
    ImportNamespace { local_name: Id },

    /// ```javascript
    /// export { orig, orig as exported } from "mod";
    /// export { "orig", "orig" as "exported" } from "mod";
    /// ```
    /// Note: `import_name` will never be `default`.
    IndirectExportNamed {
        import_name: (Atom, SpanCtx),
        export_name: Option<(Atom, SpanCtx)>,
    },

    /// ```javascript
    /// export { default } from "foo";
    /// export { "default" } from "foo";
    /// export { default as foo } from "mod";
    /// ```
    IndirectExportDefault {
        export_name: Atom,
        export_name_span: SpanCtx,
    },

    /// ```javascript
    /// export * as foo from "mod";
    /// export * as "bar" from "mod";
    /// ```
    /// The spec resolves this to a namespace export binding. This transform
    /// emits a legacy interop object getter instead.
    /// Spec:
    /// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-resolveexport
    /// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-getmodulenamespace
    IndirectExportNamespace {
        export_name: Atom,
        export_name_span: SpanCtx,
    },

    /// ```javascript
    /// export * from "mod";
    /// ```
    /// Related spec operation: `GetExportedNames` walks
    /// `[[StarExportEntries]]` and omits `default` from star-exported names.
    /// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-getexportednames
    StarExport,

    /// ```javascript
    /// import foo = require("foo");
    /// ```
    TsImportEquals { local_name: Id },
}

impl From<ImportSpecifier> for ModuleRecordEntry {
    fn from(i: ImportSpecifier) -> Self {
        match i {
            ImportSpecifier::Namespace(ImportStarAsSpecifier { local, .. }) => {
                Self::ImportNamespace {
                    local_name: local.to_id(),
                }
            }

            ImportSpecifier::Default(ImportDefaultSpecifier { local, .. }) => Self::ImportDefault {
                local_name: local.to_id(),
            },
            ImportSpecifier::Named(ImportNamedSpecifier {
                is_type_only: false,
                local,
                imported: Some(ModuleExportName::Ident(Ident { sym: s, .. })),
                ..
            }) if &*s == "default" => Self::ImportDefault {
                local_name: local.to_id(),
            },

            ImportSpecifier::Named(ImportNamedSpecifier {
                is_type_only: false,
                local,
                imported: Some(ModuleExportName::Str(Str { value: s, .. })),
                ..
            }) if &s == "default" => Self::ImportDefault {
                local_name: local.to_id(),
            },

            ImportSpecifier::Named(ImportNamedSpecifier {
                is_type_only: false,
                local,
                imported,
                ..
            }) => {
                let import_name = imported.and_then(|e| match e {
                    ModuleExportName::Ident(Ident { sym, .. }) => Some(sym),
                    ModuleExportName::Str(Str { value, .. }) => value.as_atom().cloned(),
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                });

                Self::ImportNamed {
                    local_name: local.to_id(),
                    import_name,
                }
            }
            _ => Self::Empty,
        }
    }
}

impl From<ExportSpecifier> for ModuleRecordEntry {
    fn from(e: ExportSpecifier) -> Self {
        match e {
            ExportSpecifier::Namespace(ExportNamespaceSpecifier {
                name:
                    ModuleExportName::Str(Str {
                        span, value: sym, ..
                    }),
                ..
            }) => Self::IndirectExportNamespace {
                export_name: sym.to_atom_lossy().into_owned(),
                export_name_span: (span, SyntaxContext::empty()),
            },
            ExportSpecifier::Namespace(ExportNamespaceSpecifier {
                name: ModuleExportName::Ident(Ident { span, sym, .. }),
                ..
            }) => Self::IndirectExportNamespace {
                export_name: sym,
                export_name_span: (span, SyntaxContext::empty()),
            },

            ExportSpecifier::Default(ExportDefaultSpecifier { exported }) => {
                // https://github.com/tc39/proposal-export-default-from
                Self::IndirectExportDefault {
                    export_name: exported.sym,
                    export_name_span: (exported.span, exported.ctxt),
                }
            }

            ExportSpecifier::Named(ExportNamedSpecifier {
                is_type_only: false,
                orig,
                exported,
                ..
            }) => {
                let orig = match orig {
                    ModuleExportName::Ident(Ident { span, sym, .. }) => {
                        (sym, (span, SyntaxContext::empty().apply_mark(Mark::new())))
                    }
                    ModuleExportName::Str(Str {
                        span, value: sym, ..
                    }) => (
                        sym.to_atom_lossy().into_owned(),
                        (span, SyntaxContext::empty().apply_mark(Mark::new())),
                    ),
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                };

                let exported = exported.map(|exported| match exported {
                    ModuleExportName::Ident(Ident { span, sym, .. }) => {
                        (sym, (span, SyntaxContext::empty().apply_mark(Mark::new())))
                    }
                    ModuleExportName::Str(Str {
                        span, value: sym, ..
                    }) => (
                        sym.to_atom_lossy().into_owned(),
                        (span, SyntaxContext::empty().apply_mark(Mark::new())),
                    ),
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                });

                match (&*orig.0, orig.1) {
                    ("default", _) => {
                        let (sym, span) = exported.unwrap_or(orig);

                        Self::IndirectExportDefault {
                            export_name: sym,
                            export_name_span: span,
                        }
                    }
                    _ => Self::IndirectExportNamed {
                        import_name: orig,
                        export_name: exported,
                    },
                }
            }
            _ => Self::Empty,
        }
    }
}

#[derive(Debug, Default)]
pub struct RequestedModule {
    /// First useful source span for the module request. The spec tracks this as
    /// a ModuleRequest Record; emitters keep the span for generated literals
    /// and diagnostics.
    ///
    /// Spec: https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-module-request-records
    pub span: SpanCtx,
    /// `ImportEntry` and `ExportEntry` records associated with this module
    /// request.
    pub entries: FxHashSet<ModuleRecordEntry>,
    /// Emitter-only summary of which runtime module shape is needed.
    pub usage: ModuleRequestUsage,
}

use bitflags::bitflags;

bitflags! {
    #[derive(Default, Debug)]
    pub struct ModuleRequestUsage: u8 {
        const NAMED = 1 << 0;
        const DEFAULT = 1 << 1;
        const NAMESPACE = Self::NAMED.bits() | Self::DEFAULT.bits();
        const STAR_EXPORT = 1 << 2;
        const TS_IMPORT_EQUALS = 1 << 3;
    }
}

impl ModuleRequestUsage {
    pub fn needs_interop(&self) -> bool {
        self.intersects(Self::DEFAULT)
    }

    pub fn has_named(&self) -> bool {
        self.intersects(Self::NAMED)
    }

    pub fn needs_namespace_object(&self) -> bool {
        self.contains(Self::NAMESPACE)
    }

    pub fn needs_raw_import_for_ts_import_equals(&self) -> bool {
        self.needs_interop() && self.intersects(Self::TS_IMPORT_EQUALS)
    }

    pub fn has_star_export(&self) -> bool {
        self.intersects(Self::STAR_EXPORT)
    }
}

impl From<&ModuleRecordEntry> for ModuleRequestUsage {
    fn from(s: &ModuleRecordEntry) -> Self {
        match s {
            ModuleRecordEntry::Empty => Self::empty(),
            ModuleRecordEntry::ImportNamespace { .. } => Self::NAMESPACE,
            ModuleRecordEntry::ImportDefault { .. } => Self::DEFAULT,
            ModuleRecordEntry::ImportNamed { .. } => Self::NAMED,

            ModuleRecordEntry::IndirectExportNamespace { .. } => Self::NAMESPACE,
            ModuleRecordEntry::IndirectExportDefault { .. } => Self::DEFAULT,
            ModuleRecordEntry::IndirectExportNamed { .. } => Self::NAMED,

            ModuleRecordEntry::TsImportEquals { .. } => Self::TS_IMPORT_EQUALS,
            ModuleRecordEntry::StarExport => Self::STAR_EXPORT,
        }
    }
}

impl From<&ImportSpecifier> for ModuleRequestUsage {
    fn from(i: &ImportSpecifier) -> Self {
        match i {
            ImportSpecifier::Namespace(..) => Self::NAMESPACE,

            ImportSpecifier::Default(ImportDefaultSpecifier { .. }) => Self::DEFAULT,

            ImportSpecifier::Named(ImportNamedSpecifier {
                is_type_only: false,
                imported: Some(ModuleExportName::Ident(Ident { sym: default, .. })),
                ..
            }) if &**default == "default" => Self::DEFAULT,

            ImportSpecifier::Named(ImportNamedSpecifier {
                is_type_only: false,
                imported: Some(ModuleExportName::Str(Str { value: default, .. })),
                ..
            }) if default == "default" => Self::DEFAULT,

            ImportSpecifier::Named(ImportNamedSpecifier {
                is_type_only: false,
                ..
            }) => Self::NAMED,

            _ => Self::empty(),
        }
    }
}

impl From<&ExportSpecifier> for ModuleRequestUsage {
    fn from(e: &ExportSpecifier) -> Self {
        match e {
            ExportSpecifier::Namespace(..) => Self::NAMESPACE,

            // https://github.com/tc39/proposal-export-default-from
            ExportSpecifier::Default(..) => Self::DEFAULT,

            ExportSpecifier::Named(ExportNamedSpecifier {
                is_type_only: false,
                orig: ModuleExportName::Str(Str { value: s, .. }),
                ..
            }) if s == "default" => Self::DEFAULT,

            ExportSpecifier::Named(ExportNamedSpecifier {
                is_type_only: false,
                orig: ModuleExportName::Ident(Ident { sym: s, .. }),
                ..
            }) if &**s == "default" => Self::DEFAULT,

            ExportSpecifier::Named(ExportNamedSpecifier {
                is_type_only: false,
                ..
            }) => Self::NAMED,

            _ => Self::empty(),
        }
    }
}

impl Extend<ModuleRecordEntry> for RequestedModule {
    fn extend<T: IntoIterator<Item = ModuleRecordEntry>>(&mut self, iter: T) {
        iter.into_iter().for_each(|link| {
            self.insert(link);
        });
    }
}

impl RequestedModule {
    fn mut_dummy_span(&mut self, span: Span) -> &mut Self {
        if self.span.0.is_dummy() {
            self.span.0 = span;
        }

        self
    }

    fn insert(&mut self, entry: ModuleRecordEntry) -> bool {
        self.usage |= (&entry).into();
        self.entries.insert(entry)
    }
}

pub(crate) type ExportObjectProperties = Vec<ExportBinding>;

/// Reduce module record entries into the import map and export object
/// properties required by CommonJS-like emitters.
///
/// This is not a full ECMAScript module linker. It only lowers collected
/// syntactic entries to emitter-local data structures; the corresponding spec
/// operations for linked modules are `GetExportedNames` and `ResolveExport`.
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-getexportednames
/// - https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-resolveexport
pub(crate) trait ModuleRecordEntryReducer {
    fn reduce(
        self,
        import_map: &mut ImportMap,
        export_bindings: &mut ExportObjectProperties,
        mod_ident: &Ident,
        raw_mod_ident: &Option<Ident>,
        ref_to_mod_ident: &mut bool,
        // do not emit `mod.default`, emit `mod` instead
        default_nowrap: bool,
    );
}

impl ModuleRecordEntryReducer for FxHashSet<ModuleRecordEntry> {
    fn reduce(
        self,
        import_map: &mut ImportMap,
        export_bindings: &mut ExportObjectProperties,
        mod_ident: &Ident,
        raw_mod_ident: &Option<Ident>,
        ref_to_mod_ident: &mut bool,
        default_nowrap: bool,
    ) {
        self.into_iter().for_each(|s| match s {
            ModuleRecordEntry::ImportNamed {
                import_name,
                local_name,
            } => {
                *ref_to_mod_ident = true;

                import_map.insert(
                    local_name.clone(),
                    (mod_ident.clone(), import_name.or(Some(local_name.0))),
                );
            }
            ModuleRecordEntry::ImportDefault { local_name } => {
                *ref_to_mod_ident = true;

                import_map.insert(
                    local_name,
                    (
                        mod_ident.clone(),
                        (!default_nowrap).then(|| atom!("default")),
                    ),
                );
            }
            ModuleRecordEntry::ImportNamespace { local_name } => {
                *ref_to_mod_ident = true;

                import_map.insert(local_name, (mod_ident.clone(), None));
            }
            ModuleRecordEntry::IndirectExportNamed {
                import_name,
                export_name,
            } => {
                *ref_to_mod_ident = true;

                // ```javascript
                // export { foo as bar } from "mod";
                //
                // import { foo } from "mod";
                // export { foo as bar };
                // ```

                // foo -> mod.foo
                import_map.insert(
                    (import_name.0.clone(), import_name.1 .1),
                    (mod_ident.clone(), Some(import_name.0.clone())),
                );

                let (export_name, export_name_span) =
                    export_name.unwrap_or_else(|| import_name.clone());

                // bar -> foo
                export_bindings.push((
                    export_name,
                    LocalExportEntry::new(
                        export_name_span,
                        quote_ident!(import_name.1 .1, import_name.1 .0, import_name.0),
                    ),
                ))
            }
            ModuleRecordEntry::IndirectExportDefault {
                export_name,
                export_name_span,
                ..
            } => {
                *ref_to_mod_ident = true;

                // ```javascript
                // export { default as foo } from "mod";
                //
                // import { default as foo } from "mod";
                // export { foo };
                // ```

                // foo -> mod.default
                import_map.insert(
                    (export_name.clone(), export_name_span.1),
                    (mod_ident.clone(), Some(atom!("default"))),
                );

                export_bindings.push((
                    export_name.clone(),
                    LocalExportEntry::new(
                        export_name_span,
                        quote_ident!(export_name_span.1, export_name_span.0, export_name),
                    ),
                ));
            }
            ModuleRecordEntry::IndirectExportNamespace {
                export_name,
                export_name_span,
            } => {
                *ref_to_mod_ident = true;

                export_bindings.push((
                    export_name,
                    LocalExportEntry::new(export_name_span, mod_ident.clone()),
                ));
            }
            ModuleRecordEntry::StarExport => {}
            ModuleRecordEntry::TsImportEquals { local_name } => {
                *ref_to_mod_ident = true;

                import_map.insert(
                    local_name,
                    (
                        raw_mod_ident.clone().unwrap_or_else(|| mod_ident.clone()),
                        None,
                    ),
                );
            }
            ModuleRecordEntry::Empty => {}
        })
    }
}

#[derive(Debug)]
pub struct LocalExportEntry(SpanCtx, Ident);

impl LocalExportEntry {
    pub fn new(export_name_span: SpanCtx, local_ident: Ident) -> Self {
        Self(export_name_span, local_ident)
    }

    pub fn export_name_span(&self) -> SpanCtx {
        self.0
    }

    pub fn into_local_ident(self) -> Ident {
        self.1
    }
}

pub type ExportBinding = (Atom, LocalExportEntry);
