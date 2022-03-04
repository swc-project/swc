use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_at_rule() -> impl VisitMut {
    CompressAtRule {}
}

struct CompressAtRule {}

impl VisitMut for CompressAtRule {
    fn visit_mut_import_href(&mut self, import_href: &mut ImportHref) {
        import_href.visit_mut_children_with(self);

        if let ImportHref::Url(Url {
            value: Some(value),
            modifiers,
            span,
            ..
        }) = import_href
        {
            if let Some(modifiers) = modifiers {
                if !modifiers.is_empty() {
                    return;
                }
            }

            let new_value = match value {
                UrlValue::Str(Str { value, .. }) => value,
                UrlValue::Raw(UrlValueRaw { value, .. }) => value,
            };

            *import_href = ImportHref::Str(Str {
                span: *span,
                value: (&*new_value).into(),
                raw: (&*new_value).into(),
            });
        }
    }
}
