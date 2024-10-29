use swc_common::{util::take::Take, FileName, Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_parser::parse_file_as_expr;
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_utils::ExprCtx;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use tracing::{info, warn};

use super::negate_cost;
use crate::{compress::util::negate, debug::dump};

struct UnwrapParen;
impl VisitMut for UnwrapParen {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Paren(p) = e {
            *e = *p.expr.take();
        }
    }
}

fn assert_negate_cost(s: &str, in_bool_ctx: bool, is_ret_val_ignored: bool, expected: isize) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon.into(), s.to_string());

        let mut e = parse_file_as_expr(
            &fm,
            Default::default(),
            swc_ecma_ast::EsVersion::latest(),
            None,
            &mut Vec::new(),
        )
        .map_err(|e| {
            e.into_diagnostic(&handler).emit();
        })?;

        e.visit_mut_with(&mut UnwrapParen);

        let input = {
            let mut e = e.clone();
            e.visit_mut_with(&mut fixer(None));
            dump(&e, true)
        };

        let expr_ctx = ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(Mark::new()),
            is_unresolved_ref_safe: false,
            in_strict: false,
        };

        let real = {
            let mut real = e.clone();
            negate(&expr_ctx, &mut real, in_bool_ctx, is_ret_val_ignored);
            real.visit_mut_with(&mut fixer(None));
            dump(&real, true)
        };

        {
            warn!(
                "Actual: {} ;Input = {}, Real = {}",
                real.len() as isize - input.len() as isize,
                input.len(),
                real.len()
            );
            info!("Real: {}", real);
            info!("Input: {}", input);
        }

        let actual = negate_cost(&expr_ctx, &e, in_bool_ctx, is_ret_val_ignored);

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

#[test]
#[ignore]
fn next_31077_1() {
    assert_negate_cost(
        "((!a || !(a instanceof TextViewDesc1) || /\\n$/.test(a.node.text)) && ((result1.safari \
         || result1.chrome) && a && 'false' == a.dom.contentEditable && this.addHackNode('IMG'), \
         this.addHackNode('BR')))",
        true,
        true,
        0,
    );
}

#[test]
#[ignore]
fn next_31077_2() {
    assert_negate_cost(
        "!((!a || !(a instanceof TextViewDesc1) || /\\n$/.test(a.node.text)) || ((result1.safari \
         || result1.chrome) && a && 'false' == a.dom.contentEditable && this.addHackNode('IMG'), \
         this.addHackNode('BR')))",
        true,
        true,
        -3,
    );
}
