pub use self::emit::*;
use self::{ctx::Ctx, list::ListFormat};
use std::borrow::Cow;
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
            Rule::Style(n) => emit!(self, n),
            Rule::AtRule(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_style_rule(&mut self, n: &StyleRule) -> Result {
        self.emit_list(&n.selectors, ListFormat::CommaDelimited)?;

        space!(self);

        emit!(self, n.block);
    }

    #[emitter]
    fn emit_at_rule(&mut self, n: &AtRule) -> Result {
        match n {
            AtRule::Charset(n) => emit!(self, n),
            AtRule::Import(n) => emit!(self, n),
            AtRule::FontFace(n) => emit!(self, n),
            AtRule::Keyframes(n) => emit!(self, n),
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
        emit!(self, n.src);

        if let Some(query) = &n.condition {
            space!(self);
            emit!(self, query);
        }

        semi!(self);
    }

    #[emitter]
    fn emit_font_face_rule(&mut self, n: &FontFaceRule) -> Result {
        punct!(self, "@");
        keyword!(self, "font-face");
        space!(self);

        emit!(self, n.block);
    }

    #[emitter]
    fn emit_keyframes_rule(&mut self, n: &KeyframesRule) -> Result {
        punct!(self, "@");
        keyword!(self, "keyframes");
        space!(self);

        emit!(self, n.id);
        if !n.id.value.is_empty() {
            space!(self);
        }

        punct!(self, "{");
        self.emit_list(&n.blocks, ListFormat::NotDelimited)?;
        punct!(self, "}");
    }

    #[emitter]
    fn emit_keyfram_block(&mut self, n: &KeyframeBlock) -> Result {
        self.emit_list(&n.selector, ListFormat::CommaDelimited)?;

        space!(self);

        emit!(self, n.rule);
    }

    #[emitter]
    fn emit_keyframe_selector(&mut self, n: &KeyframeSelector) -> Result {
        match n {
            KeyframeSelector::Id(n) => emit!(self, n),
            KeyframeSelector::Percent(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_media_rule(&mut self, n: &MediaRule) -> Result {
        punct!(self, "@");
        keyword!(self, "media");
        space!(self);

        emit!(self, n.query);

        space!(self);

        punct!(self, "{");
        self.emit_list(&n.rules, ListFormat::NotDelimited | ListFormat::MultiLine)?;
        punct!(self, "}");
    }

    #[emitter]
    fn emit_supports_rule(&mut self, n: &SupportsRule) -> Result {
        punct!(self, "@");
        keyword!(self, "supports");
        space!(self);

        emit!(self, n.query);

        space!(self);

        punct!(self, "{");
        self.emit_list(&n.rules, ListFormat::NotDelimited)?;
        punct!(self, "}");
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
    fn emit_namespace_rule(&mut self, n: &NamespaceRule) -> Result {
        punct!(self, "@");
        keyword!(self, "namespace");
        space!(self);

        emit!(self, n.prefix);

        space!(self);

        emit!(self, n.value);
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
    fn emit_fn_value(&mut self, n: &FnValue) -> Result {
        emit!(self, n.name);

        punct!(self, "(");
        self.emit_list(&n.args, ListFormat::CommaDelimited)?;
        punct!(self, ")");
    }

    #[emitter]
    fn emit_value(&mut self, n: &Value) -> Result {
        match n {
            Value::Paren(n) => emit!(self, n),
            Value::Unit(n) => emit!(self, n),
            Value::Number(n) => emit!(self, n),
            Value::Percent(n) => emit!(self, n),
            Value::Hash(n) => emit!(self, n),
            Value::Text(n) => emit!(self, n),
            Value::Str(n) => emit!(self, n),
            Value::Fn(n) => emit!(self, n),
            Value::Bin(n) => emit!(self, n),
            Value::Array(n) => emit!(self, n),
            Value::Space(n) => emit!(self, n),
            Value::Brace(n) => emit!(self, n),
            Value::Lazy(n) => emit!(self, n),
            Value::AtText(n) => emit!(self, n),
            Value::Url(n) => emit!(self, n),
            Value::Comma(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_unknown_at_rule(&mut self, n: &UnknownAtRule) -> Result {
        punct!(self, "@");
        emit!(self, n.name);
        space!(self);

        emit!(self, n.tokens)
    }

    #[emitter]
    fn emit_str(&mut self, n: &Str) -> Result {
        // TODO: Handle escapes.
        punct!(self, "'");

        if n.value.chars().any(|c| c == '\n') {
            for c in n.value.chars() {
                match c {
                    '\n' => {
                        self.wr.write_raw_char(None, '\\')?;
                        self.wr.write_raw_char(None, 'n')?;
                    }
                    _ => {
                        self.wr.write_raw_char(None, c)?;
                    }
                }
            }
        } else {
            self.wr.write_raw(Some(n.span), &n.value)?;
        }
        punct!(self, "'");
    }

    #[emitter]
    fn emit_media_query(&mut self, n: &MediaQuery) -> Result {
        match n {
            MediaQuery::Text(n) => emit!(self, n),
            MediaQuery::And(n) => emit!(self, n),
            MediaQuery::Or(n) => emit!(self, n),
            MediaQuery::Not(n) => emit!(self, n),
            MediaQuery::Only(n) => emit!(self, n),
            MediaQuery::Property(n) => {
                punct!(self, "(");
                emit!(self, n);
                punct!(self, ")");
            }
            MediaQuery::Comma(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_decl_block(&mut self, n: &DeclBlock) -> Result {
        punct!(self, "{");

        self.emit_list(
            &n.properties,
            ListFormat::SemiDelimited | ListFormat::MultiLine,
        )?;

        punct!(self, "}");
    }

    #[emitter]
    fn emit_property(&mut self, n: &Property) -> Result {
        emit!(self, n.name);
        punct!(self, ":");
        formatting_space!(self);
        self.emit_list(
            &n.values,
            ListFormat::SpaceDelimited | ListFormat::SingleLine,
        )?;

        if let Some(tok) = n.important {
            formatting_space!(self);
            punct!(self, tok, "!");
            self.wr.write_ident(Some(tok), "important", false)?;
        }

        if self.ctx.semi_after_property {
            punct!(self, ";");
        }
    }

    #[emitter]
    fn emit_text(&mut self, n: &Text) -> Result {
        self.wr
            .write_ident(Some(n.span), &n.value, self.ctx.escape_first_dash)?;
    }

    #[emitter]
    fn emit_keyframe_block_rule(&mut self, n: &KeyframeBlockRule) -> Result {
        match n {
            KeyframeBlockRule::Decl(n) => emit!(self, n),
            KeyframeBlockRule::AtRule(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_percent_value(&mut self, n: &PercentValue) -> Result {
        emit!(self, n.value);
        punct!(self, "%");
    }

    #[emitter]
    fn emit_support_query(&mut self, n: &SupportQuery) -> Result {
        match n {
            SupportQuery::Not(n) => emit!(self, n),
            SupportQuery::And(n) => emit!(self, n),
            SupportQuery::Or(n) => emit!(self, n),
            SupportQuery::Property(n) => {
                punct!(self, "(");
                emit!(self, n);
                punct!(self, ")");
            }
            SupportQuery::Paren(n) => emit!(self, n),
        }
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
            PageRuleBlockItem::Property(n) => emit!(self, n),
            PageRuleBlockItem::Nested(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_paren_value(&mut self, n: &ParenValue) -> Result {
        punct!(self, "(");
        emit!(self, n.value);
        punct!(self, ")");
    }

    #[emitter]
    fn emit_unit_value(&mut self, n: &UnitValue) -> Result {
        emit!(self, n.value);
        emit!(self, n.unit);
    }

    #[emitter]
    fn emit_num(&mut self, n: &Num) -> Result {
        self.wr.write_raw(Some(n.span), &n.value.to_string())?;
    }

    #[emitter]
    fn emit_hash_value(&mut self, n: &HashValue) -> Result {
        punct!(self, "#");

        self.wr.write_hash_value(Some(n.span), &n.value)?;
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
    fn emit_array_value(&mut self, n: &ArrayValue) -> Result {
        punct!(self, "[");

        self.emit_list(&n.values, ListFormat::CommaDelimited)?;

        punct!(self, "]");
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
    fn emit_brace_value(&mut self, n: &BraceValue) -> Result {
        punct!(self, "{");
        emit!(self, n.value);
        punct!(self, "}");
    }

    #[emitter]
    fn emit_tokens(&mut self, n: &Tokens) -> Result {
        for TokenAndSpan { span, token } in &n.tokens {
            let span = *span;
            match token {
                Token::AtKeyword(name) => {
                    punct!(self, span, "@");
                    punct!(self, span, "@");
                    self.wr.write_ident(Some(span), &name, false)?;
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
                Token::Percent => {
                    punct!(self, span, "%");
                }
                Token::Num(n) => {
                    self.wr.write_raw(Some(span), &n.value.to_string())?;
                }
                Token::Ident(n) => {
                    self.wr.write_ident(Some(span), &n, true)?;
                }
                Token::Str { value } => {
                    punct!(self, "'");
                    self.wr.write_raw(Some(span), &value)?;
                    punct!(self, "'");
                }
                Token::Url { value } => {
                    self.wr.write_ident(Some(span), "url", false)?;
                    punct!(self, "(");
                    punct!(self, "(");
                    self.wr.write_raw(None, &value)?;
                    punct!(self, ")");
                }
                Token::Comma => {
                    punct!(self, span, ",");
                }
                Token::Semi => {
                    punct!(self, span, ";");
                }
                Token::Bang => {
                    punct!(self, span, "!");
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
                Token::Asterisk => {
                    punct!(self, span, "*");
                }
                Token::Dot => {
                    punct!(self, span, ".");
                }
                Token::Hash { value, .. } => {
                    punct!(self, "#");
                    punct!(self, "#");
                    self.wr.write_ident(Some(span), &value, true)?;
                }
                Token::WhiteSpace => {
                    space!(self);
                }
                Token::CDC => {
                    punct!(self, span, "-->");
                }
                Token::CDO => {
                    punct!(self, span, "<!--");
                }
                Token::Ampersand => {
                    punct!(self, span, "&");
                }
                Token::Bar => {
                    punct!(self, span, "|");
                }
                Token::Dollar => {
                    punct!(self, span, "$");
                }
                Token::Caret => {
                    punct!(self, span, "^");
                }
                Token::Tilde => {
                    punct!(self, span, "~");
                }
                Token::Equals => {
                    punct!(self, span, "=");
                }
                Token::Plus => {
                    punct!(self, span, "+");
                }
                Token::Minus => {
                    punct!(self, span, "-");
                }
                Token::Div => {
                    punct!(self, span, "/");
                }
                Token::GreaterThan => {
                    punct!(self, span, ">");
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
    fn emit_url_value(&mut self, n: &UrlValue) -> Result {
        keyword!(self, "url");
        punct!(self, "(");
        self.wr.write_raw(Some(n.span), &n.url)?;
        punct!(self, ")");
    }

    #[emitter]
    fn emit_and_media_query(&mut self, n: &AndMediaQuery) -> Result {
        emit!(self, n.left);
        space!(self);

        keyword!(self, "and");

        space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_or_media_query(&mut self, n: &OrMediaQuery) -> Result {
        emit!(self, n.left);
        space!(self);

        keyword!(self, "or");

        space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_not_media_query(&mut self, n: &NotMediaQuery) -> Result {
        keyword!(self, "not");
        space!(self);
        emit!(self, n.query);
    }

    #[emitter]
    fn emit_only_media_query(&mut self, n: &OnlyMediaQuery) -> Result {
        keyword!(self, "only");
        space!(self);
        emit!(self, n.query);
    }

    #[emitter]
    fn emit_comma_media_query(&mut self, n: &CommaMediaQuery) -> Result {
        self.emit_list(&n.queries, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_not_support_query(&mut self, n: &NotSupportQuery) -> Result {
        keyword!(self, "not");
        space!(self);

        emit!(self, n.query);
    }

    #[emitter]
    fn emit_and_support_query(&mut self, n: &AndSupportQuery) -> Result {
        emit!(self, n.left);
        space!(self);

        keyword!(self, "and");

        space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_or_support_query(&mut self, n: &OrSupportQuery) -> Result {
        emit!(self, n.left);
        space!(self);

        keyword!(self, "or");

        space!(self);
        emit!(self, n.right);
    }

    #[emitter]
    fn emit_paren_support_query(&mut self, n: &ParenSupportQuery) -> Result {
        punct!(self, "(");
        emit!(self, n.query);
        punct!(self, ")");
    }

    #[emitter]
    fn emit_nested_page_rule(&mut self, n: &NestedPageRule) -> Result {
        self.emit_list(&n.prelude, ListFormat::CommaDelimited)?;

        emit!(self, n.block);
    }

    #[emitter]
    fn emit_complex_selector(&mut self, n: &ComplexSelector) -> Result {
        self.emit_list(&n.selectors, ListFormat::SpaceDelimited)?;
    }

    #[emitter]
    fn emit_compound_selector(&mut self, n: &CompoundSelector) -> Result {
        if n.has_nest_prefix {
            punct!(self, "&");
        }

        if let Some(combinator) = &n.combinator {
            self.wr.write_punct(None, combinator.as_str())?;
        }

        let ctx = Ctx {
            escape_first_dash: true,
            ..self.ctx
        };
        emit!(&mut *self.with_ctx(ctx), n.type_selector);

        self.emit_list(&n.subclass_selectors, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_subclass_selector(&mut self, n: &SubclassSelector) -> Result {
        match n {
            SubclassSelector::Id(n) => emit!(self, n),
            SubclassSelector::Class(n) => emit!(self, n),
            SubclassSelector::Attr(n) => emit!(self, n),
            SubclassSelector::Pseudo(n) => emit!(self, n),
            SubclassSelector::At(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_unit(&mut self, n: &Unit) -> Result {
        let s: Cow<_> = match &n.kind {
            UnitKind::Px => Cow::Owned("px".into()),
            UnitKind::Custom(s) => Cow::Borrowed(s),
        };
        self.wr.write_ident(Some(n.span), &s, true)?;
    }

    #[emitter]
    fn emit_namespaced_name(&mut self, n: &NamespacedName) -> Result {
        if let Some(prefix) = &n.prefix {
            emit!(self, prefix);
            punct!(self, "|");
        }

        emit!(self, n.name);
    }

    #[emitter]
    fn emit_id_selector(&mut self, n: &IdSelector) -> Result {
        punct!(self, "#");
        let ctx = Ctx {
            escape_first_dash: true,
            ..self.ctx
        };
        emit!(&mut *self.with_ctx(ctx), n.text);
    }

    #[emitter]
    fn emit_class_selector(&mut self, n: &ClassSelector) -> Result {
        punct!(self, ".");
        let ctx = Ctx {
            escape_first_dash: true,
            ..self.ctx
        };
        emit!(&mut *self.with_ctx(ctx), n.text);
    }

    #[emitter]
    fn emit_attr_selector(&mut self, n: &AttrSelector) -> Result {
        punct!(self, "[");

        emit!(self, n.name);

        if let Some(op) = n.op {
            space!(self);
            self.wr.write_punct(None, op.as_str())?;
            space!(self);
        }

        emit!(self, n.value);

        if let Some(m) = &n.modifier {
            space!(self);
            self.wr.write_raw_char(None, *m)?;
        }

        punct!(self, "]");
    }

    #[emitter]
    fn emit_pseudo_selector(&mut self, n: &PseudoSelector) -> Result {
        punct!(self, ":");
        if n.is_element {
            punct!(self, ":");
        }

        emit!(self, n.name);

        if !n.args.tokens.is_empty() {
            punct!(self, "(");
            emit!(self, n.args);
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

                match format & ListFormat::LinesMask {
                    ListFormat::MultiLine => {
                        self.wr.write_newline()?;
                    }
                    _ => {}
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
            _ => unreachable!(),
        }

        Ok(())
    }
}
