use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{alias_ident_for, prop_name_to_expr_value, undefined, ExprFactory},
};
use ast::*;
use std::{iter, mem, sync::Arc};
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};

#[cfg(test)]
mod tests;

/// ## Simple class decorator
///
/// ```js
/// 
/// @annotation
/// class MyClass { }
///
/// function annotation(target) {
///    target.annotated = true;
/// }
/// ```
///
/// ## Class decorator
///
/// ```js
/// @isTestable(true)
/// class MyClass { }
///
/// function isTestable(value) {
///    return function decorator(target) {
///       target.isTestable = value;
///    }
/// }
/// ```
///
/// ## Class method decorator
///
/// ```js
/// class C {
///   @enumerable(false)
///   method() { }
/// }
///
/// function enumerable(value) {
///   return function (target, key, descriptor) {
///      descriptor.enumerable = value;
///      return descriptor;
///   }
/// }
/// ```
pub fn decorators(helpers: Arc<Helpers>) -> impl Pass + Clone {
    Decorators {
        helpers,
        is_in_strict: false,
    }
}

#[derive(Clone)]
struct Decorators {
    helpers: Arc<Helpers>,
    is_in_strict: bool,
}

impl Fold<Vec<ModuleItem>> for Decorators {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let old_strict = self.is_in_strict;
        self.is_in_strict = true;

        let items = items.move_flat_map(|item| {
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                    ExportDefaultDecl::Class(ClassExpr {
                        ident: Some(ident),
                        class,
                    }),
                ))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(box Expr::Class(
                    ClassExpr {
                        ident: Some(ident),
                        class,
                    },
                ))) => {
                    let decorate_call = box self.fold_class(ident.clone(), class);

                    Some(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(ident.clone()),
                            init: Some(decorate_call),
                            definite: false,
                        }],
                    }))))
                    .into_iter()
                    .chain(iter::once({
                        // export { Foo as default }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                            span: DUMMY_SP,
                            specifiers: vec![ExportSpecifier {
                                span: DUMMY_SP,
                                orig: ident,
                                exported: Some(quote_ident!("default")),
                            }],
                            src: None,
                        }))
                    }))
                }
                _ => None.into_iter().chain(iter::once(self.fold(item))),
            }
        });

        self.is_in_strict = old_strict;
        items
    }
}

impl Fold<ModuleDecl> for Decorators {
    fn fold(&mut self, decl: ModuleDecl) -> ModuleDecl {
        let decl = decl.fold_children(self);

        match decl {
            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl::Class(ClassExpr { ident, class })) => {
                let decorate_call =
                    box self.fold_class(ident.unwrap_or_else(|| quote_ident!("_class")), class);

                ModuleDecl::ExportDefaultExpr(decorate_call)
            }
            _ => decl,
        }
    }
}

impl Fold<Decl> for Decorators {
    fn fold(&mut self, decl: Decl) -> Decl {
        let decl = decl.fold_children(self);

        match decl {
            Decl::Class(ClassDecl {
                ident,
                declare: false,
                class,
            }) => {
                if !contains_decorator(&class) {
                    return Decl::Class(ClassDecl {
                        ident,
                        declare: false,
                        class,
                    });
                }

                let decorate_call = box self.fold_class(ident.clone(), class);

                Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(ident),
                        definite: false,
                        init: Some(decorate_call),
                    }],
                })
            }
            _ => decl,
        }
    }
}

impl Fold<Expr> for Decorators {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Class(ClassExpr { ident, class }) => {
                if !contains_decorator(&class) {
                    return Expr::Class(ClassExpr { ident, class });
                }

                let decorate_call =
                    self.fold_class(ident.unwrap_or_else(|| quote_ident!("_class")), class);

                decorate_call
            }
            _ => expr,
        }
    }
}

impl Decorators {
    fn fold_class(&self, ident: Ident, mut class: Class) -> Expr {
        let initialize = private_ident!("_initialize");
        let super_class_ident = match class.super_class {
            Some(ref expr) => Some(alias_ident_for(expr, "_super")),
            None => None,
        };
        let super_class_expr = class.super_class;
        class.super_class = super_class_ident.clone().map(|i| box Expr::Ident(i));

        let constructor = {
            let initialize_call = Stmt::Expr(box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: initialize.clone().as_callee(),
                args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                type_args: Default::default(),
            }));

            // Inject initialize
            let pos = class.body.iter().position(|member| match *member {
                ClassMember::Constructor(Constructor { body: Some(..), .. }) => true,
                _ => false,
            });

