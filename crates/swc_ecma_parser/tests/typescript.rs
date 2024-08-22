#![allow(clippy::needless_update)]

use std::{
    fs::File,
    io::Read,
    path::{Path, PathBuf},
};

use pretty_assertions::assert_eq;
use swc_common::{comments::SingleThreadedComments, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, Syntax, TsSyntax};
use swc_ecma_visit::FoldWith;
use testing::StdErr;

use crate::common::Normalizer;

#[path = "common/mod.rs"]
mod common;

#[testing::fixture("tests/shifted/**/*.ts")]
fn shifted(file: PathBuf) {
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
            file.display(),
            input
        );
    }

    with_parser(false, &file, true, true, |p, comments| {
        let program = p.parse_program()?.fold_with(&mut Normalizer {
            drop_span: false,
            is_test262: false,
        });

        let json =
            serde_json::to_string_pretty(&program).expect("failed to serialize module as json");

        if StdErr::from(json)
            .compare_to_file(format!("{}.json", file.display()))
            .is_err()
        {
            panic!()
        }
        if StdErr::from(format!("{:#?}", comments))
            .compare_to_file(format!("{}.comments", file.display()))
            .is_err()
        {
            panic!()
        }

        Ok(())
    })
    .map_err(|_| ())
    .unwrap();
}

#[testing::fixture("tests/typescript/**/*.ts")]
#[testing::fixture("tests/typescript/**/*.mts")]
#[testing::fixture("tests/typescript/**/*.cts")]
#[testing::fixture("tests/typescript/**/*.tsx")]
fn spec(file: PathBuf) {
    let output = file.parent().unwrap().join(format!(
        "{}.json",
        file.file_name().unwrap().to_string_lossy()
    ));
    run_spec(&file, &output);
}

#[testing::fixture(
    "tests/tsc/**/*.ts",
    exclude(
        "for-of51.ts",
        "parserArrowFunctionExpression11",
        "esDecorators-decoratorExpression.1"
    )
)]
fn tsc_spec(file: PathBuf) {
    let output = file.with_extension("json");
    run_spec(&file, &output);
}

