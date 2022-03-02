use std::ops::Deref;

use ahash::AHashSet;
use serde::{Deserialize, Serialize};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FontFamilyNoDuplicateNamesConfig {
    ignore_font_family_names: Option<Vec<String>>,
}

pub fn font_family_no_duplicate_names(
    ctx: LintRuleContext<FontFamilyNoDuplicateNamesConfig>,
) -> Box<dyn LintRule> {
    let ignored = ctx
        .config()
        .ignore_font_family_names
        .clone()
        .unwrap_or_default();
    visitor_rule(ctx.reaction(), FontFamilyNoDuplicateNames { ctx, ignored })
}

#[derive(Debug, Default)]
struct FontFamilyNoDuplicateNames {
    ctx: LintRuleContext<FontFamilyNoDuplicateNamesConfig>,
    ignored: Vec<String>,
}

impl Visit for FontFamilyNoDuplicateNames {
    fn visit_declaration(&mut self, declaration: &Declaration) {
        match &declaration.name {
            DeclarationName::Ident(Ident { value, .. })
                if value.eq_str_ignore_ascii_case("font-family") =>
            {
                declaration.value.iter().fold(
                    AHashSet::with_capacity(declaration.value.len()),
                    |mut fonts, item| {
                        let font = match item {
                            ComponentValue::Ident(Ident { value, .. }) => {
                                FontNameKind::from(value.deref())
                            }
                            ComponentValue::Str(Str { raw, .. }) => FontNameKind::from(raw.deref()),
                            _ => return fonts,
                        };
                        if fonts.contains(&font)
                            && self.ignored.iter().all(|item| font.name() != item)
                        {
                            self.ctx.report(
                                item,
                                format!("Unexpected duplicate name '{}'.", font.name()),
                            );
                        }
                        fonts.insert(font);
                        fonts
                    },
                );
            }
            DeclarationName::Ident(Ident { value, .. })
                if value.eq_str_ignore_ascii_case("font") =>
            {
                let comma_index = declaration
                    .value
                    .iter()
                    .enumerate()
                    .find(|(_, item)| {
                        matches!(
                            item,
                            ComponentValue::Delimiter(Delimiter {
                                value: DelimiterValue::Comma,
                                ..
                            })
                        )
                    })
                    .map(|(i, _)| i);
                if let Some(comma_index) = comma_index {
                    declaration
                        .value
                        .iter()
                        .skip((comma_index - 1) as usize)
                        .fold(
                            AHashSet::with_capacity(declaration.value.len()),
                            |mut fonts, item| {
                                let font = match item {
                                    ComponentValue::Ident(Ident { value, .. }) => {
                                        FontNameKind::from(value.deref())
                                    }
                                    ComponentValue::Str(Str { raw, .. }) => {
                                        FontNameKind::from(raw.deref())
                                    }
                                    _ => return fonts,
                                };
                                if fonts.contains(&font)
                                    && self.ignored.iter().all(|item| font.name() != item)
                                {
                                    self.ctx.report(
                                        item,
                                        format!("Unexpected duplicate name '{}'.", font.name()),
                                    );
                                }
                                fonts.insert(font);
                                fonts
                            },
                        );
                }
            }
            _ => {}
        }
        declaration.visit_children_with(self);
    }
}

#[derive(Hash, PartialEq, Eq)]
enum FontNameKind<'a> {
    Normal(&'a str),
    Keyword(&'a str),
}

impl<'a> FontNameKind<'a> {
    #[inline]
    fn name(&self) -> &str {
        match self {
            Self::Normal(name) => name,
            Self::Keyword(name) => name,
        }
    }
}

fn is_keyword(name: &str) -> bool {
    name.eq_ignore_ascii_case("serif")
        || name.eq_ignore_ascii_case("sans-serif")
        || name.eq_ignore_ascii_case("cursive")
        || name.eq_ignore_ascii_case("fantasy")
        || name.eq_ignore_ascii_case("monospace")
        || name.eq_ignore_ascii_case("system-ui")
}

impl<'a> From<&'a str> for FontNameKind<'a> {
    fn from(name: &'a str) -> Self {
        if let Some(name) = name
            .strip_prefix('\'')
            .and_then(|name| name.strip_suffix('\''))
            .map(|name| name.trim())
        {
            if is_keyword(name) {
                Self::Keyword(name)
            } else {
                Self::Normal(name)
            }
        } else if let Some(name) = name
            .strip_prefix('"')
            .and_then(|name| name.strip_suffix('"'))
            .map(|name| name.trim())
        {
            if is_keyword(name) {
                Self::Keyword(name)
            } else {
                Self::Normal(name)
            }
        } else {
            Self::Normal(name.trim())
        }
    }
}
