use super::{jsx, primary, template, ByteHandler, RawLexResult, RawLexer, RawTokenKind};

#[derive(Clone, Default, PartialEq, Eq, Debug)]
pub enum RawLexerContext {
    #[default]
    JsLiteral,
    JsTemplateLiteral,
    JsTemplateSpanLiteral,
    JsTemplateQuasiLiteral,
    JSXExpr,
    JSXSpan,
    JSXTag,
    JSXSelfClosingTag,
}

impl RawLexer<'_> {
    pub(super) fn handler_from_byte(&self, byte: u8) -> ByteHandler {
        // TODO: perf improvement by using array
        match self.context {
            RawLexerContext::JsLiteral => primary::handler_from_byte(byte),
            RawLexerContext::JsTemplateLiteral => template::handler_for_byte,
            RawLexerContext::JsTemplateSpanLiteral => template::handler_for_byte,
            RawLexerContext::JsTemplateQuasiLiteral => primary::handler_from_byte(byte),
            // TODO: JSX parse should not in lexer.
            RawLexerContext::JSXExpr => jsx::handler_for_byte,
            RawLexerContext::JSXTag => jsx::handler_for_byte,
            RawLexerContext::JSXSelfClosingTag => jsx::handler_for_byte,
            RawLexerContext::JSXSpan => primary::handler_from_byte(byte),
        }
    }

    pub(crate) fn set_context(&mut self, context: RawLexerContext) {
        self.context = context;
    }
}
