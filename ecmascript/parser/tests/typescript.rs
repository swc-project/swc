#![feature(test)]

extern crate test;

use crate::common::Normalizer;
use pretty_assertions::assert_eq;
use std::{
    fs::File,
    io::Read,
    path::{Path, PathBuf},
};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_visit::FoldWith;
use testing::StdErr;

#[path = "common/mod.rs"]
mod common;

#[testing::fixture("typescript/**/*.ts")]
#[testing::fixture("typescript/**/*.tsx")]
fn spec(file: PathBuf) {
    let file_name = file
        .display()
        .to_string()
        .replace("\\\\", "/")
        .replace("\\", "/");

    // Ignore some useless tests
    let ignore = file_name.contains("tsc/es6/functionDeclarations/FunctionDeclaration7_es6")
        || file_name
            .contains("tsc/es6/unicodeExtendedEscapes/unicodeExtendedEscapesInStrings11_ES5")
        || file_name
            .contains("tsc/es6/unicodeExtendedEscapes/unicodeExtendedEscapesInStrings10_ES5")
        || file_name
            .contains("tsc/es6/unicodeExtendedEscapes/unicodeExtendedEscapesInStrings11_ES6")
        || file_name
            .contains("tsc/es6/unicodeExtendedEscapes/unicodeExtendedEscapesInStrings10_ES6")
        || file_name.contains(
            "tsc/types/objectTypeLiteral/propertySignatures/propertyNamesOfReservedWords",
        )
        || file_name.contains("unicodeExtendedEscapes/unicodeExtendedEscapesInTemplates10_ES5")
        || file_name.contains("unicodeExtendedEscapes/unicodeExtendedEscapesInTemplates10_ES6")
        || file_name
            .contains("tsc/es6/unicodeExtendedEscapes/unicodeExtendedEscapesInTemplates11_ES5")
        || file_name
            .contains("tsc/es6/unicodeExtendedEscapes/unicodeExtendedEscapesInTemplates11_ES6")
        || file_name.contains("tsc/es6/variableDeclarations/VariableDeclaration6_es6")
        || file_name.contains(
            "tsc/parser/ecmascriptnext/numericSeparators/parser.numericSeparators.decimal",
        );

    // Useful only for error reporting
    let ignore = ignore
        || file_name.contains(
            "tsc/types/objectTypeLiteral/callSignatures/callSignaturesWithParameterInitializers",
        )
        || file_name.contains("tsc/jsdoc/jsdocDisallowedInTypescript")
        || file_name.contains("tsc/expressions/superCalls/errorSuperCalls")
        || file_name.contains("tsc/types/rest/restElementMustBeLast");

    // Postponed
    let ignore = ignore
        || file_name.contains("tsc/jsx/inline/inlineJsxFactoryDeclarationsx")
        || file_name.contains("tsc/externalModules/typeOnly/importDefaultNamedType")
        || file_name.contains("tsc/jsx/tsxAttributeResolution5x")
        || file_name.contains("tsc/jsx/tsxErrorRecovery2x")
        || file_name.contains("tsc/jsx/tsxErrorRecovery3x")
        || file_name.contains("tsc/jsx/tsxErrorRecovery5x")
        || file_name.contains("tsc/jsx/tsxReactEmitEntitiesx/input.tsx")
        || file_name.contains("tsc/jsx/tsxTypeArgumentsJsxPreserveOutputx/input.tsx")
        || file_name.contains(
            "tsc/es7/exponentiationOperator/emitCompoundExponentiationAssignmentWithIndexingOnLHS3",
        )
        || file_name.contains("tsc/expressions/objectLiterals/objectLiteralGettersAndSetters")
        || file_name.contains("tsc/types/rest/restElementMustBeLast")
        || file_name.contains("tsc/jsx/unicodeEscapesInJsxtagsx/input.tsx")
        || file_name.contains("tsc/es6/functionDeclarations/FunctionDeclaration6_es6");

    if ignore {
        return;
    }

    {
        // Drop to reduce memory usage.
        //
        // Because the test suite contains lots of test cases, it results in oom in
        // github actions.
        let input = {
            let mut buf = String::new();
            File::open(&file).unwrap().read_to_string(&mut buf).unwrap();
            buf
        };

        eprintln!(
            "\n\n========== Running reference test {}\nSource:\n{}\n",
            file_name, input
        );
    }

    with_parser(is_backtrace_enabled(), &file, true, |p| {
        let program = p.parse_program()?.fold_with(&mut Normalizer {
            drop_span: false,
            is_test262: false,
        });

        let json =
            serde_json::to_string_pretty(&program).expect("failed to serialize module as json");

        if StdErr::from(json.clone())
            .compare_to_file(&format!("{}.json", file.display()))
            .is_err()
        {
            panic!()
        }

        let program = program.fold_with(&mut Normalizer {
            drop_span: true,
            is_test262: false,
        });

        let deser = match serde_json::from_str::<Program>(&json) {
            Ok(v) => v.fold_with(&mut Normalizer {
                drop_span: true,
                is_test262: false,
            }),
            Err(err) => {
                if err.to_string().contains("invalid type: null, expected f64") {
                    return Ok(());
                }

                panic!(
                    "failed to deserialize json back to module: {}\n{}",
                    err, json
                )
            }
        };

        assert_eq!(program, deser, "JSON:\n{}", json);

        Ok(())
    })
    .unwrap();
}

fn with_parser<F, Ret>(
    treat_error_as_bug: bool,
    file_name: &Path,
    no_early_errors: bool,
    f: F,
) -> Result<Ret, StdErr>
where
    F: FnOnce(&mut Parser<Lexer<StringInput<'_>>>) -> PResult<Ret>,
{
    let fname = file_name.display().to_string();
    let output = ::testing::run_test(treat_error_as_bug, |cm, handler| {
        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        let lexer = Lexer::new(
            Syntax::Typescript(TsConfig {
                dts: fname.ends_with(".d.ts"),
                tsx: fname.contains("tsx"),
                dynamic_import: true,
                decorators: true,
                import_assertions: true,
                no_early_errors,
                ..Default::default()
            }),
            EsVersion::Es2015,
            (&*fm).into(),
            None,
        );

        let mut p = Parser::new_from(lexer);

        let res = f(&mut p).map_err(|e| e.into_diagnostic(&handler).emit());

        for err in p.take_errors() {
            err.into_diagnostic(&handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        res
    });

    output
}

#[testing::fixture("typescript-errors/**/*.ts")]
fn errors(file: PathBuf) {
    let file_name = file.display().to_string();

    {
        let input = {
            let mut buf = String::new();
            File::open(&file).unwrap().read_to_string(&mut buf).unwrap();
            buf
        };

        eprintln!(
            "\n\n========== Running reference test {}\nSource:\n{}\n",
            file_name, input
        );
    }

    let module = with_parser(false, &file, false, |p| p.parse_typescript_module());

    let err = module.expect_err("should fail, but parsed as");
    if err
        .compare_to_file(format!("{}.stderr", file.display()))
        .is_err()
    {
        panic!()
    }
}

fn is_backtrace_enabled() -> bool {
    match ::std::env::var("RUST_BACKTRACE") {
        Ok(val) => val == "1" || val == "full",
        _ => false,
    }
}
