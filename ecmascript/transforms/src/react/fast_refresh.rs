use swc_common::{chain, DUMMY_SP};
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignOp, BlockStmtOrExpr, CallExpr, Decl, DefaultDecl, ExportDecl,
    ExportDefaultDecl, Expr, ExprOrSpread, ExprOrSuper, ExprStmt, FnDecl, FnExpr, Ident, Lit,
    ModuleDecl, ModuleItem, Pat, PatOrExpr, Stmt, Str, VarDecl, VarDeclKind, VarDeclarator,
};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_visit::Fold;

pub fn fast_refresh() -> impl Fold {
    FastRefresh {}
}

#[derive(Default)]
struct FastRefresh;

impl Fold for FastRefresh {
    fn fold_module_items(&mut self, module_items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut items = Vec::<ModuleItem>::new();
        let mut registration_handles = Vec::<Ident>::new();
        let mut refresh_regs = Vec::<CallExpr>::new();

        for item in module_items {
            let persistent_id: Option<Ident> = match &item {
                // function Foo() {}
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl { ident, .. }))) => {
                    get_persistent_id(ident)
                }

                // export function Foo() {}
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(FnDecl { ident, .. }),
                    ..
                })) => get_persistent_id(ident),

                // export default function Foo() {}
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Fn(FnExpr {
                            // We don't currently handle anonymous default exports.
                            ident: Some(ident),
                            ..
                        }),
                    ..
                })) => get_persistent_id(ident),

                // const Foo = () => {}
                // export const Foo = () => {}
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(var_decl),
                    ..
                })) => get_persistent_id_from_var_decl(var_decl),

                _ => None,
            };

            items.push(item);

            if let Some(persistent_id) = persistent_id {
                let mut registration_handle = String::from("_c");
                let registration_index = registration_handles.len() + 1; // 1-based
                if registration_index > 1 {
                    registration_handle.push_str(&registration_index.to_string());
                };
                let registration_handle = private_ident!(registration_handle.as_str());

                registration_handles.push(registration_handle.clone());

                // $RefreshReg$(_c, "Hello");
                refresh_regs.push(CallExpr {
                    span: DUMMY_SP,
                    callee: ExprOrSuper::Expr(Box::new(Expr::Ident(quote_ident!("$RefreshReg$")))),
                    args: vec![
                        ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Ident(registration_handle.clone())),
                        },
                        ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: persistent_id.sym.clone(),
                                has_escape: false,
                            }))),
                        },
                    ],
                    type_args: None,
                });

                //
                items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(registration_handle))),
                        right: Box::new(Expr::Ident(persistent_id)),
                    })),
                })));
            }
        }

        // Insert
        // ```
        // var _c, _c2;
        // ```
        if registration_handles.len() > 0 {
            items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: registration_handles
                    .into_iter()
                    .map(|handle| VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(handle),
                        init: None,
                        definite: false,
                    })
                    .collect(),
            }))));
        }

        // Insert
        // ```
        // $RefreshReg$(_c, "Hello");
        // $RefreshReg$(_c2, "Foo");
        // ```
        for refresh_reg in refresh_regs {
            items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(refresh_reg)),
            })));
        }

        items
    }
}

fn is_componentish_name(name: &str) -> bool {
    name.starts_with(char::is_uppercase)
}

fn get_persistent_id(ident: &Ident) -> Option<Ident> {
    if is_componentish_name(ident.as_ref()) {
        Some(ident.clone())
    } else {
        None
    }
}

fn get_persistent_id_from_var_decl(var_decl: &VarDecl) -> Option<Ident> {
    match var_decl.decls.as_slice() {
        // We only handle the case when a single variable is declared
        [VarDeclarator {
            name: Pat::Ident(ident),
            init: Some(init_expr),
            ..
        }] => {
            if let Some(persistent_id) = get_persistent_id(ident) {
                match init_expr.as_ref() {
                    Expr::Fn(_) => Some(persistent_id),
                    Expr::Arrow(ArrowExpr { body, .. }) => {
                        if is_body_arrow_fn(body) {
                            // Ignore complex function expressions like
                            // let Foo = () => () => {}
                            None
                        } else {
                            Some(persistent_id)
                        }
                    }
                    _ => None,
                }
            } else {
                None
            }
        }
        _ => None,
    }
}

