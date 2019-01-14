use crate::{helpers::Helpers, pass::Pass, util::ExprFactory};
use ast::*;
use std::{
    iter,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Span, Spanned, Visit, VisitWith, DUMMY_SP};

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
#[derive(Default, Clone)]
pub struct Classes {
    pub helpers: Arc<Helpers>,
}

impl Fold<Decl> for Classes {
    fn fold(&mut self, n: Decl) -> Decl {
        fn should_work(node: &Decl) -> bool {
            struct Visitor {
                found: bool,
            };
            impl Visit<Class> for Visitor {
                fn visit(&mut self, _: &Class) {
                    self.found = true
                }
            }
            let mut v = Visitor { found: false };
            node.visit_with(&mut v);
            v.found
        }
        // fast path
        if !should_work(&n) {
            return n;
        }

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
            Decl::Class(decl) => {
                let span = decl.span();
                let rhs = self.fold_class(Some(decl.ident.clone()), decl.class);

                Decl::Var(VarDecl {
                    span,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span,
                        init: Some(box rhs),
                        // Foo in var Foo =
                        name: decl.ident.into(),
                        definite: false,
                    }],
                    declare: false,
                })
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
                _ => quote_ident!("_Super"),
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
            callee: Expr::Fn(FnExpr {
                ident: None,
                function: Function {
                    span: DUMMY_SP,
                    is_async: false,
                    is_generator: false,
                    params,
                    body: Some(body),
                    decorators: Default::default(),
                    type_params: Default::default(),
                    return_type: Default::default(),
                },
            })
            .as_callee(),
            args,
            type_args: Default::default(),
        })
    }

    /// Returned `stmts` contains `return Foo`
    fn class_to_stmts(
        &mut self,
        class_name: Option<Ident>,
        super_class_ident: Option<Ident>,
        class: Class,
    ) -> Vec<Stmt> {
        let class_name = class_name.unwrap_or_else(|| quote_ident!("_Class"));
        let mut stmts = vec![];

        let mut priv_methods = vec![];
        let mut methods = vec![];
        let mut prop_init_stmts = vec![];
        let mut static_prop_init_stmts = vec![];
        let mut constructor = None;
        for member in class.body {
            let span = member.span();
            match member {
                ClassMember::Constructor(c) => {
                    if constructor.is_some() {
                        unimplemented!("multiple constructor")
                    } else {
                        constructor = Some(c)
                    }
                }
                ClassMember::PrivateMethod(m) => priv_methods.push(m),
                ClassMember::Method(m) => methods.push(m),
                ClassMember::ClassProp(ClassProperty {
                    key,
                    value: Some(right),
                    is_static: true,
                    ..
                }) => static_prop_init_stmts.push(Stmt::Expr(box Expr::Assign(AssignExpr {
                    span,
                    left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                        span,
                        obj: class_name.clone().as_obj(),
                        computed: match *key {
                            Expr::Ident(..) => false,
                            _ => true,
                        },
                        prop: key,
                    })),
                    op: op!("="),
                    right,
                }))),
                ClassMember::ClassProp(ClassProperty {
                    key,
                    value: Some(right),
                    is_static: false,
                    ..
                }) => prop_init_stmts.push(Stmt::Expr(box Expr::Assign(AssignExpr {
                    span,
                    left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                        span,
                        obj: ThisExpr { span }.as_obj(),
                        computed: match *key {
                            Expr::Ident(..) => false,
                            _ => true,
                        },
                        prop: key,
                    })),
                    op: op!("="),
                    right,
                }))),
                ClassMember::TsIndexSignature(s) => {
                    unimplemented!("typescript index signature {:?}", s)
                }
                ClassMember::PrivateProp(p) => unimplemented!("private class property {:?}", p),
                // Skip
                _ => {}
            }
        }

        if let Some(ref super_class_ident) = super_class_ident {
            // inject helper methods
            self.helpers.inherits.store(true, Ordering::Relaxed);
            self.helpers
                .possible_constructor_return
                .store(true, Ordering::Relaxed);

            stmts.push(Stmt::Expr(box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: quote_ident!("_inherits").as_callee(),
                args: vec![
                    class_name.clone().as_arg(),
                    super_class_ident.clone().as_arg(),
                ],
                type_args: Default::default(),
            })));
        }

        // Process constructor
        {
            let constructor = constructor.unwrap_or_else(|| Constructor {
                accessibility: None,
                is_optional: false,
                key: PropName::Ident(quote_ident!("constructor")),
                span: class_name.span,
                params: vec![],
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![],
                }),
            });

            // inject _classCallCheck(this, Bar);
            self.helpers.class_call_check.store(true, Ordering::Relaxed);
            let mut body = iter::once(Stmt::Expr(box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Expr::Ident(quote_ident!("_classCallCheck")).as_callee(),
                args: vec![
                    Expr::This(ThisExpr { span: DUMMY_SP }).as_arg(),
                    Expr::Ident(class_name.clone()).as_arg(),
                ],
                type_args: Default::default(),
            })))
            .chain(constructor.body.unwrap().stmts)
            .collect::<Vec<_>>();

            if super_class_ident.is_some() {
                // inject possibleReturnCheck
                let super_call_pos = body.iter().position(|c| match *c {
                    Stmt::Expr(box Expr::Call(CallExpr {
                        callee: ExprOrSuper::Super(..),
                        ..
                    })) => true,
                    _ => false,
                });
                // is super() call last?
                let is_last = super_call_pos == Some(body.len() - 1);

                // possible return value from super() call
                let possible_return_value = box Expr::Call(CallExpr {
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
                                prop: box Expr::Ident(if super_call_pos.is_some() {
                                    quote_ident!("call")
                                } else {
                                    quote_ident!("apply")
                                }),
                            }
                            .as_callee(),

                            args: if let Some(super_call_pos) = super_call_pos {
                                // Code like `super(foo, bar)` should be result in
                                // `.call(this, foo, bar)`
                                match body[super_call_pos] {
                                    Stmt::Expr(box Expr::Call(CallExpr {
                                        callee: ExprOrSuper::Super(..),
                                        ref args,
                                        ..
                                    })) => iter::once(ThisExpr { span: DUMMY_SP }.as_arg())
                                        .chain(args.into_iter().cloned())
                                        .collect(),
                                    _ => unreachable!(),
                                }
                            } else {
                                vec![
                                    ThisExpr { span: DUMMY_SP }.as_arg(),
                                    quote_ident!("arguments").as_arg(),
                                ]
                            },

                            type_args: Default::default(),
                        });

                        apply.as_arg()
                    }],
                    type_args: Default::default(),
                });

                match super_call_pos {
                    Some(super_call_pos) => {
                        if is_last {
                            body.append(&mut prop_init_stmts);

                            body[super_call_pos] = Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(possible_return_value),
                            });
                        } else {
                            body[super_call_pos] = Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: quote_ident!("_this").into(),
                                    init: Some(possible_return_value),
                                    definite: false,
                                }],
                                declare: false,
                            }));

                            body.append(&mut prop_init_stmts);

                            body.push(Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(box Expr::Ident(quote_ident!("_this"))),
                            }));
                        }
                    }

                    _ => body.push(Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(possible_return_value),
                    })),
                }
            }

            // TODO: Handle
            //
            //     console.log('foo');
            //     super();
            //     console.log('bar');
            //
            //

            let params = constructor
                .params
                .into_iter()
                .map(|param| match param {
                    PatOrTsParamProp::Pat(p) => p,
                    _ => unimplemented!("TsParamProp in constructor"),
                })
                .collect();

            stmts.push(Stmt::Decl(Decl::Fn(FnDecl {
                ident: class_name.clone(),
                function: Function {
                    decorators: Default::default(),
                    span: constructor.span,
                    body: Some(BlockStmt {
                        span: constructor.span,
                        stmts: body,
                    }),
                    params,
                    is_async: false,
                    is_generator: false,
                    type_params: Default::default(),
                    return_type: Default::default(),
                },
                declare: false,
            })));

            // Handle static properties
            stmts.append(&mut static_prop_init_stmts);
        }

        // convert class methods
        // stmts.extend(self.fold_class_methods(class_name.clone(), priv_methods));
        stmts.extend(self.fold_class_methods(class_name.clone(), methods));

        // `return Foo`
        stmts.push(Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(box Expr::Ident(class_name)),
        }));

        stmts
    }

    fn fold_class_methods(
        &mut self,
        class_name: Ident,
        methods: Vec<ClassMethod<PropName>>,
    ) -> Vec<Stmt> {
        if methods.is_empty() {
            return vec![];
        }

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
                return quote_expr!(DUMMY_SP, null).as_arg();
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
                type_args: Default::default(),
            }))
        }

        let (mut props, mut static_props) = (vec![], vec![]);

        for m in methods {
            let prop_name = match m.key {
                PropName::Ident(ref i) => i,
                _ => unimplemented!("non-ident prop name: {:?}", m.key),
            };

            let append_to: &mut Vec<_> = if m.is_static {
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

            match m.kind {
                MethodKind::Method | MethodKind::Getter => {
                    append_to.push(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: vec![
                            PropOrSpread::Prop(box mk_prop_key(&m.key)),
                            PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(if m.kind == MethodKind::Getter {
                                    quote_ident!("get")
                                } else {
                                    quote_ident!("value")
                                }),
                                value,
                            })),
                        ],
                    }));
                }

                MethodKind::Setter => {
                    // Setter
                    append_to.push(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: vec![
                            PropOrSpread::Prop(box mk_prop_key(&m.key)),
                            PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("set")),
                                value,
                            })),
                        ],
                    }))
                }
            }
        }

        if props.is_empty() && static_props.is_empty() {
            return vec![];
        }
        self.helpers.create_class.store(true, Ordering::Relaxed);
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
        type_args: Default::default(),
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
struct SuperCallFolder<'a> {
    class_name: &'a Ident,
    helpers: Arc<Helpers>,
}

