use super::{input::ParserInput, PResult, Parser};
use crate::token::Token;
use swc_css_ast::*;

#[derive(Debug, Default)]
pub(super) struct AtRuleContext {}

enum AtRuleKind {
    Empty,
    Declarations,
    InheritContext,
}

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(super) fn parse_at_rule(&mut self, ctx: AtRuleContext) -> PResult<AtRule> {
        let start = self.input.cur_span()?.lo;

        assert!(matches!(cur!(self), Token::AtKeyword(..)));

        let name = match bump!(self) {
            Token::AtKeyword(word) => word,
            _ => {
                unreachable!()
            }
        };

        let kind;

        let prelude_start = self.input.cur_span()?.lo;
        match &*name {
            "charset" => {
                kind = AtRuleKind::Empty;

                self.input.skip_ws()?;

                let value = self.may_parse_str()?;

                if let Some(v) = value {
                    let span = span!(self, start);
                    return Ok(AtRule::Charset(CharsetRule { span, charset: v }));
                }
            }

            "import" => {
                kind = AtRuleKind::Empty;
                self.input.skip_ws()?;

                let res = self.expect_url_or_str();
                match res {
                    Ok(path) => {
                        // TODO
                        let import_conditin_start = self.input.cur_span()?.lo;

                        if !is_one_of!(self, ";", EOF) {}
                    }
                    _ => {}
                }
            }

            _ => {}
        }

        todo!("at rule ({})", name)
    }
}
