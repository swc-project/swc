use swc_ecma_lexer::common::parser::{
    module_item::parse_module_item,
    stmt::{parse_stmt, parse_stmt_list_item},
};

use super::*;
use crate::parser::Parser;

mod module_item;

impl<I: Tokens> Parser<I> {
    pub fn parse_module_item(&mut self) -> PResult<ModuleItem> {
        parse_module_item(self)
    }

    /// Parse a statement but not a declaration.
    pub fn parse_stmt(&mut self) -> PResult<Stmt> {
        parse_stmt(self)
    }

    /// Parse a statement and maybe a declaration.
    pub fn parse_stmt_list_item(&mut self) -> PResult<Stmt> {
        parse_stmt_list_item(self)
    }
}

#[cfg(test)]
mod tests {
    use swc_atoms::atom;
    use swc_common::{comments::SingleThreadedComments, DUMMY_SP as span};
    use swc_ecma_lexer::common::parser::stmt::TempForHead;
    use swc_ecma_visit::assert_eq_ignore_span;

    use super::*;
    use crate::EsSyntax;

    fn stmt(s: &'static str) -> Stmt {
        test_parser(s, Syntax::default(), |p| p.parse_stmt())
    }

    fn module_item(s: &'static str) -> ModuleItem {
        test_parser(s, Syntax::default(), |p| p.parse_module_item())
    }
    fn expr(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| p.parse_expr())
    }

    #[test]
    fn expr_stmt() {
        assert_eq_ignore_span!(
            stmt("a + b + c"),
            Stmt::Expr(ExprStmt {
                span,
                expr: expr("a + b + c")
            })
        )
    }

    #[test]
    fn catch_rest_pat() {
        assert_eq_ignore_span!(
            stmt("try {} catch({ ...a34 }) {}"),
            Stmt::Try(Box::new(TryStmt {
                span,
                block: BlockStmt {
                    span,
                    ..Default::default()
                },
                handler: Some(CatchClause {
                    span,
                    param: Pat::Object(ObjectPat {
                        span,
                        optional: false,
                        props: vec![ObjectPatProp::Rest(RestPat {
                            span,
                            dot3_token: span,
                            arg: Box::new(Pat::Ident(
                                Ident::new_no_ctxt(atom!("a34"), span).into()
                            )),
                            type_ann: None
                        })],
                        type_ann: None,
                    })
                    .into(),
                    body: BlockStmt {
                        span,
                        ..Default::default()
                    }
                }),
                finalizer: None
            }))
        );
    }

    #[test]
    fn throw_this() {
        assert_eq_ignore_span!(
            stmt("throw this"),
            Stmt::Throw(ThrowStmt {
                span,
                arg: expr("this"),
            })
        )
    }

    #[test]
    fn await_for_of() {
        assert_eq_ignore_span!(
            stmt("for await (const a of b) ;"),
            Stmt::ForOf(ForOfStmt {
                span,
                is_await: true,
                left: ForHead::VarDecl(Box::new(VarDecl {
                    span,
                    kind: VarDeclKind::Const,
                    decls: vec![VarDeclarator {
                        span,
                        init: None,
                        name: Pat::Ident(Ident::new_no_ctxt(atom!("a"), span).into()),
                        definite: false,
                    }],
                    ..Default::default()
                })),
                right: Box::new(Expr::Ident(Ident::new_no_ctxt(atom!("b"), span))),

                body: Box::new(Stmt::Empty(EmptyStmt { span })),
            })
        )
    }

    #[test]
    fn no_empty_without_semi() {
        assert_eq_ignore_span!(
            stmt("(function foo() { return 1 })"),
            stmt(
                "(function foo () {
                return 1
            })"
            )
        );

        assert_eq_ignore_span!(
            stmt("{ 1; }"),
            Stmt::Block(BlockStmt {
                span,
                stmts: vec![stmt("1")],
                ..Default::default()
            })
        );
    }

    #[test]
    fn if_else() {
        assert_eq_ignore_span!(
            stmt("if (a) b; else c"),
            Stmt::If(IfStmt {
                span,
                test: expr("a"),
                cons: Box::new(stmt("b;")),
                alt: Some(Box::new(stmt("c"))),
            })
        );
    }

    #[test]
    fn class_decorator() {
        assert_eq_ignore_span!(
            test_parser(
                "
            @decorator
            @dec2
            class Foo {}
            ",
                Syntax::Es(EsSyntax {
                    decorators: true,
                    ..Default::default()
                }),
                |p| p.parse_stmt_list_item(),
            ),
            Stmt::Decl(Decl::Class(ClassDecl {
                ident: Ident::new_no_ctxt(atom!("Foo"), span),
                class: Box::new(Class {
                    span,
                    decorators: vec![
                        Decorator {
                            span,
                            expr: expr("decorator")
                        },
                        Decorator {
                            span,
                            expr: expr("dec2")
                        }
                    ],
                    super_class: None,
                    body: Vec::new(),
                    is_abstract: false,
                    ..Default::default()
                }),
                declare: false,
            }))
        );
    }

    #[test]
    fn example() {
        let src = r#"
import React from 'react'
import ReactDOM from 'react-dom'

function App() {
  return <h1>JSX is working!</h1>
}

ReactDOM.render(<App />, document.getElementById('root'))

"#;
        test_parser(
            src,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn ice() {
        let src = r#"import React from "react"

function App() {
  return <h1>works</h1>
}

export default App"#;
        test_parser(
            src,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default() {
        let src = "export v, { x, y as w } from 'mod';";
        test_parser(
            src,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_2() {
        let src = "export foo from 'bar';";
        test_parser(
            src,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_3() {
        let src = "export default from 'bar';";
        test_parser(
            src,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_4() {
        let src = "export default, {foo} from 'bar';";
        test_parser(
            src,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn shebang_01() {
        let src = "#!/usr/bin/env node";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn shebang_02() {
        let src = "#!/usr/bin/env node
let x = 4";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn empty() {
        test_parser("", Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn issue_226() {
        test_parser(
            "export * as Foo from 'bar';",
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    #[should_panic(expected = "Expected 'from', got ','")]
    fn issue_4369_1() {
        test_parser(
            r#"export * as foo, { bar } from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: false,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_4369_2() {
        test_parser(
            r#"export foo, * as bar, { baz } from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_4369_3() {
        test_parser(
            r#"export foo, * as bar from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_4369_4() {
        test_parser(
            r#"export * as bar, { baz } from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_4369_5() {
        test_parser(
            r#"export foo, { baz } from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_257_var() {
        test_parser(
            "
export default function waitUntil(callback, options = {}) {
  var timeout = 'timeout' in options ? options.timeout : 1000;
}",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_257_let() {
        test_parser(
            "
export default function waitUntil(callback, options = {}) {
  let timeout = 'timeout' in options ? options.timeout : 1000;
}",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_269() {
        test_parser(
            ";(function() {})(window, window.lib || (window.lib = {}))",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_319_2() {
        module_item(
            "export default obj({
    async f() {
        await g();
    }
});",
        );
    }

    #[test]
    fn issue_340_fn() {
        test_parser("export default function(){};", Default::default(), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_340_async_fn() {
        test_parser(
            "export default async function(){};",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_340_generator_fn() {
        test_parser("export default function*(){};", Default::default(), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_340_class() {
        test_parser("export default class {};", Default::default(), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_360() {
        test_parser(
            "var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_380_1() {
        test_parser(
            "import(filePath).then(bar => {})",
            Syntax::Es(Default::default()),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_380_2() {
        test_parser(
            "class Foo {
                componentDidMount() {
                    const filePath = '../foo/bar'
                    import(filePath).then(bar => {})
                }
            }",
            Syntax::Es(Default::default()),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_411() {
        test_parser(
            "try {
} catch {}",
            Syntax::Es(Default::default()),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn top_level_await() {
        test_parser("await foo", Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_856() {
        let c = SingleThreadedComments::default();
        let s = "class Foo {
    static _extensions: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: (module: Module, filename: string) => any;
    } = Object.create(null);
}
";
        let _ = test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
    }

    #[test]
    fn issue_856_2() {
        let c = SingleThreadedComments::default();
        let s = "type ConsoleExamineFunc = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csl: any,
  out: StringBuffer,
  err?: StringBuffer,
  both?: StringBuffer
) => void;";

        let _ = test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
    }

    #[test]
    fn issue_856_3() {
        let c = SingleThreadedComments::default();
        let s = "type RequireWrapper = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exports: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  require: any,
  module: Module,
  __filename: string,
  __dirname: string
) => void;";

        let _ = test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 2);
    }

    #[test]
    fn issue_856_4() {
        let c = SingleThreadedComments::default();
        let s = "const _extensions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (module: Module, filename: string) => any;
  } = Object.create(null);";

        let _ = test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
    }

    fn parse_for_head(str: &'static str) -> TempForHead {
        test_parser(str, Syntax::default(), |p| {
            swc_ecma_lexer::common::parser::stmt::parse_for_head(p)
        })
    }

    #[test]
    fn for_array_binding_pattern() {
        match parse_for_head("let [, , t] = simple_array; t < 10; t++") {
            TempForHead::For { init: Some(v), .. } => assert_eq_ignore_span!(
                v,
                VarDeclOrExpr::VarDecl(Box::new(VarDecl {
                    span,
                    declare: false,
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span,
                        name: Pat::Array(ArrayPat {
                            span,
                            type_ann: None,
                            optional: false,
                            elems: vec![
                                None,
                                None,
                                Some(Pat::Ident(Ident::new_no_ctxt(atom!("t"), span).into()))
                            ]
                        }),
                        init: Some(Box::new(Expr::Ident(Ident::new_no_ctxt(
                            atom!("simple_array"),
                            span
                        )))),
                        definite: false
                    }],
                    ..Default::default()
                }))
            ),
            _ => unreachable!(),
        }
    }
    #[test]
    fn for_object_binding_pattern() {
        match parse_for_head("let {num} = obj; num < 11; num++") {
            TempForHead::For { init: Some(v), .. } => assert_eq_ignore_span!(
                v,
                VarDeclOrExpr::VarDecl(Box::new(VarDecl {
                    span,
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span,
                        name: Pat::Object(ObjectPat {
                            optional: false,
                            type_ann: None,
                            span,
                            props: vec![ObjectPatProp::Assign(AssignPatProp {
                                span,
                                key: Ident::new_no_ctxt(atom!("num"), span).into(),
                                value: None
                            })]
                        }),
                        init: Some(Box::new(Expr::Ident(Ident::new_no_ctxt(
                            atom!("obj"),
                            span
                        )))),
                        definite: false
                    }],
                    ..Default::default()
                }))
            ),
            _ => unreachable!(),
        }
    }

    #[test]
    #[should_panic(expected = "'import.meta' cannot be used outside of module code.")]
    fn import_meta_in_script() {
        let src = "const foo = import.meta.url;";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn import_meta_in_program() {
        let src = "const foo = import.meta.url;";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_program());
    }

    #[test]
    #[should_panic(expected = "'import', and 'export' cannot be used outside of module code")]
    fn import_statement_in_script() {
        let src = "import 'foo';";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    #[should_panic(expected = "top level await is only allowed in module")]
    fn top_level_await_in_script() {
        let src = "await promise";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn top_level_await_in_program() {
        let src = "await promise";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_program());
    }

    #[test]
    fn for_of_head_lhs_async_dot() {
        let src = "for (async.x of [1]) ;";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn for_head_init_async_of() {
        let src = "for (async of => {}; i < 10; ++i) { ++counter; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_module() {
        let src = "function foo (p) { await p; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_script() {
        let src = "function foo (p) { await p; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_program() {
        let src = "function foo (p) { await p; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_program());
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_in_nested_async_function_in_module() {
        let src = "async function foo () { function bar(x = await) {} }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn await_in_nested_async_function_in_script() {
        let src = "async function foo () { function bar(x = await) {} }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn await_in_nested_async_function_in_program() {
        let src = "async function foo () { function bar(x = await) {} }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_program());
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_param_ident_in_module() {
        let src = "function foo (x = await) { }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn await_as_param_ident_in_script() {
        let src = "function foo (x = await) { }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_ident_in_module() {
        let src = "let await = 1";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn await_as_ident_in_script() {
        let src = "let await = 1";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_ident_in_async() {
        let src = "async function foo() { let await = 1; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn top_level_await_in_block() {
        let src = "if (true) { await promise; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn top_level_await_in_decl() {
        test_parser(r#"const t = await test();"#, Default::default(), |p| {
            let program = p.parse_program()?;
            assert!(program.is_module());
            Ok(program)
        });
    }

    #[test]
    fn class_static_blocks() {
        let src = "class Foo { static { 1 + 1; } }";
        assert_eq_ignore_span!(
            test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr()),
            Box::new(Expr::Class(ClassExpr {
                ident: Some(Ident {
                    span,
                    sym: atom!("Foo"),
                    ..Default::default()
                }),
                class: Box::new(Class {
                    span,
                    decorators: Vec::new(),
                    super_class: None,
                    type_params: None,
                    super_type_params: None,
                    is_abstract: false,
                    implements: Vec::new(),
                    body: vec!(ClassMember::StaticBlock(StaticBlock {
                        span,
                        body: BlockStmt {
                            span,
                            stmts: vec!(stmt("1 + 1;")),
                            ..Default::default()
                        }
                    })),
                    ..Default::default()
                })
            }))
        );
    }

    #[test]
    fn multiple_class_static_blocks() {
        let src = "class Foo { static { 1 + 1; } static { 1 + 1; } }";
        assert_eq_ignore_span!(
            test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr()),
            Box::new(Expr::Class(ClassExpr {
                ident: Some(Ident {
                    span,
                    sym: atom!("Foo"),
                    ..Default::default()
                }),
                class: Box::new(Class {
                    span,
                    decorators: Vec::new(),
                    super_class: None,
                    is_abstract: false,
                    body: vec!(
                        ClassMember::StaticBlock(StaticBlock {
                            span,
                            body: BlockStmt {
                                span,
                                stmts: vec!(stmt("1 + 1;")),
                                ..Default::default()
                            },
                        }),
                        ClassMember::StaticBlock(StaticBlock {
                            span,
                            body: BlockStmt {
                                span,
                                stmts: vec!(stmt("1 + 1;")),
                                ..Default::default()
                            },
                        })
                    ),
                    ..Default::default()
                })
            }))
        );
    }

    #[test]
    fn class_static_blocks_with_line_breaks_01() {
        let src = "class Foo {
            static
            {
                1 + 1;
            }
        }";
        assert_eq_ignore_span!(
            test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr()),
            Box::new(Expr::Class(ClassExpr {
                ident: Some(Ident {
                    span,
                    sym: atom!("Foo"),
                    ..Default::default()
                }),
                class: Box::new(Class {
                    span,
                    is_abstract: false,
                    body: vec!(ClassMember::StaticBlock(StaticBlock {
                        span,
                        body: BlockStmt {
                            span,
                            stmts: vec!(stmt("1 + 1;")),
                            ..Default::default()
                        }
                    })),
                    ..Default::default()
                })
            }))
        );
    }

    #[test]
    fn class_static_blocks_with_line_breaks_02() {
        let src = "class Foo {
            static
            {}
        }";
        assert_eq_ignore_span!(
            test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr()),
            Box::new(Expr::Class(ClassExpr {
                ident: Some(Ident {
                    span,
                    sym: atom!("Foo"),
                    ..Default::default()
                }),
                class: Box::new(Class {
                    span,
                    is_abstract: false,
                    body: vec!(ClassMember::StaticBlock(StaticBlock {
                        span,
                        body: BlockStmt {
                            span,
                            stmts: Vec::new(),
                            ..Default::default()
                        }
                    })),
                    ..Default::default()
                })
            }))
        );
    }

    #[test]
    fn class_static_blocks_in_ts() {
        let src = "class Foo { static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    fn class_static_blocks_with_line_breaks_in_ts_01() {
        let src = "class Foo {
            static
            {
                1 + 1;
            }
        }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    fn class_static_blocks_with_line_breaks_in_ts_02() {
        let src = "class Foo {
            static
            {}
        }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Expected ident")]
    fn class_static_blocks_with_await() {
        let src = "class Foo{
            static {
                var await = 'bar';
            }
        }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr());
    }

    #[test]
    #[should_panic(expected = "Expected ident")]
    fn class_static_blocks_with_await_in_nested_class() {
        let src = "class Foo{
            static {
                function foo() {
                    class Foo {
                        static {
                            var await = 'bar';
                        }
                    }
                }
            }
        }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr());
    }

    #[test]
    fn class_static_blocks_with_await_in_fn() {
        let src = "class Foo{
            static {
                function foo() {
                    var await = 'bar';
                }
            }
        }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr());
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_01() {
        let src = "class Foo { abstract static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_02() {
        let src = "class Foo { static static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_03() {
        let src = "class Foo { declare static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_04() {
        let src = "class Foo { private static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Trailing comma is disallowed inside import(...) arguments")]
    fn error_for_trailing_comma_inside_dynamic_import() {
        let src = "import('foo',)";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr());
    }

    #[test]
    fn no_error_for_trailing_comma_inside_dynamic_import_with_import_assertions() {
        let src = "import('foo',)";
        test_parser(
            src,
            Syntax::Es(EsSyntax {
                import_attributes: true,
                ..Default::default()
            }),
            |p| p.parse_expr(),
        );
    }

    #[test]
    fn type_only_star_exports_with_name() {
        let src = "export type * as bar from 'mod'";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn type_only_star_exports_without_name() {
        let src = "export type * from 'mod'";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    #[should_panic(expected = "A string literal cannot be used as an imported binding.")]
    fn error_for_string_literal_is_import_binding() {
        let src = "import { \"str\" } from \"mod\"";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    #[should_panic(
        expected = "A string literal cannot be used as an exported binding without `from`."
    )]
    fn error_for_string_literal_is_export_binding() {
        let src = "export { 'foo' };";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    #[should_panic(expected = "'const' declarations must be initialized")]
    fn ts_error_for_const_declaration_not_initialized() {
        let src = r#"
"use strict";
const foo;"#;

        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    #[should_panic(expected = "'const' declarations must be initialized")]
    fn es_error_for_const_declaration_not_initialized() {
        let src = r#"
"use strict";
const foo;"#;

        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn issue_5557_expr_follow_class() {
        let src = "foo * class {} / bar;";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_5722_class_keyword_in_tpl() {
        let src = "console.log(`${toStr({class: fn})}`)";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt() {
        let src = "try { await; } catch { console.log('caught'); }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_1() {
        let src = "try { await, await; } catch { console.log('caught'); }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_2() {
        let src = "function test() { await; }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_3() {
        let src = "function test() { await, await; }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_4() {
        let src = "function test() { [await]; }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_5() {
        let src = "function test() { (await); }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6322() {
        let src = "for ( ; { } / 1 ; ) ;";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6323() {
        let src = "let x = 0 < { } / 0 ;";

        test_parser(src, Default::default(), |p| p.parse_script());
    }
}
