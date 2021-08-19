pub use self::emit::*;
pub use std::fmt::Result;
use std::fmt::Write;
use swc_css_ast::*;
use swc_css_codegen_macros::emitter;

#[macro_use]
mod macros;
mod emit;

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
}
