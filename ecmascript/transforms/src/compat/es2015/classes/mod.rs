use super::Helpers;
use crate::util::ExprFactory;
use std::{
    iter,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-classes`
///
/// # In
/// ```js
/// class Test {
///   constructor(name) {
///     this.name = name;
///   }
///
///   logger () {
///     console.log("Hello", this.name);
///   }
/// }
/// ```
///
/// # Out
/// ```js
/// var Test = function () {
///   function Test(name) {
///     _classCallCheck(this, Test);
///
///     this.name = name;
///   }
///
///   Test.prototype.logger = function logger() {
///     console.log("Hello", this.name);
///   };
///
///   return Test;
/// }();
/// ```
#[derive(Debug, Clone, Default)]
pub struct Classes {
    pub helpers: Arc<Helpers>,
}

impl Fold<Stmt> for Classes {
    fn fold(&mut self, n: Stmt) -> Stmt {
        let n = n.fold_children(self);

        match n {
            // TODO: Don't wrap simple classes with function
            //
            //    class Foo {}
            //
            // should be
            //
            //    var Foo = function Foo() {
            //        _classCallCheck(this, Foo);
            //    };
            //
            // instead of
            //    var Foo = function(){
            //      function Foo() {
            //          _classCallCheck(this, Foo);
            //      }
            //
            //      return Foo;
            //    }();
            Stmt::Decl(Decl::Class(decl)) => {
                let span = mark!(decl.span());
                let rhs = self.fold_class(Some(decl.ident.clone()), decl.class);

                Stmt::Decl(Decl::Var(VarDecl {
                    span,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span,
                        init: Some(box rhs),
                        // Foo in var Foo =
                        name: decl.ident.into(),
                    }],
                }))
            }
            _ => n,
        }
    }
}

impl Fold<Expr> for Classes {
    fn fold(&mut self, n: Expr) -> Expr {
        let n = n.fold_children(self);

        match n {
            Expr::Class(e) => self.fold_class(e.ident, e.class),
            _ => n,
        }
    }
}