            match pos {
                Some(pos) => {
                    match class.body[pos] {
                        ClassMember::Constructor(ref mut c) => match c.body {
                            Some(ref mut body) => {
                                // inject _initialize(this) after **all** super call

                                let mut injector = InitializeInjector { initialize_call };
                                let stmts = mem::replace(&mut body.stmts, vec![]);
                                body.stmts = stmts.fold_with(&mut injector);
                            }
                            None => unreachable!(),
                        },
                        _ => unreachable!(),
                    }

                    class.body.remove(pos)
                }
                None => ClassMember::Constructor(Constructor {
                    span: DUMMY_SP,
                    key: PropName::Ident(quote_ident!("constructor")),
                    is_optional: false,
                    accessibility: Default::default(),
                    params: if super_class_ident.is_some() {
                        vec![PatOrTsParamProp::Pat(Pat::Rest(RestPat {
                            dot3_token: DUMMY_SP,
                            arg: box Pat::Ident(quote_ident!("args")),
                            type_ann: Default::default(),
                        }))]
                    } else {
                        vec![]
                    },
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: if super_class_ident.is_some() {
                            vec![
                                Stmt::Expr(box Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: ExprOrSuper::Super(DUMMY_SP),
                                    args: vec![ExprOrSpread {
                                        spread: Some(DUMMY_SP),
                                        expr: box Expr::Ident(quote_ident!("args")),
                                    }],
                                    type_args: Default::default(),
                                })),
                                initialize_call,
                            ]
                        } else {
                            vec![initialize_call]
                        },
                    }),
                }),
            }
        };

        macro_rules! fold_method {
            ($method:expr, $fn_name:expr, $key_prop_value:expr) => {{
                let fn_name = $fn_name;
                //   kind: "method",
                //   key: getKeyJ(),
                //   value: function () {
                //     return 2;
                //   }
                Some(
                    ObjectLit {
                        span: DUMMY_SP,
                        props: iter::once(PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("kind")),
                            value: box Expr::Lit(Lit::Str(quote_str!(match $method.kind {
                                MethodKind::Method => "method",
                                MethodKind::Getter => "get",
                                MethodKind::Setter => "set",
                            }))),
                        })))
                        .chain(if $method.is_static {
                            Some(PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("static")),
                                value: box Expr::Lit(Lit::Bool(Bool {
                                    value: true,
                                    span: DUMMY_SP,
                                })),
                            })))
                        } else {
                            None
                        })
                        .chain({
                            //
                            if $method.function.decorators.is_empty() {
                                None
                            } else {
                                Some(PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("decorators")),
                                    value: box Expr::Array(ArrayLit {
                                        span: DUMMY_SP,
                                        elems: $method
                                            .function
                                            .decorators
                                            .into_iter()
                                            .map(|dec| dec.expr.as_arg())
                                            .map(Some)
                                            .collect(),
                                    }),
                                })))
                            }
                        })
                        .chain(iter::once(PropOrSpread::Prop(box Prop::KeyValue(
                            KeyValueProp {
                                key: PropName::Ident(quote_ident!("key")),
                                value: $key_prop_value,
                            },
                        ))))
                        .chain(iter::once(PropOrSpread::Prop(box Prop::KeyValue(
                            KeyValueProp {
                                key: PropName::Ident(quote_ident!("value")),
                                value: box FnExpr {
                                    // TODO(kdy1): Fucntion name
                                    ident: fn_name,
                                    function: Function {
                                        decorators: vec![],
                                        ..$method.function
                                    },
                                }
                                .into(),
                            },
                        ))))
                        .collect(),
                    }
                    .as_arg(),
                )
            }};
        }

        let descriptors = class
            .body
            .into_iter()
            .filter_map(|member| {
                //
                match member {
                    ClassMember::Constructor(_) => unreachable!("multiple constructor?"),
                    ClassMember::TsIndexSignature(_) => None,
                    ClassMember::Method(method) => {
                        let fn_name = match method.key {
                            PropName::Ident(ref i) => Some(i.clone()),
                            PropName::Str(ref s) => Some(Ident::new(s.value.clone(), s.span)),
                            _ => None,
                        };
                        let key_prop_value = box prop_name_to_expr_value(method.key);
                        fold_method!(method, fn_name, key_prop_value)
                    }
                    ClassMember::PrivateMethod(method) => {
                        let fn_name = Ident::new(
                            format!("_{}", method.key.id.sym).into(),
                            method.key.id.span,
                        );
                        let key_prop_value = box Expr::Lit(Lit::Str(Str {
                            span: method.key.id.span,
                            value: method.key.id.sym,
                            has_escape: false,
                        }));
                        fold_method!(method, Some(fn_name), key_prop_value)
                    }
                    ClassMember::ClassProp(prop) => {
                        let prop_span = prop.span();
                        let key_prop_value = match *prop.key {
                            Expr::Ident(i) => box Expr::Lit(Lit::Str(Str {
                                span: i.span,
                                value: i.sym,
                                has_escape: false,
                            })),
                            _ => prop.key,
                        };
                        //
                        Some(
                            ObjectLit {
                                span: prop_span,
                                props: iter::once(PropOrSpread::Prop(box Prop::KeyValue(
                                    KeyValueProp {
                                        key: PropName::Ident(quote_ident!("kind")),
                                        value: box Expr::Lit(Lit::Str(quote_str!("field"))),
                                    },
                                )))
                                .chain(if prop.is_static {
                                    Some(PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("static")),
                                        value: box Expr::Lit(Lit::Bool(Bool {
                                            value: true,
                                            span: DUMMY_SP,
                                        })),
                                    })))
                                } else {
                                    None
                                })
                                .chain({
                                    //
                                    if prop.decorators.is_empty() {
                                        None
                                    } else {
                                        Some(PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                            key: PropName::Ident(quote_ident!("decorators")),
                                            value: box Expr::Array(ArrayLit {
                                                span: DUMMY_SP,
                                                elems: prop
                                                    .decorators
                                                    .into_iter()
                                                    .map(|dec| dec.expr.as_arg())
                                                    .map(Some)
                                                    .collect(),
                                            }),
                                        })))
                                    }
                                })
                                .chain(iter::once(PropOrSpread::Prop(box Prop::KeyValue(
                                    KeyValueProp {
                                        key: PropName::Ident(quote_ident!("key")),
                                        value: key_prop_value,
                                    },
                                ))))
                                .chain(iter::once(PropOrSpread::Prop(box match prop.value {
                                    Some(value) => Prop::Method(MethodProp {
                                        key: PropName::Ident(quote_ident!("value")),
                                        function: Function {
                                            span: DUMMY_SP,
                                            is_async: false,
                                            is_generator: false,
                                            decorators: vec![],
                                            params: vec![],

                                            body: Some(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![Stmt::Return(ReturnStmt {
                                                    span: DUMMY_SP,
                                                    arg: Some(value),
                                                })],
                                            }),

                                            type_params: Default::default(),
                                            return_type: Default::default(),
                                        },
                                    }),
                                    _ => Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("value")),
                                        value: undefined(DUMMY_SP),
                                    }),
                                })))
                                .collect(),
                            }
                            .as_arg(),
                        )
                    }
                    _ => unimplemented!("ClassMember::{:?}", member,),
                }
            })
            .map(Some)
            .collect();

        self.helpers.decorate();
        let decorate_call = Expr::Call(make_decorate_call(
            class.decorators,
            iter::once({
                // function(_initialize) {}
                FnExpr {
                    ident: None,
                    function: Function {
                        span: DUMMY_SP,

                        params: iter::once(Pat::Ident(initialize.clone()))
                            .chain(super_class_ident.map(Pat::Ident))
                            .collect(),

                        decorators: Default::default(),
                        is_async: false,
                        is_generator: false,

                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: if !self.is_in_strict {
                                // 'use strict';
                                Some(Stmt::Expr(box Expr::Lit(Lit::Str(quote_str!(
                                    "use strict"
                                )))))
                            } else {
                                None
                            }
                            .into_iter()
                            .chain(iter::once(Stmt::Decl(Decl::Class(ClassDecl {
                                ident: ident.clone(),
                                class: Class {
                                    decorators: Default::default(),
                                    body: vec![constructor],
                                    ..class
                                },
                                declare: false,
                            }))))
                            .chain(iter::once(Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(box Expr::Object(ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![
                                        PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                            key: PropName::Ident(quote_ident!("F")),
                                            value: box Expr::Ident(ident.clone()),
                                        })),
                                        PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                            key: PropName::Ident(quote_ident!("d")),
                                            value: box Expr::Array(ArrayLit {
                                                span: DUMMY_SP,
                                                elems: descriptors,
                                            }),
                                        })),
                                    ],
                                })),
                            })))
                            .collect(),
                        }),

                        return_type: Default::default(),
                        type_params: Default::default(),
                    },
                }
                .as_arg()
            })
            .chain(super_class_expr.map(|e| e.as_arg())),
        ));

        decorate_call
    }
}

