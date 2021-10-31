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
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, s.to_string());

        let lexer = Lexer::new(
            Default::default(),
            swc_ecma_ast::EsVersion::latest(),
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let mut e = parser.parse_expr().map_err(|e| {
            e.into_diagnostic(&handler).emit();
        })?;

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
fn negate_cost_3() {
    assert_negate_cost(
        "(pvt || (delete cache[id].data, isEmptyDataObject(cache[id]))) && (isNode ? \
         jQuery.cleanData([
            elem
        ], !0) : jQuery.support.deleteExpando || cache != cache.window ? delete cache[id] : \
         cache[id] = null)",
        true,
        true,
        4,
    );
}

#[test]
#[ignore]
fn negate_cost_4() {
    // "(!force && !this._isRebuildRequired()) && !self._buildList()",
    assert_negate_cost(
        "!(force || this._isRebuildRequired()) || self._buildList()",
        true,
        true,
        2,
    );
}

#[test]
fn negate_cost_5() {
    assert_negate_cost(
        "!(capacity && codeResult1 && (codeResult2 = codeResult1, !((list = config.blacklist) && \
         list.some(function(item) {
            return Object.keys(item).every(function(key) {
                return item[key] === codeResult2[key];
            });
        }))) && (codeResult3 = codeResult1, \"function\" != typeof (filter = config.filter) || \
         filter(codeResult3))) || (capacity--, result.codeResult = codeResult, capture && \
         (canvas.width = imageSize.x, canvas.height = imageSize.y, image_debug.a.drawImage(data, \
         imageSize, ctx), result.frame = canvas.toDataURL()), results.push(result))",
        true,
        true,
        -1,
    );
}

#[test]
fn negate_cost_5_1() {
    assert_negate_cost(
        "!(capacity && codeResult1 && (codeResult2 = codeResult1, !((list = config.blacklist) && \
         list.some(function(item) {
            return Object.keys(item).every(function(key) {
                return item[key] === codeResult2[key];
            });
        }))) && (codeResult3 = codeResult1, \"function\" != typeof (filter = config.filter) || \
         filter(codeResult3)))",
        true,
        false,
        -1,
    );
}

#[test]
fn negate_cost_5_2() {
    assert_negate_cost(
        "!(capacity && codeResult1 && (codeResult2 = codeResult1, !((list = config.blacklist) && \
         list.some(function(item) {
            return Object.keys(item).every(function(key) {
                return item[key] === codeResult2[key];
            });
        }))))",
        true,
        false,
        -1,
    );
}

#[test]
fn negate_cost_5_3() {
    assert_negate_cost(
        "!(codeResult2 = codeResult1, !((list = config.blacklist) && list.some(function(item) {
            return Object.keys(item).every(function(key) {
                return item[key] === codeResult2[key];
            });
        })))",
        true,
        false,
        -1,
    );
}

#[test]
fn negate_cost_6() {
    assert_negate_cost(
        "
        capacity && codeResult1 && (codeResult2 = codeResult1, !((list = config.blacklist) && \
         list.some(function(item) {
            return Object.keys(item).every(function(key) {
                return item[key] === codeResult2[key];
            });
        }))) && (codeResult3 = codeResult1, \"function\" != typeof (filter = config.filter) || \
         filter(codeResult3)) && (capacity--, result.codeResult = codeResult, capture && \
         (canvas.width = imageSize.x, canvas.height = imageSize.y, image_debug.a.drawImage(data, \
         imageSize, ctx), result.frame = canvas.toDataURL()), results.push(result))",
        true,
        true,
        4,
    );
}

#[test]
fn negate_cost_6_1() {
    assert_negate_cost(
        "
        capacity && codeResult1 && (codeResult2 = codeResult1, !((list = config.blacklist) && \
         list.some(function(item) {
            return Object.keys(item).every(function(key) {
                return item[key] === codeResult2[key];
            });
        }))) && (codeResult3 = codeResult1, \"function\" != typeof (filter = config.filter) || \
         filter(codeResult3))",
        true,
        false,
        4,
    );
}

#[test]
fn negate_cost_6_2() {
    assert_negate_cost(
        "
        !((list = config.blacklist) && list.some(function(item) {
            return Object.keys(item).every(function(key) {
                return item[key] === codeResult2[key];
            });
        }))",
        true,
        false,
        -1,
    );
}
