use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_at_rule() -> impl VisitMut {
    CompressAtRule {
        stylesheet_has_non_ascii_characters: false,
    }
}

struct CompressAtRule {
    stylesheet_has_non_ascii_characters: bool,
}

impl VisitMut for CompressAtRule {
    fn visit_mut_token_and_span(&mut self, token_and_span: &mut TokenAndSpan) {
        token_and_span.visit_mut_children_with(self);

        if !self.stylesheet_has_non_ascii_characters {
            match &token_and_span.token {
                Token::Ident { value, .. }
                | Token::Function { value, .. }
                | Token::AtKeyword { value, .. }
                | Token::String { value, .. }
                | Token::BadString { value, .. }
                | Token::Dimension { unit: value, .. }
                    if !contains_only_ascii_characters(value) =>
                {
                    self.stylesheet_has_non_ascii_characters = true;
                }
                _ => {}
            }
        }
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        ident.visit_mut_children_with(self);

        if !self.stylesheet_has_non_ascii_characters {
            self.stylesheet_has_non_ascii_characters =
                !contains_only_ascii_characters(&ident.value);
        }
    }

    fn visit_mut_custom_ident(&mut self, custom_ident: &mut CustomIdent) {
        custom_ident.visit_mut_children_with(self);

        if !self.stylesheet_has_non_ascii_characters {
            self.stylesheet_has_non_ascii_characters =
                !contains_only_ascii_characters(&custom_ident.value);
        }
    }

    fn visit_mut_dashed_ident(&mut self, dashed_ident: &mut DashedIdent) {
        dashed_ident.visit_mut_children_with(self);

        if !self.stylesheet_has_non_ascii_characters {
            self.stylesheet_has_non_ascii_characters =
                !contains_only_ascii_characters(&dashed_ident.value);
        }
    }

    fn visit_mut_str(&mut self, string: &mut Str) {
        string.visit_mut_children_with(self);

        if !self.stylesheet_has_non_ascii_characters {
            self.stylesheet_has_non_ascii_characters =
                !contains_only_ascii_characters(&string.value);
        }
    }

    fn visit_mut_custom_property_name(&mut self, custom_property_name: &mut CustomPropertyName) {
        custom_property_name.visit_mut_children_with(self);

        if !self.stylesheet_has_non_ascii_characters {
            self.stylesheet_has_non_ascii_characters =
                !contains_only_ascii_characters(&custom_property_name.value);
        }
    }

    fn visit_mut_stylesheet(&mut self, stylesheet: &mut Stylesheet) {
        stylesheet.visit_mut_children_with(self);

        if !self.stylesheet_has_non_ascii_characters {
            match stylesheet.rules.get(0) {
                Some(Rule::AtRule(AtRule {
                    prelude: Some(AtRulePrelude::CharsetPrelude(Str { value, .. })),
                    ..
                })) if value.as_ref().eq_ignore_ascii_case("utf-8") => {
                    stylesheet.rules.remove(0);
                }
                _ => {}
            }
        }
    }

    fn visit_mut_import_prelude_href(&mut self, import_href: &mut ImportPreludeHref) {
        import_href.visit_mut_children_with(self);

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

            let new_value = match value {
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

fn contains_only_ascii_characters(string: &str) -> bool {
    string.chars().all(|c: char| c.is_ascii())
}
