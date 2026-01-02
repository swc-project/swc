use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprFactory, QueryRef, RefRewriter};

use crate::{
    config::{Config, ImportsNotUsedAsValues, TsImportExportAssignConfig},
    strip_import_export::{DeclareCollect, UsageCollect},
    ts_enum::TsEnumRecord,
};

/// Context for TypeScript transforms, holding all state needed by the hooks
pub struct TypeScriptCtx {
    // Configuration
    pub config: Config,
    pub unresolved_ctxt: SyntaxContext,
    pub top_level_ctxt: SyntaxContext,

    // Transform state
    pub transform: TransformState,

    // StripImportExport state
    pub strip_import_export: StripImportExportState,

    // StripType state
    pub strip_type: StripTypeState,
}

impl TypeScriptCtx {
    pub fn new(config: Config, unresolved_mark: Mark, top_level_mark: Mark) -> Self {
        Self {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
            transform: TransformState {
                import_export_assign_config: config.import_export_assign_config,
                ts_enum_is_mutable: config.ts_enum_is_mutable,
                verbatim_module_syntax: config.verbatim_module_syntax,
                native_class_properties: config.native_class_properties,
                ..Default::default()
            },
            strip_import_export: StripImportExportState {
                import_not_used_as_values: config.import_not_used_as_values,
                ..Default::default()
            },
            strip_type: StripTypeState::default(),
            config,
        }
    }
}

/// State for the main Transform hook
#[derive(Default)]
pub struct TransformState {
    pub(crate) import_export_assign_config: TsImportExportAssignConfig,
    pub(crate) ts_enum_is_mutable: bool,
    pub(crate) verbatim_module_syntax: bool,
    pub(crate) native_class_properties: bool,

    pub(crate) is_lhs: bool,

    pub(crate) ref_rewriter: Option<RefRewriter<ExportQuery>>,
    pub(crate) ref_rewriter_temp: Option<RefRewriter<ExportQuery>>,
    pub(crate) ref_rewriter_saved_for_var_decl: Option<RefRewriter<ExportQuery>>,
    pub(crate) in_export_decl: bool,

    pub(crate) decl_id_record: FxHashSet<Id>,
    pub(crate) namespace_id: Option<Id>,
    pub(crate) saved_namespace_id: Option<Option<Id>>,
    pub(crate) exported_binding: FxHashMap<Id, Option<Id>>,

    pub(crate) enum_record: TsEnumRecord,
    pub(crate) const_enum: FxHashSet<Id>,

    pub(crate) var_list: Vec<Id>,
    pub(crate) export_var_list: Vec<Id>,
    pub(crate) saved_var_list: Vec<Vec<Id>>,
    pub(crate) collector_saved_namespace_id: Option<Option<Id>>,

    pub(crate) in_class_prop: Vec<Id>,
    pub(crate) in_class_prop_init: Vec<Box<Expr>>,

    pub(crate) last_module_span: Option<swc_common::Span>,
}

/// State for StripImportExport hook
#[derive(Default)]
pub struct StripImportExportState {
    pub(crate) import_not_used_as_values: ImportsNotUsedAsValues,
    pub(crate) usage_info: UsageCollect,
    pub(crate) declare_info: DeclareCollect,
    pub(crate) in_namespace: bool,
}

/// State for StripType hook
#[derive(Default)]
pub struct StripTypeState {
    pub(crate) in_namespace: bool,
}

/// Query implementation for RefRewriter
pub struct ExportQuery {
    pub export_name: FxHashMap<Id, Option<Id>>,
}

impl QueryRef for ExportQuery {
    fn query_ref(&self, export_name: &Ident) -> Option<Box<Expr>> {
        self.export_name
            .get(&export_name.to_id())?
            .clone()
            .map(|namespace_id| namespace_id.make_member(export_name.clone().into()).into())
    }

    fn query_lhs(&self, ident: &Ident) -> Option<Box<Expr>> {
        self.query_ref(ident)
    }

    fn query_jsx(&self, ident: &Ident) -> Option<JSXElementName> {
        use swc_common::DUMMY_SP;

        self.export_name
            .get(&ident.to_id())?
            .clone()
            .map(|namespace_id| {
                JSXMemberExpr {
                    span: DUMMY_SP,
                    obj: JSXObject::Ident(namespace_id.into()),
                    prop: ident.clone().into(),
                }
                .into()
            })
    }
}
