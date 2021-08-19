pub use self::emit::*;
use self::list::ListFormat;
pub use std::fmt::Result;
use std::fmt::Write;
use swc_common::Spanned;
use swc_css_ast::*;
use swc_css_codegen_macros::emitter;

#[macro_use]
mod macros;
mod emit;
mod list;

#[derive(Debug, Clone, Copy)]
pub struct CodegenConfig {
    pub minify: bool,
}
#[derive(Debug)]
pub struct CodeGenerator<W>
where
    W: Write,
{
    wr: W,
    config: CodegenConfig,
}

impl<W> CodeGenerator<W>
where
    W: Write,
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
    fn emit_style_rule(&mut self, n: &StyleRule) -> Result {}

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
            ListFormat::BarDelimited => {
                punct!(self, "|")
            }
            ListFormat::AmpersandDelimited => {
                punct!(self, "&")
            }
            _ => unreachable!(),
        }

        Ok(())
    }
}