fn is_body_arrow_fn(body: &BlockStmtOrExpr) -> bool {
    if let BlockStmtOrExpr::Expr(body) = body {
        matches!(body.as_ref(), Expr::Arrow(_))
    } else {
        false
    }
}

#[cfg(test)]
mod tests {
    use super::{super::super::hygiene, *};

    fn tr() -> impl Fold {
        chain!(hygiene(), fast_refresh())
    }

    mod function_declarations {
        use super::super::*;

        #[test]
        fn top_level() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
function Hello() {
  function handleClick() {}
  return <h1 onClick={handleClick}>Hi</h1>;
}

function Bar() {
  return <Hello />;
}
                "#,
                // Output: Hello and Bar should be registered, handleClick shouldn't.
                r#"
function Hello() {
  function handleClick() {}
  
  return <h1 onClick={handleClick}>Hi</h1>;
}
_c = Hello;

function Bar() {
  return <Hello />;
}
_c2 = Bar;

var _c, _c2;

$RefreshReg$(_c, "Hello");
$RefreshReg$(_c2, "Bar");
                "#
            )
        }

        #[test]
        fn top_level_exported() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
export function Hello() {
  function handleClick() {}
  return <h1 onClick={handleClick}>Hi</h1>;
}

export default function Bar() {
  return <Hello />;
}

function Baz() {
  return <h1>OK</h1>;
}

const NotAComp = 'hi';
export { Baz, NotAComp };

export function sum() {}
export const Bad = 42;
                "#,
                // Output
                r#"
export function Hello() {
  function handleClick() {}
  
  return <h1 onClick={handleClick}>Hi</h1>;
}
_c = Hello;
export default function Bar() {
  return <Hello />;
}
_c2 = Bar;

function Baz() {
  return <h1>OK</h1>;
}
_c3 = Baz;

const NotAComp = 'hi';
export { Baz, NotAComp };

export function sum() {}
export const Bad = 42;

var _c, _c2, _c3;

$RefreshReg$(_c, "Hello");
$RefreshReg$(_c2, "Bar");
$RefreshReg$(_c3, "Baz");
                "#
            )
        }

        #[test]
        fn uses_original_function_declaration_if_it_get_reassigned() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
function Hello() {
    return <h1>Hi</h1>;
}
Hello = connect(Hello);
                "#,
                // Output: should register the original version.
                // TODO: in the future, we may *also* register the wrapped one.
                r#"
function Hello() {
  return <h1>Hi</h1>;
}
_c = Hello;

Hello = connect(Hello);

var _c;

$RefreshReg$(_c, "Hello");
                "#
            )
        }

        #[test]
        fn only_registers_pascal_case_functions() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
function hello() {
    return 2 * 2;
}
                "#,
                // Output: should not get registered.
                r#"
function hello() {
     return 2 * 2;
}
                "#
            )
        }
    }

    mod function_expressions {
        use super::super::*;

        #[test]
        fn top_level() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
let Hello = function() {
    function handleClick() {}
    return <h1 onClick={handleClick}>Hi</h1>;
};

const Bar = function Baz() {
    return <Hello />;
};

function sum() {}

let Baz = 10;

var Qux;
                "#,
                // Output: Hello and Bar should be registered; handleClick, sum, Baz, and Qux not.
                r#"
let Hello = function () {
  function handleClick() {}

  return <h1 onClick={handleClick}>Hi</h1>;
};
_c = Hello;

const Bar = function Baz() {
  return <Hello />;
};
_c2 = Bar;

function sum() {}

let Baz = 10;

var Qux;

var _c, _c2;

$RefreshReg$(_c, "Hello");
$RefreshReg$(_c2, "Bar");
                "#
            )
        }

        #[test]
        fn top_level_exported() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
export let Hello = function() {
    function handleClick() {}
    return <h1 onClick={handleClick}>Hi</h1>;
};

export const Bar = function Baz() {
    return <Hello />;
};

export function sum() {}

export let Baz = 10;

