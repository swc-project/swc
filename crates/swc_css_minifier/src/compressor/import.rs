use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_import_prelude_href(&mut self, import_href: &mut ImportPreludeHref) {
        if let ImportPreludeHref::Url(Url {
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

            let new_value = match &mut **value {
                UrlValue::Str(Str { value, .. }) => value,
                UrlValue::Raw(UrlValueRaw { value, .. }) => value,
            };

            *import_href = ImportPreludeHref::Str(Str {
                span: *span,
                value: (&*new_value).into(),
                raw: None,
            });
        }
    }
}
