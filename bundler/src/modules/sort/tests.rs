use super::stmt::sort_stmts;
use crate::bundler::tests::suite;
use crate::debug::print_hygiene;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::drop_span;
use testing::assert_eq;

fn assert_sorted(src: &[&str], res: &str) {
    assert_sorted_with_free(src, "", res)
}

fn assert_sorted_with_free(src: &[&str], free: &str, res: &str) {
    let mut s = suite();
    for (i, src) in src.iter().enumerate() {
        s = s.file(&format!("{}.js", i), src);
    }
    s.run(|t| {
        let mut modules = vec![];
        let mut entry = None;

        let mut free: Module = drop_span(t.parse(free));
        for item in free.body.iter_mut() {
            mark(item, t.bundler.injected_ctxt);
        }
        modules.push(free.body);

        for (i, _) in src.iter().enumerate() {
            let info = t.module(&format!("{}.js", i));
            if entry.is_none() {
                entry = Some(info.id);
            }
            let actual: Module = drop_span((*info.module).clone());
            modules.push(actual.body);
        }

        let sorted = sort_stmts(t.bundler.injected_ctxt, modules, &t.cm);

        let actual: Module = drop_span(Module {
            span: DUMMY_SP,
            body: sorted,
            shebang: None,
        });

        let expected = drop_span(t.parse(res));

        if actual == expected {
            return Ok(());
        }

        print_hygiene("actual", &t.cm, &actual);
        print_hygiene("expected", &t.cm, &expected);
        assert_eq!(actual, expected);
        panic!()
    });
}

#[test]
fn sort_001() {
    assert_sorted(
        &["_9[0] = 133;", "const _9 = new ByteArray(32);"],
        "
        const _9 = new ByteArray(32);
        _9[0] = 133; 
        ",
    )
}

#[test]
fn sort_002() {
    assert_sorted(
        &[
            "
            const mod = (function(){
                const A = v;
            }());
            ",
            "const v = 5;",
        ],
        "
        const v = 5;
        const mod = (function(){
            const A = v;
        }());
        ",
    )
}

#[test]
fn sort_003() {
    assert_sorted(
        &[
            "class Constraint extends serialization.Serializable {}",
            "const serialization = {};",
        ],
        "
        const serialization = {};
        class Constraint extends serialization.Serializable {
        }
        ",
    );
}

#[test]
fn sort_004() {
    assert_sorted(
        &["use(global);", "const global = getGlobal();"],
        "
        const global = getGlobal();
        use(global);
        ",
    );
}

#[test]
fn sort_005() {
    assert_sorted(
        &[
            "use(a);",
            "
            const a = new A();
            const b = 1;
            ",
            "
            use(b);
            class A {}
            ",
        ],
        "
        class A {
        }
        const a = new A();
        const b = 1;
        use(b);        
        use(a);
        ",
    );
}

#[test]
fn deno_jszip_01() {
    assert_sorted(
        &[
            "use(a);",
            "
            const a = {};
            a.foo = 1;
            ",
        ],
        "
        const a = {};
        a.foo = 1;
        use(a)
        ",
    );
}

#[test]
fn deno_jszip_02() {
    assert_sorted(
        &[
            "X()",
            "
            const Q = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof self ? \
             self : global;
            ",
            "
            function X() {
                console.log(Q.A)
            }
            ",
        ],
        "
        const Q = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof self ? \
         self : global;
        function X() {
            console.log(Q.A)
        }
        X()
        ",
    );
}

#[test]
fn deno_jszip_03() {
    assert_sorted(
        &[
            "const v = X()",
            "
            const Q = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof self ? \
             self : global;
            function X() {
                console.log(Q.A)
            }
            ",
        ],
        "
        const Q = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof self ? \
         self : global;
        function X() {
            console.log(Q.A)
        }
        const v = X() 
        ",
    );
}

#[test]
#[ignore = "Outdated"]
fn sort_006() {
    assert_sorted(
        &[
            "use(b)",
            "
            const b, a = b = {};
            a.env = {};
            ",
        ],
        "
        const b, a = b = {};
        a.env = {};
        use(b);
        ",
    );
}

