use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn minify(ss: &mut Stylesheet) {
    ss.visit_mut_with(&mut minifier());
}

fn minifier() -> impl VisitMut {
    Minifier {}
}

struct Minifier {}

impl VisitMut for Minifier {
    fn visit_mut_tokens(&mut self, tokens: &mut Tokens) {
        for tok in tokens.tokens.iter_mut() {
            match &mut tok.token {
                Token::WhiteSpace { value, .. } => {
                    if value.len() >= 2 {
                        *value = " ".into()
                    }
                }
                _ => {}
            }
        }
    }
}