export var Qux;
                "#,
                // Output: Hello and Bar should be registered; handleClick, sum, Baz, and Qux not.
                r#"
export let Hello = function () {
  function handleClick() {}

  return <h1 onClick={handleClick}>Hi</h1>;
};
_c = Hello;

export const Bar = function Baz() {
  return <Hello />;
};
_c2 = Bar;

export function sum() {}

export let Baz = 10;

export var Qux;

var _c, _c2;

$RefreshReg$(_c, "Hello");
$RefreshReg$(_c2, "Bar");
                "#
            )
        }
    }

    mod arrow_function_expressions {
        use super::super::*;

        #[test]
        fn top_level() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
let Hello = () => {
    const handleClick = () => {};
    return <h1 onClick={handleClick}>Hi</h1>;
}
const Bar = () => {
    return <Hello />;
};
var Baz = () => <div />;
var sum = () => {};
                "#,
                // Output: Hello, Bar, and Baz should be registered; handleClick and sum shouldn't.
                r#"
let Hello = () => {
  const handleClick = () => {};

  return <h1 onClick={handleClick}>Hi</h1>;
};
_c = Hello;

const Bar = () => {
  return <Hello />;
};
_c2 = Bar;

var Baz = () => <div />;
_c3 = Baz;

var sum = () => {};

var _c, _c2, _c3;

$RefreshReg$(_c, "Hello");
$RefreshReg$(_c2, "Bar");
$RefreshReg$(_c3, "Baz");
                "#
            )
        }

        #[test]
        fn top_level_exported() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
export const Hello = () => {
    function handleClick() {}
    return <h1 onClick={handleClick}>Hi</h1>;
};

export let Bar = (props) => <Hello />;

export default () => {
    // This one should be ignored.
    // You should name your components.
    return <Hello />;
};
                "#,
                // Output
                r#"
export const Hello = () => {
    function handleClick() {}
    return <h1 onClick={handleClick}>Hi</h1>;
};
_c = Hello;

export let Bar = props => <Hello />;
_c2 = Bar;

export default (() => {
    // This one should be ignored.
    // You should name your components.
    return <Hello />;
});

var _c, _c2;

$RefreshReg$(_c, "Hello");
$RefreshReg$(_c2, "Bar");
                "#
            )
        }
    }

    mod hocs {
        use super::super::*;

        #[test]
        fn ignores_hoc_definitions() {
            test_transform!(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                |_| super::tr(),
                // Input
                r#"
let connect = () => {
    function Comp() {
        const handleClick = () => {};
        return <h1 onClick={handleClick}>Hi</h1>;
    }
    return Comp;
};

function withRouter() {
    return function Child() {
        const handleClick = () => {};
        return <h1 onClick={handleClick}>Hi</h1>;
    }
};
                "#,
                // Output
                // TODO: we might want to handle HOCs at usage site, however.
                // TODO: it would be nice if we could always avoid registering
                // a function that is known to return a function or other non-node.
                r#"
let connect = () => {
    function Comp() {
        const handleClick = () => {};
        return <h1 onClick={handleClick}>Hi</h1>;
    }
    return Comp;
};

function withRouter() {
    return function Child() {
        const handleClick = () => {};
        return <h1 onClick={handleClick}>Hi</h1>;
    }
};
                "#
            )
        }
    }

    #[test]
    fn ignores_complex_expressions() {
        test_transform!(
            Syntax::Es(EsConfig {
                jsx: true,
                ..Default::default()
            }),
            |_| tr(),
            // Input
            r#"
let A = foo ? () => {
    return <h1>Hi</h1>;
} : null

const B = function Foo() {
    return <h1>Hi</h1>;
}();

let C = () => () => {
    return <h1>Hi</h1>;
};

let D = bar && (() => {
    return <h1>Hi</h1>;
});
            "#,
            // Output
            r#"
let A = foo ? () => {
    return <h1>Hi</h1>;
} : null

const B = function Foo() {
    return <h1>Hi</h1>;
}();

let C = () => () => {
    return <h1>Hi</h1>;
};

let D = bar && (() => {
    return <h1>Hi</h1>;
});
            "#
        )
    }
}
