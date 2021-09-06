use super::negate_cost;
use swc_common::{input::SourceFileInput, util::take::Take, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

struct UnwrapParen;
impl VisitMut for UnwrapParen {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Paren(p) => {
                *e = *p.expr.take();
            }
            _ => {}
        }
    }
}

fn assert_negate_cost(s: &str, in_bool_ctx: bool, is_ret_val_ignored: bool, expected: isize) {
    testing::run_test2(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, s.to_string());

        let lexer = Lexer::new(
            Default::default(),
            swc_ecma_ast::EsVersion::latest(),
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let mut e = parser
            .parse_expr()
            .expect("failed to parse input as an expression");

        e.visit_mut_with(&mut UnwrapParen);

        let actual = negate_cost(&e, in_bool_ctx, is_ret_val_ignored).unwrap();

        assert_eq!(
            actual, expected,
            "Expected negation cost of {} to be {}, but got {}",
            s, expected, actual,
        );

        Ok(())
    })
    .unwrap();
}

#[test]
fn negate_cost_1() {
    assert_negate_cost(
        "this[key] && !this.hasOwnProperty(key) || (this[key] = value)",
        false,
        true,
        2,
    );
}

#[test]
#[ignore]
fn negate_cost_2() {
    assert_negate_cost(
        "(!this[key] || this.hasOwnProperty(key)) && (this[key] = value)",
        false,
        true,
        -2,
    );
}

#[test]
#[ignore]
fn negate_cost_3() {
    assert_negate_cost(
        "(jQuery.support.deleteExpando || cache != cache.window) ? !(delete cache[id]) : \
         !(cache[id] = null)",
        false,
        true,
        -2,
    );
}
