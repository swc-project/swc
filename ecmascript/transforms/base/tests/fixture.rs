use std::path::{Path, PathBuf};
use swc_common::chain;
use swc_common::sync::Lrc;
use swc_common::Mark;
use swc_common::SourceMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_transforms_base::hygiene::hygiene;
use swc_ecma_transforms_base::resolver::resolver;
use swc_ecma_transforms_base::resolver::ts_resolver;
use swc_ecma_visit::as_folder;
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use testing::NormalizedOutput;
use testing::{fixture, run_test2};

pub fn print(cm: Lrc<SourceMap>, module: &Module) -> String {
    let mut buf = vec![];
    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                cm.clone(),
                "\n",
                &mut buf,
                None,
            )),
            comments: None,
        };

        // println!("Emitting: {:?}", module);
        emitter.emit_module(&module).unwrap();
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

    run_test2(false, |cm, _| {
        let fm = cm.load_file(input).unwrap();

        let lexer = Lexer::new(syntax, EsVersion::latest(), StringInput::from(&*fm), None);
        let mut parser = Parser::new_from(lexer);

        let module = parser.parse_module().expect("failed to parse input");

        let mut folder = op();

        let module = module.fold_with(&mut folder);

        let actual = print(cm.clone(), &module);
        let actual = NormalizedOutput::from(actual);

        actual.compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}

#[fixture("resolver/**/input.js")]
fn test_resolver(input: PathBuf) {
    run(Syntax::default(), &input, || {
        chain!(resolver(), hygiene(), fixer(None))
    });
}

#[fixture("ts-resolver/**/input.ts")]
fn test_ts_resolver(input: PathBuf) {
    run(Syntax::Typescript(Default::default()), &input, || {
        let top_level_mark = Mark::fresh(Mark::root());

        chain!(
            ts_resolver(top_level_mark),
            as_folder(TsHygiene { top_level_mark }),
            fixer(None)
        )
    });
}

struct TsHygiene {
    top_level_mark: Mark,
}

impl VisitMut for TsHygiene {
    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if SyntaxContext::empty().apply_mark(self.top_level_mark) == i.span.ctxt {
            println!("ts_hygiene: {} is top-level", i.sym);
            return;
        }

        let ctxt = format!("{:?}", i.span.ctxt).replace("#", "");
        i.sym = format!("{}__{}", i.sym, ctxt).into();
        i.span = i.span.with_ctxt(SyntaxContext::empty());
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);
        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        match n {
            PropName::Computed(n) => {
                n.visit_mut_with(self);
            }
            _ => {}
        }
    }

    fn visit_mut_ts_qualified_name(&mut self, q: &mut TsQualifiedName) {
        q.left.visit_mut_with(self);
    }
}
