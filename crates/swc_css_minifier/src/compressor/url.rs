use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_url(&self, url: &mut Url) {
        if url.name.value != "url" {
            return;
        }

        if let Some(modifiers) = &url.modifiers {
            if !modifiers.is_empty() {
                return;
            }
        }

        if let Some(UrlValue::Str(Str { value, span, .. })) = url.value.as_deref() {
            let mut counter = 0;

            for c in value.chars() {
                if counter == 2 {
                    return;
                }

                match c {
                    '(' | ')' | '"' | '\'' => {
                        counter += 1;
                    }
                    _ if c.is_whitespace() => {
                        counter += 1;
                    }
                    _ => {}
                }
            }

            url.value = Some(Box::new(UrlValue::Raw(UrlValueRaw {
                span: *span,
                value: value.clone(),
                raw: None,
            })));
        }
    }
}
