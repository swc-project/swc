use is_macro::Is;
use serde::{Deserialize, Serialize};
use swc_atoms::{js_word, JsWord};
use swc_cached::regex::CachedRegex;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    is_valid_prop_ident, member_expr, private_ident, quote_ident, quote_str, ExprFactory,
    FunctionFactory,
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
    member_expr!(DUMMY_SP, Object.defineProperty)
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

pub(super) fn clone_first_use_directive(stmts: &[ModuleItem]) -> Option<Stmt> {
    if stmts.is_empty() {
        return None;
    }

    stmts.iter().find_map(|item| match item {
        ModuleItem::Stmt(stmt @ Stmt::Expr(ExprStmt { expr, .. })) => match **expr {
            Expr::Lit(Lit::Str(Str { ref value, .. })) if value.starts_with("use ") => {
                Some(stmt.clone())
            }
            _ => None,
        },
        _ => None,
    })
}

pub(super) fn use_strict() -> Stmt {
    Lit::Str(quote_str!("use strict")).into_stmt()
}

/// Private `_exports` ident.
pub(super) struct Exports(pub Ident);

impl Default for Exports {
    fn default() -> Self {
        Exports(private_ident!("_exports"))
    }
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
        value: Box::new(all.clone().computed_member(Expr::from(name.clone()))),
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
            span: DUMMY_SP,
            stmts: vec![for_in_stmt],
        }),
        is_generator: false,
        is_async: false,
        type_params: None,
        return_type: None,
    }
}

pub(crate) fn emit_export_stmts(exports: Ident, mut prop_list: Vec<ObjPropKeyIdent>) -> Vec<Stmt> {
    match prop_list.len() {
        0 | 1 => prop_list
            .pop()
            .map(|obj_prop| {
                object_define_enumerable(
                    exports.as_arg(),
                    quote_str!(obj_prop.span(), obj_prop.key()).as_arg(),
                    prop_function((js_word!("get"), DUMMY_SP, obj_prop.2.clone()).into()).into(),
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

pub(crate) fn prop_name(key: &str, span: Span) -> IdentOrStr {
    if is_valid_prop_ident(key) {
        IdentOrStr::Ident(quote_ident!(span, key))
    } else {
        IdentOrStr::Str(quote_str!(span, key))
    }
}

pub(crate) enum IdentOrStr {
    Ident(Ident),
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

/// {
///     "key": ident,
/// }
pub(crate) struct ObjPropKeyIdent(JsWord, Span, Ident);

impl From<((JsWord, Span), Ident)> for ObjPropKeyIdent {
    fn from(((key, span), ident): ((JsWord, Span), Ident)) -> Self {
        Self(key, span, ident)
    }
}

impl From<(JsWord, Span, Ident)> for ObjPropKeyIdent {
    fn from((key, span, ident): (JsWord, Span, Ident)) -> Self {
        Self(key, span, ident)
    }
}

impl Spanned for ObjPropKeyIdent {
    fn span(&self) -> Span {
        self.1
    }
}

impl ObjPropKeyIdent {
    pub fn key(&self) -> &JsWord {
        &self.0
    }

    pub fn into_expr(self) -> Expr {
        self.2.into()
    }
}

/// ```javascript
/// {
///     key: function() {
///         return expr;
///     },
/// }
/// ```
pub(crate) fn prop_function(prop: ObjPropKeyIdent) -> Prop {
    let key = prop_name(prop.key(), prop.span()).into();

    KeyValueProp {
        key,
        value: Box::new(
            prop.into_expr()
                .into_lazy_fn(Default::default())
                .into_fn_expr(None)
                .into(),
        ),
    }
    .into()
}
