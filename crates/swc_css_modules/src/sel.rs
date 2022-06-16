use swc_css_ast::*;
use swc_css_parser::{parse_tokens, parser::ParserConfig};
use swc_css_visit::{VisitMut, VisitMutWith};

pub struct SelVisitor {}

impl VisitMut for SelVisitor {
    fn visit_mut_tokens(&mut self, t: &mut Tokens) {
        t.visit_mut_children_with(self);

        while let Some(idx) =
            t.tokens
                .windows(2)
                .position(|tokens| match (&tokens[0].token, &tokens[1].token) {
                    (
                        Token::Colon,
                        Token::Ident { value: v, .. } | Token::Function { value: v, .. },
                    ) => v == "local",
                    _ => false,
                })
        {
            t.tokens.remove(idx);

            // If we remove `local(`, we should insert `(`
            if let Some(TokenAndSpan {
                span,
                token: Token::Function { .. },
            }) = t.tokens.get(idx).cloned()
            {
                t.tokens.insert(
                    idx + 1,
                    TokenAndSpan {
                        span,
                        token: Token::LParen,
                    },
                )
            }
            t.tokens.remove(idx);
        }
    }

    fn visit_mut_rule(&mut self, rule: &mut Rule) {
        rule.visit_mut_children_with(self);

        if let Rule::Invalid(tokens) = rule {
            let new_rule = parse_tokens(
                &*tokens,
                ParserConfig {
                    allow_wrong_line_comments: true,
                },
                &mut vec![],
            );

            if let Ok(new_rule) = new_rule {
                *rule = Rule::QualifiedRule(new_rule);
            }
        }

        dbg!(&*rule);
    }
}
