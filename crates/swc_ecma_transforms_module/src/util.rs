use is_macro::Is;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_cached::regex::CachedRegex;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{
    is_valid_prop_ident, member_expr, private_ident, quote_ident, quote_str, ExprFactory,
    FunctionFactory, IsDirective,
};

use crate::{
    module_decl_strip::{ExportItem, ExportKV},
    SpanCtx,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub allow_top_level_this: bool,
    #[serde(default)]
    pub strict: bool,
    #[serde(default = "default_strict_mode")]
    pub strict_mode: bool,
    #[serde(default)]
    pub lazy: Lazy,
    #[serde(default)]
    pub import_interop: Option<ImportInterop>,
    /// Emits `cjs-module-lexer` annotation
    /// `cjs-module-lexer` is used in Node.js core for detecting the named
    /// exports available when importing a CJS module into ESM.
    /// swc will emit `cjs-module-lexer` detectable annotation with this option
    /// enabled.
    ///
    /// Defaults to `true` if import_interop is Node, else `false`
    #[serde(default)]
    pub export_interop_annotation: Option<bool>,
    #[serde(default)]
    /// Note: deprecated
    pub no_interop: bool,
    #[serde(default)]
    pub ignore_dynamic: bool,
    #[serde(default)]
    pub preserve_import_meta: bool,

    #[serde(default)]
    pub resolve_fully: bool,

    #[serde(default = "Config::default_js_ext")]
    pub out_file_extension: String,
}

impl Config {
    pub fn default_js_ext() -> String {
        "js".to_string()
    }
}

impl Default for Config {
    fn default() -> Self {
        Config {
            allow_top_level_this: false,
            strict: false,
            strict_mode: default_strict_mode(),
            lazy: Lazy::default(),
            import_interop: None,
            export_interop_annotation: None,
            no_interop: false,
            ignore_dynamic: false,
            preserve_import_meta: false,
            resolve_fully: false,
            out_file_extension: "js".to_string(),
        }
    }
}

const fn default_strict_mode() -> bool {
    true
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Is, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ImportInterop {
    #[serde(alias = "babel")]
    Swc,
    Node,
    None,
}

impl From<bool> for ImportInterop {
    fn from(no_interop: bool) -> Self {
        if no_interop {
            ImportInterop::None
        } else {
            ImportInterop::Swc
        }
    }
}

impl Config {
    #[inline(always)]
    pub fn import_interop(&self) -> ImportInterop {
        self.import_interop
            .unwrap_or_else(|| self.no_interop.into())
    }

    #[inline(always)]
    pub fn export_interop_annotation(&self) -> bool {
        self.export_interop_annotation
            .unwrap_or_else(|| self.import_interop == Some(ImportInterop::Node))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct LazyObjectConfig {
    pub patterns: Vec<CachedRegex>,
}

impl LazyObjectConfig {
    pub fn is_lazy(&self, src: &JsWord) -> bool {
        self.patterns.iter().any(|pat| pat.is_match(src))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged, deny_unknown_fields, rename_all = "camelCase")]
pub enum Lazy {
    Bool(bool),
    List(Vec<JsWord>),
    Object(LazyObjectConfig),
}

impl Lazy {
    pub fn is_lazy(&self, src: &JsWord) -> bool {
        match *self {
            Lazy::Bool(false) => false,
            Lazy::Bool(true) => !src.starts_with('.'),
            Lazy::List(ref srcs) => srcs.contains(src),
            Lazy::Object(ref object) => object.is_lazy(src),
        }
    }
}

impl Default for Lazy {
    fn default() -> Self {
        Lazy::Bool(false)
    }
}

pub(super) fn local_name_for_src(src: &JsWord) -> JsWord {
    let src = src.split('/').last().unwrap();
    let src = src
        .strip_suffix(".js")
        .or_else(|| src.strip_suffix(".mjs"))
        .unwrap_or(src);

    let id = match Ident::verify_symbol(src) {
        Ok(_) => src.into(),
        Err(err) => err,
    };

    if !id.starts_with('_') {
        format!("_{}", id).into()
    } else {
        id.into()
    }
}

/// Creates
///
///```js
/// 
///  Object.defineProperty(target, prop_name, {
///      ...props
///  });
/// ```
pub(super) fn object_define_property(
    target: ExprOrSpread,
    prop_name: ExprOrSpread,
    descriptor: ExprOrSpread,
) -> Expr {
    member_expr!(Default::default(), DUMMY_SP, Object.defineProperty)
        .as_call(DUMMY_SP, vec![target, prop_name, descriptor])
}

/// Creates
///
///```js
/// 
///  Object.defineProperty(exports, '__esModule', {
///       value: true
///  });
/// ```
pub(super) fn define_es_module(exports: Ident) -> Stmt {
    object_define_property(
        exports.as_arg(),
        quote_str!("__esModule").as_arg(),
        ObjectLit {
            span: DUMMY_SP,
            props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("value")),
                value: true.into(),
            })))],
        }
        .as_arg(),
    )
    .into_stmt()
}

pub(super) trait VecStmtLike {
    type StmtLike: IsDirective;

    fn as_ref(&self) -> &[Self::StmtLike];

