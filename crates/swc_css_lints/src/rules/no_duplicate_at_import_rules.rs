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
}

impl Visit for NoDuplicateAtImportRules {
    fn visit_stylesheet(&mut self, stylesheet: &Stylesheet) {
        self.imports = Default::default();
        stylesheet.visit_children_with(self);
    }

    fn visit_import_rule(&mut self, import_rule: &ImportRule) {
        let href = match &import_rule.href {
            ImportHref::Str(Str { value, .. }) => value,
            ImportHref::Url(Url {
                value: Some(value), ..
            }) => match value {
                UrlValue::Raw(UrlValueRaw { value, .. }) => value,
                UrlValue::Str(Str { value, .. }) => value,
            },
            _ => {
                import_rule.visit_children_with(self);
                return;
            }
        };

        if let Some(queries) = import_rule.media.as_ref().map(|media| &media.queries) {
            queries.iter().fold(&mut self.imports, |imports, query| {
                let media = query.media_type.as_ref().map(|ident| ident.value.clone());
                let pair = (href.clone(), media);

                if imports.contains(&pair) {
                    self.ctx.report(import_rule, build_message(href));
                }

                imports.insert(pair);
                imports
            });
        } else {
            let pair = (href.clone(), None);

            if self.imports.contains(&pair) {
                self.ctx.report(import_rule, build_message(href));
            }

            self.imports.insert(pair);
        }

        import_rule.visit_children_with(self);
    }
}
