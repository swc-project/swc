//! 13.3.3 Destructuring Binding Patterns

use swc_ecma_lexer::common::parser::pat::parse_binding_pat_or_ident;

use super::*;
use crate::parser::Parser;

impl<I: Tokens> Parser<I> {
    pub fn parse_pat(&mut self) -> PResult<Pat> {
        parse_binding_pat_or_ident(self, false)
    }
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP as span;
    use swc_ecma_lexer::common::parser::pat::parse_array_binding_pat;
    use swc_ecma_visit::assert_eq_ignore_span;

    use super::*;

    fn array_pat(s: &'static str) -> Pat {
        test_parser(s, Syntax::default(), |p| parse_array_binding_pat(p))
    }

    fn object_pat(s: &'static str) -> Pat {
        test_parser(s, Syntax::default(), |p| {
            parse_binding_pat_or_ident(p, false)
        })
    }

    fn ident(s: &str) -> Ident {
        Ident::new_no_ctxt(s.into(), span)
    }

    fn ident_name(s: &str) -> IdentName {
        IdentName::new(s.into(), span)
    }

    fn rest() -> Option<Pat> {
        Some(
            RestPat {
                span,
                type_ann: None,
                arg: ident("tail").into(),
            }
            .into(),
        )
    }

    #[test]
    fn array_pat_simple() {
        assert_eq_ignore_span!(
            array_pat("[a, [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    Some(Pat::Ident(ident("a").into())),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b").into()))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c").into()))],
                        type_ann: None
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_pat_empty_start() {
        assert_eq_ignore_span!(
            array_pat("[, a, [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    None,
                    Some(Pat::Ident(ident("a").into())),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b").into()))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c").into()))],
                        type_ann: None
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_pat_empty() {
        assert_eq_ignore_span!(
            array_pat("[a, , [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    Some(Pat::Ident(ident("a").into())),
                    None,
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("b").into()))],
                        type_ann: None
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        optional: false,
                        elems: vec![Some(Pat::Ident(ident("c").into()))],
                        type_ann: None
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_pat_empty_end() {
        assert_eq_ignore_span!(
            array_pat("[a, ,]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![Some(Pat::Ident(ident("a").into())), None,],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_binding_pattern_tail() {
        assert_eq_ignore_span!(
            array_pat("[...tail]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![rest()],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_binding_pattern_assign() {
        assert_eq_ignore_span!(
            array_pat("[,a=1,]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    None,
                    Some(Pat::Assign(AssignPat {
                        span,
                        left: Box::new(Pat::Ident(ident("a").into())),
                        right: Box::new(Expr::Lit(Lit::Num(Number {
                            span,
                            value: 1.0,
                            raw: Some("1".into())
                        })))
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_binding_pattern_tail_with_elems() {
        assert_eq_ignore_span!(
            array_pat("[,,,...tail]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![None, None, None, rest()],
                type_ann: None
            })
        );
    }

    #[test]
    fn array_binding_pattern_tail_inside_tail() {
        assert_eq_ignore_span!(
            array_pat("[,,,...[...tail]]"),
            Pat::Array(ArrayPat {
                span,
                optional: false,
                elems: vec![
                    None,
                    None,
                    None,
                    Some(Pat::Rest(RestPat {
                        span,
                        type_ann: None,
                        arg: Box::new(Pat::Array(ArrayPat {
                            span,
                            optional: false,
                            elems: vec![rest()],
                            type_ann: None
                        }))
                    }))
                ],
                type_ann: None
            })
        );
    }

    #[test]
    fn object_binding_pattern_tail() {
        assert_eq_ignore_span!(
            object_pat("{...obj}"),
            Pat::Object(ObjectPat {
                span,
                type_ann: None,
                optional: false,
                props: vec![ObjectPatProp::Rest(RestPat {
                    span,
                    type_ann: None,
                    arg: Box::new(Pat::Ident(ident("obj").into()))
                })]
            })
        );
    }

    #[test]
    fn object_binding_pattern_with_prop() {
        assert_eq_ignore_span!(
            object_pat("{prop = 10 }"),
            Pat::Object(ObjectPat {
                span,
                type_ann: None,
                optional: false,
                props: vec![ObjectPatProp::Assign(AssignPatProp {
                    span,
                    key: ident("prop").into(),
                    value: Some(Box::new(Expr::Lit(Lit::Num(Number {
                        span,
                        value: 10.0,
                        raw: Some("10".into())
                    }))))
                })]
            })
        );
    }

    #[test]
    fn object_binding_pattern_with_prop_and_label() {
        fn prop(key: PropName, assign_name: &str, expr: Expr) -> PropOrSpread {
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                span,
                key,
                value: AssignExpr {
                    span,
                    op: AssignOp::Assign,
                    left: ident(assign_name).into(),
                    right: Box::new(expr),
                }
                .into(),
            })))
        }

        assert_eq_ignore_span!(
            object_pat(
                "{obj = {$: num = 10, '': sym = '', \" \": quote = \" \", _: under = [...tail],}}"
            ),
            Pat::Object(ObjectPat {
                span,
                type_ann: None,
                optional: false,
                props: vec![ObjectPatProp::Assign(AssignPatProp {
                    span,
                    key: ident("obj").into(),
                    value: Some(Box::new(Expr::Object(ObjectLit {
                        span,
                        props: vec![
                            prop(
                                PropName::Ident(ident_name("$")),
                                "num",
                                Expr::Lit(Lit::Num(Number {
                                    span,
                                    value: 10.0,
                                    raw: Some("10".into())
                                }))
                            ),
                            prop(
                                PropName::Str(Str {
                                    span,
                                    value: "".into(),
                                    raw: Some("''".into()),
                                }),
                                "sym",
                                Expr::Lit(Lit::Str(Str {
                                    span,
                                    value: "".into(),
                                    raw: Some("''".into()),
                                }))
                            ),
                            prop(
                                PropName::Str(Str {
                                    span,
                                    value: " ".into(),
                                    raw: Some("\" \"".into()),
                                }),
                                "quote",
                                Expr::Lit(Lit::Str(Str {
                                    span,
                                    value: " ".into(),
                                    raw: Some("\" \"".into()),
                                }))
                            ),
                            prop(
                                PropName::Ident(ident_name("_")),
                                "under",
                                Expr::Array(ArrayLit {
                                    span,
                                    elems: vec![Some(ExprOrSpread {
                                        spread: Some(span),
                                        expr: Box::new(Expr::Ident(ident("tail")))
                                    })]
                                })
                            ),
                        ]
                    })))
                })]
            })
        );
    }
}
