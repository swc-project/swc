#![deny(clippy::all)]
#![allow(clippy::needless_update)]

pub use std::fmt::Result;
use std::str::from_utf8;

use swc_common::{BytePos, Span, Spanned, DUMMY_SP};
use swc_css_ast::*;
use swc_css_codegen_macros::emitter;
use writer::CssWriter;

pub use self::emit::*;
use self::{ctx::Ctx, list::ListFormat};

#[macro_use]
mod macros;
mod ctx;
mod emit;
mod list;
pub mod writer;

#[derive(Debug, Default, Clone, Copy)]
pub struct CodegenConfig {
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
            Rule::Invalid(n) => emit!(self, n),
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
            QualifiedRulePrelude::Invalid(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_at_rule(&mut self, n: &AtRule) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), "@");
        emit!(self, n.name);

        if let Some(prelude) = &n.prelude {
            emit!(self, prelude);
        }

        if n.block.is_some() {
            match &n.prelude {
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
            AtRulePrelude::ListOfComponentValues(n) => emit!(self, n),
            AtRulePrelude::CharsetPrelude(n) => {
                space!(self);
                emit!(self, n)
            }
            AtRulePrelude::PropertyPrelude(n) => {
                space!(self);
                emit!(self, n)
            }
            AtRulePrelude::CounterStylePrelude(n) => {
                space!(self);
                emit!(self, n)
            }
            AtRulePrelude::ColorProfilePrelude(n) => {
                space!(self);
                emit!(self, n);
            }
            AtRulePrelude::DocumentPrelude(n) => {
                space!(self);
                emit!(self, n)
            }
            AtRulePrelude::FontPaletteValuesPrelude(n) => {
                space!(self);
                emit!(self, n)
            }
            AtRulePrelude::NestPrelude(n) => {
                space!(self);
                emit!(self, n)
            }
            AtRulePrelude::KeyframesPrelude(n) => {
                match n {
                    KeyframesName::Str(_) => {
                        formatting_space!(self);
                    }
                    KeyframesName::CustomIdent(_) => {
                        space!(self);
                    }
                }

                emit!(self, n)
            }
            AtRulePrelude::ImportPrelude(n) => {
                match n.href {
                    ImportPreludeHref::Url(_) => {
                        space!(self);
                    }
                    ImportPreludeHref::Str(_) => {
                        formatting_space!(self);
                    }
                }

                emit!(self, n)
            }
            AtRulePrelude::NamespacePrelude(n) => emit!(self, n),
            AtRulePrelude::MediaPrelude(n) => {
                let need_space = match n.queries.get(0) {
                    Some(media_query)
                        if media_query.modifier.is_none() && media_query.media_type.is_none() =>
                    {
                        match &media_query.condition {
                            Some(MediaConditionType::All(media_condition)) => !matches!(
                                media_condition.conditions.get(0),
                                Some(MediaConditionAllType::MediaInParens(_))
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

                emit!(self, n)
            }
            AtRulePrelude::SupportsPrelude(n) => {
                match n.conditions.get(0) {
                    Some(SupportsConditionType::SupportsInParens(_)) => {
                        formatting_space!(self);
                    }
                    _ => {
                        space!(self);
                    }
                }

                emit!(self, n);
            }
            AtRulePrelude::PagePrelude(n) => {
                match n.selectors.get(0) {
                    Some(page_selector) if page_selector.page_type.is_none() => {
                        formatting_space!(self);
                    }
                    _ => {
                        space!(self);
                    }
                }

                emit!(self, n)
            }
            AtRulePrelude::LayerPrelude(n) => {
                space!(self);
                emit!(self, n)
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
    fn emit_import_prelude_supports_type(&mut self, n: &ImportPreludeSupportsType) -> Result {
        match n {
            ImportPreludeSupportsType::SupportsCondition(n) => emit!(self, n),
            ImportPreludeSupportsType::Declaration(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_import_prelude(&mut self, n: &ImportPrelude) -> Result {
        emit!(self, n.href);

        if let Some(layer_name) = &n.layer_name {
            formatting_space!(self);
            emit!(self, layer_name);

            if self.config.minify && (n.supports.is_some() || n.media.is_some()) {
                if let ImportPreludeLayerName::Ident(_) = layer_name {
                    space!(self);
                }
            }
        }

        if let Some(supports) = &n.supports {
            formatting_space!(self);
            write_raw!(self, "supports");
            write_raw!(self, "(");
            emit!(self, supports);
            write_raw!(self, ")");
        }

        if let Some(media) = &n.media {
            formatting_space!(self);
            emit!(self, media);
        }
    }

    #[emitter]
    fn emit_import_prelude_href(&mut self, n: &ImportPreludeHref) -> Result {
        match n {
            ImportPreludeHref::Url(n) => emit!(self, n),
            ImportPreludeHref::Str(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_import_layer_name(&mut self, n: &ImportPreludeLayerName) -> Result {
        match n {
            ImportPreludeLayerName::Ident(n) => emit!(self, n),
            ImportPreludeLayerName::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_keyframes_name(&mut self, n: &KeyframesName) -> Result {
        match n {
            KeyframesName::CustomIdent(n) => emit!(self, n),
            KeyframesName::Str(n) => emit!(self, n),
        }
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
            KeyframeSelector::Ident(n) => emit!(self, n),
            KeyframeSelector::Percentage(n) => emit!(self, n),
        }
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
            emit!(self, n.modifier);
            space!(self);
        }

        if n.media_type.is_some() {
            emit!(self, n.media_type);

            if n.condition.is_some() {
                space!(self);
                emit!(self, n.keyword);
                space!(self);
            }
        }

        if n.condition.is_some() {
            emit!(self, n.condition);
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
        self.emit_list(&n.conditions, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_media_condition_without_or(&mut self, n: &MediaConditionWithoutOr) -> Result {
        self.emit_list(&n.conditions, ListFormat::NotDelimited)?;
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
        formatting_space!(self);
        emit!(self, n.keyword);
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_media_and(&mut self, n: &MediaAnd) -> Result {
        formatting_space!(self);
        emit!(self, n.keyword);
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_media_or(&mut self, n: &MediaOr) -> Result {
        formatting_space!(self);
        emit!(self, n.keyword);
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
        }
    }

    #[emitter]
    fn emit_media_feature_value(&mut self, n: &MediaFeatureValue) -> Result {
        match n {
            MediaFeatureValue::Number(n) => emit!(self, n),
            MediaFeatureValue::Dimension(n) => emit!(self, n),
            MediaFeatureValue::Ident(n) => emit!(self, n),
            MediaFeatureValue::Ratio(n) => emit!(self, n),
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
        self.emit_list(&n.conditions, ListFormat::NotDelimited)?;
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
        formatting_space!(self);
        emit!(self, n.keyword);
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_supports_and(&mut self, n: &SupportsAnd) -> Result {
        formatting_space!(self);
        emit!(self, n.keyword);
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_support_or(&mut self, n: &SupportsOr) -> Result {
        formatting_space!(self);
        emit!(self, n.keyword);
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
        emit!(self, n.value);
    }

    #[emitter]
    fn emit_namespace_prelude(&mut self, n: &NamespacePrelude) -> Result {
        let has_prefix = n.prefix.is_some();
        let is_uri_url = match n.uri {
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

    fn emit_list_of_component_values_inner(
        &mut self,
        nodes: &[ComponentValue],
        format: ListFormat,
    ) -> Result {
        let iter = nodes.iter();
        let len = nodes.len();

        for (idx, node) in iter.enumerate() {
            emit!(self, node);

            let is_current_preserved_token = matches!(node, ComponentValue::PreservedToken(_));
            let next = nodes.get(idx + 1);
            let is_next_preserved_token = matches!(next, Some(ComponentValue::PreservedToken(_)));

            if idx != len - 1 && !is_current_preserved_token && !is_next_preserved_token {
                let need_delim = match node {
                    ComponentValue::SimpleBlock(_)
                    | ComponentValue::Function(_)
                    | ComponentValue::Color(Color::Function(_))
                    | ComponentValue::Color(Color::AbsoluteColorBase(
                        AbsoluteColorBase::Function(_),
                    ))
                    | ComponentValue::Delimiter(_)
                    | ComponentValue::Str(_)
                    | ComponentValue::Url(_)
                    | ComponentValue::Percentage(_) => match next {
                        Some(ComponentValue::Delimiter(Delimiter {
                            value: DelimiterValue::Comma,
                            ..
                        })) => false,
                        _ => !self.config.minify,
                    },
                    ComponentValue::Ident(_) => match next {
                        Some(ComponentValue::SimpleBlock(SimpleBlock { name, .. })) => {
                            if *name == '(' {
                                true
                            } else {
                                !self.config.minify
                            }
                        }
                        Some(ComponentValue::Color(Color::AbsoluteColorBase(
                            AbsoluteColorBase::HexColor(_),
                        )))
                        | Some(ComponentValue::Str(_)) => !self.config.minify,
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
                                let value = match dimension {
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
                        _ => true,
                    },
                    _ => match next {
                        Some(ComponentValue::SimpleBlock(_))
                        | Some(ComponentValue::Color(Color::AbsoluteColorBase(
                            AbsoluteColorBase::HexColor(_),
                        ))) => !self.config.minify,
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
        emit!(self, n.name);
        write_raw!(self, "(");
        self.emit_list_of_component_values_inner(
            &n.value,
            ListFormat::SpaceDelimited | ListFormat::SingleLine,
        )?;
        write_raw!(self, ")");
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
            let minified = minify_string(&*n.value);

            write_str!(self, n.span, &minified);
        } else {
            write_str!(self, n.span, &n.raw);
        }
    }

    #[emitter]
    fn emit_simple_block(&mut self, n: &SimpleBlock) -> Result {
        let ending = match n.name {
            '[' => "]",
            '(' => ")",
            '{' => "}",
            _ => {
                unreachable!();
            }
        };

        write_raw!(self, lo_span_offset!(n.span, 1), &n.name.to_string());

        let len = n.value.len();

        for (idx, node) in n.value.iter().enumerate() {
            match node {
                ComponentValue::StyleBlock(_) => {
                    if idx == 0 {
                        formatting_newline!(self);
                    }

                    increase_indent!(self);
                }
                ComponentValue::Rule(_) | ComponentValue::KeyframeBlock(_) => {
                    formatting_newline!(self);
                    increase_indent!(self);
                }
                ComponentValue::DeclarationOrAtRule(_) => {
                    if idx == 0 {
                        formatting_newline!(self);
                    }

                    increase_indent!(self);
                }
                _ => {}
            }

            emit!(self, node);

            match node {
                ComponentValue::Rule(_) => {
                    formatting_newline!(self);
                    decrease_indent!(self);
                }
                ComponentValue::StyleBlock(i) => {
                    match i {
                        StyleBlock::AtRule(_) | StyleBlock::QualifiedRule(_) => {
                            formatting_newline!(self);
                        }
                        StyleBlock::Declaration(_) => {
                            if idx != len - 1 {
                                semi!(self);
                            } else {
                                formatting_semi!(self);
                            }

                            formatting_newline!(self);
                        }
                        StyleBlock::Invalid(_) => {}
                    }

                    decrease_indent!(self);
                }
                ComponentValue::KeyframeBlock(_) => {
                    if idx == len - 1 {
                        formatting_newline!(self);
                    }

                    decrease_indent!(self);
                }
                ComponentValue::DeclarationOrAtRule(i) => {
                    match i {
                        DeclarationOrAtRule::AtRule(_) => {
                            formatting_newline!(self);
                        }
                        DeclarationOrAtRule::Declaration(_) => {
                            if idx != len - 1 {
                                semi!(self);
                            } else {
                                formatting_semi!(self);
                            }

                            formatting_newline!(self);
                        }
                        DeclarationOrAtRule::Invalid(_) => {}
                    }

                    decrease_indent!(self);
                }
                _ => {
                    if ending == "]" && idx != len - 1 {
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

            ComponentValue::StyleBlock(n) => emit!(self, n),
            ComponentValue::DeclarationOrAtRule(n) => emit!(self, n),
            ComponentValue::Rule(n) => emit!(self, n),
            ComponentValue::KeyframeBlock(n) => emit!(self, n),

            ComponentValue::Ident(n) => emit!(self, n),
            ComponentValue::DashedIdent(n) => emit!(self, n),
            ComponentValue::Str(n) => emit!(self, n),
            ComponentValue::Url(n) => emit!(self, n),
            ComponentValue::Integer(n) => emit!(self, n),
            ComponentValue::Number(n) => emit!(self, n),
            ComponentValue::Percentage(n) => emit!(self, n),
            ComponentValue::Dimension(n) => emit!(self, n),
            ComponentValue::Ratio(n) => emit!(self, n),
            ComponentValue::UnicodeRange(n) => emit!(self, n),
            ComponentValue::Color(n) => emit!(self, n),
            ComponentValue::AlphaValue(n) => emit!(self, n),
            ComponentValue::Hue(n) => emit!(self, n),
            ComponentValue::CmykComponent(n) => emit!(self, n),
            ComponentValue::Delimiter(n) => emit!(self, n),

            ComponentValue::CalcSum(n) => emit!(self, n),
            ComponentValue::ComplexSelector(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_style_block(&mut self, n: &StyleBlock) -> Result {
        match n {
            StyleBlock::AtRule(n) => emit!(self, n),
            StyleBlock::Declaration(n) => emit!(self, n),
            StyleBlock::QualifiedRule(n) => emit!(self, n),
            StyleBlock::Invalid(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_declaration_block_item(&mut self, n: &DeclarationOrAtRule) -> Result {
        match n {
            DeclarationOrAtRule::Declaration(n) => emit!(self, n),
            DeclarationOrAtRule::AtRule(n) => emit!(self, n),
            DeclarationOrAtRule::Invalid(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_declaration(&mut self, n: &Declaration) -> Result {
        emit!(self, n.name);
        write_raw!(self, ":");

        let is_custom_property = match n.name {
            DeclarationName::DashedIdent(_) => true,
            DeclarationName::Ident(_) => false,
        };

        // https://github.com/w3c/csswg-drafts/issues/774
        // `--foo: ;` and `--foo:;` is valid, but not all browsers support it, currently
        // we print " " (whitespace) always
        if is_custom_property {
            match n.value.get(0) {
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
            self.emit_list(&n.value, ListFormat::NotDelimited)?;
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
        let mut value = String::new();

        value.push('!');

        if self.config.minify {
            value.push_str(&n.value.value.to_lowercase());
        } else {
            value.push_str(&n.value.raw);
        }

        write_raw!(self, n.span, &value);
    }

    #[emitter]
    fn emit_ident(&mut self, n: &Ident) -> Result {
        write_raw!(self, n.span, &n.raw);
    }

    #[emitter]
    fn emit_custom_ident(&mut self, n: &CustomIdent) -> Result {
        write_raw!(self, n.span, &n.raw);
    }

    #[emitter]
    fn emit_dashed_ident(&mut self, n: &DashedIdent) -> Result {
        write_raw!(self, n.span, &n.raw);
    }

    #[emitter]
    fn emit_custom_property_name(&mut self, n: &CustomPropertyName) -> Result {
        write_raw!(self, n.span, &n.raw);
    }

    #[emitter]
    fn emit_percentage(&mut self, n: &Percentage) -> Result {
        emit!(self, n.value);
        write_raw!(self, hi_span_offset!(n.span, 1), "%");
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
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_angle(&mut self, n: &Angle) -> Result {
        emit!(self, n.value);
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_time(&mut self, n: &Time) -> Result {
        emit!(self, n.value);
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_frequency(&mut self, n: &Frequency) -> Result {
        emit!(self, n.value);
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_resolution(&mut self, n: &Resolution) -> Result {
        emit!(self, n.value);
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_flex(&mut self, n: &Flex) -> Result {
        emit!(self, n.value);
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_unknown_dimension(&mut self, n: &UnknownDimension) -> Result {
        emit!(self, n.value);
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_integer(&mut self, n: &Integer) -> Result {
        if self.config.minify {
            write_raw!(self, n.span, &n.value.to_string());
        } else {
            write_raw!(self, n.span, &n.raw);
        }
    }

    #[emitter]
    fn emit_number(&mut self, n: &Number) -> Result {
        if self.config.minify {
            let minified = minify_numeric(n.value);

            write_raw!(self, n.span, &minified);
        } else {
            write_raw!(self, n.span, &n.raw);
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
        let mut hex_color = String::new();

        hex_color.push('#');

        if self.config.minify {
            let minified = minify_hex_color(&n.value);

            hex_color.push_str(&minified);
        } else {
            hex_color.push_str(&n.raw);
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
                let mut at_keyword = String::new();

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
                let mut percentage = String::new();

                percentage.push_str(raw);
                percentage.push('%');

                write_raw!(self, span, &percentage);
            }
            Token::Dimension {
                raw_value,
                raw_unit,
                ..
            } => {
                let mut dimension = String::new();

                dimension.push_str(raw_value);
                dimension.push_str(raw_unit);

                write_raw!(self, span, &dimension);
            }
            Token::Ident { raw, .. } => {
                write_raw!(self, span, raw);
            }
            Token::Function { raw, .. } => {
                let mut function = String::new();

                function.push_str(raw);
                function.push('(');

                write_raw!(self, span, &function);
            }
            Token::BadString { raw, .. } => {
                write_str!(self, span, raw);
            }
            Token::String { raw, .. } => {
                write_str!(self, span, raw);
            }
            Token::Url {
                raw_name,
                raw_value,
                before,
                after,
                ..
            } => {
                let mut url = String::new();

                url.push_str(raw_name);
                url.push('(');
                url.push_str(before);
                url.push_str(raw_value);
                url.push_str(after);
                url.push(')');

                write_str!(self, span, &url);
            }
            Token::BadUrl {
                raw_name,
                raw_value,
                ..
            } => {
                let mut bad_url = String::new();

                bad_url.push_str(raw_name);
                bad_url.push('(');
                bad_url.push_str(raw_value);
                bad_url.push(')');

                write_str!(self, span, &bad_url);
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
                let mut hash = String::new();

                hash.push('#');
                hash.push_str(raw);

                write_raw!(self, span, &hash);
            }
            Token::WhiteSpace { value, .. } => {
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
    fn emit_tokens(&mut self, n: &Tokens) -> Result {
        for TokenAndSpan { span, token } in &n.tokens {
            let span = *span;

            match token {
                Token::AtKeyword { raw, .. } => {
                    let mut at_keyword = String::new();

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
                    let mut percentage = String::new();

                    percentage.push_str(raw);
                    percentage.push('%');

                    write_raw!(self, span, &percentage);
                }
                Token::Dimension {
                    raw_value,
                    raw_unit,
                    ..
                } => {
                    let mut dimension = String::new();

                    dimension.push_str(raw_value);
                    dimension.push_str(raw_unit);

                    write_raw!(self, span, &dimension);
                }
                Token::Ident { raw, .. } => {
                    write_raw!(self, span, raw);
                }
                Token::Function { raw, .. } => {
                    let mut function = String::new();

                    function.push_str(raw);
                    function.push('(');

                    write_raw!(self, span, &function);
                }
                Token::BadString { raw, .. } => {
                    write_str!(self, span, raw);
                }
                Token::String { raw, .. } => {
                    write_str!(self, span, raw);
                }
                Token::Url {
                    raw_name,
                    raw_value,
                    before,
                    after,
                    ..
                } => {
                    let mut url = String::new();

                    url.push_str(raw_name);
                    url.push('(');
                    url.push_str(before);
                    url.push_str(raw_value);
                    url.push_str(after);
                    url.push(')');

                    write_str!(self, span, &url);
                }
                Token::BadUrl {
                    raw_name,
                    raw_value,
                    ..
                } => {
                    let mut bad_url = String::new();

                    bad_url.push_str(raw_name);
                    bad_url.push('(');
                    bad_url.push_str(raw_value);
                    bad_url.push(')');

                    write_str!(self, span, &bad_url);
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
                    let mut hash = String::new();

                    hash.push('#');
                    hash.push_str(raw);

                    write_raw!(self, span, &hash);
                }
                Token::WhiteSpace { value, .. } => {
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
    }

    #[emitter]
    fn emit_url(&mut self, n: &Url) -> Result {
        emit!(self, n.name);
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
        let mut url = String::new();

        if !self.config.minify {
            url.push_str(&n.before);
        }

        if self.config.minify {
            url.push_str(&n.value);
        } else {
            url.push_str(&n.raw);
        }

        if !self.config.minify {
            url.push_str(&n.after);
        }

        write_str!(self, n.span, &url);
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
        let mut value = String::new();

        value.push(n.prefix);
        value.push('+');
        value.push_str(&n.start);

        if let Some(end) = &n.end {
            value.push('-');
            value.push_str(end);
        }

        write_raw!(self, n.span, &value);
    }

    #[emitter]
    fn emit_selector_list(&mut self, n: &SelectorList) -> Result {
        self.emit_list(
            &n.children,
            if self.config.minify {
                ListFormat::CommaDelimited
            } else {
                ListFormat::CommaDelimited | ListFormat::MultiLine
            },
        )?;
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
        emit!(&mut *self.with_ctx(self.ctx), n.nesting_selector);
        emit!(&mut *self.with_ctx(self.ctx), n.type_selector);

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
        emit!(self, n.name);
    }

    #[emitter]
    fn emit_universal_selector(&mut self, n: &UniversalSelector) -> Result {
        if let Some(prefix) = &n.prefix {
            emit!(self, prefix);
        }

        write_raw!(self, hi_span_offset!(n.span, 1), "*");
    }

    #[emitter]
    fn emit_ns_prefix(&mut self, n: &NsPrefix) -> Result {
        emit!(self, n.prefix);
        write_raw!(self, hi_span_offset!(n.span, 1), "|");
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
        emit!(self, n.value);
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
        if self.config.minify {
            let mut an_plus_b_minified = String::new();

            if let Some(a) = &n.a {
                if *a == -1 {
                    an_plus_b_minified.push('-');
                } else if *a != 1 {
                    an_plus_b_minified.push_str(&a.to_string());
                }

                an_plus_b_minified.push('n');
            }

            if let Some(b) = &n.b {
                if *b >= 0 && n.a.is_some() {
                    an_plus_b_minified.push('+');
                }

                an_plus_b_minified.push_str(&b.to_string());
            }

            write_raw!(self, n.span, &an_plus_b_minified);
        } else {
            let mut an_plus_b = String::new();

            if let Some(a_raw) = &n.a_raw {
                an_plus_b.push_str(a_raw);
                an_plus_b.push('n');
            }

            if let Some(b_raw) = &n.b_raw {
                an_plus_b.push_str(b_raw);
            }

            write_raw!(self, n.span, &an_plus_b);
        }
    }

    #[emitter]
    fn emit_pseudo_class_selector(&mut self, n: &PseudoClassSelector) -> Result {
        write_raw!(self, lo_span_offset!(n.span, 1), ":");
        emit!(self, n.name);

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
            PseudoClassSelectorChildren::SelectorList(n) => emit!(self, n),
            PseudoClassSelectorChildren::CompoundSelectorList(n) => emit!(self, n),
            PseudoClassSelectorChildren::RelativeSelectorList(n) => emit!(self, n),
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
                        space!(self)
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
        emit!(self, n.name);

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
                let mut minified = String::new();

                minified.push((chars[0] as char).to_ascii_lowercase());
                minified.push((chars[2] as char).to_ascii_lowercase());
                minified.push((chars[4] as char).to_ascii_lowercase());

                return minified;
            }
            // 8 -> 4
            else if length == 8 && chars[6] == chars[7] {
                let mut minified = String::new();

                minified.push((chars[0] as char).to_ascii_lowercase());
                minified.push((chars[2] as char).to_ascii_lowercase());
                minified.push((chars[4] as char).to_ascii_lowercase());
                minified.push((chars[6] as char).to_ascii_lowercase());

                return minified;
            }
        }
    }

    value.to_ascii_lowercase()
}

fn minify_string(value: &str) -> String {
    let mut minified = String::new();

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
