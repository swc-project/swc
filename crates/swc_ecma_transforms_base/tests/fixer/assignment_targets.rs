use std::path::PathBuf;

use swc_common::{sync::Lrc, util::take::Take, EqIgnoreSpan, FileName, SourceMap};
use swc_ecma_ast::{EsVersion, Expr, Module, NewExpr};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{error::SyntaxError, parse_file_as_module, Syntax, TsSyntax};
use swc_ecma_transforms_base::fixer::{fixer, paren_remover};
use swc_ecma_visit::{VisitMut, VisitMutWith};
use testing::{fixture, NormalizedOutput};

/// Keep recovered parenthesized targets intact while ignoring redundant
/// expression parentheses and optional empty constructor argument lists.
struct Normalize;

impl VisitMut for Normalize {
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        while let Expr::Paren(paren) = expr {
            *expr = *paren.expr.take();
        }
        expr.visit_mut_children_with(self);
    }

    fn visit_mut_new_expr(&mut self, expr: &mut NewExpr) {
        expr.visit_mut_children_with(self);
        if expr.args.as_ref().is_some_and(|args| args.is_empty()) {
            expr.args = None;
        }
    }
}

fn parse(cm: &SourceMap, source: String, syntax: Syntax) -> (Module, Vec<SyntaxError>) {
    let file = cm.new_source_file(FileName::Anon.into(), source);
    let mut errors = Vec::new();
    let module = parse_file_as_module(&file, syntax, EsVersion::latest(), None, &mut errors)
        .expect("invalid targets should retain a recoverable module");
    (
        module,
        errors.into_iter().map(|error| error.into_kind()).collect(),
    )
}

fn print(cm: Lrc<SourceMap>, module: &Module, minify: bool) -> String {
    let mut output = Vec::new();
    Emitter {
        cfg: swc_ecma_codegen::Config::default().with_minify(minify),
        cm: cm.clone(),
        comments: None,
        wr: JsWriter::new(cm, "\n", &mut output, None),
    }
    .emit_module(module)
    .unwrap();
    String::from_utf8(output).unwrap()
}

#[fixture("tests/fixer/assignment-targets/**/input.ts")]
#[fixture("tests/fixer/assignment-targets/**/input.tsx")]
fn recovered_assignment_targets(input: PathBuf) {
    testing::run_test2(false, |cm, _| {
        let syntax = Syntax::Typescript(TsSyntax {
            tsx: input.extension().is_some_and(|ext| ext == "tsx"),
            ..Default::default()
        });
        let (mut expected, errors) = parse(&cm, std::fs::read_to_string(&input).unwrap(), syntax);
        assert!(
            !errors.is_empty(),
            "fixture should exercise parser recovery"
        );
        let mut fixed = expected.clone();
        fixed.visit_mut_with(&mut fixer(None));

        // Both passes must preserve expressions that AssignTarget cannot
        // represent without the parenthesized recovery node.
        let mut removed = expected.clone();
        removed.visit_mut_with(&mut paren_remover(None));
        expected.visit_mut_with(&mut Normalize);
        removed.visit_mut_with(&mut Normalize);
        assert!(expected.eq_ignore_span(&removed));

        for minify in [false, true] {
            let output = print(cm.clone(), &fixed, minify);
            let (mut actual, actual_errors) = parse(&cm, output.clone(), syntax);
            actual.visit_mut_with(&mut Normalize);
            assert!(expected.eq_ignore_span(&actual), "{output}");
            assert_eq!(errors, actual_errors, "{output}");

            let mode = if minify { "compact" } else { "pretty" };
            let extension = input.extension().unwrap().to_str().unwrap();
            NormalizedOutput::from(output)
                .compare_to_file(input.with_file_name(format!("output.{mode}.{extension}")))
                .unwrap();
        }
        NormalizedOutput::from(format!("{errors:#?}\n"))
            .compare_to_file(input.with_file_name("output.errors"))
            .unwrap();
        Ok(())
    })
    .unwrap();
}
