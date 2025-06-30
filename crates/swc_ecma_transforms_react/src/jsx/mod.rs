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
mod development;
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

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AutomaticConfig {
    /// Import source for automatic runtime
    #[serde(default = "default_import_source")]
    pub import_source: Atom,
}

impl Default for AutomaticConfig {
    fn default() -> Self {
        Self {
            import_source: default_import_source(),
        }
    }
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(try_from = "RuntimeRaw")]
pub enum Runtime {
    Classic(ClassicConfig),
    Automatic(AutomaticConfig),
    Preserve,
}

impl Default for Runtime {
    fn default() -> Self {
        Runtime::Automatic(Default::default())
    }
}

impl Merge for Runtime {
    fn merge(&mut self, other: Self) {
        *self = other;
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeRaw {
    #[serde(default)]
    runtime: Option<String>,
    #[serde(default)]
    pragma: Option<BytesStr>,
    #[serde(default)]
    pragma_frag: Option<BytesStr>,
    #[serde(default)]
    import_source: Option<Atom>,
}

impl TryFrom<RuntimeRaw> for Runtime {
    type Error = String;

    fn try_from(raw: RuntimeRaw) -> Result<Self, Self::Error> {
        match raw.runtime.as_deref() {
            Some("automatic") => Ok(Runtime::Automatic(AutomaticConfig {
                import_source: raw.import_source.unwrap_or_else(default_import_source),
            })),
            Some("classic") => Ok(Runtime::Classic(ClassicConfig {
                pragma: raw.pragma.unwrap_or_else(default_pragma),
                pragma_frag: raw.pragma_frag.unwrap_or_else(default_pragma_frag),
            })),
            Some("preserve") => Ok(Runtime::Preserve),
            Some(other) => Err(format!(
                "unknown runtime variant `{other}`, expected one of `automatic`, `classic`, \
                 `preserve`"
            )),
            None => match (raw.pragma, raw.pragma_frag, raw.import_source) {
                (pragma @ Some(..), pragma_frag, None) | (pragma, pragma_frag @ Some(..), None) => {
                    Ok(Runtime::Classic(ClassicConfig {
                        pragma: pragma.unwrap_or_else(default_pragma),
                        pragma_frag: pragma_frag.unwrap_or_else(default_pragma_frag),
                    }))
                }
                (_, _, import_source) => Ok(Runtime::Automatic(AutomaticConfig {
                    import_source: import_source.unwrap_or_else(default_import_source),
                })),
            },
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, Merge)]
#[serde(try_from = "OptionsRaw")]
pub struct Options {
    #[serde(flatten)]
    pub runtime: Runtime,

    #[serde(flatten)]
    pub common: CommonConfig,

    #[serde(default, deserialize_with = "deserialize_refresh")]
    // default to disabled since this is still considered as experimental by now
    pub refresh: Option<RefreshOptions>,
}

impl TryFrom<&str> for Options {
    type Error = String;

    fn try_from(s: &str) -> Result<Self, Self::Error> {
        match s {
            "react" => Ok(Options {
                runtime: Runtime::Classic(ClassicConfig::default()),
                common: CommonConfig::default(),
                refresh: None,
            }),
            "react-jsx" => Ok(Options {
                runtime: Runtime::Automatic(AutomaticConfig::default()),
                common: CommonConfig::default(),
                refresh: None,
            }),
            "react-jsxdev" => Ok(Options {
                runtime: Runtime::Automatic(AutomaticConfig::default()),
                common: CommonConfig {
                    development: true.into(),
                    ..CommonConfig::default()
                },
                refresh: None,
            }),
            "preserve" | "react-native" => Ok(Options {
                runtime: Runtime::Preserve,
                common: CommonConfig::default(),
                refresh: None,
            }),
            other => Err(format!(
                "unknown preset `{other}`, expected one of `react`, `react-jsx`, `react-jsxdev`, \
                 `preserve`, `react-native`"
            )),
        }
    }
}

#[derive(Deserialize)]
#[serde(untagged)]
enum OptionsRaw {
    Preset(String),
    Object {
        #[serde(flatten)]
        runtime: Runtime,
        #[serde(flatten)]
        common: CommonConfig,
        #[serde(default, deserialize_with = "deserialize_refresh")]
        refresh: Option<RefreshOptions>,
    },
}

impl TryFrom<OptionsRaw> for Options {
    type Error = String;

    fn try_from(raw: OptionsRaw) -> Result<Self, Self::Error> {
        match raw {
            OptionsRaw::Preset(preset) => preset.as_str().try_into(),
            OptionsRaw::Object {
                runtime,
                common,
                refresh,
            } => Ok(Options {
                runtime,
                common,
                refresh,
            }),
        }
    }
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
    unresolved_mark: swc_common::Mark,
) -> (impl swc_ecma_ast::Pass, impl swc_ecma_ast::Pass)
where
    C: swc_common::comments::Comments + Clone + 'static,
{
    options.runtime = parse_directives(options.runtime, comments.clone());

    let Options {
        runtime, common, ..
    } = options;

    match runtime {
        Runtime::Automatic(config) => (
            None,
            Some(automatic(
                config,
                common,
                unresolved_mark,
                comments.clone(),
                cm.clone(),
            )),
        ),
        Runtime::Classic(config) => (
            Some(classic(config, common, comments.clone(), cm.clone())),
            None,
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
