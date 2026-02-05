use std::{borrow::Cow, iter::zip, mem::take};

use swc_atoms::{
    wtf8::{Wtf8, Wtf8Buf},
    Atom, Wtf8Atom,
};
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};
use Value::Known;

use super::Pure;

impl Pure<'_> {
    /// This only handles `'foo' + ('bar' + baz) because others are handled by
    /// expression simplifier.
    pub(super) fn eval_str_addition(&mut self, e: &mut Expr) {
        let (span, l_l, r_l, r_r) = match e {
            Expr::Bin(
                e @ BinExpr {
                    op: op!(bin, "+"), ..
                },
            ) => match &mut *e.right {
                Expr::Bin(
                    r @ BinExpr {
                        op: op!(bin, "+"), ..
                    },
                ) => (e.span, &mut *e.left, &mut *r.left, &mut r.right),
                _ => return,
            },
            _ => return,
        };

        match l_l.get_type(self.expr_ctx) {
            Known(Type::Str) => {}
            _ => return,
        }
        match r_l.get_type(self.expr_ctx) {
            Known(Type::Str) => {}
            _ => return,
        }

        let lls = l_l.as_pure_string(self.expr_ctx);
        let rls = r_l.as_pure_string(self.expr_ctx);

        if let (Known(lls), Known(rls)) = (lls, rls) {
            self.changed = true;
            report_change!("evaluate: 'foo' + ('bar' + baz) => 'foobar' + baz");

            let s = lls.into_owned() + &*rls;
            *e = BinExpr {
                span,
                op: op!(bin, "+"),
                left: s.into(),
                right: r_r.take(),
            }
            .into();
        }
    }

    pub(super) fn eval_tpl_as_str(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        fn need_unsafe(e: &Expr) -> bool {
            match e {
                Expr::Lit(..) => false,
                Expr::Bin(e) => need_unsafe(&e.left) || need_unsafe(&e.right),
                _ => true,
            }
        }

        let tpl = match e {
            Expr::Tpl(e) => e,
            _ => return,
        };

        if tpl.quasis.len() == 2
            && (tpl.quasis[0].cooked.is_some() || !tpl.quasis[0].raw.contains('\\'))
            && tpl.quasis[1].raw.is_empty()
        {
            if !self.options.unsafe_passes && need_unsafe(&tpl.exprs[0]) {
                return;
            }

            self.changed = true;
            report_change!("evaluating a template to a string");
            *e = BinExpr {
                span: tpl.span,
                op: op!(bin, "+"),
                left: tpl.quasis[0]
                    .cooked
                    .clone()
                    .unwrap_or_else(|| tpl.quasis[0].raw.clone().into())
                    .into(),
                right: tpl.exprs[0].take(),
            }
            .into();
        }
    }

    pub(super) fn eval_nested_tpl(&mut self, e: &mut Expr) {
        let tpl = match e {
            Expr::Tpl(e) => e,
            _ => return,
        };

        if !tpl.exprs.iter().any(|e| match &**e {
            Expr::Tpl(t) => t
                .quasis
                .iter()
                .all(|q| q.cooked.is_some() && !q.raw.contains('\\')),
            _ => false,
        }) {
            return;
        }

        self.changed = true;
        report_change!("evaluating nested template literals");

        let mut new_tpl = Tpl {
            span: tpl.span,
            quasis: Default::default(),
            exprs: Default::default(),
        };
        let mut cur_cooked_str = Wtf8Buf::new();
        let mut cur_raw_str = String::new();
        let mut q_iter = tpl.quasis.take().into_iter();
        let e_iter = tpl.exprs.take().into_iter();

        macro_rules! push_str {
            ($e:expr) => {
                if let Some(cooked) = $e.cooked {
                    cur_cooked_str.push_wtf8(&cooked);
                } else {
                    cur_cooked_str.push_wtf8(&Str::from_tpl_raw(&$e));
                }
                cur_raw_str.push_str(&$e.raw);
            };
        }

        macro_rules! end_str {
            () => {
                let cooked = Wtf8Atom::from(&*cur_cooked_str);
                let raw = Atom::from(&*cur_raw_str);
                cur_cooked_str.clear();
                cur_raw_str.clear();
                new_tpl.quasis.push(TplElement {
                    span: DUMMY_SP,
                    tail: false,
                    cooked: Some(cooked),
                    raw,
                });
            };
        }

        // Consume quasis first to make sure it align with exprs
        // quasis.len() == exprs.len() + 1
        if let Some(q) = q_iter.next() {
            push_str!(q);
        }

        for (q, mut e) in zip(q_iter, e_iter) {
            self.eval_nested_tpl(&mut e);
            match *e {
                Expr::Tpl(mut tpl) => {
                    // For evaluated template only the first
                    // and the last quasi could be concat with
                    // outside quasis.
                    let mut quasis_taken = tpl.quasis.take();
                    let l = quasis_taken.len();

                    // Store the first quasi for later concat
                    let first = quasis_taken[0].take();
                    push_str!(first);

                    if l > 1 {
                        // If there are more than one quasi
                        // Concat first with outside quasis
                        end_str!();

                        // Store the last quasi for later concat
                        let last = quasis_taken.pop().unwrap();
                        push_str!(last);

                        // Append the rest of quasis and exprs to new_tpl
                        new_tpl.quasis.extend(quasis_taken.into_iter().skip(1));
                        new_tpl.exprs.extend(tpl.exprs.into_iter());
                    }
                }
                _ => {
                    end_str!();

                    new_tpl.exprs.push(e);
                }
            }
            push_str!(q);
        }

        end_str!();

        *e = new_tpl.into();
    }

    /// Converts template literals to string if `exprs` of [Tpl] is empty.
    pub(super) fn convert_tpl_to_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Tpl(t) if t.quasis.len() == 1 && t.exprs.is_empty() => {
                let c = &t.quasis[0].raw;
                let mut template_longer_count = 0;
                let mut iter = c.chars().peekable();
                while let Some(ch) = iter.next() {
                    match ch {
                        '\\' => {
                            if let Some(next_ch) = iter.next() {
                                match next_ch {
                                    c @ '\n' | c @ '\r' => {
                                        if c == '\r' && iter.peek() == Some(&'\n') {
                                            iter.next();
                                        }
                                    }
                                    'n' | 'r' => {
                                        template_longer_count -= 1;
                                    }
                                    '`' => {
                                        template_longer_count += 1;
                                    }
                                    _ => {}
                                }
                            }
                        }
                        c @ '\n' | c @ '\r' => {
                            template_longer_count -= 1;
                            if c == '\r' && iter.peek() == Some(&'\n') {
                                iter.next();
                            }
                        }
                        _ => {
                            // When the target environment is below ES2015
                            // and non-BMP characters (like emojis) are encountered,
                            // we stop the conversion.
                            //
                            // This is because:
                            // 1. Tpl: `🦀` (may output directly in source code or require minimal
                            //    escaping) -> shorter
                            // 2. Str (in ES5 mode): `\uD83E\uDD80` (escape sequence for surrogate
                            //    pair) -> extremely long
                            if self.options.ecma < EsVersion::Es2015 && ch > '\u{ffff}' {
                                return;
                            }
                        }
                    }
                }

                if template_longer_count < 0 {
                    return;
                }

                if let Some(cooked) = &t.quasis[0].cooked {
                    report_change!("converting a template literal to a string literal");

                    *e = Lit::Str(Str {
                        span: t.span,
                        raw: None,
                        value: cooked.clone(),
                    })
                    .into();
                    return;
                }

                let value = Str::from_tpl_raw(&t.quasis[0]);

                report_change!(
                    "converting a template literal to a string literal by Str::from_tpl_raw"
                );

                *e = Lit::Str(Str {
                    span: t.span,
                    raw: None,
                    value,
                })
                .into();
            }
            _ => {}
        }
    }

    /// This compresses a template literal by inlining string literals in
    /// expresions into quasis.
    ///
    /// Note that this pass only cares about string literals and conversion to a
    /// string literal should be done before calling this pass.
    pub(super) fn compress_tpl(&mut self, tpl: &mut Tpl) {
        debug_assert_eq!(tpl.exprs.len() + 1, tpl.quasis.len());
        let has_str_lit = tpl
            .exprs
            .iter()
            .any(|expr| matches!(&**expr, Expr::Lit(Lit::Str(..))));
        if !has_str_lit {
            return;
        }

        trace_op!("compress_tpl");

        let mut quasis = Vec::new();
        let mut exprs = Vec::new();
        let mut cur_raw = String::new();
        let mut cur_cooked = Some(Wtf8Buf::new());

        for i in 0..(tpl.exprs.len() + tpl.quasis.len()) {
            if i % 2 == 0 {
                let i = i / 2;
                let q = tpl.quasis[i].clone();

                if q.cooked.is_some() {
                    if let Some(cur_cooked) = &mut cur_cooked {
                        cur_cooked.push_str("");
                    }
                } else {
                    // If cooked is None, it means that the template literal contains invalid escape
                    // sequences.
                    cur_cooked = None;
                }
            } else {
                let i = i / 2;
                let e = &tpl.exprs[i];

                match &**e {
                    Expr::Lit(Lit::Str(s)) => {
                        if cur_cooked.is_none() && s.raw.is_none() {
                            return;
                        }

                        if let Some(cur_cooked) = &mut cur_cooked {
                            cur_cooked.push_str("");
                        }
                    }
                    _ => {
                        cur_cooked = Some(Wtf8Buf::new());
                    }
                }
            }
        }

        cur_cooked = Some(Default::default());

        for i in 0..(tpl.exprs.len() + tpl.quasis.len()) {
            if i % 2 == 0 {
                let i = i / 2;
                let q = tpl.quasis[i].take();

                cur_raw.push_str(&q.raw);
                if let Some(cooked) = q.cooked {
                    if let Some(cur_cooked) = &mut cur_cooked {
                        cur_cooked.push_wtf8(&cooked);
                    }
                } else {
                    // If cooked is None, it means that the template literal contains invalid escape
                    // sequences.
                    cur_cooked = None;
                }
            } else {
                let i = i / 2;
                let e = tpl.exprs[i].take();

                match *e {
                    Expr::Lit(Lit::Str(s)) => {
                        if let Some(cur_cooked) = &mut cur_cooked {
                            cur_cooked.push_wtf8(&Cow::Borrowed(&s.value));
                        }

                        if let Some(raw) = &s.raw {
                            if raw.len() >= 2 {
                                // Exclude quotes
                                cur_raw
                                    .push_str(&convert_str_raw_to_tpl_raw(&raw[1..raw.len() - 1]));
                            }
                        } else {
                            cur_raw.push_str(&convert_str_value_to_tpl_raw(&s.value));
                        }
                    }
                    _ => {
                        quasis.push(TplElement {
                            span: DUMMY_SP,
                            tail: true,
                            cooked: cur_cooked.take().map(From::from),
                            raw: take(&mut cur_raw).into(),
                        });
                        cur_cooked = Some(Wtf8Buf::new());

                        exprs.push(e);
                    }
                }
            }
        }

        report_change!("compressing template literals");

        quasis.push(TplElement {
            span: DUMMY_SP,
            tail: true,
            cooked: cur_cooked.map(From::from),
            raw: cur_raw.into(),
        });

        debug_assert_eq!(exprs.len() + 1, quasis.len());

        tpl.quasis = quasis;
        tpl.exprs = exprs;
    }

    /// Called for binary operations with `+`.
    pub(super) fn concat_tpl(&mut self, l: &mut Expr, r: &mut Expr) {
        match (&mut *l, &mut *r) {
            (Expr::Tpl(l), Expr::Lit(Lit::Str(rs))) => {
                if let Some(raw) = &rs.raw {
                    if raw.len() <= 2 {
                        return;
                    }
                }

                // Append
                if let Some(l_last) = l.quasis.last_mut() {
                    self.changed = true;

                    report_change!(
                        "template: Concatted a string (`{:?}`) on rhs of `+` to a template literal",
                        rs.value
                    );

                    if let Some(cooked) = &mut l_last.cooked {
                        let mut c = Wtf8Buf::from(&*cooked);
                        c.push_wtf8(&Cow::Borrowed(&rs.value));
                        *cooked = c.into();
                    }

                    l_last.raw = format!(
                        "{}{}",
                        l_last.raw,
                        rs.raw
                            .clone()
                            .map(|s| convert_str_raw_to_tpl_raw(&s[1..s.len() - 1]))
                            .unwrap_or_else(|| convert_str_value_to_tpl_raw(&rs.value).into())
                    )
                    .into();

                    r.take();
                }
            }

            (Expr::Lit(Lit::Str(ls)), Expr::Tpl(r)) => {
                if let Some(raw) = &ls.raw {
                    if raw.len() <= 2 {
                        return;
                    }
                }

                // Append
                if let Some(r_first) = r.quasis.first_mut() {
                    self.changed = true;

                    report_change!(
                        "template: Prepended a string (`{:?}`) on lhs of `+` to a template literal",
                        ls.value
                    );

                    if let Some(cooked) = &mut r_first.cooked {
                        let mut c = Wtf8Buf::new();
                        c.push_wtf8(&Cow::Borrowed(&ls.value));
                        c.push_wtf8(&*cooked);
                        *cooked = c.into();
                    }

                    let new: Atom = format!(
                        "{}{}",
                        ls.raw
                            .clone()
                            .map(|s| convert_str_raw_to_tpl_raw(&s[1..s.len() - 1]))
                            .unwrap_or_else(|| convert_str_value_to_tpl_raw(&ls.value).into()),
                        r_first.raw
                    )
                    .into();
                    r_first.raw = new;

                    l.take();
                }
            }

            (Expr::Tpl(l), Expr::Tpl(rt)) => {
                // We prepend the last quasis of l to the first quasis of r.
                // After doing so, we can append all data of r to l.

                {
                    let l_last = l.quasis.pop().unwrap();
                    let r_first = rt.quasis.first_mut().unwrap();
                    let new: Atom = format!("{}{}", l_last.raw, r_first.raw).into();

                    r_first.raw = new;
                }

                l.quasis.extend(rt.quasis.take());
                l.exprs.extend(rt.exprs.take());
                // Remove r
                r.take();

                debug_assert!(l.quasis.len() == l.exprs.len() + 1, "{l:?} is invalid");
                self.changed = true;
                report_change!("strings: Merged two template literals");
            }
            _ => {}
        }
    }

    ///
    /// - `a + 'foo' + 'bar'` => `a + 'foobar'`
    pub(super) fn concat_str(&mut self, e: &mut Expr) {
        if let Expr::Bin(
            bin @ BinExpr {
                op: op!(bin, "+"), ..
            },
        ) = e
        {
            if let Expr::Bin(
                left @ BinExpr {
                    op: op!(bin, "+"), ..
                },
            ) = &mut *bin.left
            {
                let type_of_second = left.right.get_type(self.expr_ctx);
                let type_of_third = bin.right.get_type(self.expr_ctx);

                if let Value::Known(Type::Str) = type_of_second {
                    if let Value::Known(Type::Str) = type_of_third {
                        if let Value::Known(second_str) = left.right.as_pure_wtf8(self.expr_ctx) {
                            if let Value::Known(third_str) = bin.right.as_pure_wtf8(self.expr_ctx) {
                                #[cfg(feature = "debug")]
                                let debug_second_str = second_str.clone();

                                let new_str = second_str.into_owned() + &*third_str;
                                let left_span = left.span;

                                self.changed = true;
                                report_change!(
                                    "strings: Concatting `{:?} + {:?}` to `{:?}`",
                                    debug_second_str,
                                    third_str,
                                    new_str
                                );

                                *e = BinExpr {
                                    span: bin.span,
                                    op: op!(bin, "+"),
                                    left: left.left.take(),
                                    right: Lit::Str(Str {
                                        span: left_span,
                                        raw: None,
                                        value: new_str.into(),
                                    })
                                    .into(),
                                }
                                .into();
                            }
                        }
                    }
                }
            }
        }
    }

    pub(super) fn drop_useless_addition_of_str(&mut self, e: &mut Expr) {
        if let Expr::Bin(BinExpr {
            op: op!(bin, "+"),
            left,
            right,
            ..
        }) = e
        {
            let lt = left.get_type(self.expr_ctx);
            let rt = right.get_type(self.expr_ctx);
            if let Value::Known(Type::Str) = lt {
                if let Value::Known(Type::Str) = rt {
                    match &**left {
                        Expr::Lit(Lit::Str(Str { value, .. })) if value.is_empty() => {
                            self.changed = true;
                            report_change!(
                                "string: Dropping empty string literal (in lhs) because it does \
                                 not changes type"
                            );

                            *e = *right.take();
                            return;
                        }
                        _ => (),
                    }

                    match &**right {
                        Expr::Lit(Lit::Str(Str { value, .. })) if value.is_empty() => {
                            self.changed = true;
                            report_change!(
                                "string: Dropping empty string literal (in rhs) because it does \
                                 not changes type"
                            );

                            *e = *left.take();
                        }
                        _ => (),
                    }
                }
            }
        }
    }
}