impl Classes {
    /// Turns class expresion into iife.
    ///
    /// ```js
    /// class Foo {}
    /// ```
    ///
    /// ```js
    /// function() {
    ///   var Foo = function Foo(){
    ///   };
    /// }()
    /// ```
    fn fold_class(&mut self, class_name: Option<Ident>, class: Class) -> Expr {
        fn determine_super_ident(sc: &Expr) -> Ident {
            match *sc {
                Expr::Ident(ref i) => quote_ident!(i.span, format!("_{}", i.sym)),
                Expr::Member(ref member) => determine_super_ident(&member.prop),
                _ => unimplemented!("determine_super_ident({:?})", sc),
            }
        }
        // Ident of the super class *inside* function.
        let super_ident = class.super_class.as_ref().map(|e| determine_super_ident(e));

        let (params, args) = if let Some(ref super_ident) = super_ident {
            (
                vec![Pat::Ident(super_ident.clone())],
                vec![class.super_class.clone().unwrap().as_arg()],
            )
        } else {
            (vec![], vec![])
        };

        let body = BlockStmt {
            span: DUMMY_SP,
            stmts: self.class_to_stmts(class_name, super_ident, class),
        };

        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: ExprOrSuper::Expr(box Expr::Fn(FnExpr {
                ident: None,
                function: Function {
                    span: DUMMY_SP,
                    async: None,
                    generator: None,
                    params,
                    body,
                },
            })),
            args,
        })
    }

    /// Returned `stmts` contains `return Foo`
    fn class_to_stmts(
        &mut self,
        class_name: Option<Ident>,
        super_class_ident: Option<Ident>,
        mut class: Class,
    ) -> Vec<Stmt> {
        let class_name = class_name.unwrap_or_else(|| quote_ident!("_Class"));
        let mut stmts = vec![];

        if let Some(ref super_class_ident) = super_class_ident {
            // inject helper methods
            self.helpers.inherits.store(true, Ordering::SeqCst);
            self.helpers
                .possible_constructor_return
                .store(true, Ordering::SeqCst);

            stmts.push(Stmt::Expr(box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: quote_ident!("_inherits").as_callee(),
                args: vec![
                    class_name.clone().as_arg(),
                    super_class_ident.clone().as_arg(),
                ],
            })));
        }

        // Process constructor
        {
            let constructor = {
                // Find constuctor
                let pos = class.body.iter().position(|m| match m.kind {
                    ClassMethodKind::Constructor => true,
                    _ => false,
                });
                match pos {
                    Some(pos) => Some(class.body.remove(pos)),
                    _ => None,
                }
            };
            let mut function = constructor.map(|c| c.function).unwrap_or_else(|| Function {
                async: None,
                generator: None,
                span: class_name.span,
                params: vec![],
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![],
                },
            });

            // inject _classCallCheck(this, Bar);
            function.body.stmts = iter::once(Stmt::Expr(box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: ExprOrSuper::Expr(box Expr::Ident(Ident::new(
                    "_classCallCheck".into(),
                    DUMMY_SP,
                ))),
                args: vec![
                    Expr::This(ThisExpr { span: DUMMY_SP }).as_arg(),
                    Expr::Ident(class_name.clone()).as_arg(),
                ],
            })))
            .chain(function.body.stmts)
            .collect();

            if super_class_ident.is_some() {
                // inject possibleReturnCheck

                function.body.stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(box Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: quote_ident!("_possibleConstructorReturn").as_callee(),
                        args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), {
                            let apply = box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: MemberExpr {
                                    span: DUMMY_SP,
                                    obj: ExprOrSuper::Expr(
                                        box get_prototype_of(&Expr::Ident(class_name.clone()))
                                            .wrap_with_paren(),
                                    ),
                                    computed: false,
                                    prop: box Expr::Ident(quote_ident!("apply")),
                                }
                                .as_callee(),

                                args: vec![
                                    ThisExpr { span: DUMMY_SP }.as_arg(),
                                    quote_ident!("arguments").as_arg(),
                                ],
                            });

                            apply.as_arg()
                        }],
                    })),
                }));
            }

            // TODO: Handle
            //
            //     console.log('foo');
            //     super();
            //     console.log('bar');
            //
            //

            stmts.push(Stmt::Decl(Decl::Fn(FnDecl {
                ident: class_name.clone(),
                function,
            })));
        }

        // convert class methods
        stmts.extend(self.fold_class_methods(class_name.clone(), class.body));

        // `return Foo`
        stmts.push(Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(box Expr::Ident(class_name)),
        }));

        stmts
    }

    fn fold_class_methods(&mut self, class_name: Ident, methods: Vec<ClassMethod>) -> Vec<Stmt> {
        /// { key: "prop" }
        fn mk_prop_key(key: &PropName) -> Prop {
            Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!(key.span(), "key")),
                value: match *key {
                    PropName::Ident(ref i) => {
                        box Expr::Lit(Lit::Str(quote_str!(i.span, i.sym.clone())))
                    }
                    PropName::Str(ref s) => box Expr::Lit(Lit::Str(s.clone())),
                    _ => unimplemented!("PropName {:?}", key),
                },
            })
        }

        fn mk_arg_obj_for_create_class(props: Vec<Expr>) -> ExprOrSpread {
            if props.is_empty() {
                return expr!(DUMMY_SP, null).as_arg();
            }
            Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: props.into_iter().map(|e| Some(e.as_arg())).collect(),
            })
            .as_arg()
        }

        /// _createClass(Foo, [{}], [{}]);
        fn mk_create_class_call(
            class_name: Ident,
            methods: ExprOrSpread,
            static_methods: Option<ExprOrSpread>,
        ) -> Stmt {
            Stmt::Expr(box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: quote_ident!("_createClass").as_callee(),
                args: iter::once(class_name.as_arg())
                    .chain(iter::once(methods))
                    .chain(static_methods)
                    .collect(),
            }))
        }

        let (mut props, mut static_props) = (vec![], vec![]);

        for m in methods {
            let span = mark!(m.span());

            let prop_name = match m.key {
                PropName::Ident(ref i) => i,
                _ => unimplemented!("non-ident prop name: {:?}", m.key),
            };

            match m.kind {
                ClassMethodKind::Constructor => unreachable!(),
                //
                //  Foo.staticMethod
                //  Foo.prototype.method
                ClassMethodKind::Method => {
                    let append_to: &mut Vec<_> = if let Some(_static_token) = m.static_token {
                        &mut static_props
                    } else {
                        &mut props
                    };

                    let function = m.function.fold_with(&mut SuperCallFolder {
                        class_name: &class_name,
                        helpers: self.helpers.clone(),
                    });

                    let value = box Expr::Fn(FnExpr {
                        ident: Some(prop_name.clone()),
                        function,
                    });

                    append_to.push(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: vec![
                            mk_prop_key(&m.key),
                            Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("value")),
                                value,
                            }),
                        ],
                    }));
                }

                _ => unimplemented!("Class getter / setter"),
            }
        }

        if props.is_empty() && static_props.is_empty() {
            return vec![];
        }

        vec![mk_create_class_call(
            class_name,
            mk_arg_obj_for_create_class(props),
            if static_props.is_empty() {
                None
            } else {
                Some(mk_arg_obj_for_create_class(static_props))
            },
        )]
    }
}