    fn has_use_strict(&self) -> bool {
        self.as_ref()
            .iter()
            .take_while(|s| s.directive_continue())
            .any(IsDirective::is_use_strict)
    }
}

impl VecStmtLike for [ModuleItem] {
    type StmtLike = ModuleItem;

    fn as_ref(&self) -> &[Self::StmtLike] {
        self
    }
}

impl VecStmtLike for [Stmt] {
    type StmtLike = Stmt;

    fn as_ref(&self) -> &[Self::StmtLike] {
        self
    }
}

pub(super) fn use_strict() -> Stmt {
    Lit::Str(quote_str!("use strict")).into_stmt()
}

pub(crate) fn object_define_enumerable(
    target: ExprOrSpread,
    prop_name: ExprOrSpread,
    prop: PropOrSpread,
) -> Expr {
    object_define_property(
        target,
        prop_name,
        ObjectLit {
            span: DUMMY_SP,
            props: vec![
                PropOrSpread::Prop(Box::new(
                    KeyValueProp {
                        key: quote_ident!("enumerable").into(),
                        value: Box::new(true.into()),
                    }
                    .into(),
                )),
                prop,
            ],
        }
        .as_arg(),
    )
}

#[macro_export]
macro_rules! caniuse {
    ($feature_set:ident . $feature:ident) => {
        $feature_set.intersects(swc_ecma_transforms_base::feature::FeatureFlag::$feature)
    };
}

/// ```javascript
/// function _esmExport(target, all) {
///    for (var name in all)Object.defineProperty(target, name, { get: all[name], enumerable: true });
/// }
/// ```
pub(crate) fn esm_export() -> Function {
    let target = private_ident!("target");
    let all = private_ident!("all");
    let name = private_ident!("name");

    let getter = KeyValueProp {
        key: quote_ident!("get").into(),
        value: all.clone().computed_member(name.clone()).into(),
    };

    let body = object_define_enumerable(
        target.clone().as_arg(),
        name.clone().as_arg(),
        PropOrSpread::Prop(Box::new(Prop::KeyValue(getter))),
    )
    .into_stmt();

    let for_in_stmt: Stmt = ForInStmt {
        span: DUMMY_SP,
        left: VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: name.into(),
                init: None,
                definite: false,
            }],
            ..Default::default()
        }
        .into(),
        right: Box::new(all.clone().into()),
        body: Box::new(body),
    }
    .into();

    Function {
        params: vec![target.into(), all.into()],
        decorators: Default::default(),
        span: DUMMY_SP,
        body: Some(BlockStmt {
            stmts: vec![for_in_stmt],
            ..Default::default()
        }),
        is_generator: false,
        is_async: false,
        ..Default::default()
    }
}

pub(crate) fn emit_export_stmts(exports: Ident, mut prop_list: Vec<ExportKV>) -> Vec<Stmt> {
    match prop_list.len() {
        0 | 1 => prop_list
            .pop()
            .map(|(export_name, export_item)| {
                object_define_enumerable(
                    exports.as_arg(),
                    quote_str!(export_item.export_name_span().0, export_name).as_arg(),
                    prop_function((
                        "get".into(),
                        ExportItem::new(Default::default(), export_item.into_local_ident()),
                    ))
                    .into(),
                )
                .into_stmt()
            })
            .into_iter()
            .collect(),
        _ => {
            let props = prop_list
                .into_iter()
                .map(prop_function)
                .map(From::from)
                .collect();
            let obj_lit = ObjectLit {
                span: DUMMY_SP,
                props,
            };

            let esm_export_ident = private_ident!("_export");

            vec![
                Stmt::Decl(Decl::Fn(
                    esm_export().into_fn_decl(esm_export_ident.clone()),
                )),
                esm_export_ident
                    .as_call(DUMMY_SP, vec![exports.as_arg(), obj_lit.as_arg()])
                    .into_stmt(),
            ]
        }
    }
}

pub(crate) fn prop_name(key: &str, (span, _): SpanCtx) -> IdentOrStr {
    if is_valid_prop_ident(key) {
        IdentOrStr::Ident(IdentName::new(key.into(), span))
    } else {
        IdentOrStr::Str(quote_str!(span, key))
    }
}

pub(crate) enum IdentOrStr {
    Ident(IdentName),
    Str(Str),
}

impl From<IdentOrStr> for PropName {
    fn from(val: IdentOrStr) -> Self {
        match val {
            IdentOrStr::Ident(i) => Self::Ident(i),
            IdentOrStr::Str(s) => Self::Str(s),
        }
    }
}

impl From<IdentOrStr> for MemberProp {
    fn from(val: IdentOrStr) -> Self {
        match val {
            IdentOrStr::Ident(i) => Self::Ident(i),
            IdentOrStr::Str(s) => Self::Computed(ComputedPropName {
                span: DUMMY_SP,
                expr: s.into(),
            }),
        }
    }
}

/// ```javascript
/// {
///     key: function() {
///         return expr;
///     },
/// }
/// ```
pub(crate) fn prop_function((key, export_item): ExportKV) -> Prop {
    let key = prop_name(&key, export_item.export_name_span()).into();

    KeyValueProp {
        key,
        value: Box::new(
            export_item
                .into_local_ident()
                .into_lazy_fn(Default::default())
                .into_fn_expr(None)
                .into(),
        ),
    }
    .into()
}