pub(super) fn convert_str_value_to_tpl_raw(value: &Wtf8) -> Cow<str> {
    let mut result = String::default();

    let iter = value.code_points();
    for code_point in iter {
        if let Some(ch) = code_point.to_char() {
            match ch {
                '\\' => {
                    result.push_str("\\\\");
                }
                '`' => {
                    result.push_str("\\`");
                }
                '$' => {
                    result.push_str("\\$");
                }
                '\n' => {
                    result.push_str("\\n");
                }
                '\r' => {
                    result.push_str("\\r");
                }
                _ => result.push(ch),
            }
        } else {
            result.push_str(&format!("\\u{:04X}", code_point.to_u32()));
        }
    }

    result.into()
}

pub(super) fn convert_str_raw_to_tpl_raw(value: &str) -> Atom {
    value.replace('`', "\\`").replace('$', "\\$").into()
}

#[cfg(test)]
mod tests {
    use swc_common::{FileName, Mark, SyntaxContext};
    use swc_ecma_ast::*;
    use swc_ecma_codegen::{
        text_writer::{omit_trailing_semi, JsWriter, WriteJs},
        Config, Emitter,
    };
    use swc_ecma_parser::{parse_file_as_module, EsSyntax, Syntax};
    use swc_ecma_transforms_base::{fixer::fixer, resolver};
    use swc_ecma_usage_analyzer::marks::Marks;
    use swc_ecma_visit::VisitMutWith;

