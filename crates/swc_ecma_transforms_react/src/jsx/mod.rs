#![allow(clippy::redundant_allocation)]

use std::borrow::Cow;

use bytes_str::BytesStr;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use swc_atoms::{atom, Atom};
use swc_common::{iter::IdentifyLast, Spanned};
use swc_config::{merge::Merge, types::BoolConfig};
use swc_ecma_ast::*;

use self::static_check::should_use_create_element;
use crate::refresh::options::{deserialize_refresh, RefreshOptions};

mod automatic;
mod classic;
mod parse_directives;
mod static_check;

pub use automatic::automatic;
pub use classic::{classic, parse_expr_for_jsx};
pub use parse_directives::parse_directives;

#[cfg(test)]
mod tests;

#[derive(Debug, Default, Clone, Copy, Deserialize, Serialize, Merge)]
#[serde(rename_all = "camelCase")]
pub struct CommonConfig {
    #[serde(default)]
    pub development: BoolConfig<false>,
    #[serde(default)]
    pub pure: BoolConfig<true>,
    #[serde(default)]
    pub throw_if_namespace: BoolConfig<true>,
}

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AutomaticConfig {
    /// Import source for automatic runtime
    #[serde(default = "default_import_source")]
    pub import_source: Atom,
}

/// Configuration for classic JSX runtime transformation
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ClassicConfig {
    /// The pragma for JSX elements (e.g., "React.createElement")
    #[serde(default = "default_pragma")]
    pub pragma: BytesStr,

    /// The pragma for JSX fragments (e.g., "React.Fragment")
    #[serde(default = "default_pragma_frag")]
    pub pragma_frag: BytesStr,
}

impl Default for ClassicConfig {
    fn default() -> Self {
        Self {
            pragma: default_pragma(),
            pragma_frag: default_pragma_frag(),
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub enum Runtime {
    Classic(ClassicConfig),
    Automatic(AutomaticConfig),
    Preserve,
}

impl Default for Runtime {
    // [TODO]: change to automatic runtime
    fn default() -> Self {
        Runtime::Classic(Default::default())
    }
}

impl Merge for Runtime {
    fn merge(&mut self, other: Self) {
        *self = other;
    }
}

impl<'de> Deserialize<'de> for Runtime {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        use std::fmt;

        use serde::de::{Error, Visitor};

        struct RuntimeVisitor;

        impl<'de> Visitor<'de> for RuntimeVisitor {
            type Value = Runtime;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("a string or an object for runtime configuration")
            }

            fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
            where
                E: Error,
            {
                match value {
                    "automatic" => Ok(Runtime::Automatic(AutomaticConfig::default())),
                    "classic" => Ok(Runtime::Classic(ClassicConfig::default())),
                    "preserve" => Ok(Runtime::Preserve),
                    _ => Err(Error::unknown_variant(
                        value,
                        &["automatic", "classic", "preserve"],
                    )),
                }
            }

            fn visit_map<A>(self, map: A) -> Result<Self::Value, A::Error>
            where
                A: serde::de::MapAccess<'de>,
            {
                #[derive(Deserialize)]
                #[serde(rename_all = "camelCase")]
                struct ConfigHelper {
                    runtime: Option<String>,
                    pragma: Option<BytesStr>,
                    pragma_frag: Option<BytesStr>,
                    import_source: Option<Atom>,
                }

                let helper: ConfigHelper =
                    Deserialize::deserialize(serde::de::value::MapAccessDeserializer::new(map))?;

                match helper.runtime.as_deref() {
                    Some("automatic") => {
                        let config = AutomaticConfig {
                            import_source: helper
                                .import_source
                                .unwrap_or_else(default_import_source),
                        };
                        Ok(Runtime::Automatic(config))
                    }
                    Some("classic") => {
                        let config = ClassicConfig {
                            pragma: helper.pragma.unwrap_or_else(default_pragma),
                            pragma_frag: helper.pragma_frag.unwrap_or_else(default_pragma_frag),
                        };
                        Ok(Runtime::Classic(config))
                    }
                    Some("preserve") => Ok(Runtime::Preserve),
                    Some(other) => Err(Error::unknown_variant(
                        other,
                        &["automatic", "classic", "preserve"],
                    )),
                    None => {
                        if let Some(import_source) = helper.import_source {
                            let config = AutomaticConfig { import_source };
                            Ok(Runtime::Automatic(config))
                        } else {
                            let config = ClassicConfig {
                                pragma: helper.pragma.unwrap_or_else(default_pragma),
                                pragma_frag: helper.pragma_frag.unwrap_or_else(default_pragma_frag),
                            };
                            Ok(Runtime::Classic(config))
                        }
                    }
                }
            }
        }

        deserializer.deserialize_any(RuntimeVisitor)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, Merge)]
pub struct Options {
    #[serde(flatten)]
    pub runtime: Runtime,

    #[serde(flatten)]
    pub common: CommonConfig,

