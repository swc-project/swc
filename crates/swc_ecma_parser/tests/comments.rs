use std::path::PathBuf;
use swc_common::{
    comments::SingleThreadedComments,
    errors::{DiagnosticBuilder, Handler},
    input::SourceFileInput,
    BytePos, Span, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig};
use swc_ecma_visit::{Node, Visit, VisitWith};
use testing::{fixture, Tester};

#[fixture("tests/comments/**/input.js")]
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
                    static_blocks: true,
                    ..Default::default()
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