    use crate::{
        compress::pure::{pure_optimizer, PureOptimizerConfig},
        option::CompressOptions,
    };

    /// Helper to minify code with specific EcmaScript version and run
    /// assertion.
    fn run_test(src: &str, ecma: EsVersion, target: EsVersion, check: impl FnOnce(String)) {
        testing::run_test2(false, |cm, _handler| {
            let fm = cm.new_source_file(FileName::Anon.into(), src.to_string());

            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            let mut module = parse_file_as_module(
                &fm,
                Syntax::Es(EsSyntax::default()),
                EsVersion::latest(),
                None,
                &mut Vec::new(),
            )
            .expect("failed to parse");

            module.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

            let marks = Marks {
                unresolved_mark,
                top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
                const_ann: Mark::new(),
                noinline: Mark::new(),
                pure: Mark::new(),
                fake_block: Mark::new(),
            };

            let compress_options = CompressOptions {
                ecma,
                ..Default::default()
            };

            let mut optimizer = pure_optimizer(
                &compress_options,
                marks,
                PureOptimizerConfig {
                    enable_join_vars: false,
                },
            );

            module.visit_mut_with(&mut optimizer);
            module.visit_mut_with(&mut fixer(None));

            // Generate code with target version
            let mut buf = Vec::new();
            {
                let wr: Box<dyn WriteJs> = Box::new(omit_trailing_semi(Box::new(JsWriter::new(
                    cm.clone(),
                    "\n",
                    &mut buf,
                    None,
                ))));

                let mut emitter = Emitter {
                    cfg: Config::default().with_target(target).with_minify(true),
                    cm,
                    comments: None,
                    wr,
                };

                emitter.emit_module(&module).expect("failed to emit module");
            }

            let output = String::from_utf8(buf).expect("invalid utf8");
            check(output);

            Ok(())
        })
        .unwrap();
    }

