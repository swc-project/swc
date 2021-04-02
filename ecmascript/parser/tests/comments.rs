use std::path::PathBuf;
use swc_common::comments::SingleThreadedComments;
use swc_common::errors::DiagnosticBuilder;
use swc_common::errors::Handler;
use swc_common::input::SourceFileInput;
use swc_common::BytePos;
use swc_common::Span;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::EsConfig;
use swc_ecma_parser::Parser;
use swc_ecma_parser::Syntax;
use swc_ecma_parser::TsConfig;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;
use testing::fixture;
use testing::Tester;

#[fixture("comments/**/input.js")]
#[fixture("comments/**/input.ts")]
#[fixture("comments/**/input.tsx")]
fn test(input: PathBuf) {
    let ext = input.extension().unwrap();
    let ext = ext.to_string_lossy();

    let output_file = PathBuf::from(format!("{}.stderr", input.display()));

    let output = Tester::new()
        .print_errors(|cm, handler| -> Result<(), _> {
            //
            let fm = cm.load_file(&input).unwrap();
            let syntax = match &*ext {
                "js" => Syntax::Es(EsConfig {
                    jsx: false,
                    num_sep: true,
                    class_private_props: true,
                    class_private_methods: true,
                    class_props: true,
                    fn_bind: false,
                    decorators: true,
                    decorators_before_export: false,
                    export_default_from: true,
                    export_namespace_from: true,
                    dynamic_import: true,
                    nullish_coalescing: true,
                    optional_chaining: true,
                    import_meta: true,
                    top_level_await: true,
                    import_assertions: true,
                }),
                "ts" | "tsx" => Syntax::Typescript(TsConfig {
                    tsx: ext == "tsx",
                    decorators: true,
                    dynamic_import: true,
                    no_early_errors: true,
                    import_assertions: true,
                    ..Default::default()
                }),
                _ => {
                    unreachable!()
                }
            };

            let comments = SingleThreadedComments::default();

            let lexer = Lexer::new(
                syntax,
                EsVersion::latest(),
                SourceFileInput::from(&*fm),
                Some(&comments),
            );
            let mut parser = Parser::new_from(lexer);

            let module = parser.parse_module();
            let module = match module {
                Ok(v) => v,
                Err(err) => {
                    panic!("{:?}", err)
                }
            };

            module.visit_with(
                &Invalid { span: DUMMY_SP },
                &mut CommentPrinter {
                    handler: &handler,
                    comments,
                },
            );

            Err(())
        })
        .unwrap_err();
    if output.trim().is_empty() {
        panic!("Comments have incorrect position")
    }

    output.compare_to_file(&output_file).unwrap();
}

struct CommentPrinter<'a> {
    handler: &'a Handler,
    comments: SingleThreadedComments,
}

impl Visit for CommentPrinter<'_> {
    fn visit_span(&mut self, n: &Span, _: &dyn Node) {
        self.comments.with_leading(n.lo, |comments| {
            for c in comments {
                DiagnosticBuilder::new(
                    &self.handler,
                    swc_common::errors::Level::Note,
                    "Leading (lo)",
                )
                .span_note(Span::new(n.lo, n.lo, Default::default()), &c.text)
                .emit();
            }
        });

        self.comments.with_trailing(n.lo, |comments| {
            for c in comments {
                DiagnosticBuilder::new(
                    &self.handler,
                    swc_common::errors::Level::Note,
                    "Trailing (lo)",
                )
                .span_note(Span::new(n.lo, n.lo, Default::default()), &c.text)
                .emit();
            }
        });

        self.comments.with_leading(n.hi - BytePos(1), |comments| {
            for c in comments {
                DiagnosticBuilder::new(
                    &self.handler,
                    swc_common::errors::Level::Note,
                    "Leading (hi)",
                )
                .span_note(
                    Span::new(n.hi - BytePos(1), n.hi - BytePos(1), Default::default()),
                    &c.text,
                )
                .emit();
            }
        });

        self.comments.with_trailing(n.hi, |comments| {
            for c in comments {
                DiagnosticBuilder::new(
                    &self.handler,
                    swc_common::errors::Level::Note,
                    "Trailing (hi)",
                )
                .span_note(Span::new(n.hi, n.hi, Default::default()), &c.text)
                .emit();
            }
        });
    }
}
