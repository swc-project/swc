use std::path::{Path, PathBuf};

use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, EsSyntax, Parser, StringInput, Syntax, TsSyntax};
use swc_ecma_transforms_base::semantics::{analyze, SemanticConfig, Semantics};
use testing::{fixture, run_test2, NormalizedOutput};

fn dump_semantics(semantics: &Semantics) -> String {
    let mut out = String::new();

    out.push_str("scopes\n");
    for (idx, scope) in semantics.scopes().iter().enumerate() {
        let parent = scope
            .parent
            .map(|id| id.as_u32().to_string())
            .unwrap_or_else(|| "-".into());
        let symbols = scope
            .symbols
            .iter()
            .map(|id| id.as_u32().to_string())
            .collect::<Vec<_>>()
            .join(",");

        out.push_str(&format!(
            "  scope#{idx} {:?} parent={parent} fn={} symbols=[{symbols}]\n",
            scope.kind,
            scope.enclosing_function.as_u32()
        ));
    }

    out.push_str("symbols\n");
    for (idx, symbol) in semantics.symbols().iter().enumerate() {
        let decls = symbol
            .declaration_node_ids
            .iter()
            .map(|id| id.as_u32().to_string())
            .collect::<Vec<_>>()
            .join(",");

        out.push_str(&format!(
            "  symbol#{idx} {:?} {:?} {} scope={} decls=[{decls}]\n",
            symbol.namespace,
            symbol.kind,
            symbol.name,
            symbol.scope.as_u32()
        ));
    }

    out.push_str("references\n");
    for (idx, reference) in semantics.references().iter().enumerate() {
        let symbol = reference
            .symbol
            .map(|id| id.as_u32().to_string())
            .unwrap_or_else(|| "-".into());

        out.push_str(&format!(
            "  reference#{idx} {:?} {:?} {} node={} scope={} fn={} symbol={symbol}\n",
            reference.namespace,
            reference.kind,
            reference.name,
            reference.node_id.as_u32(),
            reference.scope.as_u32(),
            reference.enclosing_function.as_u32()
        ));
    }

    out
}

fn run(input: &Path) {
    let is_ts = input.extension().filter(|ext| *ext == "ts").is_some();
    let syntax = if is_ts {
        Syntax::Typescript(TsSyntax {
            decorators: true,
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        })
    };

    let output = input.parent().unwrap().join("output.txt");

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(input).unwrap();
        let lexer = Lexer::new(syntax, EsVersion::latest(), StringInput::from(&*fm), None);
        let mut parser = Parser::new_from(lexer);

        let mut program = parser
            .parse_program()
            .map_err(|err| err.into_diagnostic(&handler).emit())?;

        let semantics = analyze(&mut program, SemanticConfig { typescript: is_ts });
        NormalizedOutput::from(dump_semantics(&semantics))
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[fixture("tests/node-id-semantics/**/input.js")]
#[fixture("tests/node-id-semantics/**/input.ts")]
fn node_id_semantics(input: PathBuf) {
    run(&input);
}