fn make_decorate_call(
    decorators: Vec<Decorator>,
    args: impl Iterator<Item = ExprOrSpread>,
) -> CallExpr {
    CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("_decorate").as_callee(),
        args: iter::once(
            ArrayLit {
                span: DUMMY_SP,
                elems: decorators
                    .into_iter()
                    .map(|dec| Some(dec.expr.as_arg()))
                    .collect(),
            }
            .as_arg(),
        )
        .chain(args)
        .collect(),
        type_args: Default::default(),
    }
}

struct InitializeInjector {
    initialize_call: Stmt,
}

impl Fold<Vec<Stmt>> for InitializeInjector {
    fn fold(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        let stmts = stmts.fold_children(self);

        stmts.move_flat_map(|stmt| match stmt {
            Stmt::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            })) => iter::once(stmt).chain(Some(self.initialize_call.clone())),
            _ => iter::once(stmt).chain(None),
        })
    }
}

impl Fold<Function> for InitializeInjector {
    fn fold(&mut self, n: Function) -> Function {
        n
    }
}

struct DecoratorFinder {
    found: bool,
}
impl Visit<Decorator> for DecoratorFinder {
    fn visit(&mut self, _: &Decorator) {
        self.found = true
    }
}

fn contains_decorator<N>(node: &N) -> bool
where
    N: VisitWith<DecoratorFinder>,
{
    let mut v = DecoratorFinder { found: false };
    node.visit_with(&mut v);
    v.found
}
