use std::path::PathBuf;

use swc_common::{sync::Lrc, util::take::Take, EqIgnoreSpan, FileName, SourceMap};
use swc_ecma_ast::{EsVersion, Expr, Module, SimpleAssignTarget};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use testing::fixture;

#[path = "fixer/assignment_targets.rs"]
mod assignment_targets;
#[path = "fixer/metadata.rs"]
mod metadata;

/// Compare expression structure independently of the parentheses that the
/// parser records and the fixer inserts.
struct IgnoreParens;

impl VisitMut for IgnoreParens {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        while let Expr::Paren(paren) = expr {
            *expr = *paren.expr.take();
        }
        expr.visit_mut_children_with(self);
    }

    fn visit_mut_simple_assign_target(&mut self, target: &mut SimpleAssignTarget) {
        while let SimpleAssignTarget::Paren(paren) = target {
            *target = SimpleAssignTarget::try_from(paren.expr.take())
                .expect("parenthesized assignment target should remain assignable");
        }
        target.visit_mut_children_with(self);
    }
}

fn parse(cm: &SourceMap, source: String, syntax: Syntax) -> Module {
    let file = cm.new_source_file(FileName::Anon.into(), source);
    let mut errors = Vec::new();
    let module = parse_file_as_module(&file, syntax, EsVersion::latest(), None, &mut errors)
        .expect("fixer fixture should parse as a TypeScript module");
    assert!(
        errors.is_empty(),
        "fixer fixture has syntax errors: {errors:?}"
    );
    module
}

fn print(cm: Lrc<SourceMap>, module: &Module) -> String {
    let mut output = Vec::new();
    let mut emitter = Emitter {
        cfg: Default::default(),
        cm: cm.clone(),
        comments: None,
        wr: JsWriter::new(cm, "\n", &mut output, None),
    };
    emitter.emit_module(module).unwrap();
    String::from_utf8(output).unwrap()
}

#[fixture("tests/ts-resolver/fixer/**/input.ts")]
#[fixture("tests/ts-resolver/fixer/**/input.tsx")]
fn ts_fixer_round_trip(input: PathBuf) {
    testing::run_test2(false, |cm, _| {
        let source = std::fs::read_to_string(&input).unwrap();
        let syntax = Syntax::Typescript(TsSyntax {
            tsx: input.extension().is_some_and(|ext| ext == "tsx"),
            ..Default::default()
        });
        let mut expected = parse(&cm, source, syntax);
        let mut fixed = expected.clone();
        fixed.visit_mut_with(&mut fixer(None));
        let output = print(cm.clone(), &fixed);
        let mut actual = parse(&cm, output.clone(), syntax);

        expected.visit_mut_with(&mut IgnoreParens);
        actual.visit_mut_with(&mut IgnoreParens);
        assert!(
            expected.eq_ignore_span(&actual),
            "fixer changed the expression structure in {}:\n{output}",
            input.display(),
        );
        Ok(())
    })
    .unwrap();
}

#[fixture("tests/ts-resolver/fixer/instantiation-assignments/input.ts")]
#[fixture("tests/ts-resolver/fixer/instantiation-assignments/input.tsx")]
#[fixture("tests/ts-resolver/fixer/cast-type-query-tails/input.ts")]
#[fixture("tests/ts-resolver/fixer/cast-type-query-tails/input.tsx")]
fn ts_fixer_structure(input: PathBuf) {
    testing::run_test2(false, |cm, _| {
        let source = std::fs::read_to_string(&input).unwrap();
        let syntax = Syntax::Typescript(TsSyntax {
            tsx: input.extension().is_some_and(|ext| ext == "tsx"),
            ..Default::default()
        });
        let mut expected = parse(&cm, source, syntax);
        let mut actual = expected.clone();
        actual.visit_mut_with(&mut fixer(None));

        expected.visit_mut_with(&mut IgnoreParens);
        actual.visit_mut_with(&mut IgnoreParens);
        assert!(
            expected.eq_ignore_span(&actual),
            "fixer changed the expression structure in {}",
            input.display(),
        );
        Ok(())
    })
    .unwrap();
}