struct SuperCalleeFolder<'a> {
    class_name: &'a Ident,
    inject_get: bool,
    inject_set: bool,
}

impl<'a> Fold<Expr> for SuperCalleeFolder<'a> {
    fn fold(&mut self, n: Expr) -> Expr {
        let n = match n {
            Expr::Assign(AssignExpr {
                span,
                left,
                op: op!("="),
                right,
            }) => match left {
                PatOrExpr::Expr(box Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Super(super_token),
                    prop,
                    ..
                }))
                | PatOrExpr::Pat(box Pat::Expr(box Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Super(super_token),
                    prop,
                    ..
                }))) => self.super_to_set_call(super_token, prop, right),
                _ => Expr::Assign(AssignExpr {
                    span,
                    left: left.fold_children(self),
                    op: op!("="),
                    right: right.fold_children(self),
                }),
            },
            _ => n.fold_children(self),
        };

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
        self.inject_get = true;

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
            type_args: Default::default(),
        })
    }

    fn super_to_set_call(&mut self, super_token: Span, prop: Box<Expr>, rhs: Box<Expr>) -> Expr {
        self.inject_set = true;

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

        let rhs_arg = rhs.as_arg();

        let this_arg = ThisExpr { span: super_token }.as_arg();

        Expr::Call(CallExpr {
            span: super_token,
            callee: quote_ident!("_set").as_callee(),
            args: vec![
                proto_arg,
                prop_arg,
                rhs_arg,
                this_arg,
                // strict
                Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })
                .as_arg(),
            ],
            type_args: Default::default(),
        })
    }
}

impl<'a> Fold<Expr> for SuperCallFolder<'a> {
    fn fold(&mut self, n: Expr) -> Expr {
        let mut callee_folder = SuperCalleeFolder {
            class_name: self.class_name,
            inject_get: false,
            inject_set: false,
        };

        let was_call = match n {
            Expr::Call(..) => true,
            _ => false,
        };

        let n = n.fold_with(&mut callee_folder);

        if callee_folder.inject_get {
            self.helpers.get.store(true, Ordering::Relaxed);

            if was_call {
                match n {
                    Expr::Call(CallExpr {
                        span,
                        callee,
                        args,
                        type_args,
                    }) => {
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
                            type_args,
                        });
                    }
                    _ => unreachable!(),
                }
            }
        }

        if callee_folder.inject_set {
            self.helpers.set.store(true, Ordering::Relaxed);
        }

        n
    }
}
