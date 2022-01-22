#![deny(clippy::all)]
#![allow(clippy::needless_update)]

pub use self::emit::*;
use self::{ctx::Ctx, list::ListFormat};
pub use std::fmt::Result;
use swc_common::Spanned;
use swc_css_ast::*;
use swc_css_codegen_macros::emitter;
use writer::CssWriter;

#[macro_use]
mod macros;
mod ctx;
mod emit;
mod list;
pub mod writer;

#[derive(Debug, Clone, Copy)]
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
        self.emit_list(&n.rules, ListFormat::NotDelimited | ListFormat::MultiLine)?;
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
        if !self.config.minify {
            space!(self);
        }
        emit!(self, n.block);
    }

    #[emitter]
    fn emit_at_rule(&mut self, n: &AtRule) -> Result {
        match n {
            AtRule::Charset(n) => emit!(self, n),
            AtRule::Import(n) => emit!(self, n),
            AtRule::FontFace(n) => emit!(self, n),
            AtRule::Keyframes(n) => emit!(self, n),
            AtRule::Layer(n) => emit!(self, n),
            AtRule::Media(n) => emit!(self, n),
            AtRule::Supports(n) => emit!(self, n),
            AtRule::Page(n) => emit!(self, n),
            AtRule::Namespace(n) => emit!(self, n),
            AtRule::Viewport(n) => emit!(self, n),
            AtRule::Document(n) => emit!(self, n),
            AtRule::Unknown(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_import_supports_type(&mut self, n: &ImportSupportsType) -> Result {
        match n {
            ImportSupportsType::SupportsCondition(n) => emit!(self, n),
            ImportSupportsType::Declaration(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_charset_rule(&mut self, n: &CharsetRule) -> Result {
        punct!(self, "@");
        keyword!(self, "charset");

        space!(self);

        emit!(self, n.charset);

        semi!(self);
    }

    #[emitter]
    fn emit_import_rule(&mut self, n: &ImportRule) -> Result {
        punct!(self, "@");
        keyword!(self, "import");
        space!(self);
        emit!(self, n.href);

        if let Some(layer_name) = &n.layer_name {
            space!(self);
            emit!(self, layer_name);
        }

        if let Some(supports) = &n.supports {
            space!(self);
            keyword!(self, "supports");
            punct!(self, "(");
            emit!(self, supports);
            punct!(self, ")");
        }

        if let Some(media) = &n.media {
            space!(self);
            emit!(self, media);
        }

        semi!(self);
    }

    #[emitter]
    fn emit_import_href(&mut self, n: &ImportHref) -> Result {
        match n {
            ImportHref::Url(n) => emit!(self, n),
            ImportHref::Str(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_import_layer_name(&mut self, n: &ImportLayerName) -> Result {
        match n {
            ImportLayerName::Ident(n) => emit!(self, n),
            ImportLayerName::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_font_face_rule(&mut self, n: &FontFaceRule) -> Result {
        punct!(self, "@");
        keyword!(self, "font-face");
        space!(self);

        emit!(self, n.block);
    }

    #[emitter]
    fn emit_keyframes_name(&mut self, n: &KeyframesName) -> Result {
        match n {
            KeyframesName::CustomIdent(n) => emit!(self, n),
            KeyframesName::Str(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_keyframes_rule(&mut self, n: &KeyframesRule) -> Result {
        punct!(self, "@");
        keyword!(self, "keyframes");
        space!(self);

        emit!(self, n.name);
        space!(self);

        punct!(self, "{");
        self.emit_list(&n.blocks, ListFormat::NotDelimited)?;
        punct!(self, "}");
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
    fn emit_layer_rule(&mut self, n: &LayerRule) -> Result {
        punct!(self, "@");
        keyword!(self, "layer");
        space!(self);

        if n.prelude.is_some() {
            emit!(self, n.prelude);
        }

        if let Some(rules) = &n.rules {
            punct!(self, "{");
            self.emit_list(rules, ListFormat::NotDelimited | ListFormat::MultiLine)?;
            punct!(self, "}");
        } else {
            punct!(self, ";");
        }
    }

    #[emitter]
    fn emit_keyframe_block(&mut self, n: &KeyframeBlock) -> Result {
        self.emit_list(&n.selector, ListFormat::CommaDelimited)?;

        space!(self);

        emit!(self, n.rule);
    }

    #[emitter]
    fn emit_keyframe_selector(&mut self, n: &KeyframeSelector) -> Result {
        match n {
            KeyframeSelector::Ident(n) => emit!(self, n),
            KeyframeSelector::Percent(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_rule(&mut self, n: &MediaRule) -> Result {
        punct!(self, "@");
        keyword!(self, "media");
        space!(self);

        emit!(self, n.media);

        space!(self);

        punct!(self, "{");
        self.emit_list(&n.rules, ListFormat::NotDelimited | ListFormat::MultiLine)?;
        punct!(self, "}");
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
                keyword!(self, "and");
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
        space!(self);
        keyword!(self, "not");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_media_and(&mut self, n: &MediaAnd) -> Result {
        space!(self);
        keyword!(self, "and");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_media_or(&mut self, n: &MediaOr) -> Result {
        space!(self);
        keyword!(self, "or");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_media_in_parens(&mut self, n: &MediaInParens) -> Result {
        match n {
            MediaInParens::MediaCondition(n) => {
                punct!(self, "(");
                emit!(self, n);
                punct!(self, ")");
            }
            MediaInParens::Feature(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_feature(&mut self, n: &MediaFeature) -> Result {
        punct!(self, "(");

        match n {
            MediaFeature::Plain(n) => emit!(self, n),
            MediaFeature::Boolean(n) => emit!(self, n),
            MediaFeature::Range(n) => emit!(self, n),
            MediaFeature::RangeInterval(n) => emit!(self, n),
        }

        punct!(self, ")");
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
        punct!(self, ":");
        space!(self);
        emit!(self, n.value);
    }

    #[emitter]
    fn emit_media_feature_boolean(&mut self, n: &MediaFeatureBoolean) -> Result {
        emit!(self, n.name);
    }

    #[emitter]
    fn emit_media_feature_range(&mut self, n: &MediaFeatureRange) -> Result {
        emit!(self, n.left);
        space!(self);
        self.wr.write_punct(None, n.comparison.as_str())?;
        space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_media_feature_range_interval(&mut self, n: &MediaFeatureRangeInterval) -> Result {
        emit!(self, n.left);
        space!(self);
        self.wr.write_punct(None, n.left_comparison.as_str())?;
        space!(self);
        emit!(self, n.name);
        space!(self);
        self.wr.write_punct(None, n.right_comparison.as_str())?;
        space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_supports_rule(&mut self, n: &SupportsRule) -> Result {
        punct!(self, "@");
        keyword!(self, "supports");
        space!(self);

        emit!(self, n.condition);

        space!(self);

        punct!(self, "{");
        self.emit_list(&n.rules, ListFormat::NotDelimited)?;
        punct!(self, "}");
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
        keyword!(self, "not");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_supports_and(&mut self, n: &SupportsAnd) -> Result {
        keyword!(self, "and");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_support_or(&mut self, n: &SupportsOr) -> Result {
        keyword!(self, "or");
        space!(self);
        emit!(self, n.condition);
    }

    #[emitter]
    fn emit_supports_in_parens(&mut self, n: &SupportsInParens) -> Result {
        match n {
            SupportsInParens::SupportsCondition(n) => {
                punct!(self, "(");
                emit!(self, n);
                punct!(self, ")");
            }
            SupportsInParens::Feature(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_supports_feature(&mut self, n: &SupportsFeature) -> Result {
        punct!(self, "(");

        match n {
            SupportsFeature::Declaration(n) => emit!(self, n),
        }

        punct!(self, ")");
    }

    #[emitter]
    fn emit_page_rule(&mut self, n: &PageRule) -> Result {
        punct!(self, "@");
        keyword!(self, "page");
        space!(self);

        self.emit_list(&n.prelude, ListFormat::CommaDelimited)?;

        emit!(self, n.block);
    }

    #[emitter]
    fn emit_page_selector(&mut self, n: &PageSelector) -> Result {
        emit!(self, n.ident);
        if let Some(pseudo) = &n.pseudo {
            punct!(self, ":");
            emit!(self, pseudo);
        }
    }
    #[emitter]
    fn emit_namespace_uri(&mut self, n: &NamespaceUri) -> Result {
        match n {
            NamespaceUri::Url(n) => emit!(self, n),
            NamespaceUri::Str(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_namespace_rule(&mut self, n: &NamespaceRule) -> Result {
        punct!(self, "@");
        keyword!(self, "namespace");
        space!(self);

        if n.prefix.is_some() {
            emit!(self, n.prefix);
            space!(self);
        }

        emit!(self, n.uri);
    }

    #[emitter]
    fn emit_viewport_rule(&mut self, n: &ViewportRule) -> Result {
        punct!(self, "@");
        keyword!(self, "viewport");
        space!(self);

        emit!(self, n.block);
    }

    #[emitter]
    fn emit_document_rule(&mut self, n: &DocumentRule) -> Result {
        punct!(self, "@");
        keyword!(self, "document");
        space!(self);

        self.emit_list(&n.selectors, ListFormat::CommaDelimited)?;

        space!(self);

        punct!(self, "{");
        self.emit_list(&n.block, ListFormat::NotDelimited)?;
        punct!(self, "}");
    }

    #[emitter]
    fn emit_function(&mut self, n: &Function) -> Result {
        emit!(self, n.name);

        punct!(self, "(");
        self.emit_list(&n.value, ListFormat::CommaDelimited)?;
        punct!(self, ")");
    }

    #[emitter]
    fn emit_value(&mut self, n: &Value) -> Result {
        match n {
            Value::Function(n) => emit!(self, n),
            Value::SimpleBlock(n) => emit!(self, n),
            Value::Unit(n) => emit!(self, n),
            Value::Number(n) => emit!(self, n),
            Value::Percent(n) => emit!(self, n),
            Value::Ratio(n) => emit!(self, n),
            Value::Hash(n) => emit!(self, n),
            Value::Ident(n) => emit!(self, n),
            Value::Str(n) => emit!(self, n),
            Value::Bin(n) => emit!(self, n),
            Value::Space(n) => emit!(self, n),
            Value::Tokens(n) => emit!(self, n),
            Value::AtText(n) => emit!(self, n),
            Value::Url(n) => emit!(self, n),
            Value::Comma(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_unknown_at_rule(&mut self, n: &UnknownAtRule) -> Result {
        punct!(self, "@");
        emit!(self, n.name);

        self.emit_list(&n.prelude, ListFormat::NotDelimited)?;

        if n.block.is_some() {
            emit!(self, n.block)
        } else {
            punct!(self, ";");
        }
    }

    #[emitter]
    fn emit_str(&mut self, n: &Str) -> Result {
        self.wr.write_raw(Some(n.span), &n.raw)?;
    }

    #[emitter]
    fn emit_simple_block(&mut self, n: &SimpleBlock) -> Result {
        let ending = match n.name {
            '[' => ']',
            '(' => ')',
            '{' => '}',
            _ => {
                unreachable!();
            }
        };

        self.wr.write_raw_char(None, n.name)?;
        self.emit_list(
            &n.value,
            if ending == ']' {
                ListFormat::SpaceDelimited
            } else {
                ListFormat::NotDelimited
            },
        )?;
        self.wr.write_raw_char(None, ending)?;
    }

    #[emitter]
    fn emit_block(&mut self, n: &Block) -> Result {
        punct!(self, "{");

        self.emit_list(&n.value, ListFormat::SemiDelimited | ListFormat::MultiLine)?;

        punct!(self, "}");
    }

    #[emitter]
    fn emit_declaration_block_item(&mut self, n: &DeclarationBlockItem) -> Result {
        match n {
            DeclarationBlockItem::Declaration(n) => emit!(self, n),
            DeclarationBlockItem::AtRule(n) => emit!(self, n),
            DeclarationBlockItem::Invalid(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_declaration(&mut self, n: &Declaration) -> Result {
        emit!(self, n.property);
        punct!(self, ":");

        let is_custom_property = n.property.value.starts_with("--");

        if !is_custom_property {
            formatting_space!(self);
        }

        let format = match is_custom_property {
            true => ListFormat::NotDelimited,
            false => ListFormat::SpaceDelimited | ListFormat::SingleLine,
        };

        self.emit_list(&n.value, format)?;

        if let Some(tok) = n.important {
            if !is_custom_property {
                formatting_space!(self);
            }

            punct!(self, tok, "!");

            self.wr.write_raw(Some(tok), "important")?;
        }

        if self.ctx.semi_after_property {
            punct!(self, ";");
        }
    }

    #[emitter]
    fn emit_ident(&mut self, n: &Ident) -> Result {
        self.wr.write_raw(Some(n.span), &n.raw)?;
    }

    #[emitter]
    fn emit_custom_ident(&mut self, n: &CustomIdent) -> Result {
        self.wr.write_raw(Some(n.span), &n.raw)?;
    }

    #[emitter]
    fn emit_keyframe_block_rule(&mut self, n: &KeyframeBlockRule) -> Result {
        match n {
            KeyframeBlockRule::Block(n) => emit!(self, n),
            KeyframeBlockRule::AtRule(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_percent_value(&mut self, n: &PercentValue) -> Result {
        emit!(self, n.value);
        punct!(self, "%");
    }

    #[emitter]
    fn emit_page_rule_block(&mut self, n: &PageRuleBlock) -> Result {
        punct!(self, "{");

        self.wr.write_newline()?;

        self.wr.increase_indent();

        let ctx = Ctx {
            semi_after_property: true,
            ..self.ctx
        };
        self.with_ctx(ctx)
            .emit_list(&n.items, ListFormat::MultiLine | ListFormat::NotDelimited)?;

        self.wr.write_newline()?;

        self.wr.decrease_indent();

        punct!(self, "}");
    }

    #[emitter]
    fn emit_page_rule_block_item(&mut self, n: &PageRuleBlockItem) -> Result {
        match n {
            PageRuleBlockItem::Declaration(n) => emit!(self, n),
            PageRuleBlockItem::Nested(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_unit_value(&mut self, n: &UnitValue) -> Result {
        emit!(self, n.value);
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_number(&mut self, n: &Number) -> Result {
        self.wr.write_raw(Some(n.span), &n.raw)?;
    }

    #[emitter]
    fn emit_ration(&mut self, n: &Ratio) -> Result {
        emit!(self, n.left);
        punct!(self, "/");

        if let Some(right) = &n.right {
            emit!(self, right);
        }
    }

    #[emitter]
    fn emit_hash_value(&mut self, n: &HashValue) -> Result {
        punct!(self, "#");

        self.wr.write_raw(Some(n.span), &n.raw)?;
    }

    #[emitter]
    fn emit_bin_value(&mut self, n: &BinValue) -> Result {
        emit!(self, n.left);
        space!(self);
        punct!(self, n.op.as_str());
        space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_comma_values(&mut self, n: &CommaValues) -> Result {
        self.emit_list(&n.values, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_space_values(&mut self, n: &SpaceValues) -> Result {
        self.emit_list(&n.values, ListFormat::SpaceDelimited)?;
    }

    #[emitter]
    fn emit_tokens(&mut self, n: &Tokens) -> Result {
        for TokenAndSpan { span, token } in &n.tokens {
            let span = *span;
            match token {
                Token::AtKeyword { raw, .. } => {
                    punct!(self, span, "@");
                    self.wr.write_raw(Some(n.span), raw)?;
                }
                Token::Delim { value } => {
                    self.wr.write_raw_char(Some(n.span), *value)?;
                }
                Token::LParen => {
                    punct!(self, span, "(");
                }
                Token::RParen => {
                    punct!(self, span, ")");
                }
                Token::LBracket => {
                    punct!(self, span, "[");
                }
                Token::RBracket => {
                    punct!(self, span, "]");
                }
                Token::Num { raw, .. } => {
                    self.wr.write_raw(Some(span), raw)?;
                }
                Token::Percent { raw, .. } => {
                    self.wr.write_raw(Some(span), raw)?;
                    punct!(self, "%");
                }
                Token::Dimension {
                    raw_value,
                    raw_unit,
                    ..
                } => {
                    self.wr.write_raw(Some(span), raw_value)?;
                    self.wr.write_raw(Some(span), raw_unit)?;
                }
                Token::Ident { raw, .. } => {
                    self.wr.write_raw(Some(n.span), raw)?;
                }
                Token::Function { raw, .. } => {
                    self.wr.write_raw(Some(n.span), raw)?;
                    punct!(self, "(");
                }
                Token::BadStr { raw, .. } => {
                    self.wr.write_raw(Some(span), raw)?;
                }
                Token::Str { raw, .. } => {
                    self.wr.write_raw(Some(span), raw)?;
                }
                Token::Url { raw, .. } => {
                    self.wr.write_raw(Some(span), "url")?;
                    punct!(self, "(");
                    self.wr.write_raw(None, raw)?;
                    punct!(self, ")");
                }
                Token::BadUrl { raw, .. } => {
                    self.wr.write_raw(Some(span), "url")?;
                    punct!(self, "(");
                    self.wr.write_raw(None, raw)?;
                    punct!(self, ")");
                }
                Token::Comma => {
                    punct!(self, span, ",");
                }
                Token::Semi => {
                    punct!(self, span, ";");
                }
                Token::LBrace => {
                    punct!(self, span, "{");
                }
                Token::RBrace => {
                    punct!(self, span, "}");
                }
                Token::Colon => {
                    punct!(self, span, ":");
                }
                Token::Hash { raw, .. } => {
                    punct!(self, "#");
                    self.wr.write_raw(Some(span), raw)?;
                }
                Token::WhiteSpace { value, .. } => {
                    self.wr.write_raw(None, value)?;
                }
                Token::CDC => {
                    punct!(self, span, "-->");
                }
                Token::CDO => {
                    punct!(self, span, "<!--");
                }
            }
        }
    }

    #[emitter]
    fn emit_at_text_value(&mut self, n: &AtTextValue) -> Result {
        punct!(self, "@");
        emit!(self, n.name);
        space!(self);

        emit!(self, n.block);
    }

    #[emitter]
    fn emit_url(&mut self, n: &Url) -> Result {
        emit!(self, n.name);
        punct!(self, "(");

        if let Some(value) = &n.value {
            emit!(self, value);
        }

        if let Some(modifiers) = &n.modifiers {
            self.emit_list(&modifiers, ListFormat::SpaceDelimited)?;
        }

        punct!(self, ")");
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
        self.wr.write_raw(Some(n.span), &n.raw)?;
    }

    #[emitter]
    fn emit_url_modifier(&mut self, n: &UrlModifier) -> Result {
        match n {
            UrlModifier::Ident(n) => emit!(self, n),
            UrlModifier::Function(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_nested_page_rule(&mut self, n: &NestedPageRule) -> Result {
        emit!(self, n.prelude);
        emit!(self, n.block);
    }

    #[emitter]
    fn emit_selector_list(&mut self, n: &SelectorList) -> Result {
        self.emit_list(&n.children, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_complex_selector(&mut self, n: &ComplexSelector) -> Result {
        let mut need_space = false;
        for (idx, node) in n.children.iter().enumerate() {
            if let ComplexSelectorChildren::Combinator(..) = node {
                need_space = false;
            }

            if idx != 0 && need_space {
                need_space = false;

                self.wr.write_space()?;
            }

            if let ComplexSelectorChildren::CompoundSelector(..) = node {
                need_space = true;
            }

            emit!(self, node)
        }
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
        self.wr.write_punct(None, n.value.as_str())?;
    }

    #[emitter]
    fn emit_nesting_selector(&mut self, _: &NestingSelector) -> Result {
        punct!(self, "&");
    }

    #[emitter]
    fn emit_subclass_selector(&mut self, n: &SubclassSelector) -> Result {
        match n {
            SubclassSelector::Id(n) => emit!(self, n),
            SubclassSelector::Class(n) => emit!(self, n),
            SubclassSelector::Attr(n) => emit!(self, n),
            SubclassSelector::PseudoClass(n) => emit!(self, n),
            SubclassSelector::PseudoElement(n) => emit!(self, n),
            SubclassSelector::At(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_unit(&mut self, n: &Unit) -> Result {
        self.wr.write_raw(Some(n.span), &n.raw)?;
    }

    #[emitter]
    fn emit_type_selector(&mut self, n: &TypeSelector) -> Result {
        if let Some(prefix) = &n.prefix {
            emit!(self, prefix);
            punct!(self, "|");
        }

        emit!(self, n.name);
    }

    #[emitter]
    fn emit_id_selector(&mut self, n: &IdSelector) -> Result {
        punct!(self, "#");
        let ctx = Ctx { ..self.ctx };
        emit!(&mut *self.with_ctx(ctx), n.text);
    }

    #[emitter]
    fn emit_class_selector(&mut self, n: &ClassSelector) -> Result {
        punct!(self, ".");
        let ctx = Ctx { ..self.ctx };
        emit!(&mut *self.with_ctx(ctx), n.text);
    }

    #[emitter]
    fn emit_attr_selector_value(&mut self, n: &AttrSelectorValue) -> Result {
        match n {
            AttrSelectorValue::Str(n) => emit!(self, n),
            AttrSelectorValue::Ident(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_attr_selector(&mut self, n: &AttrSelector) -> Result {
        punct!(self, "[");

        if let Some(prefix) = &n.prefix {
            emit!(self, prefix);
            punct!(self, "|");
        }

        emit!(self, n.name);

        if let Some(matcher) = n.matcher {
            self.wr.write_punct(None, matcher.as_str())?;
        }

        emit!(self, n.value);

        if let Some(m) = &n.modifier {
            space!(self);

            self.wr.write_raw_char(None, *m)?;
        }

        punct!(self, "]");
    }

    #[emitter]
    fn emit_nth(&mut self, n: &Nth) -> Result {
        emit!(self, n.nth);

        if n.selector_list.is_some() {
            emit!(self, n.selector_list);
        }
    }

    #[emitter]
    fn emit_an_plus_b(&mut self, n: &AnPlusB) -> Result {
        if let Some(a_raw) = &n.a_raw {
            self.wr.write_raw(Some(n.span), a_raw)?;
            punct!(self, "n");
        }

        if let Some(b_raw) = &n.b_raw {
            self.wr.write_raw(Some(n.span), b_raw)?;
        }
    }

    #[emitter]
    fn emit_nth_value(&mut self, n: &NthValue) -> Result {
        match n {
            NthValue::AnPlusB(n) => emit!(self, n),
            NthValue::Ident(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_pseudo_selector_children(&mut self, n: &PseudoSelectorChildren) -> Result {
        match n {
            PseudoSelectorChildren::Nth(n) => emit!(self, n),
            PseudoSelectorChildren::Tokens(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_pseudo_class_selector(&mut self, n: &PseudoClassSelector) -> Result {
        punct!(self, ":");

        emit!(self, n.name);

        if n.children.is_some() {
            punct!(self, "(");
            emit!(self, n.children);
            punct!(self, ")");
        }
    }

    #[emitter]
    fn emit_pseudo_element_selector(&mut self, n: &PseudoElementSelector) -> Result {
        punct!(self, ":");
        punct!(self, ":");

        emit!(self, n.name);

        if n.children.is_some() {
            punct!(self, "(");
            emit!(self, n.children);
            punct!(self, ")");
        }
    }

    #[emitter]
    fn emit_at_selector(&mut self, n: &AtSelector) -> Result {
        punct!(self, "@");
        emit!(self, n.text);
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
                    self.wr.write_newline()?;
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
                punct!(self, ",");
                space!(self);
            }
            ListFormat::SpaceDelimited => {
                space!(self)
            }
            ListFormat::SemiDelimited => {
                punct!(self, ";")
            }
            ListFormat::DotDelimited => {
                punct!(self, ".");
            }
            _ => unreachable!(),
        }

        Ok(())
    }
}
