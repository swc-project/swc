#![feature(test)]
extern crate test;

use std::{
    env,
    io::{self, Write},
    path::Path,
    sync::{Arc, RwLock},
};
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_codegen::{self, Emitter};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_transforms_typescript::strip;
use swc_ecma_visit::{Fold, FoldWith};
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use walkdir::WalkDir;

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            test_type: TestType::UnitTest,
            name: TestName::DynTestName(name),
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: DynTestFn(Box::new(f)),
    });
}

fn correctness_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .join("parser")
        .join("tests")
        .join("typescript");

    eprintln!("Loading tests from {}", dir.display());

    for entry in WalkDir::new(&dir) {
        let entry = entry?;

        if entry.metadata()?.is_dir() {
            continue;
        }

        let file_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .expect("to_str() failed")
            .replace("\\\\", "/")
            .replace("\\", "/");

        let ext = entry
            .path()
            .extension()
            .map(|s| s.to_string_lossy().to_owned())
            .unwrap_or_default();
        if ext != "ts" && ext != "tsx" {
            continue;
        }

        let ignored = &[
            // Cannot run the test with current test suite
            "tsc/directives/multilinex",
            // Stack size
            "stack-size",
            "issue-716",
            "tsc/types/specifyingTypes/typeLiterals/parenthesizedTypes/input.ts",
            // TODO: Unignore unicode escape test
            "unicodeExtendedEscapes",
            // Trolling with yield
            "tsc/es6/yieldExpressions/generatorTypeCheck40/input.ts",
            "tsc/es6/yieldExpressions/generatorTypeCheck55/input.ts",
            "tsc/es6/yieldExpressions/generatorTypeCheck60/input.ts",
            "tsc/es6/functionDeclarations/FunctionDeclaration6_es6/input.ts",
            "tsc/es6/functionDeclarations/FunctionDeclaration7_es6/input.ts",
            // Trolling with pattern
            "tsc/es6/destructuring/restPropertyWithBindingPattern/input.ts",
            "tsc/expressions/optionalChaining/elementAccessChain/elementAccessChain.3/input.ts",
            "tsc/expressions/optionalChaining/propertyAccessChain/propertyAccessChain.3/input.ts",
            // TODO: Unignore
            // These tests are hard to debug because file is large
            "tsc/es7/exponentiationOperator/\
             emitCompoundExponentiationAssignmentWithIndexingOnLHS3/input.ts",
            "tsc/es7/exponentiationOperator/emitExponentiationOperator1/input.ts",
            "tsc/es7/exponentiationOperator/emitExponentiationOperator3/input.ts",
            "tsc/es7/exponentiationOperator/emitExponentiationOperator4/input.ts",
            "tsc/es7/exponentiationOperator/emitExponentiationOperatorInTempalteString4/input.ts",
            "tsc/es7/exponentiationOperator/emitExponentiationOperatorInTempalteString4ES6/input.\
             ts",
            "tsc/es7/exponentiationOperator/\
             exponentiationOperatorWithInvalidSimpleUnaryExpressionOperands/input.ts",
            // `let[0] = 'foo'` is useless
            "tsc/expressions/elementAccess/letIdentifierInElementAccess01/input.ts",
            // Parser issue
            "tsc/expressions/superCalls/errorSuperCalls/input.ts",
            // TypeScript parser issue
            "tsc/expressions/objectLiterals/objectLiteralGettersAndSetters/input.ts",
            "tsc/parser/ecmascript5/SuperExpressions/parserSuperExpression2/input.ts",
            // TODO: Unignore
            "tsc/jsx",
            "tsc/types/contextualTypes/jsxAttributes/\
             contextuallyTypedStringLiteralsInJsxAttributes01x/input.tsx",
            "tsc/types/contextualTypes/jsxAttributes/\
             contextuallyTypedStringLiteralsInJsxAttributes02x/input.tsx",
            // TODO: Unignore
            // Tests require ast change
            "tsc/types/thisType/thisTypeInAccessors/input.ts",
            "tsc/types/thisType/thisTypeInAccessorsNegative/input.ts",
            // Invalid syntax
            "tsc/types/rest/objectRestNegative/input.ts",
            "tsc/jsdoc/jsdocDisallowedInTypescript/input.ts",
            "tsc/types/rest/restElementMustBeLast/input.ts",
            "tsc/types/rest/objectRestPropertyMustBeLast/input.ts",
            "tsc/types/objectTypeLiteral/propertySignatures/propertyNamesOfReservedWords/input.ts",
            "tsc/types/objectTypeLiteral/callSignatures/callSignaturesWithParameterInitializers/\
             input.ts",
        ];

        // TODO: Unignore const enum test
        let ignore = file_name.contains("export-import-require/input.ts")
            || file_name.contains("v4/issue-866/input.ts")
            || file_name.contains("jsdocTypeFromChainedAssignment3")
            || file_name.contains("tsc/enums/enumConstantMembers/input.ts")
            || ignored.iter().any(|ignored| file_name.contains(ignored));

        let name = format!("typescript::correctness::{}", file_name);

        add_test(tests, name, ignore, {
            move || {
                ::testing::run_test(false, |cm, handler| -> Result<(), ()> {
                    let src = cm.load_file(&entry.path()).expect("failed to load file");
                    println!("{}", src.src);

                    let mut parser: Parser<Lexer<StringInput>> = Parser::new(
                        Syntax::Typescript(TsConfig {
                            tsx: file_name.contains("tsx"),
                            decorators: true,
                            dynamic_import: true,
                            dts: false,
                            no_early_errors: false,
                            import_assertions: true,
                        }),
                        (&*src).into(),
                        None,
                    );

                    let mut wr = Buf(Arc::new(RwLock::new(vec![])));

                    {
                        let mut emitter = Emitter {
                            cfg: swc_ecma_codegen::Config { minify: false },
                            cm: cm.clone(),
                            wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                                cm.clone(),
                                "\n",
                                &mut wr,
                                None,
                            )),
                            comments: None,
                        };

                        // Parse source
                        let module = parser
                            .parse_typescript_module()
                            .map(|p| p.fold_with(&mut strip()).fold_with(&mut fixer(None)))
                            .map_err(|e| {
                                eprintln!("failed to parse as typescript module");
                                e.into_diagnostic(handler).emit();
                            })?;

                        emitter.emit_module(&module).unwrap();
                    }

                    let js_content = String::from_utf8_lossy(&*wr.0.read().unwrap()).to_string();

                    println!("---------------- JS ----------------\n\n{}", js_content);

                    let js_fm = cm.new_source_file(FileName::Anon, js_content.clone());

                    let mut parser: Parser<Lexer<StringInput>> = Parser::new(
                        Syntax::Es(EsConfig {
                            jsx: file_name.contains("tsx"),
                            num_sep: true,
                            class_private_props: true,
                            class_private_methods: true,
                            class_props: true,
                            decorators: true,
                            decorators_before_export: true,
                            export_default_from: true,
                            export_namespace_from: true,
                            dynamic_import: true,
                            nullish_coalescing: true,
                            optional_chaining: true,
                            import_meta: true,
                            top_level_await: true,
                            ..Default::default()
                        }),
                        (&*js_fm).into(),
                        None,
                    );

                    // It's very unscientific.
                    // TODO: Change this with visitor
                    if js_content.contains("import") || js_content.contains("export") {
                        parser.parse_module().unwrap_or_else(|err| {
                            panic!("{} is invalid module\n{:?}", js_content, err)
                        });
                    } else {
                        parser.parse_script().unwrap_or_else(|err| {
                            panic!("{} is invalid script\n{:?}", js_content, err)
                        });
                    }

                    Ok(())
                })
                .expect("failed to run test");
            }
        });
    }

    Ok(())
}

