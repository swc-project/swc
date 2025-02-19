use super::{jsx, primary, template, ByteHandler, RawLexResult, RawLexer, RawTokenKind};

#[derive(Clone, Default, PartialEq, Eq)]
pub enum RawLexerContext {
    #[default]
    JsLiteral,
    JsTemplateLiteral,
    JsTemplateSpanLiteral,
    JsTemplateQuasiLiteral,
    Jsx,
    JsxTag,
}

impl RawLexer<'_> {
    pub(super) fn handler_from_byte(&self, byte: u8) -> ByteHandler {
        match self.context {
            RawLexerContext::JsLiteral => primary::handler_from_byte(byte),
            RawLexerContext::JsTemplateLiteral => template::handler_for_byte,
            RawLexerContext::JsTemplateSpanLiteral => template::handler_for_byte,
            RawLexerContext::JsTemplateQuasiLiteral => primary::handler_from_byte(byte),
            RawLexerContext::Jsx => jsx::handler_from_byte(byte),
            RawLexerContext::JsxTag => jsx::handler_from_byte(byte),
        }
    }

    pub(super) fn set_context(&mut self, context: RawLexerContext) {
        self.context = context;
    }
}
