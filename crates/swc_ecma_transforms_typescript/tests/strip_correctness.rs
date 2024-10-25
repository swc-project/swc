use std::path::PathBuf;

use swc_common::{FileName, Mark};
use swc_ecma_ast::*;
use swc_ecma_codegen::to_code_default;
use swc_ecma_parser::{lexer::Lexer, EsSyntax, Parser, Syntax, TsSyntax};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene, resolver};
use swc_ecma_transforms_typescript::typescript;

#[testing::fixture("../swc_ecma_parser/tests/tsc/**/*.ts")]
#[testing::fixture("../swc_ecma_parser/tests/tsc/**/*.tsx")]
#[testing::fixture("../swc_ecma_parser/tests/typescript/**/*.ts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript/**/*.tsx")]
fn identity(entry: PathBuf) {
    let file_name = entry
        .to_string_lossy()
        .replace("\\\\", "/")
        .replace('\\', "/");

    let ignored = &[
        // Cannot run the test with current test suite
        "multilinex",
        // Stack size
        "stack-size",
        "issue-716",
        "parenthesizedTypes.ts",
        // These tests are hard to debug because file is large
        "emitCompoundExponentiationAssignmentWithIndexingOnLHS3.ts",
        "emitExponentiationOperator1.ts",
        "emitExponentiationOperator3.ts",
        "emitExponentiationOperator4.ts",
        "emitExponentiationOperatorInTempalteString4.ts",
        "emitExponentiationOperatorInTempalteString4ES6.ts",
        "exponentiationOperatorWithInvalidSimpleUnaryExpressionOperands.ts",
        // `let[0] = 'foo'` is useless
        "letIdentifierInElementAccess01.ts",
        // decorator
        "issue-2417",
    ];

    // TODO: Unignore
    let postponed = &[
        "decoratorOnClassMethod11.ts",
        "elementAccessChain.3.ts",
        "awaitUsingDeclarationsInForAwaitOf.ts",
        "awaitUsingDeclarationsInForOf.1.ts",
        "usingDeclarationsInForOf.1.ts",
        "usingDeclarationsInForAwaitOf.ts",
        "tsxReactEmitNesting.tsx",
        "staticAutoAccessorsWithDecorators.ts",
        "generatorTypeCheck59.ts",
        "generatorTypeCheck61.ts",
        "parserAssignmentExpression1.ts",
        "objectRestNegative.ts",
        "parserSuperExpression2.ts",
        "propertyAccessChain.3.ts",
        "esDecorators-classDeclaration-classSuper.2.ts",
        "esDecorators-classExpression-classSuper.2.ts",
        "contextualTypes.ts",
        "decoratorOnClassMethod12.ts",
        "decoratorExpression.2.ts",
        "preservesThis.ts",
    ];

    // TODO: Unignore const enum test
    let ignore = file_name.contains("export-import-require")
        || file_name.contains("issue-866")
        || file_name.contains("jsdocTypeFromChainedAssignment3")
        || file_name.contains("enumConstantMembers")
        || postponed
            .iter()
            .any(|postponed| file_name.ends_with(postponed))
        || ignored.iter().any(|ignored| file_name.contains(ignored));

    if ignore {
        return;
    }

    ::testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let src = cm.load_file(&entry).expect("failed to load file");
        println!("{}", src.src);

        let mut parser: Parser<Lexer> = Parser::new(
            Syntax::Typescript(TsSyntax {
                tsx: file_name.contains("tsx"),
                decorators: true,
                dts: false,
                no_early_errors: false,
                disallow_ambiguous_jsx_like: false,
            }),
            (&*src).into(),
            None,
        );

        let js_content = {
            // Parse source
            let program = parser
                .parse_typescript_module()
                .map(|p| {
                    let unresolved_mark = Mark::new();
                    let top_level_mark = Mark::new();
                    Program::Module(p)
                        .apply(resolver(unresolved_mark, top_level_mark, true))
                        .apply(typescript(
                            typescript::Config {
                                no_empty_export: true,
                                ..Default::default()
                            },
                            unresolved_mark,
                            top_level_mark,
                        ))
                        .apply(hygiene())
                        .apply(fixer(None))
                })
                .map_err(|e| {
                    eprintln!("failed to parse as typescript module");
                    e.into_diagnostic(handler).emit();
                });

            // We are not testing parser issues
            let program = match program {
                Ok(program) => program,
                Err(_) => return Ok(()),
            };

            to_code_default(cm.clone(), None, &program)
        };

        println!("---------------- JS ----------------\n\n{}", js_content);

        let js_fm = cm.new_source_file(FileName::Anon.into(), js_content.clone());

        let mut parser: Parser<Lexer> = Parser::new(
            Syntax::Es(EsSyntax {
                jsx: file_name.contains("tsx"),
                decorators: true,
                decorators_before_export: true,
                export_default_from: true,
                import_attributes: true,
                allow_super_outside_method: true,
                auto_accessors: true,
                ..Default::default()
            }),
            (&*js_fm).into(),
            None,
        );

        // It's very unscientific.
        // TODO: Change this with visitor
        if js_content.contains("import") || js_content.contains("export") {
            parser
                .parse_module()
                .unwrap_or_else(|err| panic!("{} is invalid module\n{:?}", js_content, err));
        } else {
            parser
                .parse_script()
                .unwrap_or_else(|err| panic!("{} is invalid script\n{:?}", js_content, err));
        }

        Ok(())
    })
    .expect("failed to run test");
}