#[test]
fn identity() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    correctness_tests(&mut tests).expect("failed to load testss");
    test_main(&args, tests, Some(Options::new()));
}

#[derive(Debug, Clone)]
struct Buf(Arc<RwLock<Vec<u8>>>);
impl Write for Buf {
    fn write(&mut self, data: &[u8]) -> io::Result<usize> {
        self.0.write().unwrap().write(data)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.write().unwrap().flush()
    }
}

struct Normalizer;
impl Fold for Normalizer {
    fn fold_new_expr(&mut self, expr: NewExpr) -> NewExpr {
        let mut expr = expr.fold_children_with(self);

        expr.args = match expr.args {
            Some(..) => expr.args,
            None => Some(vec![]),
        };

        expr
    }

    fn fold_prop_name(&mut self, name: PropName) -> PropName {
        let name = name.fold_children_with(self);

        match name {
            PropName::Ident(i) => PropName::Str(Str {
                value: i.sym,
                span: i.span,
                has_escape: false,
                kind: StrKind::Normal {
                    contains_quote: false,
                },
            }),
            PropName::Num(n) => {
                let s = if n.value.is_infinite() {
                    if n.value.is_sign_positive() {
                        "Infinity".into()
                    } else {
                        "-Infinity".into()
                    }
                } else {
                    format!("{}", n.value)
                };
                PropName::Str(Str {
                    value: s.into(),
                    span: n.span,
                    has_escape: false,
                    kind: Default::default(),
                })
            }
            _ => name,
        }
    }

    fn fold_stmt(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children_with(self);

        match stmt {
            Stmt::Expr(ExprStmt { span, expr }) => match *expr {
                Expr::Paren(ParenExpr { expr, .. }) => Stmt::Expr(ExprStmt { span, expr }),
                _ => Stmt::Expr(ExprStmt { span, expr }),
            },
            _ => stmt,
        }
    }
}