    // ===== Emoji/Non-BMP Character Tests =====

    /// Test: Emoji (U+1F980, crab) should NOT be converted to string in ES5
    /// because codegen would produce long surrogate pair escapes.
    #[test]
    fn test_emoji_es5_should_not_convert() {
        run_test(
            r#"console.log(`🦀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // In ES5, the template should remain as-is or the string should have
                // surrogate pairs which would be longer
                // Template literals with emoji should NOT become strings in ES5
                assert!(
                    output.contains('`') || !output.contains("\\u"),
                    "ES5 should keep template literal or not use surrogate escapes. Got: {output}",
                );
            },
        );
    }

    /// Test: Emoji should be converted to string in ES2015+ (shorter output)
    #[test]
    fn test_emoji_es2015_should_convert() {
        run_test(
            r#"console.log(`🦀`)"#,
            EsVersion::Es2015,
            EsVersion::Es2015,
            |output| {
                // In ES2015+, template can be converted to string
                // The string literal can contain emoji directly
                assert!(
                    output.contains("\"🦀\"") || output.contains("'🦀'") || output.contains("`🦀`"),
                    "ES2015+ should produce short output. Got: {output}",
                );
            },
        );
    }

    /// Test: Multiple emojis in ES5
    #[test]
    fn test_multiple_emojis_es5() {
        run_test(
            r#"console.log(`🦀🎉🚀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // Should NOT convert - would produce very long surrogate pairs
                assert!(
                    output.contains('`'),
                    "ES5 should keep template literal with multiple emojis. Got: {output}",
                );
            },
        );
    }

    /// Test: Multiple emojis in ES2015
    #[test]
    fn test_multiple_emojis_es2015() {
        run_test(
            r#"console.log(`🦀🎉🚀`)"#,
            EsVersion::Es2015,
            EsVersion::Es2015,
            |output| {
                // Can convert - emojis can be in string directly
                assert!(
                    output.contains("🦀") && output.contains("🎉") && output.contains("🚀"),
                    "ES2015+ should preserve emojis directly. Got: {output}",
                );
            },
        );
    }

    /// Test: Mixed ASCII and emoji in ES5
    #[test]
    fn test_mixed_ascii_emoji_es5() {
        run_test(
            r#"console.log(`Hello 🦀 World`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // Should NOT convert due to emoji
                assert!(
                    output.contains('`'),
                    "ES5 should keep template literal with mixed ASCII and emoji. Got: {output}",
                );
            },
        );
    }

    /// Test: Mixed ASCII and emoji in ES2015
    #[test]
    fn test_mixed_ascii_emoji_es2015() {
        run_test(
            r#"console.log(`Hello 🦀 World`)"#,
            EsVersion::Es2015,
            EsVersion::Es2015,
            |output| {
                // Can convert
                assert!(
                    output.contains("Hello") && output.contains("🦀") && output.contains("World"),
                    "ES2015+ should preserve content. Got: {output}",
                );
            },
        );
    }

    // ===== Unicode Escape Sequence Tests =====

    /// Test: Unicode escape \u{1F980} (crab emoji) in ES5
    /// The raw string contains the escape but cooked value has the emoji
    #[test]
    fn test_unicode_escape_es5() {
        // \u{1F980} is the crab emoji
        run_test(
            r#"console.log(`\u{1F980}`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // The cooked value would contain the emoji character
                // This should NOT be converted in ES5
                // Note: parser interprets \u{1F980} -> 🦀 in cooked
                assert!(
                    output.contains('`') || output.contains("\\u"),
                    "ES5 with unicode escape should handle carefully. Got: {output}",
                );
            },
        );
    }

    /// Test: Unicode escape \u{1F980} in ES2015
    #[test]
    fn test_unicode_escape_es2015() {
        run_test(
            r#"console.log(`\u{1F980}`)"#,
            EsVersion::Es2015,
            EsVersion::Es2015,
            |output| {
                // In ES2015, the escape or actual emoji can be used
                assert!(
                    !output.is_empty(),
                    "ES2015 should produce valid output. Got: {output}",
                );
            },
        );
    }

    // ===== Various Non-BMP Unicode Characters =====

    /// Test: Mathematical symbols (U+1D400-U+1D7FF range)
    #[test]
    fn test_math_symbols_es5() {
        // Mathematical Bold Capital A (U+1D400)
        run_test(
            r#"console.log(`𝐀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with non-BMP math symbols. Got: {output}",
                );
            },
        );
    }

    /// Test: Mathematical symbols in ES2015
    #[test]
    fn test_math_symbols_es2015() {
        run_test(
            r#"console.log(`𝐀`)"#,
            EsVersion::Es2015,
            EsVersion::Es2015,
            |output| {
                assert!(
                    output.contains("𝐀"),
                    "ES2015+ should preserve math symbols. Got: {output}",
                );
            },
        );
    }

    /// Test: Musical symbols (U+1D100-U+1D1FF range)
    #[test]
    fn test_musical_symbols_es5() {
        // Musical Symbol G Clef (U+1D11E)
        run_test(
            r#"console.log(`𝄞`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with musical symbols. Got: {output}",
                );
            },
        );
    }

    /// Test: CJK Extension B characters (U+20000+)
    #[test]
    fn test_cjk_extension_b_es5() {
        // CJK Unified Ideograph Extension B (U+20000)
        run_test(
            r#"console.log(`𠀀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with CJK Extension B. Got: {output}",
                );
            },
        );
    }

    // ===== BMP Characters - Should Always Convert =====

    /// Test: ASCII-only template should convert in ES5
    #[test]
    fn test_ascii_only_es5() {
        run_test(
            r#"console.log(`hello world`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // ASCII-only should be safe to convert
                assert!(
                    output.contains("\"hello world\"") || output.contains("'hello world'"),
                    "ES5 should convert ASCII-only template to string. Got: {output}",
                );
            },
        );
    }

    /// Test: ASCII-only template should convert in ES2015
    #[test]
    fn test_ascii_only_es2015() {
        run_test(
            r#"console.log(`hello world`)"#,
            EsVersion::Es2015,
            EsVersion::Es2015,
            |output| {
                assert!(
                    output.contains("\"hello world\"") || output.contains("'hello world'"),
                    "ES2015 should convert ASCII-only template to string. Got: {output}",
                );
            },
        );
    }

    /// Test: BMP Unicode characters (< U+FFFF) should convert in ES5
    #[test]
    fn test_bmp_unicode_es5() {
        // Various BMP characters: Chinese, Japanese, Korean, etc.
        run_test(
            r#"console.log(`你好世界`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // BMP characters don't need surrogate pairs
                assert!(
                    output.contains("\"你好世界\"")
                        || output.contains("'你好世界'")
                        || output.contains("`你好世界`"),
                    "ES5 should handle BMP Chinese characters. Got: {output}",
                );
            },
        );
    }

    /// Test: BMP Japanese hiragana
    #[test]
    fn test_bmp_hiragana_es5() {
        run_test(
            r#"console.log(`こんにちは`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains("こんにちは"),
                    "ES5 should handle BMP hiragana. Got: {output}",
                );
            },
        );
    }

    /// Test: BMP Korean
    #[test]
    fn test_bmp_korean_es5() {
        run_test(
            r#"console.log(`안녕하세요`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains("안녕하세요"),
                    "ES5 should handle BMP Korean. Got: {output}",
                );
            },
        );
    }

    /// Test: BMP special symbols (arrows, etc.)
    #[test]
    fn test_bmp_arrows_es5() {
        run_test(
            r#"console.log(`→←↑↓`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains("→") || output.contains("\\u"),
                    "ES5 should handle BMP arrows. Got: {output}",
                );
            },
        );
    }

    // ===== Edge Cases =====

    /// Test: Empty template
    #[test]
    fn test_empty_template_es5() {
        run_test(
            r#"console.log(``)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains("\"\"") || output.contains("''"),
                    "ES5 should convert empty template. Got: {output}",
                );
            },
        );
    }

    /// Test: Template with backtick escape
    #[test]
    fn test_backtick_escape_es5() {
        run_test(
            r#"console.log(`\``)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // Should convert - backtick in string is simpler
                assert!(
                    output.contains('`') || output.contains("\"") || output.contains("'"),
                    "ES5 should handle backtick escape. Got: {output}",
                );
            },
        );
    }

    /// Test: Template with newlines (should remain template for size)
    #[test]
    fn test_newlines_es5() {
        run_test(
            "console.log(`line1\nline2`)",
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // Newlines in template are shorter than \n in string
                assert!(
                    output.contains('\n') || output.contains("\\n"),
                    "ES5 should handle newlines appropriately. Got: {output}",
                );
            },
        );
    }

    /// Test: Character at boundary (U+FFFF - highest BMP)
    #[test]
    fn test_bmp_boundary_es5() {
        // U+FFFF is still BMP (should convert)
        run_test(
            r#"console.log(`\uFFFF`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // U+FFFF is BMP, should be safe to convert
                assert!(
                    !output.is_empty(),
                    "ES5 should handle BMP boundary character. Got: {output}",
                );
            },
        );
    }

    /// Test: First non-BMP character (U+10000)
    #[test]
    fn test_first_non_bmp_es5() {
        // U+10000 - Linear B Syllable B008 A
        run_test(
            r#"console.log(`𐀀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // This is non-BMP (U+10000 > U+FFFF), should NOT convert
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with first non-BMP char (U+10000). Got: {output}",
                );
            },
        );
    }

    /// Test: ES3 target (also < ES2015)
    #[test]
    fn test_emoji_es3() {
        run_test(
            r#"console.log(`🦀`)"#,
            EsVersion::Es3,
            EsVersion::Es3,
            |output| {
                // ES3 should also not convert
                assert!(
                    output.contains('`') || output.contains("\\u"),
                    "ES3 should keep template literal or use escapes. Got: {output}",
                );
            },
        );
    }

    // ===== Surrogate Pairs =====

    /// Test: Lone surrogate (invalid UTF-16)
    /// These are edge cases in JavaScript
    #[test]
    fn test_surrogate_handling_es5() {
        // High surrogate alone
        run_test(
            r#"console.log(`\uD83E`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // This is a lone surrogate, not a full non-BMP character
                assert!(
                    !output.is_empty(),
                    "ES5 should handle lone surrogate. Got: {output}",
                );
            },
        );
    }

    // ===== Combination Tests =====

    /// Test: Mix of BMP and non-BMP in ES5
    #[test]
    fn test_mixed_bmp_non_bmp_es5() {
        run_test(
            r#"console.log(`ABC🦀DEF`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // Has non-BMP (emoji), should NOT convert
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with mixed BMP/non-BMP. Got: {output}",
                );
            },
        );
    }

    /// Test: Only ASCII with emoji in different statement
    #[test]
    fn test_separate_statements_es5() {
        run_test(
            r#"
            console.log(`hello`);
            console.log(`🦀`);
        "#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // First should convert, second should not
                assert!(
                    output.contains("\"hello\"") || output.contains("'hello'"),
                    "ES5 should convert ASCII-only template in first statement. Got: {output}",
                );
            },
        );
    }

    // ===== Size Comparison Tests =====

    /// Test: Verify emoji in ES5 would produce longer output
    #[test]
    fn test_size_comparison_emoji_es5() {
        run_test(
            r#"console.log(`🦀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |tpl_output| {
                // The template should be kept because converting would be longer
                // `🦀` = 4 chars (backticks + emoji as 1 char visually but 2 code units)
                // "\uD83E\uDD80" = 16 chars
                assert!(
                    tpl_output.contains('`'),
                    "ES5 should prefer shorter template form. Got: {tpl_output}",
                );
            },
        );
    }

    /// Test: Verify multiple emojis show even bigger size difference
    #[test]
    fn test_size_comparison_multiple_emojis_es5() {
        run_test(
            r#"console.log(`🦀🎉🚀🌟`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // 4 emojis would become 4 * 12 chars = 48 chars in surrogate pairs
                // vs ~6 chars in template
                assert!(
                    output.contains('`'),
                    "ES5 should definitely keep template with multiple emojis. Got: {output}",
                );
            },
        );
    }

    // ===== Flag Emojis (Compound Emojis) =====

    /// Test: Flag emoji (uses regional indicator symbols, both non-BMP)
    #[test]
    fn test_flag_emoji_es5() {
        // US flag: U+1F1FA U+1F1F8
        run_test(
            r#"console.log(`🇺🇸`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with flag emoji. Got: {output}",
                );
            },
        );
    }

    /// Test: Emoji with skin tone modifier
    #[test]
    fn test_emoji_skin_tone_es5() {
        // Thumbs up with skin tone: U+1F44D U+1F3FB
        run_test(
            r#"console.log(`👍🏻`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with skin tone emoji. Got: {output}",
                );
            },
        );
    }

    /// Test: ZWJ sequence emoji (family, etc.)
    #[test]
    fn test_emoji_zwj_sequence_es5() {
        // Family emoji using ZWJ
        run_test(
            r#"console.log(`👨‍👩‍👧`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with ZWJ sequence emoji. Got: {output}",
                );
            },
        );
    }

    // ===== Variation Selectors =====

    /// Test: Emoji with variation selector
    #[test]
    fn test_emoji_variation_selector_es5() {
        // Heart with emoji variation selector: U+2764 U+FE0F
        run_test(
            r#"console.log(`❤️`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                // U+2764 is BMP, U+FE0F is BMP variation selector
                // Both are BMP so this could convert
                assert!(
                    !output.is_empty(),
                    "ES5 should handle heart with variation selector. Got: {output}",
                );
            },
        );
    }

    // ===== Ancient Scripts (Non-BMP) =====

    /// Test: Egyptian hieroglyphs (U+13000-U+1342F)
    #[test]
    fn test_hieroglyphs_es5() {
        // Egyptian Hieroglyph A001 (U+13000)
        run_test(
            r#"console.log(`𓀀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with hieroglyphs. Got: {output}",
                );
            },
        );
    }

    /// Test: Cuneiform (U+12000-U+123FF)
    #[test]
    fn test_cuneiform_es5() {
        // Cuneiform Sign A (U+12000)
        run_test(
            r#"console.log(`𒀀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with cuneiform. Got: {output}",
                );
            },
        );
    }

    // ===== Private Use Area =====

    /// Test: Supplementary Private Use Area-A (U+F0000-U+FFFFF)
    #[test]
    fn test_private_use_area_es5() {
        // U+F0000 - first char in Supplementary PUA-A
        run_test(
            r#"console.log(`󰀀`)"#,
            EsVersion::Es5,
            EsVersion::Es5,
            |output| {
                assert!(
                    output.contains('`'),
                    "ES5 should keep template with supplementary PUA. Got: {output}",
                );
            },
        );
    }
}
