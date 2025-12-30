use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, ExprFactory, QueryRef, RefRewriter};

use crate::{
    config::{Config, ImportsNotUsedAsValues, TsImportExportAssignConfig},
    strip_import_export::{DeclareCollect, UsageCollect},
    ts_enum::{TsEnumRecord, TsEnumRecordKey, TsEnumRecordValue},
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
                import_export_assign_config: config.import_export_assign_config.clone(),
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
    pub import_export_assign_config: TsImportExportAssignConfig,
    pub ts_enum_is_mutable: bool,
    pub verbatim_module_syntax: bool,
    pub native_class_properties: bool,

    pub is_lhs: bool,

    pub ref_rewriter: Option<RefRewriter<ExportQuery>>,
    pub ref_rewriter_temp: Option<RefRewriter<ExportQuery>>,
    pub in_export_decl: bool,

    pub decl_id_record: FxHashSet<Id>,
    pub namespace_id: Option<Id>,
    pub exported_binding: FxHashMap<Id, Option<Id>>,

    pub enum_record: TsEnumRecord,
    pub const_enum: FxHashSet<Id>,

    pub var_list: Vec<Id>,
    pub export_var_list: Vec<Id>,
    pub saved_var_list: Option<Vec<Id>>,

    pub in_class_prop: Vec<Id>,
    pub in_class_prop_init: Vec<Box<Expr>>,

    pub last_module_span: Option<swc_common::Span>,
}

/// State for StripImportExport hook
#[derive(Default)]
pub struct StripImportExportState {
    pub import_not_used_as_values: ImportsNotUsedAsValues,
    pub usage_info: UsageCollect,
    pub declare_info: DeclareCollect,
}

/// State for StripType hook
#[derive(Default)]
pub struct StripTypeState {
    pub in_namespace: bool,
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

impl TransformState {
    pub fn get_enum_value(&self, enum_id: &Id, member_name: &str) -> Option<&TsEnumRecordValue> {
        let key = TsEnumRecordKey {
            enum_id: enum_id.clone(),
            member_name: member_name.into(),
        };
        self.enum_record.get(&key)
    }
}
