use std::path::PathBuf;

use swc_common::{comments::SingleThreadedComments, FileName};
use swc_ecma_parser::{Lexer, Parser, Syntax, TsSyntax};
use testing::StdErr;

fn tsrx_syntax() -> Syntax {
    Syntax::Typescript(TsSyntax {
        tsrx: true,
        ..Default::default()
    })
}

#[testing::fixture("../swc_ecma_parser/tests/tsrx/**/*.tsrx")]
fn lowering(entry: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let comments = SingleThreadedComments::default();
        let fm = cm.load_file(&entry).expect("failed to load TSRX fixture");
        let lexer = Lexer::new(
            tsrx_syntax(),
            Default::default(),
            (&*fm).into(),
            Some(&comments),
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|error| error.into_diagnostic(handler).emit())?;
        for error in parser.take_errors() {
            error.into_diagnostic(handler).emit();
        }
        if handler.has_errors() {
            return Err(());
        }

        let output = swc_ecma_codegen::to_code_default(cm.clone(), Some(&comments), &module);
        StdErr::from(output.clone())
            .compare_to_file(format!("{}.tsx", entry.display()))
            .map_err(|_| ())?;

        let output_fm = cm.new_source_file(
            FileName::Custom(format!("{}.lowered.tsx", entry.display())).into(),
            output,
        );
        let lexer = Lexer::new(
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            Default::default(),
            (&*output_fm).into(),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        parser
            .parse_module()
            .map_err(|error| error.into_diagnostic(handler).emit())?;
        for error in parser.take_errors() {
            error.into_diagnostic(handler).emit();
        }
        if handler.has_errors() {
            return Err(());
        }

        Ok(())
    })
    .unwrap();
}
