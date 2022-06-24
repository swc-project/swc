use inflector::Inflector;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_cached::regex::CachedRegex;
use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    is_valid_prop_ident, member_expr, private_ident, quote_ident, quote_str, ExprFactory,
    FunctionFactory,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub strict: bool,
    #[serde(default = "default_strict_mode")]
    pub strict_mode: bool,
    #[serde(default)]
    pub lazy: Lazy,
    #[serde(default)]
    pub no_interop: bool,
    #[serde(default)]
    pub ignore_dynamic: bool,
    #[serde(default)]
    pub preserve_import_meta: bool,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            strict: false,
            strict_mode: default_strict_mode(),
            lazy: Lazy::default(),
            no_interop: false,
            ignore_dynamic: false,
            preserve_import_meta: false,
        }
    }
}

const fn default_strict_mode() -> bool {
    true
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
    if !src.contains('/') {
        return format!("_{}", src.to_camel_case()).into();
    }

    format!("_{}", src.split('/').last().unwrap().to_camel_case()).into()
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

pub(super) fn has_use_strict(stmts: &[ModuleItem]) -> bool {
    if stmts.is_empty() {
        return false;
    }

    if let ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) = stmts.first().unwrap() {
        if let Expr::Lit(Lit::Str(Str { ref value, .. })) = &**expr {
            return value == "use strict";
        }
    }

    false
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
                prop,
                PropOrSpread::Prop(Box::new(
                    KeyValueProp {
                        key: quote_ident!("enumerable").into(),
                        value: Box::new(true.into()),
                    }
                    .into(),
                )),
            ],
        }
        .as_arg(),
    )
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

/// ```javascript
/// {
///     key: () => expr,
/// }
/// ```
pub(crate) fn prop_arrow((key, span, expr): (JsWord, Span, Expr)) -> Prop {
    let key = prop_name(&key, span).into();

    KeyValueProp {
        key,
        value: Box::new(expr.into_lazy_arrow(Default::default()).into()),
    }
    .into()
}

/// ```javascript
/// {
///     key() {
///         return expr;
///     },
/// }
/// ```
pub(crate) fn prop_method((key, span, expr): (JsWord, Span, Expr)) -> Prop {
    let key = prop_name(&key, span).into();

    expr.into_lazy_fn(Default::default())
        .into_method_prop(key)
        .into()
}

/// ```javascript
/// {
///     key: function() {
///         return expr;
///     },
/// }
/// ```
pub(crate) fn prop_function((key, span, expr): (JsWord, Span, Expr)) -> Prop {
    let key = prop_name(&key, span).into();

    KeyValueProp {
        key,
        value: Box::new(
            expr.into_lazy_fn(Default::default())
                .into_fn_expr(None)
                .into(),
        ),
    }
    .into()
}

#[macro_export]
macro_rules! caniuse {
    ($feature_set:ident . $feature:ident) => {
        $feature_set
            .borrow()
            .contains(&swc_ecma_transforms_base::feature::Feature::$feature)
    };
}
