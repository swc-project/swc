use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, Span};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    dataset::is_generic_font_keyword,
    pattern::NamePattern,
    rule::{visitor_rule, LintRule, LintRuleContext},
    ConfigError,
};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FontFamilyNoDuplicateNamesConfig {
    ignore_font_family_names: Option<Vec<String>>,
}

pub fn font_family_no_duplicate_names(
    ctx: LintRuleContext<FontFamilyNoDuplicateNamesConfig>,
) -> Result<Box<dyn LintRule>, ConfigError> {
    let ignored = ctx
        .config()
        .ignore_font_family_names
        .clone()
        .unwrap_or_default()
        .into_iter()
        .map(NamePattern::try_from)
        .collect::<Result<_, _>>()?;
    Ok(visitor_rule(
        ctx.reaction(),
        FontFamilyNoDuplicateNames { ctx, ignored },
    ))
}

#[derive(Debug, Default)]
struct FontFamilyNoDuplicateNames {
    ctx: LintRuleContext<FontFamilyNoDuplicateNamesConfig>,
    ignored: Vec<NamePattern>,
}

impl FontFamilyNoDuplicateNames {
    fn check_component_values(&self, values: &[ComponentValue]) {
        let (mut fonts, last) = values.iter().fold(
            (
                Vec::with_capacity(values.len()),
                Option::<(String, Span)>::None,
            ),
            |(mut fonts, last_identifier), item| match item {
                ComponentValue::Ident(Ident { value, span, .. }) => {
                    if let Some((mut identifier, last_span)) = last_identifier {
                        identifier.push(' ');
                        identifier.push_str(value);
                        (fonts, Some((identifier, last_span.with_hi(span.hi()))))
                    } else {
                        (fonts, Some((value.to_string(), *span)))
                    }
                }
                ComponentValue::Str(Str { raw, span, .. }) => {
                    fonts.push((FontNameKind::from(raw), *span));
                    (fonts, None)
                }
                ComponentValue::Delimiter(Delimiter {
                    value: DelimiterValue::Comma,
                    ..
                }) => {
                    if let Some((identifier, span)) = last_identifier {
                        fonts.push((FontNameKind::from(identifier), span));
                    }
                    (fonts, None)
                }
                _ => (fonts, last_identifier),
            },
        );
        if let Some((identifier, span)) = last {
            fonts.push((FontNameKind::from(identifier), span));
        }

        fonts
            .iter()
            .fold(AHashSet::default(), |mut seen, (font, span)| {
                let name = font.name();
                if seen.contains(&font) && self.ignored.iter().all(|item| !item.is_match(name)) {
                    self.ctx
                        .report(span, format!("Unexpected duplicate name '{}'.", name));
                }
                seen.insert(font);
                seen
            });
    }
}

impl Visit for FontFamilyNoDuplicateNames {
    fn visit_declaration(&mut self, declaration: &Declaration) {
        match &declaration.name {
            DeclarationName::Ident(Ident { value, .. })
                if value.eq_str_ignore_ascii_case("font-family") =>
            {
                self.check_component_values(&declaration.value);
            }
            DeclarationName::Ident(Ident { value, .. })
                if value.eq_str_ignore_ascii_case("font") =>
            {
                let index = declaration
                    .value
                    .iter()
                    .enumerate()
                    .rev()
                    .find(|(_, item)| {
                        matches!(
                            item,
                            ComponentValue::Integer(..)
                                | ComponentValue::Number(..)
                                | ComponentValue::Percentage(..)
                                | ComponentValue::Dimension(..)
                                | ComponentValue::Ratio(..)
                                | ComponentValue::CalcSum(..)
                        )
                    })
                    .map(|(i, _)| i);
                if let Some(index) = index {
                    self.check_component_values(&declaration.value[(index + 1)..]);
                }
            }
            _ => {}
        }
        declaration.visit_children_with(self);
    }
}

#[derive(Hash, PartialEq, Eq)]
enum FontNameKind {
    Normal(String),
    Keyword(String),
}

impl FontNameKind {
    #[inline]
    fn name(&self) -> &str {
        match self {
            Self::Normal(name) => name.as_str(),
            Self::Keyword(name) => name.as_str(),
        }
    }
}

impl<S> From<S> for FontNameKind
where
    S: AsRef<str>,
{
    fn from(name: S) -> Self {
        if let Some(name) = name
            .as_ref()
            .strip_prefix('\'')
            .and_then(|name| name.strip_suffix('\''))
            .map(|name| name.trim())
        {
            if is_generic_font_keyword(name) {
                Self::Keyword(name.to_string())
            } else {
                Self::Normal(name.to_string())
            }
        } else if let Some(name) = name
            .as_ref()
            .strip_prefix('"')
            .and_then(|name| name.strip_suffix('"'))
            .map(|name| name.trim())
        {
            if is_generic_font_keyword(name) {
                Self::Keyword(name.to_string())
            } else {
                Self::Normal(name.to_string())
            }
        } else {
            Self::Normal(name.as_ref().trim().to_string())
        }
    }
}
