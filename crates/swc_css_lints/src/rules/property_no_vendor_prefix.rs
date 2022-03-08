use serde::{Deserialize, Serialize};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    dataset::strip_vendor_prefix,
    error::ConfigError,
    pattern::NamePattern,
    rule::{visitor_rule, LintRule, LintRuleContext},
};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PropertyNoVendorPrefixConfig {
    ignore_properties: Option<Vec<String>>,
}

pub fn property_no_vendor_prefix(
    ctx: LintRuleContext<PropertyNoVendorPrefixConfig>,
) -> Result<Box<dyn LintRule>, ConfigError> {
    let ignored = ctx
        .config()
        .ignore_properties
        .clone()
        .unwrap_or_default()
        .into_iter()
        .map(NamePattern::try_from)
        .collect::<Result<_, _>>()?;
    Ok(visitor_rule(
        ctx.reaction(),
        PropertyNoVendorPrefix { ctx, ignored },
    ))
}

#[derive(Debug, Default)]
struct PropertyNoVendorPrefix {
    ctx: LintRuleContext<PropertyNoVendorPrefixConfig>,

    ignored: Vec<NamePattern>,
}

impl Visit for PropertyNoVendorPrefix {
    fn visit_declaration(&mut self, declaration: &Declaration) {
        if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            match strip_vendor_prefix(&value.to_lowercase()) {
                Some(unprefix) if self.ignored.iter().all(|pat| !pat.is_match(unprefix)) => {
                    self.ctx.report(
                        &declaration.name,
                        format!("Unexpected vendor-prefix '{}'.", value),
                    );
                }
                _ => {}
            }
        }
        declaration.visit_children_with(self);
    }
}
