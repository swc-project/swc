use std::{
    io::{self, Write},
    path::PathBuf,
    sync::{Arc, RwLock},
};

use swc_common::{FileName, Mark};
use swc_ecma_ast::*;
use swc_ecma_codegen::{self, Emitter};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene, resolver};
use swc_ecma_transforms_typescript::typescript;
use swc_ecma_visit::{Fold, FoldWith};

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
        "constEnum4.ts",
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
            Syntax::Typescript(TsConfig {
                tsx: file_name.contains("tsx"),
                decorators: true,
                dts: false,
                no_early_errors: false,
                disallow_ambiguous_jsx_like: false,
            }),
            (&*src).into(),
            None,
        );

        let mut wr = Buf(Arc::new(RwLock::new(vec![])));

        {
            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config::default(),
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
            let program = parser
                .parse_typescript_module()
                .map(|p| {
                    let unresolved_mark = Mark::new();
                    let top_level_mark = Mark::new();
                    Program::Module(p)
                        .fold_with(&mut resolver(unresolved_mark, top_level_mark, true))
                        .fold_with(&mut typescript(
                            typescript::Config {
                                no_empty_export: true,
                                ..Default::default()
                            },
                            top_level_mark,
                        ))
                        .fold_with(&mut hygiene())
                        .fold_with(&mut fixer(None))
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

            emitter.emit_program(&program).unwrap();
        }

        let js_content = String::from_utf8_lossy(&wr.0.read().unwrap()).to_string();

        println!("---------------- JS ----------------\n\n{}", js_content);

        let js_fm = cm.new_source_file(FileName::Anon, js_content.clone());

        let mut parser: Parser<Lexer> = Parser::new(
            Syntax::Es(EsConfig {
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
                raw: None,
                value: i.sym,
                span: i.span,
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
                    raw: None,
                    value: s.into(),
                    span: n.span,
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
