use swc_atoms::js_word;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_url(&self, url: &mut Url) {
        if url.name.value != js_word!("url") {
            return;
        }

        if let Some(modifiers) = &url.modifiers {
            if !modifiers.is_empty() {
                return;
            }
        }

        if let Some(UrlValue::Str(Str { value, span, .. })) = url.value.as_deref() {
            let mut escaped = String::with_capacity(value.len());
            let mut has_escaped = false;

            for c in value.chars() {
                match c {
                    '(' | ')' | '"' | '\'' => {
                        if has_escaped {
                            return;
                        }

                        has_escaped = true;
                        escaped.push('\\');
                        escaped.push(c)
                    }
                    _ if c.is_whitespace() => {
                        if has_escaped {
                            return;
                        }

                        has_escaped = true;
                        escaped.push('\\');
                        escaped.push(c)
                    }
                    _ => escaped.push(c),
                }
            }

            url.value = Some(Box::new(UrlValue::Raw(UrlValueRaw {
                span: *span,
                value: escaped.into(),
                raw: None,
            })));
        }
    }
}
