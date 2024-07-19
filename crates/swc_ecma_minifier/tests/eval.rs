#![deny(warnings)]

use swc_atoms::Atom;
use swc_common::{sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_minifier::{
    eval::{EvalResult, Evaluator},
    marks::Marks,
};
use swc_ecma_parser::{parse_file_as_expr, parse_file_as_module, EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use testing::{assert_eq, DebugUsingDisplay};

fn eval(module: &str, expr: &str) -> Option<String> {
    testing::run_test2(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon.into(), module.to_string());
        let marks = Marks::new();

        let module_ast = parse_file_as_module(
            &fm,
            Default::default(),
            EsVersion::latest(),
            None,
            &mut Vec::new(),
        )
        .unwrap();

        let expr_ast = {
            let fm = cm.new_source_file(FileName::Anon.into(), expr.to_string());
            parse_file_as_expr(
                &fm,
                Default::default(),
                EsVersion::latest(),
                None,
                &mut Vec::new(),
            )
            .unwrap()
        };

        let mut evaluator = Evaluator::new(module_ast, marks);

        let res = evaluator.eval(&expr_ast);

        match res {
            Some(res) => match res {
                EvalResult::Lit(l) => match l {
                    swc_ecma_ast::Lit::Str(v) => Ok(Some(v.value.to_string())),
                    swc_ecma_ast::Lit::Bool(v) => Ok(Some(v.value.to_string())),
                    swc_ecma_ast::Lit::Num(v) => Ok(Some(v.value.to_string())),
                    swc_ecma_ast::Lit::Null(_) => Ok(Some("null".into())),
                    _ => unreachable!(),
                },
                EvalResult::Undefined => Ok(Some("undefined".into())),
            },
            None => Ok(None),
        }
    })
    .unwrap()
}

#[test]

fn simple() {
    assert_eq!(eval("const foo = 4", "foo").unwrap(), "4");
}

#[test]
fn eval_lit() {
    assert_eq!(eval("", "true").unwrap(), "true");
    assert_eq!(eval("", "false").unwrap(), "false");
}

struct PartialInliner {
    marks: Marks,
    eval: Option<Evaluator>,
}

impl PartialInliner {
    fn run_test<F>(src: &str, op: F)
    where
        F: FnOnce(Lrc<SourceMap>, Module, &mut PartialInliner),
    {
        testing::run_test2(false, |cm, _handler| {
            let fm = cm.new_source_file(FileName::Anon.into(), src.to_string());
            let marks = Marks::new();

            let mut module = parse_file_as_module(
                &fm,
                Syntax::Es(EsSyntax {
                    jsx: true,
                    ..Default::default()
                }),
                EsVersion::latest(),
                None,
                &mut Vec::new(),
            )
            .unwrap();
            module.visit_mut_with(&mut resolver(Mark::new(), Mark::new(), false));

            let mut inliner = PartialInliner {
                marks,
                eval: Default::default(),
            };

            op(cm, module, &mut inliner);

            Ok(())
        })
        .unwrap();
    }

    fn expect(src: &str, expected: &str) {
        PartialInliner::run_test(src, |cm, mut module, inliner| {
            //
            module.visit_mut_with(inliner);

            let expected_module = {
                let fm = cm.new_source_file(FileName::Anon.into(), expected.to_string());

                parse_file_as_module(
                    &fm,
                    Syntax::Es(EsSyntax {
                        jsx: true,
                        ..Default::default()
                    }),
                    EsVersion::latest(),
                    None,
                    &mut Vec::new(),
                )
                .unwrap()
            };
            let expected = {
                let mut buf = Vec::new();

                {
                    let mut emitter = Emitter {
                        cfg: Default::default(),
                        cm: cm.clone(),
                        comments: None,
                        wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
                    };

                    emitter.emit_module(&expected_module).unwrap();
                }
                String::from_utf8(buf).unwrap()
            };

            let actual = {
                let mut buf = Vec::new();

                {
                    let mut emitter = Emitter {
                        cfg: Default::default(),
                        cm: cm.clone(),
                        comments: None,
                        wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
                    };

                    emitter.emit_module(&module).unwrap();
                }
                String::from_utf8(buf).unwrap()
            };

            assert_eq!(DebugUsingDisplay(&expected), DebugUsingDisplay(&actual));
        });
    }
}

