#![allow(clippy::redundant_allocation)]

use bytes_str::BytesStr;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use swc_atoms::{atom, Atom};
use swc_common::Spanned;
use swc_config::{merge::Merge, types::BoolConfig};
use swc_ecma_ast::*;
use swc_ecma_utils::str::is_line_terminator;

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

/// https://github.com/microsoft/TypeScript/blob/9e20e032effad965567d4a1e1c30d5433b0a3332/src/compiler/transformers/jsx.ts#L572-L608
///
/// JSX trims whitespace at the end and beginning of lines, except that the
/// start/end of a tag is considered a start/end of a line only if that line is
/// on the same line as the closing tag. See examples in
/// tests/cases/conformance/jsx/tsxReactEmitWhitespace.tsx
/// See also https://www.w3.org/TR/html4/struct/text.html#h-9.1 and https://www.w3.org/TR/CSS2/text.html#white-space-model
///
/// An equivalent algorithm would be:
/// - If there is only one line, return it.
/// - If there is only whitespace (but multiple lines), return `undefined`.
/// - Split the text into lines.
/// - 'trimRight' the first line, 'trimLeft' the last line, 'trim' middle lines.
/// - Decode entities on each line (individually).
/// - Remove empty lines and join the rest with " ".
#[inline]
pub(crate) fn jsx_text_to_str(t: &str) -> Atom {
    let mut acc: Option<String> = None;
    let mut only_line: Option<&str> = None;
    let mut first_non_whitespace: Option<usize> = Some(0);
    let mut last_non_whitespace: Option<usize> = None;

    for (index, c) in t.char_indices() {
        if is_line_terminator(c) {
            if let (Some(first), Some(last)) = (first_non_whitespace, last_non_whitespace) {
                let line_text = &t[first..last];
                add_line_of_jsx_text(line_text, &mut acc, &mut only_line);
            }
            first_non_whitespace = None;
        } else if !is_white_space_single_line(c) {
            last_non_whitespace = Some(index + c.len_utf8());
            if first_non_whitespace.is_none() {
                first_non_whitespace.replace(index);
            }
        }
    }

    if let Some(first) = first_non_whitespace {
        let line_text = &t[first..];
        add_line_of_jsx_text(line_text, &mut acc, &mut only_line);
    }

    if let Some(acc) = acc {
        acc.into()
    } else if let Some(only_line) = only_line {
        only_line.into()
    } else {
        "".into()
    }
}

/// [TODO]: Re-validate this whitespace handling logic.
///
/// We cannot use [swc_ecma_utils::str::is_white_space_single_line] because
/// HTML entities (like `&nbsp;` → `\u{00a0}`) are pre-processed by the parser,
/// making it impossible to distinguish them from literal Unicode characters. We
/// should never trim HTML entities.
///
/// As a reference, Babel only trims regular spaces and tabs, so this is a
/// simplified implementation already in use.
/// https://github.com/babel/babel/blob/e5c8dc7330cb2f66c37637677609df90b31ff0de/packages/babel-types/src/utils/react/cleanJSXElementLiteralChild.ts#L28-L39
fn is_white_space_single_line(c: char) -> bool {
    matches!(c, ' ' | '\t')
}

// less allocations trick from OXC
// https://github.com/oxc-project/oxc/blob/4c35f4abb6874bd741b84b34df7889637425e9ea/crates/oxc_transformer/src/jsx/jsx_impl.rs#L1061-L1091
fn add_line_of_jsx_text<'a>(
    trimmed_line: &'a str,
    acc: &mut Option<String>,
    only_line: &mut Option<&'a str>,
) {
    if let Some(buffer) = acc.as_mut() {
        // Already some text in accumulator. Push a space before this line is added to
        // `acc`.
        buffer.push(' ');
    } else if let Some(only_line_content) = only_line.take() {
        // This is the 2nd line containing text. Previous line did not contain any HTML
        // entities. Generate an accumulator containing previous line and a
        // trailing space. Current line will be added to the accumulator after
        // it.
        let mut buffer = String::with_capacity(trimmed_line.len() * 2); // rough estimate
        buffer.push_str(only_line_content);
        buffer.push(' ');
        *acc = Some(buffer);
    }

    // [TODO]: Decode any HTML entities in this line

    // For now, just use the trimmed line directly
    if let Some(buffer) = acc.as_mut() {
        buffer.push_str(trimmed_line);
    } else {
        // This is the first line containing text, and there are no HTML entities in
        // this line. Record this line in `only_line`.
        // If this turns out to be the only line, we won't need to construct a String,
        // so avoid all copying.
        *only_line = Some(trimmed_line);
    }
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
