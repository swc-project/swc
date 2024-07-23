#![deny(clippy::all)]
#![allow(clippy::needless_update)]
#![allow(non_local_definitions)]

pub use std::fmt::Result;
use std::{borrow::Cow, str, str::from_utf8};

use serde::{Deserialize, Serialize};
use swc_common::{BytePos, Span, Spanned, DUMMY_SP};
use swc_css_ast::*;
use swc_css_codegen_macros::emitter;
use swc_css_utils::serialize_ident;
use writer::CssWriter;

pub use self::emit::*;
use self::{ctx::Ctx, list::ListFormat};

#[macro_use]
mod macros;
mod ctx;
mod emit;
mod list;
pub mod writer;

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CodegenConfig {
    #[serde(default)]
    pub minify: bool,
}

#[derive(Debug)]
pub struct CodeGenerator<W>
where
    W: CssWriter,
{
    wr: W,
    config: CodegenConfig,
    ctx: Ctx,
}

impl<W> CodeGenerator<W>
where
    W: CssWriter,
{
    pub fn new(wr: W, config: CodegenConfig) -> Self {
        CodeGenerator {
            wr,
            config,
            ctx: Default::default(),
        }
    }

    #[emitter]
    fn emit_stylesheet(&mut self, n: &Stylesheet) -> Result {
        self.emit_list(
            &n.rules,
            if self.config.minify {
                ListFormat::NotDelimited
            } else {
                ListFormat::NotDelimited | ListFormat::MultiLine
            },
        )?;
    }

    #[emitter]
    fn emit_rule(&mut self, n: &Rule) -> Result {
        match n {
            Rule::QualifiedRule(n) => emit!(self, n),
            Rule::AtRule(n) => emit!(self, n),
            Rule::ListOfComponentValues(n) => {
                emit!(
                    &mut *self.with_ctx(Ctx {
                        in_list_of_component_values: true,
                        ..self.ctx
                    }),
                    n
                )
            }
        }
    }

    #[emitter]
    fn emit_qualified_rule(&mut self, n: &QualifiedRule) -> Result {
        emit!(self, n.prelude);
        emit!(self, n.block);
    }

    #[emitter]
    fn emit_qualified_rule_prelude(&mut self, n: &QualifiedRulePrelude) -> Result {
        match n {
            QualifiedRulePrelude::SelectorList(n) => {
                emit!(self, n);
                formatting_space!(self);
            }
            QualifiedRulePrelude::RelativeSelectorList(n) => {
                emit!(self, n);
                formatting_space!(self);
            }
            QualifiedRulePrelude::ListOfComponentValues(n) => {
                emit!(
                    &mut *self.with_ctx(Ctx {
                        in_list_of_component_values: true,
                        ..self.ctx
                    }),
                    n
                )
            }
        }
    }

    #[emitter]
    fn emit_at_rule(&mut self, n: &AtRule) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), "@");
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );

        if let Some(prelude) = &n.prelude {
            emit!(
                &mut *self.with_ctx(Ctx {
                    in_single_line_selectors: true,
                    ..self.ctx
                }),
                prelude
            );
        }

        if n.block.is_some() {
            match n.prelude.as_deref() {
                Some(AtRulePrelude::ListOfComponentValues(_)) | None => {}
                _ => {
                    formatting_space!(self);
                }
            }

            emit!(self, n.block)
        } else {
            semi!(self);
        }
    }

    #[emitter]
    fn emit_at_rule_name(&mut self, n: &AtRuleName) -> Result {
        match n {
            AtRuleName::Ident(n) => emit!(self, n),
            AtRuleName::DashedIdent(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_at_rule_prelude(&mut self, n: &AtRulePrelude) -> Result {
        match n {
            AtRulePrelude::CharsetPrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::PropertyPrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::CounterStylePrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::ColorProfilePrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::DocumentPrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::FontPaletteValuesPrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::FontFeatureValuesPrelude(n) => {
                let need_space = !matches!(n.font_family.first(), Some(FamilyName::Str(_)));

                if need_space {
                    space!(self);
                } else {
                    formatting_space!(self);
                }

                emit!(self, n);
            }
            AtRulePrelude::NestPrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::KeyframesPrelude(n) => {
                match n {
                    KeyframesName::Str(_) => {
                        formatting_space!(self);
                    }
                    KeyframesName::CustomIdent(_)
                    | KeyframesName::PseudoPrefix(_)
                    | KeyframesName::PseudoFunction(_) => {
                        space!(self);
                    }
                }

                emit!(self, n);
            }
            AtRulePrelude::ImportPrelude(n) => {
                match &*n.href {
                    ImportHref::Url(_) => {
                        space!(self);
                    }
                    ImportHref::Str(_) => {
                        formatting_space!(self);
                    }
                }

                emit!(self, n);
            }
            AtRulePrelude::NamespacePrelude(n) => emit!(self, n),
            AtRulePrelude::MediaPrelude(n) => {
                let need_space = match n.queries.first() {
                    Some(media_query)
                        if media_query.modifier.is_none() && media_query.media_type.is_none() =>
                    {
                        match media_query.condition.as_deref() {
                            Some(MediaConditionType::All(media_condition)) => !matches!(
                                media_condition.conditions.first(),
                                Some(MediaConditionAllType::MediaInParens(
                                    MediaInParens::MediaCondition(_)
                                )) | Some(MediaConditionAllType::MediaInParens(
                                    MediaInParens::Feature(_)
                                )) | Some(MediaConditionAllType::MediaInParens(
                                    MediaInParens::GeneralEnclosed(GeneralEnclosed::SimpleBlock(_))
                                ))
                            ),
                            _ => true,
                        }
                    }
                    _ => true,
                };

                if need_space {
                    space!(self);
                } else {
                    formatting_space!(self);
                }

                emit!(self, n);
            }
            AtRulePrelude::SupportsPrelude(n) => {
                let need_space = !matches!(
                    n.conditions.first(),
                    Some(SupportsConditionType::SupportsInParens(
                        SupportsInParens::SupportsCondition(_)
                    )) | Some(SupportsConditionType::SupportsInParens(
                        SupportsInParens::Feature(SupportsFeature::Declaration(_))
                    )) | Some(SupportsConditionType::SupportsInParens(
                        SupportsInParens::GeneralEnclosed(GeneralEnclosed::SimpleBlock(_)),
                    ))
                );

                if need_space {
                    space!(self);
                } else {
                    formatting_space!(self);
                }

                emit!(self, n);
            }
            AtRulePrelude::PagePrelude(n) => {
                match n.selectors.first() {
                    Some(page_selector) if page_selector.page_type.is_none() => {
                        formatting_space!(self);
                    }
                    _ => {
                        space!(self);
                    }
                }

                emit!(self, n);
            }
            AtRulePrelude::LayerPrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::ContainerPrelude(n) => {
                let need_space = match n.name {
                    Some(_) => true,
                    _ => !matches!(
                        n.query.queries.first(),
                        Some(ContainerQueryType::QueryInParens(
                            QueryInParens::ContainerQuery(_,)
                        )) | Some(ContainerQueryType::QueryInParens(
                            QueryInParens::SizeFeature(_)
                        )) | Some(ContainerQueryType::QueryInParens(
                            QueryInParens::GeneralEnclosed(GeneralEnclosed::SimpleBlock(_)),
                        ))
                    ),
                };

                if need_space {
                    space!(self);
                } else {
                    formatting_space!(self);
                }

                emit!(self, n);
            }
            AtRulePrelude::CustomMediaPrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::ListOfComponentValues(n) => {
                emit!(
                    &mut *self.with_ctx(Ctx {
                        in_list_of_component_values: true,
                        ..self.ctx
                    }),
                    n
                )
            }
            AtRulePrelude::ScopePrelude(n) => {
                emit!(self, n);
            }
        }
    }

    #[emitter]
    fn emit_list_of_component_values(&mut self, n: &ListOfComponentValues) -> Result {
        self.emit_list_of_component_values_inner(
            &n.children,
            ListFormat::SpaceDelimited | ListFormat::SingleLine,
        )?;
    }

    #[emitter]
    fn emit_import_prelude(&mut self, n: &ImportPrelude) -> Result {
        emit!(self, n.href);

        if n.layer_name.is_some() || n.import_conditions.is_some() {
            formatting_space!(self);
        }

        if let Some(layer_name) = &n.layer_name {
            emit!(self, layer_name);

            if n.import_conditions.is_some() {
                if let ImportLayerName::Ident(_) = &**layer_name {
                    space!(self);
                } else {
                    formatting_space!(self);
                }
            }
        }

        emit!(self, n.import_conditions);
    }

    #[emitter]
    fn emit_import_prelude_href(&mut self, n: &ImportHref) -> Result {
        match n {
            ImportHref::Url(n) => emit!(self, n),
            ImportHref::Str(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_import_layer_name(&mut self, n: &ImportLayerName) -> Result {
        match n {
            ImportLayerName::Ident(n) => emit!(self, n),
            ImportLayerName::Function(n) if n.value.is_empty() => {
                // Never emit `layer()`
                emit!(
                    self,
                    AtRuleName::Ident(swc_css_ast::Ident {
                        span: n.span,
                        value: "layer".into(),
                        raw: None
                    })
                )
            }
            ImportLayerName::Function(n) => {
                emit!(self, n)
            }
        }
    }

    #[emitter]
    fn emit_import_conditions(&mut self, n: &ImportConditions) -> Result {
        if let Some(supports) = &n.supports {
            emit!(self, supports);

            if n.media.is_some() {
                formatting_space!(self);
            }
        }

        if let Some(media) = &n.media {
            emit!(self, media);
        }
    }

    #[emitter]
    fn emit_keyframes_name(&mut self, n: &KeyframesName) -> Result {
        match n {
            KeyframesName::CustomIdent(n) => emit!(self, n),
            KeyframesName::Str(n) => emit!(self, n),
            KeyframesName::PseudoFunction(n) => emit!(self, n),
            KeyframesName::PseudoPrefix(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_keyframes_pseudo_function(&mut self, n: &KeyframesPseudoFunction) -> Result {
        write_raw!(self, ":");
        emit!(self, n.pseudo);
        write_raw!(self, "(");
        emit!(self, n.name);
        write_raw!(self, ")");
    }

    #[emitter]
    fn emit_keyframes_pseudo_prefix(&mut self, n: &KeyframesPseudoPrefix) -> Result {
        write_raw!(self, ":");
        emit!(self, n.pseudo);
        space!(self);
        emit!(self, n.name);
    }

    #[emitter]
    fn emit_keyframe_block(&mut self, n: &KeyframeBlock) -> Result {
        self.emit_list(&n.prelude, ListFormat::CommaDelimited)?;

        formatting_space!(self);

        emit!(self, n.block);
    }

    #[emitter]
    fn emit_keyframe_selector(&mut self, n: &KeyframeSelector) -> Result {
        match n {
            KeyframeSelector::Ident(n) => emit!(
                &mut *self.with_ctx(Ctx {
                    allow_to_lowercase: true,
                    ..self.ctx
                }),
                n
            ),
            KeyframeSelector::Percentage(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_font_feature_values_prelude(&mut self, n: &FontFeatureValuesPrelude) -> Result {
        self.emit_list(&n.font_family, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_layer_name(&mut self, n: &LayerName) -> Result {
        self.emit_list(&n.name, ListFormat::DotDelimited)?;
    }

    #[emitter]
    fn emit_layer_name_list(&mut self, n: &LayerNameList) -> Result {
        self.emit_list(&n.name_list, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_layer_prelude(&mut self, n: &LayerPrelude) -> Result {
        match n {
            LayerPrelude::Name(n) => emit!(self, n),
            LayerPrelude::NameList(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_query_list(&mut self, n: &MediaQueryList) -> Result {
        self.emit_list(&n.queries, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_media_query(&mut self, n: &MediaQuery) -> Result {
        if n.modifier.is_some() {
            emit!(
                &mut *self.with_ctx(Ctx {
                    allow_to_lowercase: true,
                    ..self.ctx
                }),
                n.modifier
            );
            space!(self);
        }

        if n.media_type.is_some() {
            emit!(
                &mut *self.with_ctx(Ctx {
                    allow_to_lowercase: true,
                    ..self.ctx
                }),
                n.media_type
            );

            if n.condition.is_some() {
                space!(self);
                write_raw!(self, "and");
                space!(self);
            }
        }

        if n.condition.is_some() {
            emit!(self, n.condition);
        }
    }

    #[emitter]
    fn emit_media_type(&mut self, n: &MediaType) -> Result {
        match n {
            MediaType::Ident(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_condition_type(&mut self, n: &MediaConditionType) -> Result {
        match n {
            MediaConditionType::All(n) => emit!(self, n),
            MediaConditionType::WithoutOr(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_condition(&mut self, n: &MediaCondition) -> Result {
        self.emit_list(
            &n.conditions,
            if self.config.minify {
                ListFormat::NotDelimited
            } else {
                ListFormat::SpaceDelimited
            },
        )?;
    }

    #[emitter]
    fn emit_media_condition_without_or(&mut self, n: &MediaConditionWithoutOr) -> Result {
        self.emit_list(
            &n.conditions,
            if self.config.minify {
                ListFormat::NotDelimited
            } else {
                ListFormat::SpaceDelimited
            },
        )?;
    }

    #[emitter]
    fn emit_media_condition_all_type(&mut self, n: &MediaConditionAllType) -> Result {
        match n {
            MediaConditionAllType::Not(n) => emit!(self, n),
            MediaConditionAllType::And(n) => emit!(self, n),
            MediaConditionAllType::Or(n) => emit!(self, n),
            MediaConditionAllType::MediaInParens(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_condition_without_or_type(&mut self, n: &MediaConditionWithoutOrType) -> Result {
        match n {
            MediaConditionWithoutOrType::Not(n) => emit!(self, n),
            MediaConditionWithoutOrType::And(n) => emit!(self, n),
            MediaConditionWithoutOrType::MediaInParens(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_not(&mut self, n: &MediaNot) -> Result {
        write_raw!(self, "not");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_media_and(&mut self, n: &MediaAnd) -> Result {
        write_raw!(self, "and");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_media_or(&mut self, n: &MediaOr) -> Result {
        write_raw!(self, "or");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_media_in_parens(&mut self, n: &MediaInParens) -> Result {
        match n {
            MediaInParens::MediaCondition(n) => {
                write_raw!(self, lo_span_offset!(n.span, 1), "(");
                emit!(self, n);
                write_raw!(self, hi_span_offset!(n.span, 1), ")");
            }
            MediaInParens::Feature(n) => emit!(self, n),
            MediaInParens::GeneralEnclosed(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_feature(&mut self, n: &MediaFeature) -> Result {
        let span = match n {
            MediaFeature::Plain(n) => n.span,
            MediaFeature::Boolean(n) => n.span,
            MediaFeature::Range(n) => n.span,
            MediaFeature::RangeInterval(n) => n.span,
        };

        write_raw!(self, lo_span_offset!(span, 1), "(");

        match n {
            MediaFeature::Plain(n) => emit!(self, n),
            MediaFeature::Boolean(n) => emit!(self, n),
            MediaFeature::Range(n) => emit!(self, n),
            MediaFeature::RangeInterval(n) => emit!(self, n),
        }

        write_raw!(self, hi_span_offset!(span, 1), ")");
    }

    #[emitter]
    fn emit_media_feature_name(&mut self, n: &MediaFeatureName) -> Result {
        match n {
            MediaFeatureName::Ident(n) => emit!(self, n),
            MediaFeatureName::ExtensionName(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_feature_value(&mut self, n: &MediaFeatureValue) -> Result {
        match n {
            MediaFeatureValue::Number(n) => emit!(self, n),
            MediaFeatureValue::Dimension(n) => emit!(self, n),
            MediaFeatureValue::Ident(n) => emit!(self, n),
            MediaFeatureValue::Ratio(n) => emit!(self, n),
            MediaFeatureValue::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_feature_plain(&mut self, n: &MediaFeaturePlain) -> Result {
        emit!(self, n.name);
        write_raw!(self, ":");
        formatting_space!(self);
        emit!(self, n.value);
    }

    #[emitter]
    fn emit_media_feature_boolean(&mut self, n: &MediaFeatureBoolean) -> Result {
        emit!(self, n.name);
    }

    #[emitter]
    fn emit_media_feature_range(&mut self, n: &MediaFeatureRange) -> Result {
        emit!(self, n.left);
        formatting_space!(self);
        write_raw!(self, n.span, n.comparison.as_str());
        formatting_space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_media_feature_range_interval(&mut self, n: &MediaFeatureRangeInterval) -> Result {
        emit!(self, n.left);
        formatting_space!(self);
        write_raw!(self, n.span, n.left_comparison.as_str());
        formatting_space!(self);
        emit!(self, n.name);
        formatting_space!(self);
        write_raw!(self, n.span, n.right_comparison.as_str());
        formatting_space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_supports_condition(&mut self, n: &SupportsCondition) -> Result {
        self.emit_list(
            &n.conditions,
            if self.config.minify {
                ListFormat::NotDelimited
            } else {
                ListFormat::SpaceDelimited
            },
        )?;
    }

    #[emitter]
    fn emit_supports_condition_type(&mut self, n: &SupportsConditionType) -> Result {
        match n {
            SupportsConditionType::Not(n) => emit!(self, n),
            SupportsConditionType::And(n) => emit!(self, n),
            SupportsConditionType::Or(n) => emit!(self, n),
            SupportsConditionType::SupportsInParens(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_supports_not(&mut self, n: &SupportsNot) -> Result {
        write_raw!(self, "not");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_supports_and(&mut self, n: &SupportsAnd) -> Result {
        write_raw!(self, "and");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_support_or(&mut self, n: &SupportsOr) -> Result {
        write_raw!(self, "or");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_supports_in_parens(&mut self, n: &SupportsInParens) -> Result {
        match n {
            SupportsInParens::SupportsCondition(n) => {
                write_raw!(self, lo_span_offset!(n.span, 1), "(");
                emit!(self, n);
                write_raw!(self, hi_span_offset!(n.span, 1), ")");
            }
            SupportsInParens::Feature(n) => emit!(self, n),
            SupportsInParens::GeneralEnclosed(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_supports_feature(&mut self, n: &SupportsFeature) -> Result {
        match n {
            SupportsFeature::Declaration(n) => {
                write_raw!(self, lo_span_offset!(n.span, 1), "(");
                emit!(self, n);
                write_raw!(self, hi_span_offset!(n.span, 1), ")");
            }
            SupportsFeature::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_general_enclosed(&mut self, n: &GeneralEnclosed) -> Result {
        match n {
            GeneralEnclosed::Function(n) => emit!(self, n),
            GeneralEnclosed::SimpleBlock(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_page_selector_list(&mut self, n: &PageSelectorList) -> Result {
        self.emit_list(&n.selectors, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_page_selector(&mut self, n: &PageSelector) -> Result {
        if let Some(page_type) = &n.page_type {
            emit!(self, page_type);
        }

        if let Some(pseudos) = &n.pseudos {
            self.emit_list(pseudos, ListFormat::NotDelimited)?;
        }
    }

    #[emitter]
    fn emit_page_selector_type(&mut self, n: &PageSelectorType) -> Result {
        emit!(self, n.value);
    }

    #[emitter]
    fn emit_page_selector_pseudo(&mut self, n: &PageSelectorPseudo) -> Result {
        write_raw!(self, ":");
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.value
        );
    }

    #[emitter]
    fn emit_namespace_prelude(&mut self, n: &NamespacePrelude) -> Result {
        let has_prefix = n.prefix.is_some();
        let is_uri_url = match &*n.uri {
            NamespacePreludeUri::Url(_) => true,
            NamespacePreludeUri::Str(_) => false,
        };

        if has_prefix || is_uri_url {
            space!(self);
        } else {
            formatting_space!(self);
        }

        if has_prefix {
            emit!(self, n.prefix);

            if is_uri_url {
                space!(self);
            } else {
                formatting_space!(self);
            }
        }

        emit!(self, n.uri);
    }

    #[emitter]
    fn emit_namespace_prelude_uri(&mut self, n: &NamespacePreludeUri) -> Result {
        match n {
            NamespacePreludeUri::Url(n) => emit!(self, n),
            NamespacePreludeUri::Str(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_document_prelude(&mut self, n: &DocumentPrelude) -> Result {
        self.emit_list(&n.matching_functions, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_document_prelude_matching_function(
        &mut self,
        n: &DocumentPreludeMatchingFunction,
    ) -> Result {
        match n {
            DocumentPreludeMatchingFunction::Url(n) => emit!(self, n),
            DocumentPreludeMatchingFunction::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_container_condition(&mut self, n: &ContainerCondition) -> Result {
        if let Some(name) = &n.name {
            emit!(self, name);
            space!(self);
        }

        emit!(self, n.query);
    }

    #[emitter]
    fn emit_container_name(&mut self, n: &ContainerName) -> Result {
        match n {
            ContainerName::CustomIdent(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_container_query(&mut self, n: &ContainerQuery) -> Result {
        self.emit_list(
            &n.queries,
            if self.config.minify {
                ListFormat::NotDelimited
            } else {
                ListFormat::SpaceDelimited
            },
        )?;
    }

    #[emitter]
    fn emit_container_query_type(&mut self, n: &ContainerQueryType) -> Result {
        match n {
            ContainerQueryType::Not(n) => emit!(self, n),
            ContainerQueryType::And(n) => emit!(self, n),
            ContainerQueryType::Or(n) => emit!(self, n),
            ContainerQueryType::QueryInParens(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_container_query_not(&mut self, n: &ContainerQueryNot) -> Result {
        write_raw!(self, "not");
        space!(self);
        emit!(self, n.query);
    }

    #[emitter]
    fn emit_container_query_and(&mut self, n: &ContainerQueryAnd) -> Result {
        write_raw!(self, "and");
        space!(self);
        emit!(self, n.query);
    }

    #[emitter]
    fn emit_container_query_or(&mut self, n: &ContainerQueryOr) -> Result {
        write_raw!(self, "or");
        space!(self);
        emit!(self, n.query);
    }

    #[emitter]
    fn emit_query_in_parens(&mut self, n: &QueryInParens) -> Result {
        match n {
            QueryInParens::ContainerQuery(n) => {
                write_raw!(self, lo_span_offset!(n.span, 1), "(");
                emit!(self, n);
                write_raw!(self, hi_span_offset!(n.span, 1), ")");
            }
            QueryInParens::SizeFeature(n) => emit!(self, n),
            QueryInParens::GeneralEnclosed(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_size_feature(&mut self, n: &SizeFeature) -> Result {
        let span = match n {
            SizeFeature::Plain(n) => n.span,
            SizeFeature::Boolean(n) => n.span,
            SizeFeature::Range(n) => n.span,
            SizeFeature::RangeInterval(n) => n.span,
        };

        write_raw!(self, lo_span_offset!(span, 1), "(");

        match n {
            SizeFeature::Plain(n) => emit!(self, n),
            SizeFeature::Boolean(n) => emit!(self, n),
            SizeFeature::Range(n) => emit!(self, n),
            SizeFeature::RangeInterval(n) => emit!(self, n),
        }

        write_raw!(self, hi_span_offset!(span, 1), ")");
    }

    #[emitter]
    fn emit_size_feature_name(&mut self, n: &SizeFeatureName) -> Result {
        match n {
            SizeFeatureName::Ident(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_size_feature_value(&mut self, n: &SizeFeatureValue) -> Result {
        match n {
            SizeFeatureValue::Number(n) => emit!(self, n),
            SizeFeatureValue::Dimension(n) => emit!(self, n),
            SizeFeatureValue::Ident(n) => emit!(self, n),
            SizeFeatureValue::Ratio(n) => emit!(self, n),
            SizeFeatureValue::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_size_feature_plain(&mut self, n: &SizeFeaturePlain) -> Result {
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );
        write_raw!(self, ":");
        formatting_space!(self);
        emit!(self, n.value);
    }

    #[emitter]
    fn emit_size_feature_boolean(&mut self, n: &SizeFeatureBoolean) -> Result {
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );
    }

    #[emitter]
    fn emit_size_feature_range(&mut self, n: &SizeFeatureRange) -> Result {
        emit!(self, n.left);
        formatting_space!(self);
        write_raw!(self, n.span, n.comparison.as_str());
        formatting_space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_size_feature_range_interval(&mut self, n: &SizeFeatureRangeInterval) -> Result {
        emit!(self, n.left);
        formatting_space!(self);
        write_raw!(self, n.span, n.left_comparison.as_str());
        formatting_space!(self);
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );
        formatting_space!(self);
        write_raw!(self, n.span, n.right_comparison.as_str());
        formatting_space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_custom_media_query(&mut self, n: &CustomMediaQuery) -> Result {
        emit!(self, n.name);
        space!(self);
        emit!(self, n.media);
    }

    #[emitter]
    fn emit_custom_media_query_media_type(&mut self, n: &CustomMediaQueryMediaType) -> Result {
        match n {
            CustomMediaQueryMediaType::MediaQueryList(n) => emit!(self, n),
            CustomMediaQueryMediaType::Ident(n) => emit!(self, n),
        }
    }

    fn emit_list_of_component_values_inner(
        &mut self,
        nodes: &[ComponentValue],
        format: ListFormat,
    ) -> Result {
        let iter = nodes.iter();
        let len = nodes.len();

        for (idx, node) in iter.enumerate() {
            emit!(self, node);

            if self.ctx.in_list_of_component_values {
                continue;
            }

            let is_current_preserved_token = matches!(node, ComponentValue::PreservedToken(_));
            let next = nodes.get(idx + 1);
            let is_next_preserved_token = matches!(next, Some(ComponentValue::PreservedToken(_)));

            if idx != len - 1 && !is_current_preserved_token && !is_next_preserved_token {
                let need_delim = match node {
                    ComponentValue::SimpleBlock(_)
                    | ComponentValue::Function(_)
                    | ComponentValue::Delimiter(_)
                    | ComponentValue::Str(_)
                    | ComponentValue::Url(_)
                    | ComponentValue::Percentage(_)
                    | ComponentValue::LengthPercentage(_)
                    | ComponentValue::FrequencyPercentage(_)
                    | ComponentValue::AnglePercentage(_)
                    | ComponentValue::TimePercentage(_) => match next {
                        Some(ComponentValue::Delimiter(delimiter))
                            if matches!(
                                **delimiter,
                                Delimiter {
                                    value: DelimiterValue::Comma,
                                    ..
                                }
                            ) =>
                        {
                            false
                        }
                        _ => !self.config.minify,
                    },
                    ComponentValue::Color(color)
                        if matches!(
                            **color,
                            Color::AbsoluteColorBase(AbsoluteColorBase::Function(_))
                                | Color::Function(_)
                        ) =>
                    {
                        match next {
                            Some(ComponentValue::Delimiter(delimiter))
                                if matches!(
                                    **delimiter,
                                    Delimiter {
                                        value: DelimiterValue::Comma,
                                        ..
                                    }
                                ) =>
                            {
                                false
                            }
                            _ => !self.config.minify,
                        }
                    }
                    ComponentValue::Ident(_) | ComponentValue::DashedIdent(_) => match next {
                        Some(ComponentValue::SimpleBlock(simple_block)) => {
                            if simple_block.name.token == Token::LParen {
                                true
                            } else {
                                !self.config.minify
                            }
                        }
                        Some(ComponentValue::Color(color))
                            if matches!(
                                **color,
                                Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(_),)
                            ) =>
                        {
                            !self.config.minify
                        }
                        Some(ComponentValue::Str(_)) => !self.config.minify,
                        Some(ComponentValue::Delimiter(_)) => false,
                        Some(ComponentValue::Number(n)) => {
                            if self.config.minify {
                                let minified = minify_numeric(n.value);

                                !minified.starts_with('.')
                            } else {
                                true
                            }
                        }
                        Some(ComponentValue::Dimension(dimension)) => {
                            if self.config.minify {
                                let value = match &**dimension {
                                    Dimension::Length(i) => i.value.value,
                                    Dimension::Angle(i) => i.value.value,
                                    Dimension::Time(i) => i.value.value,
                                    Dimension::Frequency(i) => i.value.value,
                                    Dimension::Resolution(i) => i.value.value,
                                    Dimension::Flex(i) => i.value.value,
                                    Dimension::UnknownDimension(i) => i.value.value,
                                };

                                let minified = minify_numeric(value);

                                !minified.starts_with('.')
                            } else {
                                true
                            }
                        }
                        Some(component_value) if self.config.minify => {
                            if let Some(minified) = match component_value {
                                ComponentValue::LengthPercentage(p) => {
                                    p.as_length().map(|l| l.value.value)
                                }
                                ComponentValue::FrequencyPercentage(p) => {
                                    p.as_frequency().map(|f| f.value.value)
                                }
                                ComponentValue::AnglePercentage(p) => {
                                    p.as_angle().map(|a| a.value.value)
                                }
                                ComponentValue::TimePercentage(p) => {
                                    p.as_time().map(|t| t.value.value)
                                }
                                _ => None,
                            }
                            .map(minify_numeric)
                            {
                                !minified.starts_with('.')
                            } else {
                                true
                            }
                        }
                        _ => true,
                    },
                    _ => match next {
                        Some(ComponentValue::SimpleBlock(_)) => !self.config.minify,
                        Some(ComponentValue::Color(color))
                            if matches!(
                                &**color,
                                Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(_))
                            ) =>
                        {
                            !self.config.minify
                        }
                        Some(ComponentValue::Delimiter(_)) => false,
                        _ => true,
                    },
                };

                if need_delim {
                    self.write_delim(format)?;
                }
            }
        }

        Ok(())
    }

    #[emitter]
    fn emit_function(&mut self, n: &Function) -> Result {
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );
        write_raw!(self, "(");
        self.emit_list_of_component_values_inner(
            &n.value,
            ListFormat::SpaceDelimited | ListFormat::SingleLine,
        )?;
        write_raw!(self, ")");
    }

    #[emitter]
    fn emit_function_name(&mut self, n: &FunctionName) -> Result {
        match n {
            FunctionName::Ident(n) => emit!(self, n),
            FunctionName::DashedIdent(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_color_profile_name(&mut self, n: &ColorProfileName) -> Result {
        match n {
            ColorProfileName::Ident(n) => emit!(self, n),
            ColorProfileName::DashedIdent(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_str(&mut self, n: &Str) -> Result {
        if self.config.minify {
            let minified = minify_string(&n.value);

            write_str!(self, n.span, &minified);
        } else if let Some(raw) = &n.raw {
            write_str!(self, n.span, raw);
        } else {
            let value = serialize_string(&n.value);

            write_str!(self, n.span, &value);
        }
    }

    #[emitter]
    fn emit_simple_block(&mut self, n: &SimpleBlock) -> Result {
        let (starting, ending) = match n.name.token {
            Token::LBracket => ("[", "]"),
            Token::LParen => ("(", ")"),
            Token::LBrace => ("{", "}"),
            _ => {
                unreachable!();
            }
        };

        write_raw!(self, lo_span_offset!(n.span, 1), starting);

        let len = n.value.len();

        for (idx, node) in n.value.iter().enumerate() {
            match node {
                ComponentValue::ListOfComponentValues(_) | ComponentValue::Declaration(_) => {
                    if idx == 0 {
                        formatting_newline!(self);
                    }

                    increase_indent!(self);
                }
                ComponentValue::AtRule(_)
                | ComponentValue::QualifiedRule(_)
                | ComponentValue::KeyframeBlock(_) => {
                    formatting_newline!(self);
                    increase_indent!(self);
                }

                _ => {}
            }

            match node {
                ComponentValue::ListOfComponentValues(node) => {
                    emit!(
                        &mut *self.with_ctx(Ctx {
                            in_list_of_component_values: true,
                            ..self.ctx
                        }),
                        node
                    );
                }
                _ => {
                    emit!(self, node);
                }
            }

            match node {
                ComponentValue::AtRule(_) | ComponentValue::QualifiedRule(_) => {
                    formatting_newline!(self);
                    decrease_indent!(self);
                }
                ComponentValue::Declaration(_) => {
                    if idx != len - 1 {
                        semi!(self);
                    } else {
                        formatting_semi!(self);
                    }

                    formatting_newline!(self);
                    decrease_indent!(self);
                }
                ComponentValue::ListOfComponentValues(_) => {
                    decrease_indent!(self);
                }

                ComponentValue::KeyframeBlock(_) => {
                    if idx == len - 1 {
                        formatting_newline!(self);
                    }

                    decrease_indent!(self);
                }

                _ => {
                    if !self.ctx.in_list_of_component_values && ending == "]" && idx != len - 1 {
                        space!(self);
                    }
                }
            }
        }

        write_raw!(self, hi_span_offset!(n.span, 1), ending);
    }

    #[emitter]
    fn emit_component_value(&mut self, n: &ComponentValue) -> Result {
        match n {
            ComponentValue::PreservedToken(n) => emit!(self, n),
            ComponentValue::Function(n) => emit!(self, n),
            ComponentValue::SimpleBlock(n) => emit!(self, n),

            ComponentValue::ListOfComponentValues(n) => emit!(self, n),
            ComponentValue::QualifiedRule(n) => emit!(self, n),
            ComponentValue::AtRule(n) => emit!(self, n),
            ComponentValue::KeyframeBlock(n) => emit!(self, n),

            ComponentValue::Ident(n) => emit!(self, n),
            ComponentValue::DashedIdent(n) => emit!(self, n),
            ComponentValue::Str(n) => emit!(self, n),
            ComponentValue::Url(n) => emit!(self, n),
            ComponentValue::Integer(n) => emit!(self, n),
            ComponentValue::Number(n) => emit!(self, n),
            ComponentValue::Percentage(n) => emit!(self, n),
            ComponentValue::Dimension(n) => emit!(self, n),
            ComponentValue::LengthPercentage(n) => emit!(self, n),
            ComponentValue::FrequencyPercentage(n) => emit!(self, n),
            ComponentValue::AnglePercentage(n) => emit!(self, n),
            ComponentValue::TimePercentage(n) => emit!(self, n),
            ComponentValue::Ratio(n) => emit!(self, n),
            ComponentValue::UnicodeRange(n) => emit!(self, n),
            ComponentValue::Color(n) => emit!(self, n),
            ComponentValue::AlphaValue(n) => emit!(self, n),
            ComponentValue::Hue(n) => emit!(self, n),
            ComponentValue::CmykComponent(n) => emit!(self, n),
            ComponentValue::Delimiter(n) => emit!(self, n),

            ComponentValue::CalcSum(n) => emit!(self, n),
            ComponentValue::ComplexSelector(n) => emit!(self, n),
            ComponentValue::LayerName(n) => emit!(self, n),
            ComponentValue::Declaration(n) => emit!(self, n),
            ComponentValue::SupportsCondition(n) => emit!(self, n),
            ComponentValue::IdSelector(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_style_block(&mut self, n: &StyleBlock) -> Result {
        match n {
            StyleBlock::ListOfComponentValues(n) => {
                emit!(
                    &mut *self.with_ctx(Ctx {
                        in_list_of_component_values: true,
                        ..self.ctx
                    }),
                    n
                )
            }
            StyleBlock::AtRule(n) => emit!(self, n),
            StyleBlock::Declaration(n) => emit!(self, n),
            StyleBlock::QualifiedRule(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_declaration_block_item(&mut self, n: &DeclarationOrAtRule) -> Result {
        match n {
            DeclarationOrAtRule::Declaration(n) => emit!(self, n),
            DeclarationOrAtRule::AtRule(n) => emit!(self, n),
            DeclarationOrAtRule::ListOfComponentValues(n) => {
                emit!(
                    &mut *self.with_ctx(Ctx {
                        in_list_of_component_values: true,
                        ..self.ctx
                    }),
                    n
                )
            }
        }
    }

    #[emitter]
    fn emit_declaration(&mut self, n: &Declaration) -> Result {
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );
        write_raw!(self, ":");

        let is_custom_property = match n.name {
            DeclarationName::DashedIdent(_) => true,
            DeclarationName::Ident(_) => false,
        };

        // https://github.com/w3c/csswg-drafts/issues/774
        // `--foo: ;` and `--foo:;` is valid, but not all browsers support it, currently
        // we print " " (whitespace) always
        if is_custom_property {
            match n.value.first() {
                None => {
                    space!(self);
                }
                _ => {
                    formatting_space!(self);
                }
            };
        } else {
            formatting_space!(self);
        }

        if is_custom_property {
            self.with_ctx(Ctx {
                in_list_of_component_values: true,
                ..self.ctx
            })
            .emit_list(&n.value, ListFormat::NotDelimited)?;
        } else {
            self.emit_list_of_component_values_inner(
                &n.value,
                ListFormat::SpaceDelimited | ListFormat::SingleLine,
            )?;
        }

        if n.important.is_some() {
            if !is_custom_property {
                formatting_space!(self);
            }

            emit!(self, n.important);
        }
    }

    #[emitter]
    fn emit_declaration_name(&mut self, n: &DeclarationName) -> Result {
        match n {
            DeclarationName::Ident(n) => emit!(self, n),
            DeclarationName::DashedIdent(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_important_flag(&mut self, n: &ImportantFlag) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), "!");

        if self.config.minify {
            emit!(
                &mut *self.with_ctx(Ctx {
                    allow_to_lowercase: true,
                    ..self.ctx
                }),
                n.value
            );
        } else {
            emit!(self, n.value);
        }
    }

    #[emitter]
    fn emit_ident(&mut self, n: &Ident) -> Result {
        let value = if self.ctx.allow_to_lowercase && self.config.minify {
            Cow::Owned(n.value.to_ascii_lowercase())
        } else {
            Cow::Borrowed(&n.value)
        };

        let serialized = serialize_ident(&value, self.config.minify);

        // The unit of a <dimension-token> may need escaping to disambiguate with
        // scientific notation.
        // Old browser hacks with `\0` and other - IE
        if self.ctx.is_dimension_unit {
            write_raw!(self, n.span, &serialize_dimension_unit(&serialized));
        } else {
            write_raw!(self, n.span, &serialized);
        }
    }

    #[emitter]
    fn emit_custom_ident(&mut self, n: &CustomIdent) -> Result {
        let serialized = serialize_ident(&n.value, self.config.minify);

        write_raw!(self, n.span, &serialized);
    }

    #[emitter]
    fn emit_dashed_ident(&mut self, n: &DashedIdent) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 2), "--");

        let serialized = serialize_ident(&n.value, self.config.minify);

        write_raw!(self, n.span, &serialized);
    }

    #[emitter]
    fn emit_extension_name(&mut self, n: &ExtensionName) -> Result {
        let serialized = serialize_ident(&n.value, self.config.minify);

        write_raw!(self, n.span, &serialized);
    }

    #[emitter]
    fn emit_custom_highlight_name(&mut self, n: &CustomHighlightName) -> Result {
        let serialized = serialize_ident(&n.value, self.config.minify);

        write_raw!(self, n.span, &serialized);
    }

    #[emitter]
    fn emit_custom_property_name(&mut self, n: &CustomPropertyName) -> Result {
        write_raw!(self, n.span, &n.value);
    }

    #[emitter]
    fn emit_percentage(&mut self, n: &Percentage) -> Result {
        emit!(self, n.value);
        write_raw!(self, hi_span_offset!(n.span, 1), "%");
    }

    #[emitter]
    fn emit_length_percentage(&mut self, n: &LengthPercentage) -> Result {
        match n {
            LengthPercentage::Length(n) => emit!(self, n),
            LengthPercentage::Percentage(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_frequency_percentage(&mut self, n: &FrequencyPercentage) -> Result {
        match n {
            FrequencyPercentage::Frequency(n) => emit!(self, n),
            FrequencyPercentage::Percentage(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_angle_percentage(&mut self, n: &AnglePercentage) -> Result {
        match n {
            AnglePercentage::Angle(n) => emit!(self, n),
            AnglePercentage::Percentage(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_time_percentage(&mut self, n: &TimePercentage) -> Result {
        match n {
            TimePercentage::Time(n) => emit!(self, n),
            TimePercentage::Percentage(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_dimension(&mut self, n: &Dimension) -> Result {
        match n {
            Dimension::Length(n) => emit!(self, n),
            Dimension::Angle(n) => emit!(self, n),
            Dimension::Time(n) => emit!(self, n),
            Dimension::Frequency(n) => emit!(self, n),
            Dimension::Resolution(n) => emit!(self, n),
            Dimension::Flex(n) => emit!(self, n),
            Dimension::UnknownDimension(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_length(&mut self, n: &Length) -> Result {
        emit!(self, n.value);
        emit!(
            &mut *self.with_ctx(Ctx {
                is_dimension_unit: true,
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.unit
        );
    }

    #[emitter]
    fn emit_angle(&mut self, n: &Angle) -> Result {
        emit!(self, n.value);
        emit!(
            &mut *self.with_ctx(Ctx {
                is_dimension_unit: true,
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.unit
        );
    }

    #[emitter]
    fn emit_time(&mut self, n: &Time) -> Result {
        emit!(self, n.value);
        emit!(
            &mut *self.with_ctx(Ctx {
                is_dimension_unit: true,
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.unit
        );
    }

    #[emitter]
    fn emit_frequency(&mut self, n: &Frequency) -> Result {
        emit!(self, n.value);
        emit!(
            &mut *self.with_ctx(Ctx {
                is_dimension_unit: true,
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.unit
        );
    }

    #[emitter]
    fn emit_resolution(&mut self, n: &Resolution) -> Result {
        emit!(self, n.value);
        emit!(
            &mut *self.with_ctx(Ctx {
                is_dimension_unit: true,
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.unit
        );
    }

    #[emitter]
    fn emit_flex(&mut self, n: &Flex) -> Result {
        emit!(self, n.value);
        emit!(
            &mut *self.with_ctx(Ctx {
                is_dimension_unit: true,
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.unit
        );
    }

    #[emitter]
    fn emit_unknown_dimension(&mut self, n: &UnknownDimension) -> Result {
        emit!(self, n.value);
        emit!(
            &mut *self.with_ctx(Ctx {
                is_dimension_unit: true,
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.unit
        );
    }

    #[emitter]
    fn emit_integer(&mut self, n: &Integer) -> Result {
        write_raw!(self, n.span, &n.value.to_string());
    }

    #[emitter]
    fn emit_number(&mut self, n: &Number) -> Result {
        if self.config.minify {
            let minified = minify_numeric(n.value);

            write_raw!(self, n.span, &minified);
        } else if let Some(raw) = &n.raw {
            write_raw!(self, n.span, raw);
        } else {
            write_raw!(self, n.span, &n.value.to_string());
        }
    }

    #[emitter]
    fn emit_ration(&mut self, n: &Ratio) -> Result {
        emit!(self, n.left);

        if let Some(right) = &n.right {
            write_raw!(self, "/");
            emit!(self, right);
        }
    }

    #[emitter]
    fn emit_color(&mut self, n: &Color) -> Result {
        match n {
            Color::AbsoluteColorBase(n) => emit!(self, n),
            Color::CurrentColorOrSystemColor(n) => emit!(self, n),
            Color::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_absolute_color_base(&mut self, n: &AbsoluteColorBase) -> Result {
        match n {
            AbsoluteColorBase::HexColor(n) => emit!(self, n),
            AbsoluteColorBase::NamedColorOrTransparent(n) => emit!(self, n),
            AbsoluteColorBase::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_hex_color(&mut self, n: &HexColor) -> Result {
        let mut hex_color = String::with_capacity(9);

        hex_color.push('#');

        if self.config.minify {
            let minified = minify_hex_color(&n.value);

            hex_color.push_str(&minified);
        } else {
            hex_color.push_str(&n.value);
        }

        write_raw!(self, n.span, &hex_color);
    }

    #[emitter]
    fn emit_alpha_value(&mut self, n: &AlphaValue) -> Result {
        match n {
            AlphaValue::Number(n) => emit!(self, n),
            AlphaValue::Percentage(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_hue(&mut self, n: &Hue) -> Result {
        match n {
            Hue::Number(n) => emit!(self, n),
            Hue::Angle(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_cmyk_component(&mut self, n: &CmykComponent) -> Result {
        match n {
            CmykComponent::Number(n) => emit!(self, n),
            CmykComponent::Percentage(n) => emit!(self, n),
            CmykComponent::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_delimiter(&mut self, n: &Delimiter) -> Result {
        write_raw!(self, n.span, n.value.as_str());
    }

    #[emitter]
    fn emit_calc_sum(&mut self, n: &CalcSum) -> Result {
        self.emit_list(&n.expressions, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_calc_product_or_operator(&mut self, n: &CalcProductOrOperator) -> Result {
        match n {
            CalcProductOrOperator::Product(n) => emit!(self, n),
            CalcProductOrOperator::Operator(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_calc_operator(&mut self, n: &CalcOperator) -> Result {
        let need_space = matches!(n.value, CalcOperatorType::Add | CalcOperatorType::Sub);

        if need_space {
            space!(self);
        } else {
            formatting_space!(self);
        }

        write_raw!(self, n.span, n.value.as_str());

        if need_space {
            space!(self);
        } else {
            formatting_space!(self);
        }
    }

    #[emitter]
    fn emit_calc_product(&mut self, n: &CalcProduct) -> Result {
        self.emit_list(&n.expressions, ListFormat::None)?;
    }

    #[emitter]
    fn emit_calc_value_or_operator(&mut self, n: &CalcValueOrOperator) -> Result {
        match n {
            CalcValueOrOperator::Value(n) => emit!(self, n),
            CalcValueOrOperator::Operator(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_calc_value(&mut self, n: &CalcValue) -> Result {
        match n {
            CalcValue::Number(n) => emit!(self, n),
            CalcValue::Dimension(n) => emit!(self, n),
            CalcValue::Percentage(n) => emit!(self, n),
            CalcValue::Constant(n) => emit!(self, n),
            CalcValue::Sum(n) => {
                write_raw!(self, lo_span_offset!(n.span, 1), "(");
                emit!(self, n);
                write_raw!(self, hi_span_offset!(n.span, 1), ")");
            }
            CalcValue::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_token_and_span(&mut self, n: &TokenAndSpan) -> Result {
        let span = n.span;

        match &n.token {
            Token::AtKeyword { raw, .. } => {
                let mut at_keyword = String::with_capacity(1 + raw.len());

                at_keyword.push('@');
                at_keyword.push_str(raw);

                write_raw!(self, span, &at_keyword);
            }
            Token::Delim { value } => {
                write_raw!(self, span, &value.to_string());
            }
            Token::LParen => {
                write_raw!(self, span, "(");
            }
            Token::RParen => {
                write_raw!(self, span, ")");
            }
            Token::LBracket => {
                write_raw!(self, span, "[");
            }
            Token::RBracket => {
                write_raw!(self, span, "]");
            }
            Token::Number { raw, .. } => {
                write_raw!(self, span, raw);
            }
            Token::Percentage { raw, .. } => {
                let mut percentage = String::with_capacity(raw.len() + 1);

                percentage.push_str(raw);
                percentage.push('%');

                write_raw!(self, span, &percentage);
            }
            Token::Dimension(token) => {
                let mut dimension =
                    String::with_capacity(token.raw_value.len() + token.raw_unit.len());

                dimension.push_str(&token.raw_value);
                dimension.push_str(&token.raw_unit);

                write_raw!(self, span, &dimension);
            }
            Token::Ident { raw, .. } => {
                write_raw!(self, span, raw);
            }
            Token::Function { raw, .. } => {
                let mut function = String::with_capacity(raw.len() + 1);

                function.push_str(raw);
                function.push('(');

                write_raw!(self, span, &function);
            }
            Token::BadString { raw } => {
                write_str!(self, span, raw);
            }
            Token::String { raw, .. } => {
                write_str!(self, span, raw);
            }
            Token::Url { raw, .. } => {
                let mut url = String::with_capacity(raw.0.len() + raw.1.len() + 2);

                url.push_str(&raw.0);
                url.push('(');
                url.push_str(&raw.1);
                url.push(')');

                write_str!(self, span, &url);
            }
            Token::BadUrl { raw, .. } => {
                write_str!(self, span, raw);
            }
            Token::Comma => {
                write_raw!(self, span, ",");
            }
            Token::Semi => {
                write_raw!(self, span, ";");
            }
            Token::LBrace => {
                write_raw!(self, span, "{");
            }
            Token::RBrace => {
                write_raw!(self, span, "}");
            }
            Token::Colon => {
                write_raw!(self, span, ":");
            }
            Token::Hash { raw, .. } => {
                let mut hash = String::with_capacity(raw.len() + 1);

                hash.push('#');
                hash.push_str(raw);

                write_raw!(self, span, &hash);
            }
            Token::WhiteSpace { value } => {
                write_str!(self, span, value);
            }
            Token::CDC => {
                write_raw!(self, span, "-->");
            }
            Token::CDO => {
                write_raw!(self, span, "<!--");
            }
        }
    }

    #[emitter]
    fn emit_url(&mut self, n: &Url) -> Result {
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );
        write_raw!(self, "(");

        if let Some(value) = &n.value {
            emit!(self, value);
        }

        if let Some(modifiers) = &n.modifiers {
            if !modifiers.is_empty() {
                if n.value.is_some() {
                    formatting_space!(self);
                }

                self.emit_list(modifiers, ListFormat::SpaceDelimited)?;
            }
        }

        write_raw!(self, ")");
    }

    #[emitter]
    fn emit_url_value(&mut self, n: &UrlValue) -> Result {
        match n {
            UrlValue::Raw(n) => emit!(self, n),
            UrlValue::Str(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_url_value_raw(&mut self, n: &UrlValueRaw) -> Result {
        write_str!(self, n.span, &serialize_url(&n.value));
    }

    #[emitter]
    fn emit_url_modifier(&mut self, n: &UrlModifier) -> Result {
        match n {
            UrlModifier::Ident(n) => emit!(self, n),
            UrlModifier::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_unicode_range(&mut self, n: &UnicodeRange) -> Result {
        let mut value = String::with_capacity(
            n.start.len()
                + if let Some(end) = &n.end {
                    end.len() + 1
                } else {
                    0
                }
                + 2,
        );

        value.push_str("u+");
        value.push_str(&n.start);

        if let Some(end) = &n.end {
            value.push('-');
            value.push_str(end);
        }

        write_raw!(self, n.span, &value);
    }

    #[emitter]
    fn emit_family_name(&mut self, n: &FamilyName) -> Result {
        match n {
            FamilyName::Str(n) => emit!(self, n),
            FamilyName::SequenceOfCustomIdents(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_sequence_of_custom_idents(&mut self, n: &SequenceOfCustomIdents) -> Result {
        self.emit_list(&n.value, ListFormat::SpaceDelimited)?;
    }

    #[emitter]
    fn emit_selector_list(&mut self, n: &SelectorList) -> Result {
        self.emit_list(
            &n.children,
            if self.config.minify || self.ctx.in_single_line_selectors {
                ListFormat::CommaDelimited
            } else {
                ListFormat::CommaDelimited | ListFormat::MultiLine
            },
        )?;
    }

    #[emitter]
    fn emit_forgiving_selector_list(&mut self, n: &ForgivingSelectorList) -> Result {
        for (idx, node) in n.children.iter().enumerate() {
            if idx != 0 {
                write_raw!(self, ",");

                let need_space = matches!(node, ForgivingComplexSelector::ComplexSelector(_));

                if need_space {
                    formatting_space!(self);
                }
            }

            emit!(self, node)
        }
    }

    #[emitter]
    fn emit_forgiving_complex_list(&mut self, n: &ForgivingComplexSelector) -> Result {
        match n {
            ForgivingComplexSelector::ComplexSelector(n) => emit!(self, n),
            ForgivingComplexSelector::ListOfComponentValues(n) => {
                emit!(
                    &mut *self.with_ctx(Ctx {
                        in_list_of_component_values: true,
                        ..self.ctx
                    }),
                    n
                )
            }
        }
    }

    #[emitter]
    fn emit_compound_selector_list(&mut self, n: &CompoundSelectorList) -> Result {
        self.emit_list(&n.children, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_relative_selector_list(&mut self, n: &RelativeSelectorList) -> Result {
        self.emit_list(&n.children, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_forgiving_relative_selector_list(
        &mut self,
        n: &ForgivingRelativeSelectorList,
    ) -> Result {
        for (idx, node) in n.children.iter().enumerate() {
            if idx != 0 {
                write_raw!(self, ",");

                let need_space = matches!(node, ForgivingRelativeSelector::RelativeSelector(_));

                if need_space {
                    formatting_space!(self);
                }
            }

            emit!(self, node)
        }
    }

    #[emitter]
    fn emit_forgiving_relative_selector(&mut self, n: &ForgivingRelativeSelector) -> Result {
        match n {
            ForgivingRelativeSelector::RelativeSelector(n) => emit!(self, n),
            ForgivingRelativeSelector::ListOfComponentValues(n) => {
                emit!(
                    &mut *self.with_ctx(Ctx {
                        in_list_of_component_values: true,
                        ..self.ctx
                    }),
                    n
                )
            }
        }
    }

    #[emitter]
    fn emit_complex_selector(&mut self, n: &ComplexSelector) -> Result {
        for (idx, node) in n.children.iter().enumerate() {
            emit!(self, node);

            match node {
                ComplexSelectorChildren::Combinator(Combinator {
                    value: CombinatorValue::Descendant,
                    ..
                }) => {}
                _ => match n.children.get(idx + 1) {
                    Some(ComplexSelectorChildren::Combinator(Combinator {
                        value: CombinatorValue::Descendant,
                        ..
                    })) => {}
                    Some(_) => {
                        formatting_space!(self);
                    }
                    _ => {}
                },
            }
        }
    }

    #[emitter]
    fn emit_relative_selector(&mut self, n: &RelativeSelector) -> Result {
        if let Some(combinator) = &n.combinator {
            emit!(self, combinator);

            formatting_space!(self);
        }

        emit!(self, n.selector);
    }

    #[emitter]
    fn emit_complex_selector_children(&mut self, n: &ComplexSelectorChildren) -> Result {
        match n {
            ComplexSelectorChildren::CompoundSelector(n) => emit!(self, n),
            ComplexSelectorChildren::Combinator(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_compound_selector(&mut self, n: &CompoundSelector) -> Result {
        emit!(self, n.nesting_selector);
        emit!(self, n.type_selector);

        self.emit_list(&n.subclass_selectors, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_combinator(&mut self, n: &Combinator) -> Result {
        write_raw!(self, n.span, n.value.as_str());
    }

    #[emitter]
    fn emit_nesting_selector(&mut self, n: &NestingSelector) -> Result {
        write_raw!(self, n.span, "&");
    }

    #[emitter]
    fn emit_subclass_selector(&mut self, n: &SubclassSelector) -> Result {
        match n {
            SubclassSelector::Id(n) => emit!(self, n),
            SubclassSelector::Class(n) => emit!(self, n),
            SubclassSelector::Attribute(n) => emit!(self, n),
            SubclassSelector::PseudoClass(n) => emit!(self, n),
            SubclassSelector::PseudoElement(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_type_selector(&mut self, n: &TypeSelector) -> Result {
        match n {
            TypeSelector::TagName(n) => emit!(self, n),
            TypeSelector::Universal(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_tag_name_selector(&mut self, n: &TagNameSelector) -> Result {
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );
    }

    #[emitter]
    fn emit_universal_selector(&mut self, n: &UniversalSelector) -> Result {
        if let Some(prefix) = &n.prefix {
            emit!(self, prefix);
        }

        write_raw!(self, hi_span_offset!(n.span, 1), "*");
    }

    #[emitter]
    fn emit_namespace_prefix(&mut self, n: &NamespacePrefix) -> Result {
        if let Some(namespace) = &n.namespace {
            emit!(self, namespace);
        }

        write_raw!(self, hi_span_offset!(n.span, 1), "|");
    }

    #[emitter]
    fn emit_namespace(&mut self, n: &Namespace) -> Result {
        match n {
            Namespace::Named(n) => emit!(self, n),
            Namespace::Any(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_named_namespace(&mut self, n: &NamedNamespace) -> Result {
        emit!(self, n.name);
    }

    #[emitter]
    fn emit_any_namespace(&mut self, n: &AnyNamespace) -> Result {
        write_raw!(self, n.span, "*");
    }

    #[emitter]
    fn emit_wq_name(&mut self, n: &WqName) -> Result {
        if n.prefix.is_some() {
            emit!(self, n.prefix);
        }

        emit!(self, n.value);
    }

    #[emitter]
    fn emit_id_selector(&mut self, n: &IdSelector) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), "#");
        emit!(self, n.text);
    }

    #[emitter]
    fn emit_class_selector(&mut self, n: &ClassSelector) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), ".");
        emit!(self, n.text);
    }

    #[emitter]
    fn emit_attribute_selector(&mut self, n: &AttributeSelector) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), "[");
        emit!(self, n.name);

        if n.matcher.is_some() {
            emit!(self, n.matcher);
            emit!(self, n.value);

            if n.modifier.is_some() {
                match n.value {
                    Some(AttributeSelectorValue::Str(_)) => {
                        formatting_space!(self);
                    }
                    Some(AttributeSelectorValue::Ident(_)) => {
                        space!(self);
                    }
                    _ => {}
                }

                emit!(self, n.modifier);
            }
        }

        write_raw!(self, hi_span_offset!(n.span, 1), "]");
    }

    #[emitter]
    fn emit_attribute_selector_matcher(&mut self, n: &AttributeSelectorMatcher) -> Result {
        write_raw!(self, n.span, n.value.as_str());
    }

    #[emitter]
    fn emit_attribute_selector_value(&mut self, n: &AttributeSelectorValue) -> Result {
        match n {
            AttributeSelectorValue::Str(n) => emit!(self, n),
            AttributeSelectorValue::Ident(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_attribute_selector_modifier(&mut self, n: &AttributeSelectorModifier) -> Result {
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.value
        );
    }

    #[emitter]
    fn emit_an_plus_b(&mut self, n: &AnPlusB) -> Result {
        match n {
            AnPlusB::Ident(n) => emit!(self, n),
            AnPlusB::AnPlusBNotation(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_an_plus_b_notation(&mut self, n: &AnPlusBNotation) -> Result {
        let mut an_plus_b = String::with_capacity(4);

        if let Some(a) = &n.a {
            if *a == -1 {
                an_plus_b.push('-');
            } else if *a != 1 {
                an_plus_b.push_str(&a.to_string());
            }

            an_plus_b.push('n');
        }

        if let Some(b) = &n.b {
            if *b >= 0 && n.a.is_some() {
                an_plus_b.push('+');
            }

            an_plus_b.push_str(&b.to_string());
        }

        write_raw!(self, n.span, &an_plus_b);
    }

    #[emitter]
    fn emit_pseudo_class_selector(&mut self, n: &PseudoClassSelector) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), ":");
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );

        if let Some(children) = &n.children {
            write_raw!(self, "(");
            self.emit_list_pseudo_class_selector_children(children)?;
            write_raw!(self, ")");
        }
    }

    #[emitter]
    fn emit_pseudo_class_selector_children(&mut self, n: &PseudoClassSelectorChildren) -> Result {
        match n {
            PseudoClassSelectorChildren::PreservedToken(n) => emit!(self, n),
            PseudoClassSelectorChildren::AnPlusB(n) => emit!(self, n),
            PseudoClassSelectorChildren::Ident(n) => emit!(self, n),
            PseudoClassSelectorChildren::Str(n) => emit!(self, n),
            PseudoClassSelectorChildren::Delimiter(n) => emit!(self, n),
            PseudoClassSelectorChildren::ComplexSelector(n) => emit!(self, n),
            PseudoClassSelectorChildren::SelectorList(n) => emit!(
                &mut *self.with_ctx(Ctx {
                    in_single_line_selectors: true,
                    ..self.ctx
                }),
                n
            ),
            PseudoClassSelectorChildren::ForgivingSelectorList(n) => emit!(
                &mut *self.with_ctx(Ctx {
                    in_single_line_selectors: true,
                    ..self.ctx
                }),
                n
            ),
            PseudoClassSelectorChildren::CompoundSelectorList(n) => emit!(self, n),
            PseudoClassSelectorChildren::RelativeSelectorList(n) => emit!(self, n),
            PseudoClassSelectorChildren::ForgivingRelativeSelectorList(n) => emit!(self, n),
            PseudoClassSelectorChildren::CompoundSelector(n) => emit!(self, n),
        }
    }

    fn emit_list_pseudo_class_selector_children(
        &mut self,
        nodes: &[PseudoClassSelectorChildren],
    ) -> Result {
        let len = nodes.len();

        for (idx, node) in nodes.iter().enumerate() {
            emit!(self, node);

            if idx != len - 1 {
                match node {
                    PseudoClassSelectorChildren::PreservedToken(_) => {}
                    PseudoClassSelectorChildren::Delimiter(_) => {
                        formatting_space!(self);
                    }
                    _ => {
                        let next = nodes.get(idx + 1);

                        match next {
                            Some(PseudoClassSelectorChildren::Delimiter(Delimiter {
                                value: DelimiterValue::Comma,
                                ..
                            })) => {}
                            _ => {
                                space!(self)
                            }
                        }
                    }
                }
            }
        }

        Ok(())
    }

    #[emitter]
    fn emit_pseudo_element_selector(&mut self, n: &PseudoElementSelector) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), ":");
        write_raw!(self, lo_span_offset!(n.span, 2), ":");
        emit!(
            &mut *self.with_ctx(Ctx {
                allow_to_lowercase: true,
                ..self.ctx
            }),
            n.name
        );

        if let Some(children) = &n.children {
            write_raw!(self, "(");
            self.emit_list_pseudo_element_selector_children(children)?;
            write_raw!(self, ")");
        }
    }

    #[emitter]
    fn emit_pseudo_element_selector_children(
        &mut self,
        n: &PseudoElementSelectorChildren,
    ) -> Result {
        match n {
            PseudoElementSelectorChildren::PreservedToken(n) => emit!(self, n),
            PseudoElementSelectorChildren::Ident(n) => emit!(self, n),
            PseudoElementSelectorChildren::CompoundSelector(n) => emit!(self, n),
            PseudoElementSelectorChildren::CustomHighlightName(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_scope_range(&mut self, n: &ScopeRange) -> Result {
        if let Some(start) = &n.scope_start {
            formatting_space!(self);
            write_raw!(self, "(");
            emit!(self, start);
            write_raw!(self, ")");
        }
        if let Some(end) = &n.scope_end {
            write_raw!(self, " to");
            space!(self);
            write_raw!(self, "(");
            emit!(self, end);
            write_raw!(self, ")");
        }
    }

    fn emit_list_pseudo_element_selector_children(
        &mut self,
        nodes: &[PseudoElementSelectorChildren],
    ) -> Result {
        let len = nodes.len();

        for (idx, node) in nodes.iter().enumerate() {
            emit!(self, node);

            if idx != len - 1 {
                match node {
                    PseudoElementSelectorChildren::PreservedToken(_) => {}
                    _ => {
                        space!(self)
                    }
                }
            }
        }

        Ok(())
    }

    fn emit_list<N>(&mut self, nodes: &[N], format: ListFormat) -> Result
    where
        Self: Emit<N>,
        N: Spanned,
    {
        for (idx, node) in nodes.iter().enumerate() {
            if idx != 0 {
                self.write_delim(format)?;

                if format & ListFormat::LinesMask == ListFormat::MultiLine {
                    formatting_newline!(self);
                }
            }

            emit!(self, node)
        }

        Ok(())
    }

    fn write_delim(&mut self, f: ListFormat) -> Result {
        match f & ListFormat::DelimitersMask {
            ListFormat::None => {}
            ListFormat::CommaDelimited => {
                write_raw!(self, ",");
                formatting_space!(self);
            }
            ListFormat::SpaceDelimited => {
                space!(self)
            }
            ListFormat::SemiDelimited => {
                write_raw!(self, ";")
            }
            ListFormat::DotDelimited => {
                write_raw!(self, ".");
            }
            _ => unreachable!(),
        }

        Ok(())
    }
}

fn minify_numeric(value: f64) -> String {
    if value.is_sign_negative() && value == 0.0 {
        return "-0".to_owned();
    }
    let mut minified = value.to_string();

    if minified.starts_with("0.") {
        minified.replace_range(0..1, "");
    } else if minified.starts_with("-0.") {
        minified.replace_range(1..2, "");
    }

    if minified.starts_with(".000") {
        let mut cnt = 3;

        for &v in minified.as_bytes().iter().skip(4) {
            if v == b'0' {
                cnt += 1;
            } else {
                break;
            }
        }

        minified.replace_range(0..cnt + 1, "");

        let remain_len = minified.len();

        minified.push_str("e-");
        minified.push_str(&(remain_len + cnt).to_string());
    } else if minified.ends_with("000") {
        let mut cnt = 3;

        for &v in minified.as_bytes().iter().rev().skip(3) {
            if v == b'0' {
                cnt += 1;
            } else {
                break;
            }
        }

        minified.truncate(minified.len() - cnt);
        minified.push('e');
        minified.push_str(&cnt.to_string());
    }

    minified
}

fn minify_hex_color(value: &str) -> String {
    let length = value.len();

    if length == 6 || length == 8 {
        let chars = value.as_bytes();

        if chars[0] == chars[1] && chars[2] == chars[3] && chars[4] == chars[5] {
            // 6 -> 3 or 8 -> 3
            if length == 6 || chars[6] == b'f' && chars[7] == b'f' {
                let mut minified = String::with_capacity(3);

                minified.push(chars[0] as char);
                minified.push(chars[2] as char);
                minified.push(chars[4] as char);

                return minified;
            }
            // 8 -> 4
            else if length == 8 && chars[6] == chars[7] {
                let mut minified = String::with_capacity(4);

                minified.push(chars[0] as char);
                minified.push(chars[2] as char);
                minified.push(chars[4] as char);
                minified.push(chars[6] as char);

                return minified;
            }
        }
    }

    value.to_string()
}

fn serialize_string(value: &str) -> String {
    let mut minified = String::with_capacity(value.len());

    for c in value.chars() {
        match c {
            // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER (U+FFFD).
            '\0' => {
                minified.push('\u{FFFD}');
            }
            // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is U+007F, the
            // character escaped as code point.
            '\x01'..='\x1F' | '\x7F' => {
                static HEX_DIGITS: &[u8; 16] = b"0123456789abcdef";

                let b3;
                let b4;
                let char_as_u8 = c as u8;

                let bytes = if char_as_u8 > 0x0f {
                    let high = (char_as_u8 >> 4) as usize;
                    let low = (char_as_u8 & 0x0f) as usize;

                    b4 = [b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' '];

                    &b4[..]
                } else {
                    b3 = [b'\\', HEX_DIGITS[c as usize], b' '];

                    &b3[..]
                };

                minified.push_str(from_utf8(bytes).unwrap());
            }
            // If the character is '"' (U+0022) or "\" (U+005C), the escaped character.
            '\\' => {
                minified.push_str("\\\\");
            }
            '"' => {
                minified.push('\"');
            }
            // Otherwise, the character itself.
            _ => {
                minified.push(c);
            }
        };
    }

    format!("\"{}\"", minified.replace('"', "\\\""))
}

fn serialize_url(value: &str) -> String {
    let mut new_value = String::with_capacity(value.len());

    for c in value.chars() {
        match c {
            '\x01'..='\x1F' | '\x7F' => {
                static HEX_DIGITS: &[u8; 16] = b"0123456789abcdef";

                let b3;
                let b4;
                let char_as_u8 = c as u8;

                let bytes = if char_as_u8 > 0x0f {
                    let high = (char_as_u8 >> 4) as usize;
                    let low = (char_as_u8 & 0x0f) as usize;

                    b4 = [b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' '];

                    &b4[..]
                } else {
                    b3 = [b'\\', HEX_DIGITS[c as usize], b' '];

                    &b3[..]
                };

                new_value.push_str(from_utf8(bytes).unwrap());
            }
            '(' | ')' | '"' | '\'' => {
                new_value.push('\\');
                new_value.push(c)
            }
            '\\' => {
                new_value.push_str("\\\\");
            }
            _ if c.is_whitespace() => {
                new_value.push('\\');
                new_value.push(c)
            }
            _ => {
                new_value.push(c);
            }
        };
    }

    new_value
}

fn minify_string(value: &str) -> String {
    let mut minified = String::with_capacity(value.len());

    let mut dq = 0;
    let mut sq = 0;

    for c in value.chars() {
        match c {
            // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER (U+FFFD).
            '\0' => {
                minified.push('\u{FFFD}');
            }
            // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is U+007F, the
            // character escaped as code point.
            '\x01'..='\x1F' | '\x7F' => {
                static HEX_DIGITS: &[u8; 16] = b"0123456789abcdef";

                let b3;
                let b4;
                let char_as_u8 = c as u8;

                let bytes = if char_as_u8 > 0x0f {
                    let high = (char_as_u8 >> 4) as usize;
                    let low = (char_as_u8 & 0x0f) as usize;

                    b4 = [b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' '];

                    &b4[..]
                } else {
                    b3 = [b'\\', HEX_DIGITS[c as usize], b' '];

                    &b3[..]
                };

                minified.push_str(from_utf8(bytes).unwrap());
            }
            // If the character is '"' (U+0022) or "\" (U+005C), the escaped character.
            // We avoid escaping `"` to better string compression - we count the quantity of
            // quotes to choose the best default quotes
            '\\' => {
                minified.push_str("\\\\");
            }
            '"' => {
                dq += 1;

                minified.push(c);
            }
            '\'' => {
                sq += 1;

                minified.push(c);
            }
            // Otherwise, the character itself.
            _ => {
                minified.push(c);
            }
        };
    }

    if dq > sq {
        format!("'{}'", minified.replace('\'', "\\'"))
    } else {
        format!("\"{}\"", minified.replace('"', "\\\""))
    }
}

fn serialize_dimension_unit(value: &str) -> Cow<'_, str> {
    // Fast-path
    let need_escape =
        (value.len() >= 2 && value.as_bytes()[0] == b'e' && value.as_bytes()[1].is_ascii_digit())
            || value.contains(char::REPLACEMENT_CHARACTER);

    if !need_escape {
        return Cow::Borrowed(value);
    }

    let mut result = String::with_capacity(value.len());
    let mut chars = value.chars().enumerate().peekable();

    while let Some((i, c)) = chars.next() {
        match c {
            // Old browser hacks with `\0` and other - IE
            char::REPLACEMENT_CHARACTER => {
                result.push_str("\\0");
            }
            // The unit of a <dimension-token> may need escaping to disambiguate with scientific
            // notation.
            'e' if i == 0 => {
                if matches!(chars.peek(), Some((_, '0'..='9'))) {
                    result.push(c);
                    result.push_str("\\3");
                } else {
                    result.push(c);
                }
            }
            _ => {
                result.push(c);
            }
        }
    }

    Cow::Owned(result)
}
