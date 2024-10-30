use std::path::{Path, PathBuf};

use swc_common::{sync::Lrc, Mark, SourceMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{lexer::Lexer, EsSyntax, Parser, StringInput, Syntax, TsSyntax};
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_visit::{visit_mut_obj_and_computed, visit_mut_pass, VisitMut, VisitMutWith};
use testing::{fixture, run_test2, NormalizedOutput};

pub fn print(cm: Lrc<SourceMap>, program: &Program) -> String {
    let mut buf = Vec::new();
    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                cm, "\n", &mut buf, None,
            )),
            comments: None,
        };

        // println!("Emitting: {:?}", module);
        emitter.emit_program(program).unwrap();
    }

    let s = String::from_utf8_lossy(&buf);
    s.to_string()
}

fn run<F, P>(syntax: Syntax, input: &Path, op: F)
where
    F: FnOnce() -> P,
    P: Pass,
{
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy(),
    ));

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(input).unwrap();

        let lexer = Lexer::new(syntax, EsVersion::latest(), StringInput::from(&*fm), None);
        let mut parser = Parser::new_from(lexer);

        let program = parser
            .parse_program()
            .map_err(|err| err.into_diagnostic(&handler).emit())?;

        let mut folder = op();

        let program = program.apply(&mut folder);

        let actual = print(cm, &program);
        let actual = NormalizedOutput::from(actual);

        actual.compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}

#[fixture("tests/resolver/**/input.js")]
fn test_resolver(input: PathBuf) {
    run(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &input,
        || {
            let unresolved_mark = Mark::fresh(Mark::root());

            (
                resolver(unresolved_mark, Mark::new(), false),
                visit_mut_pass(TsHygiene { unresolved_mark }),
                fixer(None),
            )
        },
    );
}

#[fixture("tests/ts-resolver/**/input.ts")]
#[fixture("tests/ts-resolver/**/input.tsx")]
fn test_ts_resolver(input: PathBuf) {
    run(
        Syntax::Typescript(TsSyntax {
            decorators: true,
            tsx: input.extension().filter(|ext| *ext == "tsx").is_some(),
            ..Default::default()
        }),
        &input,
        || {
            let unresolved_mark = Mark::fresh(Mark::root());

            (
                resolver(unresolved_mark, Mark::new(), true),
                visit_mut_pass(TsHygiene { unresolved_mark }),
                fixer(None),
            )
        },
    );
}

struct TsHygiene {
    unresolved_mark: Mark,
}

impl VisitMut for TsHygiene {
    visit_mut_obj_and_computed!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if SyntaxContext::empty().apply_mark(self.unresolved_mark) == i.ctxt {
            println!("ts_hygiene: {} is unresolved", i.sym);
            return;
        }

        let ctxt = format!("{:?}", i.ctxt).replace('#', "");
        i.sym = format!("{}__{}", i.sym, ctxt).into();
        i.ctxt = SyntaxContext::empty();
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(n) = n {
            n.visit_mut_with(self);
        }
    }

    fn visit_mut_ts_qualified_name(&mut self, q: &mut TsQualifiedName) {
        q.left.visit_mut_with(self);
    }
}
