use swc_common::{sync::Lrc, util::take::Take, FileName, Mark, SourceMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::parse_file_as_expr;
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_utils::{drop_span, DropSpan, ExprCtx, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use tracing::{info, warn};

use super::negate_cost;
use crate::compress::util::negate;

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

        let print_expr = |mut e: Box<Expr>| {
            if is_ret_val_ignored {
                let mut e = e.into_stmt();
                e.visit_mut_with(&mut fixer(None));
                print_node(&e)
            } else {
                e.visit_mut_with(&mut fixer(None));
                print_node(&e)
            }
        };

        let input = print_expr(e.clone());

        let expr_ctx = ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(Mark::new()),
            is_unresolved_ref_safe: false,
            in_strict: false,
            remaining_depth: 2,
        };

        let real = {
            let mut real = e.clone();
            negate(expr_ctx, &mut real, in_bool_ctx, is_ret_val_ignored);
            print_expr(real)
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

        let actual = negate_cost(expr_ctx, &e, in_bool_ctx, is_ret_val_ignored);

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
        0,
    );
}

#[test]
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
fn negate_cost_4_1() {
    // "(!force && !this._isRebuildRequired()) && !self._buildList()",
    assert_negate_cost("!(force || this._isRebuildRequired())", true, false, -1);
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
fn next_31077_1() {
    assert_negate_cost(
        "((!a || !(a instanceof TextViewDesc1) || /\\n$/.test(a.node.text)) && ((result1.safari \
         || result1.chrome) && a && 'false' == a.dom.contentEditable && this.addHackNode('IMG'), \
         this.addHackNode('BR')))",
        true,
        true,
        -3,
    );
}

#[test]
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

#[test]
fn negate_cost_iterator_pattern_1() {
    assert_negate_cost(
        "!_iteratorNormalCompletion && null != _iterator.return && _iterator.return()",
        false,
        true,
        -1,
    );
}

#[test]
fn negate_cost_iterator_pattern_2() {
    assert_negate_cost(
        "!_iteratorNormalCompletion && null != _iterator.return",
        true,
        false,
        -1,
    );
}

fn print_node<N>(node: &N) -> String
where
    N: swc_ecma_codegen::Node + Clone + VisitMutWith<DropSpan>,
{
    let mut node = node.clone();
    node = drop_span(node);
    let mut buf = Vec::new();
    let cm = Lrc::new(SourceMap::default());

    {
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(true),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        node.emit_with(&mut emitter).unwrap();
    }

    String::from_utf8(buf).unwrap()
}
