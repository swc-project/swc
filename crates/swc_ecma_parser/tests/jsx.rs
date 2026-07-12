use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use pretty_assertions::assert_eq;
use swc_common::{errors::Handler, sync::Lrc, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, SourceType};
use swc_ecma_visit::{Fold, FoldWith};
use testing::{run_test, StdErr};

fn parse_module(cm: Lrc<SourceMap>, handler: &Handler, file_name: &Path) -> Result<Module, ()> {
    let fm = cm
        .load_file(file_name)
        .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));
    let result = Parser::new(&fm.src, SourceType::jsx())
        .with_start_pos(fm.start_pos)
        .parse();
    let failed = result.panicked || !result.diagnostics.is_empty();
    for error in result.diagnostics {
        error.into_diagnostic(handler).emit();
    }
    if failed {
        return Err(());
    }
    let Program::Module(module) = result.program else {
        unreachable!("module source type must produce a module")
    };
    Ok(module)
}

#[testing::fixture("tests/jsx/basic/**/*.js")]
#[testing::fixture("tests/jsx/basic/**/*.jsx")]
fn references(entry: PathBuf) {
    run_test(false, |cm, handler| {
        let input = read_to_string(&entry).unwrap();

        eprintln!("\n\n========== Running reference test \nSource:\n{input}\n");

        // Parse source
        let module = parse_module(cm, handler, &entry)?.fold_with(&mut Normalizer);
        let json =
            serde_json::to_string_pretty(&module).expect("failed to serialize module as json");
        if StdErr::from(json.clone())
            .compare_to_file(format!("{}.json", entry.display()))
            .is_err()
        {
            panic!()
        }

        let deser = serde_json::from_str::<Module>(&json)
            .unwrap_or_else(|err| {
                panic!("failed to deserialize json back to module: {err}\n{json}")
            })
            .fold_with(&mut Normalizer);
        assert_eq!(module, deser, "JSON:\n{}", json);

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "verify")]
#[testing::fixture("tests/jsx/errors/**/*.js")]
fn error(entry: PathBuf) {
    let input = read_to_string(&entry).unwrap();

    eprintln!(
        "\n\n========== Running error reporting test \nSource:\n{}\n",
        input
    );

    let err = run_test(false, |cm, handler| {
        if false {
            // Type annotation
            return Ok(());
        }

        // Parse source
        let _ = parse_module(cm, handler, &entry);
        if !handler.has_errors() {
            panic!("should emit error, but parsed without error")
        }

        Err(())
    })
    .expect_err("should fail, but parsed as");

    if err
        .compare_to_file(format!("{}.swc-stderr", entry.display()))
        .is_err()
    {
        panic!()
    }
}

struct Normalizer;

impl Fold for Normalizer {
    fn fold_pat(&mut self, mut node: Pat) -> Pat {
        node = node.fold_children_with(self);

        if let Pat::Expr(expr) = node {
            match *expr {
                Expr::Ident(i) => return i.into(),
                _ => {
                    node = expr.into();
                }
            }
        }

        node
    }
}