#[test]
#[ignore = "Outdated"]
fn sort_007() {
    assert_sorted_with_free(
        &[
            "
            var e, o = e = {};
            var T = e;
            e.env = {};
            ",
            "
            if (h$1.env.NODE_DEBUG) {
            }
            ",
        ],
        "
        const h325 = T;
        const h$1 = h325;
        ",
        "
        var e, o = e = {};
        var T = e;
        e.env = {
        };
        const h325 = T;
        const h$1 = h325;
        if (h$1.env.NODE_DEBUG) {
        }
        ",
    );
}

#[test]
fn sort_008() {
    assert_sorted_with_free(
        &[
            "
            var e, o = e = {};
            o.env = {}
            var T = e;
            ",
            "
            use(h);
            ",
        ],
        "
        const h = T;
        ",
        "
        var e, o = e = {};
        o.env = {}
        var T = e;
        const h = T;
        use(h);
        ",
    );
}

#[test]
fn sort_009() {
    assert_sorted_with_free(
        &[
            "
            use(h);
            ",
            "
            var e, o = e = {};
            o.env = {}
            var T = e;
            ",
        ],
        "
        const h = T;
        ",
        "
        var e, o = e = {};
        o.env = {}
        var T = e;
        const h = T;
        use(h);
        ",
    );
}

#[test]
fn sort_010() {
    assert_sorted(
        &["
            class AbstractBufBase {}
            class BufWriter extends AbstractBufBase {}
            "],
        "
        class AbstractBufBase {}
        class BufWriter extends AbstractBufBase {}
        ",
    );
}

#[test]
#[ignore = "Outdated"]
fn sort_011() {
    assert_sorted(
        &[
            "use(BufWriter)",
            "use(BufWriterSync)",
            "
            class AbstractBufBase {}
            class BufWriter extends AbstractBufBase {}
            class BufWriterSync extends AbstractBufBase { }
            ",
        ],
        "
        class AbstractBufBase {
        }
        class BufWriter extends AbstractBufBase {
        }
        class BufWriterSync extends AbstractBufBase {
        }
        use(BufWriter);
        use(BufWriterSync);        
        ",
    );
}

#[test]
fn sort_012() {
    assert_sorted(
        &[
            "use(isWindows)",
            "use(NATIVE_OS)",
            "
            let NATIVE_OS = 'linux';
            const navigator = globalThis.navigator;
            if (globalThis.Deno != null) {
                NATIVE_OS = Deno.build.os;
            } else if (navigator?.appVersion?.includes?.('Win') ?? false) {
                NATIVE_OS = 'windows';
            }
            const isWindows = NATIVE_OS == 'windows';
            ",
        ],
        "
        let NATIVE_OS = 'linux';
        const navigator = globalThis.navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.('Win') ?? false) {
            NATIVE_OS = 'windows';
        }
        const isWindows = NATIVE_OS == 'windows';
        use(isWindows);
        use(NATIVE_OS);
        ",
    );
}

#[test]
fn sort_013() {
    assert_sorted(
        &[
            "use(isWindows)",
            "
            let NATIVE_OS = 'linux';
            const navigator = globalThis.navigator;
            if (globalThis.Deno != null) {
                NATIVE_OS = Deno.build.os;
            } else if (navigator?.appVersion?.includes?.('Win') ?? false) {
                NATIVE_OS = 'windows';
            }
            const isWindows = NATIVE_OS == 'windows';
            ",
        ],
        "
        let NATIVE_OS = 'linux';
        const navigator = globalThis.navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.('Win') ?? false) {
            NATIVE_OS = 'windows';
        }
        const isWindows = NATIVE_OS == 'windows';
        use(isWindows);
        ",
    );
}

#[test]
#[ignore = "Outdated"]
fn sort_014() {
    assert_sorted(
        &[
            "use(NATIVE_OS)",
            "
            let NATIVE_OS = 'linux';
            const navigator = globalThis.navigator;
            if (globalThis.Deno != null) {
                NATIVE_OS = Deno.build.os;
            } else if (navigator?.appVersion?.includes?.('Win') ?? false) {
                NATIVE_OS = 'windows';
            }
            const isWindows = NATIVE_OS == 'windows';
            ",
        ],
        "
        let NATIVE_OS = 'linux';
        const navigator = globalThis.navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.('Win') ?? false) {
            NATIVE_OS = 'windows';
        }
        const isWindows = NATIVE_OS == 'windows';
        use(NATIVE_OS)
        ",
    );
}

