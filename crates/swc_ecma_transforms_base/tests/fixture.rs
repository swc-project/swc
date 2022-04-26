use std::path::{Path, PathBuf};

use swc_common::{chain, sync::Lrc, Mark, SourceMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_visit::{
    as_folder, visit_mut_obj_and_computed, Fold, FoldWith, VisitMut, VisitMutWith,
};
use testing::{fixture, run_test2, NormalizedOutput};

pub fn print(cm: Lrc<SourceMap>, module: &Module) -> String {
    let mut buf = vec![];
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
        emitter.emit_module(module).unwrap();
    }

    let s = String::from_utf8_lossy(&buf);
    s.to_string()
}

fn run<F, P>(syntax: Syntax, input: &Path, op: F)
where
    F: FnOnce() -> P,
    P: Fold,
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

        let module = parser
            .parse_module()
            .map_err(|err| err.into_diagnostic(&handler).emit())?;

        let mut folder = op();

        let module = module.fold_with(&mut folder);

        let actual = print(cm, &module);
        let actual = NormalizedOutput::from(actual);

        actual.compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}

#[fixture("tests/resolver/**/input.js")]
fn test_resolver(input: PathBuf) {
    run(
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        &input,
        || {
            let unresolved_mark = Mark::fresh(Mark::root());

            chain!(
                resolver(unresolved_mark, Mark::new(), false),
                as_folder(TsHygiene { unresolved_mark }),
                fixer(None)
            )
        },
    );
}

#[fixture("tests/ts-resolver/**/input.ts")]
fn test_ts_resolver(input: PathBuf) {
    run(
        Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }),
        &input,
        || {
            let unresolved_mark = Mark::fresh(Mark::root());

            chain!(
                resolver(unresolved_mark, Mark::new(), true),
                as_folder(TsHygiene { unresolved_mark }),
                fixer(None)
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
        if SyntaxContext::empty().apply_mark(self.unresolved_mark) == i.span.ctxt {
            println!("ts_hygiene: {} is unresolved", i.sym);
            return;
        }

        let ctxt = format!("{:?}", i.span.ctxt).replace('#', "");
        i.sym = format!("{}__{}", i.sym, ctxt).into();
        i.span = i.span.with_ctxt(SyntaxContext::empty());
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