impl VisitMut for PartialInliner {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Some(evaluator) = self.eval.as_mut() {
            if let Expr::TaggedTpl(tt) = e {
                if let Expr::Ident(ref tag) = &*tt.tag {
                    if &*tag.sym == "css" {
                        let res = evaluator.eval_tpl(&tt.tpl);

                        let res = match res {
                            Some(v) => v,
                            None => return,
                        };

                        match res {
                            EvalResult::Lit(Lit::Str(s)) => {
                                let el = TplElement {
                                    span: s.span,
                                    tail: true,
                                    // TODO possible bug for quotes
                                    raw: Atom::new(&*s.value),
                                    cooked: Some(Atom::new(&*s.value)),
                                };
                                tt.tpl = Box::new(Tpl {
                                    span: el.span,
                                    exprs: Default::default(),
                                    quasis: vec![el],
                                });
                            }
                            _ => {
                                unreachable!()
                            }
                        }
                    }
                }
            }
        }
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.eval = Some(Evaluator::new(module.clone(), self.marks));
        module.visit_mut_children_with(self);
    }
}

#[test]
fn partial_1() {
    PartialInliner::expect(
        "
            const color = 'red'

            export const foo = css`
            div {
                color: ${color};
            }
            `
            ",
        "
            const color = 'red'

            export const foo = css`
            div {
                color: red;
            }
            `
            ",
    );
}

#[test]
fn partial_2() {
    PartialInliner::expect(
        "
            export default css`
            div {
                font-size: 3em;
            }
            p {
                color: ${props.color};
            }
            `
            ",
        "
            export default css`
            div {
                font-size: 3em;
            }
            p {
                color: ${props.color};
            }
            `
            ",
    );
}

#[test]
fn partial_3() {
    PartialInliner::expect(
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export const s1 = css`
            p.${color} {
                color: ${otherColor};
                display: ${obj.display};
            }
        `;
            ",
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export const s1 = css`
            p.red {
                color: green;
                display: block;
            }
        `
        ",
    );
}

#[test]
#[ignore]
fn partial_4() {
    PartialInliner::expect(
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export const s2 = css`
            p.${color} {
                color: ${darken(color)};
            }
        `;
        ",
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export const s2 = css`
        p.red {
            color: 'red';
        }
        `
        ",
    );
}

#[test]
#[ignore]
fn partial_5() {
    PartialInliner::expect(
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export const s3 = css`
            p.${color} {
                color: ${darken(color) + 2};
            }
        `;
        ",
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export const s3 = css`
            p.red {
                color: 'red2';
            }
        `;
        ",
    );
}

#[test]
fn partial_6() {
    PartialInliner::expect(
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export const s4 = css`
            @media (min-width: ${mediumScreen}) {
                p {
                    color: green;
                }
                p {
                    color: ${`red`};
                }
                }
                p {
                    color: red;
            }
        `;
        ",
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export const s4 = css`
            @media (min-width: 680px) {
                p {
                    color: green;
                }
                p {
                    color: red;
                }
                }
                p {
                    color: red;
            }
        `;
        ",
    );
}

#[test]
fn partial_7() {
    PartialInliner::expect(
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export default ({ display }) => (
            css`
                span {
                    display: ${display ? 'block' : 'none'};
                }
            `
        )
        ",
        "
        const darken = c => c
        const color = 'red'
        const otherColor = 'green'
        const mediumScreen = '680px'
        const animationDuration = '200ms'
        const animationName = 'my-cool-animation'
        const obj = { display: 'block' }

        export default ({ display }) => (
            css`
                span {
                    display: ${display ? 'block' : 'none'};
                }
            `
        )
        ",
    );
}

#[test]
fn partial_8() {
    PartialInliner::expect(
        "const darken = c => c
    const color = 'red'
    const otherColor = 'green'
    const mediumScreen = '680px'
    const animationDuration = '200ms'
    const animationName = 'my-cool-animation'
    const obj = { display: 'block' }
    
    export default ({ display }) => (
        css`
          p.${color} {
            color: ${otherColor};
            display: ${obj.display};
          }
        `
    )
    ",
        "
        const darken = c => c
    const color = 'red'
    const otherColor = 'green'
    const mediumScreen = '680px'
    const animationDuration = '200ms'
    const animationName = 'my-cool-animation'
    const obj = { display: 'block' }
    
    export default ({ display }) => (
        css`
          p.red {
            color: green;
            display: block;
          }
        `
    )
        ",
    )
}