    #[serde(default, deserialize_with = "deserialize_refresh")]
    // default to disabled since this is still considered as experimental by now
    pub refresh: Option<RefreshOptions>,
}

#[cfg(feature = "concurrent")]
macro_rules! static_str {
    ($s:expr) => {{
        static VAL: Lazy<BytesStr> = Lazy::new(|| $s.into());
        VAL.clone()
    }};
}

#[cfg(not(feature = "concurrent"))]
macro_rules! static_str {
    ($s:expr) => {
        $s.into()
    };
}

pub fn default_import_source() -> Atom {
    atom!("react")
}

pub fn default_pragma() -> BytesStr {
    static_str!("React.createElement")
}

pub fn default_pragma_frag() -> BytesStr {
    static_str!("React.Fragment")
}

#[inline]
pub(crate) fn jsx_text_to_str(t: Atom) -> Atom {
    let mut buf = String::new();
    let replaced = t.replace('\t', " ");

    for (is_last, (i, line)) in replaced.lines().enumerate().identify_last() {
        if line.is_empty() {
            continue;
        }
        let line = Cow::from(line);
        let line = if i != 0 {
            Cow::Borrowed(line.trim_start_matches(' '))
        } else {
            line
        };
        let line = if is_last {
            line
        } else {
            Cow::Borrowed(line.trim_end_matches(' '))
        };
        if line.is_empty() {
            continue;
        }
        if i != 0 && !buf.is_empty() {
            buf.push(' ')
        }
        buf.push_str(&line);
    }
    buf.into()
}

pub fn jsx<C>(
    cm: swc_common::sync::Lrc<swc_common::SourceMap>,
    comments: Option<C>,
    mut options: Options,
    top_level_mark: swc_common::Mark,
    unresolved_mark: swc_common::Mark,
) -> impl swc_ecma_ast::Pass
where
    C: swc_common::comments::Comments + Clone + 'static,
{
    options.runtime = parse_directives(options.runtime, comments.clone());

    let Options {
        runtime, common, ..
    } = options;

    match runtime {
        Runtime::Automatic(config) => (
            Some(automatic(config, common, unresolved_mark, comments.clone())),
            None,
        ),
        Runtime::Classic(config) => (
            None,
            Some(classic(
                config,
                common,
                top_level_mark,
                comments.clone(),
                cm.clone(),
            )),
        ),
        Runtime::Preserve => (None, None),
    }
}

/// Transform JSX attribute string by handling escape sequences and whitespace
pub(crate) fn transform_jsx_attr_str(v: &str) -> String {
    let single_quote = false;
    let mut buf = String::with_capacity(v.len());
    let mut iter = v.chars().peekable();

    while let Some(c) = iter.next() {
        match c {
            '\u{0008}' => buf.push_str("\\b"),
            '\u{000c}' => buf.push_str("\\f"),
            ' ' => buf.push(' '),

            '\n' | '\r' | '\t' => {
                buf.push(' ');

                while let Some(' ') = iter.peek() {
                    iter.next();
                }
            }
            '\u{000b}' => buf.push_str("\\v"),
            '\0' => buf.push_str("\\x00"),

            '\'' if single_quote => buf.push_str("\\'"),
            '"' if !single_quote => buf.push('\"'),

            '\x01'..='\x0f' | '\x10'..='\x1f' => {
                buf.push(c);
            }

            '\x20'..='\x7e' => {
                //
                buf.push(c);
            }
            '\u{7f}'..='\u{ff}' => {
                buf.push(c);
            }

            _ => {
                buf.push(c);
            }
        }
    }

    buf
}

/// Convert JSX element name to expression
pub(crate) fn jsx_name(name: JSXElementName, throw_if_namespace: bool) -> Box<Expr> {
    let span = name.span();
    match name {
        JSXElementName::Ident(i) => {
            if i.sym == "this" {
                return ThisExpr { span }.into();
            }

            // If it starts with lowercase
            if i.as_ref().starts_with(|c: char| c.is_ascii_lowercase()) {
                Lit::Str(Str {
                    span,
                    raw: None,
                    value: i.sym,
                })
                .into()
            } else {
                i.into()
            }
        }
        JSXElementName::JSXNamespacedName(JSXNamespacedName {
            ref ns, ref name, ..
        }) => {
            if throw_if_namespace {
                swc_common::errors::HANDLER.with(|handler| {
                    handler
                        .struct_span_err(
                            span,
                            "JSX Namespace is disabled by default because react does not support \
                             it yet. You can specify jsc.transform.react.throwIfNamespace to \
                             false to override default behavior",
                        )
                        .emit()
                });
            }

            let value = format!("{}:{}", ns.sym, name.sym);

            Lit::Str(Str {
                span,
                raw: None,
                value: value.into(),
            })
            .into()
        }
        JSXElementName::JSXMemberExpr(JSXMemberExpr { obj, prop, .. }) => {
            fn convert_obj(obj: JSXObject) -> Box<Expr> {
                let span = obj.span();

                (match obj {
                    JSXObject::Ident(i) => {
                        if i.sym == "this" {
                            Expr::This(ThisExpr { span })
                        } else {
                            i.into()
                        }
                    }
                    JSXObject::JSXMemberExpr(e) => MemberExpr {
                        span,
                        obj: convert_obj(e.obj),
                        prop: MemberProp::Ident(e.prop),
                    }
                    .into(),
                })
                .into()
            }
            MemberExpr {
                span,
                obj: convert_obj(obj),
                prop: MemberProp::Ident(prop),
            }
            .into()
        }
    }
}
