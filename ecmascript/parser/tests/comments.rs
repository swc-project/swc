use std::cell::RefCell;
use std::path::PathBuf;
use std::rc::Rc;
use swc_common::comments::SingleThreadedComments;
use swc_common::input::SourceFileInput;
use swc_ecma_ast::*;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::EsConfig;
use swc_ecma_parser::Parser;
use swc_ecma_parser::Syntax;
use swc_ecma_parser::TsConfig;
use testing::fixture;
use testing::run_test2;

#[fixture("comments/**/input.js")]
#[fixture("comments/**/input.ts")]
#[fixture("comments/**/input.tsx")]
fn test(input: PathBuf) {
    let ext = input.extension().unwrap();
    let ext = ext.to_string_lossy();

    let output_file_name = format!("output.{}", ext);
    let output_file = input.with_file_name(&output_file_name);

    run_test2(false, |cm, handler| {
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
                err.into_diagnostic(&handler).emit();
                return Err(());
            }
        };

        let (leading, trailing) = comments.take_all();

        let leading = RefCell::into_inner(Rc::try_unwrap(leading).unwrap());
        let trailing = RefCell::into_inner(Rc::try_unwrap(trailing).unwrap());

        Ok(())
    })
    .unwrap()
}