fn run_spec(file: &Path, output_json: &Path) {
    let file_name = file
        .display()
        .to_string()
        .replace("\\\\", "/")
        .replace('\\', "/");

    // Ignore some useless tests
    let ignore = file_name.contains("tsc/FunctionDeclaration7_es6")
        || file_name.contains("unicodeExtendedEscapesInStrings11_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings10_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings11_ES6")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings10_ES6")
        || file_name.contains("tsc/propertyNamesOfReservedWords")
        || file_name.contains("unicodeExtendedEscapesInTemplates10_ES5")
        || file_name.contains("unicodeExtendedEscapesInTemplates10_ES6")
        || file_name.contains("tsc/unicodeExtendedEscapesInTemplates11_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInTemplates11_ES6")
        || file_name.contains("tsc/parser.numericSeparators.decimal");

    // Useful only for error reporting
    let ignore = ignore
        || file_name.contains("tsc/callSignaturesWithParameterInitializers")
        || file_name.contains("tsc/jsdocDisallowedInTypescript")
        || file_name.contains("tsc/errorSuperCalls")
        || file_name.contains("tsc/restElementMustBeLast")
        || file_name.contains("tsc/parserRegularExpressionDivideAmbiguity3");

    // Postponed
    let ignore = ignore
        || file_name.contains("tsc/inlineJsxFactoryDeclarationsx")
        || file_name.contains("tsc/importDefaultNamedType")
        || file_name.contains("tsc/tsxAttributeResolution5x")
        || file_name.contains("tsc/tsxErrorRecovery2x")
        || file_name.contains("tsc/tsxErrorRecovery3x")
        || file_name.contains("tsc/tsxErrorRecovery5x")
        || file_name.contains("tsc/tsxReactEmitEntitiesx")
        || file_name.contains("tsc/tsxTypeArgumentsJsxPreserveOutputx")
        || file_name.contains("tsc/emitCompoundExponentiationAssignmentWithIndexingOnLHS3")
        || file_name.contains("tsc/objectLiteralGettersAndSetters")
        || file_name.contains("tsc/restElementMustBeLast")
        || file_name.contains("tsc/unicodeEscapesInJsxtagsx")
        || file_name.contains("tsc/FunctionDeclaration6_es6")
        || file_name.contains("tsc/checkJsxNamespaceNamesQuestionableForms")
        || file_name.contains("tsc/classExtendingOptionalChain")
        || file_name.contains("tsc/inlineJsxFactoryDeclarations")
        || file_name.contains("tsc/interfaceExtendingOptionalChain")
        || file_name.contains("tsc/interfacesWithPredefinedTypesAsNames")
        || file_name.contains("tsc/namedTupleMembersErrors")
        || file_name.contains("tsc/parserForOfStatement23")
        || file_name.contains("tsc/topLevelAwait.2")
        || file_name.contains("tsc/tsxAttributeResolution5")
        || file_name.contains("tsc/tsxErrorRecovery2")
        || file_name.contains("tsc/tsxErrorRecovery3")
        || file_name.contains("tsc/tsxTypeArgumentsJsxPreserveOutput")
        || file_name.contains("tsc/unicodeEscapesInJsxtags")
        || file_name.contains("tsc/propertyAccessNumericLiterals")
        || file_name.contains("tsc/parserAssignmentExpression1")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity11")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity15")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity16")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity20")
        || file_name.contains("tsc/awaitUsingDeclarationsInFor")
        || file_name.ends_with("tsc/usingDeclarationsInFor.ts")
        || file_name.ends_with("tsc/decoratorOnClassMethod12.ts")
        || file_name.ends_with("tsc/esDecorators-preservesThis.ts")
        || file_name.ends_with("tsc/topLevelVarHoistingCommonJS.ts");

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
            File::open(file).unwrap().read_to_string(&mut buf).unwrap();
            buf
        };

        eprintln!(
            "\n\n========== Running reference test {}\nSource:\n{}\n",
            file_name, input
        );
    }

    with_parser(false, file, true, false, |p, _| {
        let program = p.parse_program()?.fold_with(&mut Normalizer {
            drop_span: false,
            is_test262: false,
        });

        let json =
            serde_json::to_string_pretty(&program).expect("failed to serialize module as json");

        if StdErr::from(json.clone())
            .compare_to_file(output_json)
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

        // We are not debugging f64 parsing of serde.
        if file_name.contains("issue-1803") || file_name.contains("stc") {
            return Ok(());
        }

        assert_eq!(program, deser, "JSON:\n{}", json);

        Ok(())
    })
    .map_err(|_| ())
    .unwrap();
}

fn with_parser<F, Ret>(
    treat_error_as_bug: bool,
    file_name: &Path,
    no_early_errors: bool,
    shift: bool,
    f: F,
) -> Result<Ret, StdErr>
where
    F: FnOnce(&mut Parser<Lexer>, &SingleThreadedComments) -> PResult<Ret>,
{
    let fname = file_name.display().to_string();

    ::testing::run_test(treat_error_as_bug, |cm, handler| {
        if shift {
            cm.new_source_file(FileName::Anon.into(), "".into());
        }

        let comments = SingleThreadedComments::default();

        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        let lexer = Lexer::new(
            Syntax::Typescript(TsSyntax {
                dts: fname.ends_with(".d.ts"),
                tsx: fname.contains("tsx"),
                decorators: true,
                no_early_errors,
                disallow_ambiguous_jsx_like: fname.contains("cts") || fname.contains("mts"),
                ..Default::default()
            }),
            EsVersion::Es2015,
            (&*fm).into(),
            Some(&comments),
        );

        let mut p = Parser::new_from(lexer);

        let res = f(&mut p, &comments).map_err(|e| e.into_diagnostic(handler).emit());

        for err in p.take_errors() {
            err.into_diagnostic(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        res
    })
}

#[testing::fixture("tests/typescript-errors/**/*.ts")]
#[testing::fixture("tests/typescript-errors/**/*.mts")]
#[testing::fixture("tests/typescript-errors/**/*.cts")]
#[testing::fixture("tests/typescript-errors/**/*.tsx")]
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

    let module = with_parser(false, &file, false, false, |p, _| {
        p.parse_typescript_module()
    });

    let err = module.expect_err("should fail, but parsed as");
    if err
        .compare_to_file(format!("{}.swc-stderr", file.display()))
        .is_err()
    {
        panic!()
    }
}