/// Creates
///
/// ```js
/// Child.__proto__ || Object.getPrototypeOf(Child)
/// ```
fn get_prototype_of(obj: &Expr) -> Expr {
    // `Child.__proto__`
    let proto = box Expr::Member(MemberExpr {
        span: DUMMY_SP,
        obj: ExprOrSuper::Expr(box obj.clone()),
        computed: false,
        prop: box Expr::Ident(quote_ident!("__proto__")),
    });

    // `Object.getPrototypeOf(Child)`
    let get_proto_of = box Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: member_expr!(DUMMY_SP, Object.getPrototypeOf).as_callee(),
        args: vec![obj.clone().as_arg()],
    });

    // `Child.__proto__ || Object.getPrototypeOf(Child)`
    Expr::Bin(BinExpr {
        span: DUMMY_SP,
        left: proto,
        op: op!("||"),
        // Object.getPrototypeOf(Child)
        right: get_proto_of,
    })
}

/// Process function body.
///
/// # In
///
/// ```js
/// super.foo(a)
/// ```
///
/// # Out
///
///
/// _get(Child.prototype.__proto__ || Object.getPrototypeOf(Child.prototype),
/// 'foo', this).call(this, a);
#[derive(Debug)]
struct SuperCallFolder<'a> {
    class_name: &'a Ident,
    helpers: Arc<Helpers>,
}

struct SuperCalleeFolder<'a> {
    class_name: &'a Ident,
    did_work: bool,
}

impl<'a> Fold<Expr> for SuperCalleeFolder<'a> {
    fn fold(&mut self, n: Expr) -> Expr {
        let n = n.fold_children(self);

        match n {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Super(super_token),
                prop,
                ..
            }) => self.super_to_get_call(super_token, prop),

            _ => n,
        }
    }
}

impl<'a> SuperCalleeFolder<'a> {
    fn super_to_get_call(&mut self, super_token: Span, prop: Box<Expr>) -> Expr {
        self.did_work = true;
        let super_token = mark!(super_token);

        let proto_arg = get_prototype_of(&Expr::Member(MemberExpr {
            span: super_token,
            obj: ExprOrSuper::Expr(box Expr::Ident(self.class_name.clone())),
            prop: box Expr::Ident(quote_ident!("prototype")),
            computed: false,
        }))
        .as_arg();

        let prop_arg = match *prop {
            Expr::Ident(Ident {
                sym: ref value,
                span,
                ..
            }) => Expr::Lit(Lit::Str(Str {
                span,
                value: value.clone(),
                has_escape: false,
            })),
            ref e @ Expr::Lit(Lit::Str(Str { .. })) => e.clone(),
            _ => unimplemented!("non-ident / non-string super field"),
        }
        .as_arg();

        let this_arg = ThisExpr { span: super_token }.as_arg();

        Expr::Call(CallExpr {
            span: super_token,
            callee: quote_ident!("_get").as_callee(),
            args: vec![proto_arg, prop_arg, this_arg],
        })
    }
}

impl<'a> Fold<Expr> for SuperCallFolder<'a> {
    fn fold(&mut self, n: Expr) -> Expr {
        let mut callee_folder = SuperCalleeFolder {
            class_name: self.class_name,
            did_work: false,
        };

        let was_call = match n {
            Expr::Call(..) => true,
            _ => false,
        };

        let n = n.fold_with(&mut callee_folder);
        if callee_folder.did_work {
            self.helpers.get.store(true, Ordering::SeqCst);

            if was_call {
                match n {
                    Expr::Call(CallExpr { span, callee, args }) => {
                        return Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: MemberExpr {
                                span: DUMMY_SP,
                                obj: callee,
                                prop: box Expr::Ident(quote_ident!("call")),
                                computed: false,
                            }
                            .as_callee(),
                            args: iter::once(ThisExpr { span }.as_arg()).chain(args).collect(),
                        });
                    }
                    _ => unreachable!(),
                }
            }
        }

        n
    }
}
