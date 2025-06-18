#[cfg(test)]
mod tests {
    use swc_atoms::atom;
    use swc_common::DUMMY_SP;
    use swc_ecma_ast::*;
    use swc_ecma_visit::assert_eq_ignore_span;

    use crate::{test_parser, Syntax};

    #[test]
    fn issue_708_1() {
        let actual = test_parser(
            "type test = -1;",
            Syntax::Typescript(Default::default()),
            |p| p.parse_module(),
        );

        let expected = Module {
            span: DUMMY_SP,
            shebang: None,
            body: {
                let first = TsTypeAliasDecl {
                    span: DUMMY_SP,
                    declare: false,
                    id: Ident::new_no_ctxt(atom!("test"), DUMMY_SP),
                    type_params: None,
                    type_ann: Box::new(TsType::TsLitType(TsLitType {
                        span: DUMMY_SP,
                        lit: TsLit::Number(Number {
                            span: DUMMY_SP,
                            value: -1.0,
                            raw: Some(atom!("-1")),
                        }),
                    })),
                }
                .into();
                vec![first]
            },
        };

        assert_eq_ignore_span!(actual, expected);
    }

    #[test]
    fn issue_708_2() {
        let actual = test_parser(
            "const t = -1;",
            Syntax::Typescript(Default::default()),
            |p| p.parse_module(),
        );

        let expected = Module {
            span: DUMMY_SP,
            shebang: None,
            body: {
                let second = VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(Ident::new_no_ctxt(atom!("t"), DUMMY_SP).into()),
                        init: Some(Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!(unary, "-"),
                            arg: Box::new(Expr::Lit(Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 1.0,
                                raw: Some(atom!("1")),
                            }))),
                        }))),
                        definite: false,
                    }],
                    ..Default::default()
                }
                .into();
                vec![second]
            },
        };

        assert_eq_ignore_span!(actual, expected);
    }
}
