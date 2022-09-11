use std::fmt::Display;

use swc_atoms::JsWord;
use swc_common::collections::AHashSet;
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub fn no_duplicate_at_import_rules(ctx: LintRuleContext<()>) -> Box<dyn LintRule> {
    visitor_rule(
        ctx.reaction(),
        NoDuplicateAtImportRules {
            ctx,
            imports: Default::default(),
            import_at_rules: None,
        },
    )
}

fn build_message<S>(href: S) -> String
where
    S: AsRef<str> + Display,
{
    format!("Unexpected duplicate '@import' rule '{}'.", href)
}

#[derive(Debug, Default)]
struct NoDuplicateAtImportRules {
    ctx: LintRuleContext<()>,
    imports: AHashSet<(JsWord, Option<JsWord>)>,
    import_at_rules: Option<AtRule>,
}

impl Visit for NoDuplicateAtImportRules {
    fn visit_at_rule(&mut self, at_rule: &AtRule) {
        if let Some(AtRulePrelude::ImportPrelude(_)) = at_rule.prelude.as_deref() {
            self.import_at_rules = Some(at_rule.clone());

            at_rule.visit_children_with(self);

            self.import_at_rules = None;
        }
    }

    fn visit_import_prelude(&mut self, import_prelude: &ImportPrelude) {
        let href = match &*import_prelude.href {
            ImportPreludeHref::Str(Str { value, .. }) => value,
            ImportPreludeHref::Url(Url {
                value: Some(value), ..
            }) => match &**value {
                UrlValue::Raw(UrlValueRaw { value, .. }) => value,
                UrlValue::Str(Str { value, .. }) => value,
            },
            _ => {
                import_prelude.visit_children_with(self);

                return;
            }
        };

        if let Some(queries) = import_prelude.media.as_ref().map(|media| &media.queries) {
            queries.iter().fold(&mut self.imports, |imports, query| {
                let media = query.media_type.as_ref().map(|ident| {
                    let MediaType::Ident(Ident { value, .. }) = ident;

                    value.clone()
                });
                let pair = (href.clone(), media);

                if imports.contains(&pair) {
                    if let Some(at_rule) = &self.import_at_rules {
                        self.ctx.report(at_rule, build_message(href));
                    }
                }

                imports.insert(pair);
                imports
            });
        } else {
            let pair = (href.clone(), None);

            if self.imports.contains(&pair) {
                if let Some(at_rule) = &self.import_at_rules {
                    self.ctx.report(at_rule, build_message(href));
                }
            }

            self.imports.insert(pair);
        }

        import_prelude.visit_children_with(self);
    }
}
