extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName, Span, DUMMY_SP};
use swc_html_ast::{Document, DocumentFragment, DocumentMode, Element, Namespace};
use swc_html_parser::{lexer::Lexer, parser::Parser};
use swc_html_visit::{Fold, FoldWith, VisitMut, VisitMutWith};

static SOURCE: &str = include_str!("files/github_com_17_05_2022.html");

fn run_document<F>(b: &mut Bencher, mut op: F)
where
    F: FnMut(Document) -> Document,
{
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), SOURCE.into());

        let lexer = Lexer::new(StringInput::from(&*fm));
        let mut parser = Parser::new(lexer, Default::default());
        let document: Document = parser.parse_document().unwrap();

        b.iter(|| {
            let document = document.clone();
            let document = op(document);

            black_box(document)
        });

        Ok(())
    });
}

fn run_document_fragment<F>(b: &mut Bencher, mut op: F)
where
    F: FnMut(DocumentFragment) -> DocumentFragment,
{
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), SOURCE.into());

        let lexer = Lexer::new(StringInput::from(&*fm));
        let mut parser = Parser::new(lexer, Default::default());
        let document_fragment: DocumentFragment = parser
            .parse_document_fragment(
                Element {
                    span: Default::default(),
                    tag_name: "template".into(),
                    namespace: Namespace::HTML,
                    attributes: Vec::new(),
                    is_self_closing: false,
                    children: Vec::new(),
                    content: None,
                },
                DocumentMode::NoQuirks,
                None,
            )
            .unwrap();

        b.iter(|| {
            let document_fragment = document_fragment.clone();
            let document_fragment = op(document_fragment);

            black_box(document_fragment)
        });

        Ok(())
    });
}

fn bench_cases(c: &mut Criterion) {
    c.bench_function("html/document/visitor/compare/clone", |b| {
        run_document(b, |m: Document| m)
    });

    c.bench_function("html/document/visitor/compare/visit_mut_span", |b| {
        struct RespanVisitMut;

        impl VisitMut for RespanVisitMut {
            fn visit_mut_span(&mut self, span: &mut Span) {
                *span = DUMMY_SP;
            }
        }

        run_document(b, |mut m| {
            m.visit_mut_with(&mut RespanVisitMut);

            m
        });
    });

    c.bench_function("html/document/visitor/compare/visit_mut_span_panic", |b| {
        struct RespanVisitMut;

        impl VisitMut for RespanVisitMut {
            fn visit_mut_span(&mut self, span: &mut Span) {
                *span = DUMMY_SP;
            }
        }

        run_document(b, |mut m| {
            m.visit_mut_with(&mut RespanVisitMut);

            m
        });
    });

    c.bench_function("html/document/visitor/compare/fold_span", |b| {
        struct RespanFold;

        impl Fold for RespanFold {
            fn fold_span(&mut self, _: Span) -> Span {
                DUMMY_SP
            }
        }

        run_document(b, |m| m.fold_with(&mut RespanFold));
    });

    c.bench_function("html/document/visitor/compare/fold_span_panic", |b| {
        struct RespanFold;

        impl Fold for RespanFold {
            fn fold_span(&mut self, _: Span) -> Span {
                DUMMY_SP
            }
        }

        run_document(b, |m| m.fold_with(&mut RespanFold));
    });

    c.bench_function("html/document_fragment/visitor/compare/clone", |b| {
        run_document_fragment(b, |m: DocumentFragment| m)
    });

    c.bench_function(
        "html/document_fragment/visitor/compare/visit_mut_span",
        |b| {
            struct RespanVisitMut;

            impl VisitMut for RespanVisitMut {
                fn visit_mut_span(&mut self, span: &mut Span) {
                    *span = DUMMY_SP;
                }
            }

            run_document_fragment(b, |mut m| {
                m.visit_mut_with(&mut RespanVisitMut);

                m
            });
        },
    );

    c.bench_function(
        "html/document_fragment/visitor/compare/visit_mut_span_panic",
        |b| {
            struct RespanVisitMut;

            impl VisitMut for RespanVisitMut {
                fn visit_mut_span(&mut self, span: &mut Span) {
                    *span = DUMMY_SP;
                }
            }

            run_document_fragment(b, |mut m| {
                m.visit_mut_with(&mut RespanVisitMut);

                m
            });
        },
    );

    c.bench_function("html/document_fragment/visitor/compare/fold_span", |b| {
        struct RespanFold;

        impl Fold for RespanFold {
            fn fold_span(&mut self, _: Span) -> Span {
                DUMMY_SP
            }
        }

        run_document_fragment(b, |m| m.fold_with(&mut RespanFold));
    });

    c.bench_function(
        "html/document_fragment/visitor/compare/fold_span_panic",
        |b| {
            struct RespanFold;

            impl Fold for RespanFold {
                fn fold_span(&mut self, _: Span) -> Span {
                    DUMMY_SP
                }
            }

            run_document_fragment(b, |m| m.fold_with(&mut RespanFold));
        },
    );
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
