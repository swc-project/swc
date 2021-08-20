pub use self::emit::*;
use self::list::ListFormat;
use std::borrow::Cow;
pub use std::fmt::Result;
use swc_common::Spanned;
use swc_css_ast::*;
use swc_css_codegen_macros::emitter;
use writer::CssWriter;

#[macro_use]
mod macros;
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
}

impl<W> CodeGenerator<W>
where
    W: CssWriter,
{
    pub fn new(wr: W, config: CodegenConfig) -> Self {
        CodeGenerator { wr, config }
    }

    #[emitter]
    fn emit_rule(&mut self, n: &Rule) -> Result {
        match n {
            Rule::Style(n) => emit!(n),
            Rule::AtRule(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_style_rule(&mut self, n: &StyleRule) -> Result {
        self.emit_list(&n.selectors, ListFormat::CommaDelimited)?;

        space!();

        emit!(n.block);
    }

    #[emitter]
    fn emit_at_rule(&mut self, n: &AtRule) -> Result {
        match n {
            AtRule::Charset(n) => emit!(n),
            AtRule::Import(n) => emit!(n),
            AtRule::FontFace(n) => emit!(n),
            AtRule::Keyframes(n) => emit!(n),
            AtRule::Media(n) => emit!(n),
            AtRule::Supports(n) => emit!(n),
            AtRule::Page(n) => emit!(n),
            AtRule::Namespace(n) => emit!(n),
            AtRule::Viewport(n) => emit!(n),
            AtRule::Document(n) => emit!(n),
            AtRule::Unknown(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_charset_rule(&mut self, n: &CharsetRule) -> Result {
        punct!("@");
        keyword!("charset");

        space!();

        emit!(n.charset);

        semi!();
    }

    #[emitter]
    fn emit_import_rule(&mut self, n: &ImportRule) -> Result {
        punct!("@");
        keyword!("import");

        space!();
        emit!(n.src);

        if let Some(query) = &n.condition {
            space!();
            emit!(query);
        }

        semi!();
    }

    #[emitter]
    fn emit_font_face_rule(&mut self, n: &FontFaceRule) -> Result {
        punct!("@");
        keyword!("font-face");
        space!();

        emit!(n.block);
    }

    #[emitter]
    fn emit_keyframes_rule(&mut self, n: &KeyframesRule) -> Result {
        punct!("@");
        keyword!("keyframes");
        space!();

        emit!(n.id);
        if !n.id.value.is_empty() {
            space!();
        }

        self.emit_list(&n.blocks, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_keyfram_block(&mut self, n: &KeyframeBlock) -> Result {
        self.emit_list(&n.selector, ListFormat::CommaDelimited)?;

        space!();

        emit!(n.rule);
    }

    #[emitter]
    fn emit_keyframe_selector(&mut self, n: &KeyframeSelector) -> Result {
        match n {
            KeyframeSelector::Id(n) => emit!(n),
            KeyframeSelector::Percent(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_media_rule(&mut self, n: &MediaRule) -> Result {
        punct!("@");
        keyword!("media");
        space!();

        emit!(n.query);

        space!();

        self.emit_list(&n.rules, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_supports_rule(&mut self, n: &SupportsRule) -> Result {
        punct!("@");
        keyword!("supports");
        space!();

        emit!(n.query);

        space!();

        self.emit_list(&n.rules, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_page_rule(&mut self, n: &PageRule) -> Result {
        punct!("@");
        keyword!("page");
        space!();

        self.emit_list(&n.prelude, ListFormat::CommaDelimited)?;

        emit!(n.block);
    }

    #[emitter]
    fn emit_page_selector(&mut self, n: &PageSelector) -> Result {
        emit!(n.ident);
        if let Some(pseudo) = &n.pseudo {
            punct!(":");
            emit!(pseudo);
        }
    }

    #[emitter]
    fn emit_namespace_rule(&mut self, n: &NamespaceRule) -> Result {
        punct!("@");
        keyword!("namespace");
        space!();

        emit!(n.prefix);

        space!();

        emit!(n.value);
    }

    #[emitter]
    fn emit_viewport_rule(&mut self, n: &ViewportRule) -> Result {
        punct!("@");
        keyword!("viewport");
        space!();

        emit!(n.block);
    }

    #[emitter]
    fn emit_document_rule(&mut self, n: &DocumentRule) -> Result {
        punct!("@");
        keyword!("document");
        space!();

        self.emit_list(&n.selectors, ListFormat::CommaDelimited)?;

        space!();

        self.emit_list(&n.block, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_fn_value(&mut self, n: &FnValue) -> Result {
        emit!(n.name);

        punct!("(");
        self.emit_list(&n.args, ListFormat::CommaDelimited)?;
        punct!(")");
    }

    #[emitter]
    fn emit_value(&mut self, n: &Value) -> Result {
        match n {
            Value::Paren(n) => emit!(n),
            Value::Unit(n) => emit!(n),
            Value::Number(n) => emit!(n),
            Value::Percent(n) => emit!(n),
            Value::Hash(n) => emit!(n),
            Value::Text(n) => emit!(n),
            Value::Str(n) => emit!(n),
            Value::Fn(n) => emit!(n),
            Value::Bin(n) => emit!(n),
            Value::Array(n) => emit!(n),
            Value::Space(n) => emit!(n),
            Value::Brace(n) => emit!(n),
            Value::Lazy(n) => emit!(n),
            Value::AtText(n) => emit!(n),
            Value::Url(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_unknown_at_rule(&mut self, n: &UnknownAtRule) -> Result {
        punct!("@");
        emit!(n.name);
        space!();

        emit!(n.tokens)
    }

    #[emitter]
    fn emit_str(&mut self, n: &Str) -> Result {
        // TODO: Handle escapes.
        punct!("'");
        self.wr.write_raw(Some(n.span), &n.value)?;
        punct!("'");
    }

    #[emitter]
    fn emit_media_query(&mut self, n: &MediaQuery) -> Result {
        match n {
            MediaQuery::Text(n) => emit!(n),
            MediaQuery::And(n) => emit!(n),
            MediaQuery::Or(n) => emit!(n),
            MediaQuery::Not(n) => emit!(n),
            MediaQuery::Only(n) => emit!(n),
            MediaQuery::Property(n) => emit!(n),
            MediaQuery::Comma(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_decl_block(&mut self, n: &DeclBlock) -> Result {
        punct!("{");

        self.emit_list(
            &n.properties,
            ListFormat::SemiDelimited | ListFormat::MultiLine,
        )?;

        punct!("}");
    }

    #[emitter]
    fn emit_property(&mut self, n: &Property) -> Result {
        emit!(n.name);
        punct!(":");
        space!();
        self.emit_list(
            &n.values,
            ListFormat::SpaceDelimited | ListFormat::SingleLine,
        )?;
        punct!(";");
    }

    #[emitter]
    fn emit_text(&mut self, n: &Text) -> Result {
        self.wr.write_ident(Some(n.span), &n.value)?;
    }

    #[emitter]
    fn emit_keyframe_block_rule(&mut self, n: &KeyframeBlockRule) -> Result {
        match n {
            KeyframeBlockRule::Decl(n) => emit!(n),
            KeyframeBlockRule::AtRule(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_percent_value(&mut self, n: &PercentValue) -> Result {
        emit!(n.value);
        punct!("%");
    }

    #[emitter]
    fn emit_support_query(&mut self, n: &SupportQuery) -> Result {
        match n {
            SupportQuery::Not(n) => emit!(n),
            SupportQuery::And(n) => emit!(n),
            SupportQuery::Or(n) => emit!(n),
            SupportQuery::Property(n) => emit!(n),
            SupportQuery::Paren(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_page_rule_block(&mut self, n: &PageRuleBlock) -> Result {
        punct!("{");

        self.wr.increase_indent();

        self.emit_list(&n.items, ListFormat::MultiLine | ListFormat::SemiDelimited)?;

        self.wr.decrease_indent();

        punct!("}");
    }

    #[emitter]
    fn emit_page_rule_block_item(&mut self, n: &PageRuleBlockItem) -> Result {
        match n {
            PageRuleBlockItem::Property(n) => emit!(n),
            PageRuleBlockItem::Nested(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_paren_value(&mut self, n: &ParenValue) -> Result {
        punct!("(");
        emit!(n.value);
        punct!(")");
    }

    #[emitter]
    fn emit_unit_value(&mut self, n: &UnitValue) -> Result {
        emit!(n.value);
        emit!(n.unit);
    }

    #[emitter]
    fn emit_num(&mut self, n: &Num) -> Result {
        self.wr.write_raw(Some(n.span), &n.value.to_string())?;
    }

    #[emitter]
    fn emit_hash_value(&mut self, n: &HashValue) -> Result {
        punct!("#");

        self.wr.write_ident(Some(n.span), &n.value)?;
    }

    #[emitter]
    fn emit_bin_value(&mut self, n: &BinValue) -> Result {
        emit!(n.left);
        space!();
        punct!(n.op.as_str());
        space!();
        emit!(n.right);
    }

    #[emitter]
    fn emit_array_value(&mut self, n: &ArrayValue) -> Result {
        punct!("[");

        self.emit_list(&n.values, ListFormat::CommaDelimited)?;

        punct!("]");
    }

    #[emitter]
    fn emit_space_values(&mut self, n: &SpaceValues) -> Result {
        self.emit_list(&n.values, ListFormat::SpaceDelimited)?;
    }

    #[emitter]
    fn emit_brace_value(&mut self, n: &BraceValue) -> Result {
        punct!("{");
        emit!(n.value);
        punct!("}");
    }

    #[emitter]
    fn emit_tokens(&mut self, _n: &Tokens) -> Result {
        todo!("emit_tokens")
    }

    #[emitter]
    fn emit_at_text_value(&mut self, n: &AtTextValue) -> Result {
        punct!("@");
        emit!(n.name);
        space!();

        emit!(n.block);
    }

    #[emitter]
    fn emit_url_value(&mut self, n: &UrlValue) -> Result {
        keyword!("url");
        punct!("(");
        self.wr.write_raw(Some(n.span), &n.url)?;
        punct!(")");
    }

    #[emitter]
    fn emit_and_media_query(&mut self, n: &AndMediaQuery) -> Result {
        emit!(n.left);
        space!();

        keyword!("and");

        space!();
        emit!(n.right);
    }

    #[emitter]
    fn emit_or_media_query(&mut self, n: &OrMediaQuery) -> Result {
        emit!(n.left);
        space!();

        keyword!("or");

        space!();
        emit!(n.right);
    }

    #[emitter]
    fn emit_not_media_query(&mut self, n: &NotMediaQuery) -> Result {
        keyword!("not");
        space!();
        emit!(n.query);
    }

    #[emitter]
    fn emit_only_media_query(&mut self, n: &OnlyMediaQuery) -> Result {
        keyword!("only");
        space!();
        emit!(n.query);
    }

    #[emitter]
    fn emit_comma_media_query(&mut self, n: &CommaMediaQuery) -> Result {
        self.emit_list(&n.queries, ListFormat::CommaDelimited)?;
    }

    #[emitter]
    fn emit_not_support_query(&mut self, n: &NotSupportQuery) -> Result {
        keyword!("not");
        space!();
        emit!(n.query);
    }

    #[emitter]
    fn emit_and_support_query(&mut self, n: &AndSupportQuery) -> Result {
        emit!(n.left);
        space!();

        keyword!("and");

        space!();
        emit!(n.right);
    }

    #[emitter]
    fn emit_or_support_query(&mut self, n: &OrSupportQuery) -> Result {
        emit!(n.left);
        space!();

        keyword!("or");

        space!();
        emit!(n.right);
    }

    #[emitter]
    fn emit_paren_support_query(&mut self, n: &ParenSupportQuery) -> Result {
        punct!("(");
        emit!(n.query);
        punct!(")");
    }

    #[emitter]
    fn emit_nested_page_rule(&mut self, n: &NestedPageRule) -> Result {
        self.emit_list(&n.prelude, ListFormat::CommaDelimited)?;

        emit!(n.block);
    }

    #[emitter]
    fn emit_complex_selector(&mut self, n: &ComplexSelector) -> Result {
        self.emit_list(&n.selectors, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_compound_selector(&mut self, n: &CompoundSelector) -> Result {
        emit!(n.type_selector);

        if let Some(combinator) = &n.combinator {
            self.wr.write_punct(None, combinator.as_str())?;
        }

        self.emit_list(&n.subclass_selectors, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_subclass_selector(&mut self, n: &SubclassSelector) -> Result {
        match n {
            SubclassSelector::Id(n) => emit!(n),
            SubclassSelector::Class(n) => emit!(n),
            SubclassSelector::Attr(n) => emit!(n),
            SubclassSelector::PseudoClass(n) => emit!(n),
            SubclassSelector::At(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_unit(&mut self, n: &Unit) -> Result {
        let s: Cow<_> = match &n.kind {
            UnitKind::Px => Cow::Owned("px".into()),
            UnitKind::Custom(s) => Cow::Borrowed(s),
        };
        self.wr.write_ident(Some(n.span), &s)?;
    }

    #[emitter]
    fn emit_namespaced_name(&mut self, n: &NamespacedName) -> Result {
        if let Some(prefix) = &n.prefix {
            emit!(prefix);
            punct!("|");
        }

        emit!(n.name);
    }

    #[emitter]
    fn emit_id_selector(&mut self, n: &IdSelector) -> Result {
        punct!("#");
        emit!(n.text);
    }

    #[emitter]
    fn emit_class_selector(&mut self, n: &ClassSelector) -> Result {
        punct!(".");
        emit!(n.text);
    }

    #[emitter]
    fn emit_attr_selector(&mut self, n: &AttrSelector) -> Result {
        punct!("[");

        emit!(n.name);

        if let Some(op) = n.op {
            self.wr.write_punct(None, op.as_str())?;
        }

        emit!(n.value);

        if let Some(m) = &n.modifier {
            space!();
            self.wr.write_raw(None, &m.to_string())?;
        }

        punct!("]");
    }

    #[emitter]
    fn emit_pseudo_selector(&mut self, n: &PseudoSelector) -> Result {
        punct!(":");
        if n.is_element {
            punct!(":");
        }

        emit!(n.name);

        punct!("(");
        emit!(n.args);
        punct!(")");
    }

    #[emitter]
    fn emit_at_selector(&mut self, n: &AtSelector) -> Result {
        punct!("@");
        emit!(n.text);
    }

    fn emit_list<N>(&mut self, nodes: &[N], format: ListFormat) -> Result
    where
        Self: Emit<N>,
        N: Spanned,
    {
        for (idx, node) in nodes.iter().enumerate() {
            if idx != 0 && idx != nodes.len() - 1 {
                self.write_delim(format)?;
            }
            emit!(self, node)
        }

        Ok(())
    }

    fn write_delim(&mut self, f: ListFormat) -> Result {
        match f & ListFormat::DelimitersMask {
            ListFormat::None => {}
            ListFormat::CommaDelimited => punct!(self, ","),
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
