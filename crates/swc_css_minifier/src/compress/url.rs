use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_url() -> impl VisitMut {
    CompressUrl {}
}

struct CompressUrl {}

impl VisitMut for CompressUrl {
    fn visit_mut_url(&mut self, url: &mut Url) {
        url.visit_mut_children_with(self);

        if &*url.name.value.to_lowercase() != "url" {
            return;
        }

        if let Some(modifiers) = &url.modifiers {
            if !modifiers.is_empty() {
                return;
            }
        }

        if let Some(UrlValue::Str(Str { value, span, .. })) = &url.value {
            let mut escaped = String::new();
            let mut has_escaped = false;

            for char in value.chars() {
                match char {
                    '(' | ')' | '"' | '\'' => {
                        if has_escaped {
                            return;
                        }

                        has_escaped = true;
                        escaped.push('\\');
                        escaped.push(char)
                    }
                    _ if char::is_whitespace(char) => {
                        if has_escaped {
                            return;
                        }

                        has_escaped = true;
                        escaped.push('\\');
                        escaped.push(char)
                    }
                    _ => escaped.push(char),
                }
            }

            url.value = Some(UrlValue::Raw(UrlValueRaw {
                span: *span,
                before: "".into(),
                after: "".into(),
                value: escaped.clone().into(),
                raw: escaped.clone().into(),
            }));
        }
    }
}