#[test]
fn sort_015() {
    assert_sorted(
        &[
            "
            use(isWindows)
            use(NATIVE_OS)
            ",
            "
            let NATIVE_OS = 'linux';
            const navigator = globalThis.navigator;
            if (globalThis.Deno != null) {
                NATIVE_OS = Deno.build.os;
            } else if (navigator?.appVersion?.includes?.('Win') ?? false) {
                NATIVE_OS = 'windows';
            }
            const isWindows = NATIVE_OS == 'windows';
            ",
        ],
        "
        let NATIVE_OS = 'linux';
        const navigator = globalThis.navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.('Win') ?? false) {
            NATIVE_OS = 'windows';
        }
        const isWindows = NATIVE_OS == 'windows';
        use(isWindows);
        use(NATIVE_OS);
        ",
    );
}

#[test]
fn sort_016() {
    assert_sorted(
        &[
            "
            function f1() {

            }
            f2();
            ",
            "
            function f2() {

            }
            f1();
            ",
        ],
        "
        function f1() {
        }
        function f2() {
        }
        f2();
        f1();
        ",
    );
}

fn mark(item: &mut ModuleItem, ctxt: SyntaxContext) {
    match item {
        ModuleItem::ModuleDecl(item) => match item {
            ModuleDecl::Import(ImportDecl { span, .. })
            | ModuleDecl::ExportDecl(ExportDecl { span, .. })
            | ModuleDecl::ExportNamed(NamedExport { span, .. })
            | ModuleDecl::ExportDefaultDecl(ExportDefaultDecl { span, .. })
            | ModuleDecl::ExportDefaultExpr(ExportDefaultExpr { span, .. })
            | ModuleDecl::ExportAll(ExportAll { span, .. })
            | ModuleDecl::TsImportEquals(TsImportEqualsDecl { span, .. })
            | ModuleDecl::TsExportAssignment(TsExportAssignment { span, .. })
            | ModuleDecl::TsNamespaceExport(TsNamespaceExportDecl { span, .. }) => {
                span.ctxt = ctxt;
            }
        },
        ModuleItem::Stmt(stmt) => match stmt {
            Stmt::Empty(_) => return,
            Stmt::Block(BlockStmt { span, .. })
            | Stmt::Debugger(DebuggerStmt { span, .. })
            | Stmt::With(WithStmt { span, .. })
            | Stmt::Return(ReturnStmt { span, .. })
            | Stmt::Labeled(LabeledStmt { span, .. })
            | Stmt::Break(BreakStmt { span, .. })
            | Stmt::Continue(ContinueStmt { span, .. })
            | Stmt::If(IfStmt { span, .. })
            | Stmt::Switch(SwitchStmt { span, .. })
            | Stmt::Throw(ThrowStmt { span, .. })
            | Stmt::Try(TryStmt { span, .. })
            | Stmt::While(WhileStmt { span, .. })
            | Stmt::DoWhile(DoWhileStmt { span, .. })
            | Stmt::For(ForStmt { span, .. })
            | Stmt::ForIn(ForInStmt { span, .. })
            | Stmt::ForOf(ForOfStmt { span, .. })
            | Stmt::Expr(ExprStmt { span, .. }) => {
                span.ctxt = ctxt;
            }
            Stmt::Decl(decl) => match decl {
                Decl::Class(ClassDecl {
                    class: Class { span, .. },
                    ..
                })
                | Decl::Fn(FnDecl {
                    function: Function { span, .. },
                    ..
                })
                | Decl::Var(VarDecl { span, .. })
                | Decl::TsInterface(TsInterfaceDecl { span, .. })
                | Decl::TsTypeAlias(TsTypeAliasDecl { span, .. })
                | Decl::TsEnum(TsEnumDecl { span, .. })
                | Decl::TsModule(TsModuleDecl { span, .. }) => {
                    span.ctxt = ctxt;
                }
            },
        },
    }
}
