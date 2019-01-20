use self::constructor::{
    constructor_fn, make_possible_return_value, ConstructorFolder, ReturningMode, SuperCallFinder,
};
use crate::{
    helpers::Helpers,
    util::{alias_ident_for, prop_name_to_expr, ExprFactory},
};
use ast::*;
use std::{iter, sync::Arc};
use swc_common::{Fold, FoldWith, Mark, Span, Spanned, Visit, VisitWith, DUMMY_SP};

mod constructor;
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
            Decl::Class(mut decl) => {
                let span = decl.span();

                if decl.class.super_class.is_none()
                    && (decl.class.body.is_empty()
                        || (decl.class.body.len() == 1
                            && match decl.class.body[0] {
                                ClassMember::Constructor(_) => true,
                                _ => false,
                            }))
                {
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
                    self.helpers.class_call_check();

                    let constructor = if decl.class.body.is_empty() {
                        None
                    } else {
                        match decl.class.body.remove(0) {
                            ClassMember::Constructor(c) => Some(c),
                            _ => unreachable!(),
                        }
                    };
                    let class_call_check = Stmt::Expr(box Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: Expr::Ident(quote_ident!("_classCallCheck")).as_callee(),
                        args: vec![
                            Expr::This(ThisExpr { span: DUMMY_SP }).as_arg(),
                            Expr::Ident(decl.ident.clone()).as_arg(),
                        ],
                        type_args: Default::default(),
                    }));

                    let mut constructor = constructor.unwrap_or_else(|| Constructor {
                        span: DUMMY_SP,
                        key: PropName::Ident(quote_ident!("constructor")),
                        accessibility: Default::default(),
                        is_optional: false,
                        params: vec![],
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![],
                        }),
                    });
                    constructor
                        .body
                        .as_mut()
                        .unwrap()
                        .stmts
                        .insert(0, class_call_check);

                    return Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            init: Some(box Expr::Fn(FnExpr {
                                ident: Some(decl.ident.clone()),
                                function: constructor_fn(constructor),
                            })),
                            // Foo in var Foo =
                            name: decl.ident.into(),
                            definite: false,
                        }],
                        declare: false,
                    });
                }

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
        // Ident of the super class *inside* function.
        let super_ident = class
            .super_class
            .as_ref()
            .map(|e| alias_ident_for(e, "_Super"));

        let (params, args) = if let Some(ref super_ident) = super_ident {
            let params = vec![Pat::Ident(super_ident.clone())];

            let super_class = class.super_class.clone().unwrap();
            let is_super_native = match *super_class {
                Expr::Ident(Ident { ref sym, .. }) => match *sym {
                    js_word!("Object") | js_word!("Array") => true,
                    _ => false,
                },
                _ => false,
            };
            if is_super_native {
                self.helpers.wrap_native_super();
                (
                    params,
                    vec![CallExpr {
                        span: DUMMY_SP,
                        callee: quote_ident!("_wrapNativeSuper").as_callee(),
                        args: vec![super_class.as_arg()],
                        type_args: Default::default(),
                    }
                    .as_arg()],
                )
            } else {
                (params, vec![super_class.as_arg()])
            }
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
            self.helpers.inherits();
            self.helpers.possible_constructor_return();

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
            self.helpers.class_call_check();
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
                let mode = SuperCallFinder::find(&body);

                let mark = Mark::fresh(Mark::root());
                let this = quote_ident!(DUMMY_SP.apply_mark(mark), "_this");

                body.insert(
                    0,
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(this.clone()),
                            init: None,
                            definite: false,
                        }],
                    })),
                );

                let mut folder = ConstructorFolder {
                    helpers: &self.helpers,
                    class_name: &class_name,
                    mode,
                    mark,
                };

                body = body.fold_with(&mut folder);

                let is_last_return = match body.last() {
                    Some(Stmt::Return(..)) => true,
                    _ => false,
                };
                if !is_last_return {
                    let possible_return_value = box make_possible_return_value(
                        &self.helpers,
                        ReturningMode::Returning { mark, arg: None },
                    );
                    body.push(Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(possible_return_value),
                    }));
                }
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
                function: constructor_fn(Constructor {
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: body,
                    }),
                    ..constructor
                }),
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
                    PropName::Num(n) => box Expr::Lit(Lit::Num(n)),
                    PropName::Computed(ref expr) => expr.clone(),
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
            let prop_key = box mk_prop_key(&m.key);
            let prop_name = prop_name_to_expr(m.key);

            let append_to: &mut Vec<_> = if m.is_static {
                &mut static_props
            } else {
                &mut props
            };

            let function = m.function.fold_with(&mut SuperFieldAccessFolder {
                class_name: &class_name,
                helpers: &self.helpers,
            });

            let value = box Expr::Fn(FnExpr {
                ident: match prop_name {
                    Expr::Ident(ident) => Some(ident),
                    _ => None,
                },
                function,
            });

            match m.kind {
                MethodKind::Method | MethodKind::Getter => {
                    append_to.push(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: vec![
                            PropOrSpread::Prop(prop_key),
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
                            PropOrSpread::Prop(prop_key),
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
        self.helpers.create_class();
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
fn get_prototype_of(helpers: &Helpers, obj: &Expr) -> Expr {
    helpers.get_prototype_of();

    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: member_expr!(DUMMY_SP, _getPrototypeOf).as_callee(),
        args: vec![obj.clone().as_arg()],
        type_args: Default::default(),
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
struct SuperFieldAccessFolder<'a> {
    class_name: &'a Ident,
    helpers: &'a Helpers,
}

struct SuperCalleeFolder<'a> {
    helpers: &'a Helpers,
    class_name: &'a Ident,
    /// True if we should inject get and
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

        let proto_arg = get_prototype_of(
            self.helpers,
            &Expr::Member(MemberExpr {
                span: super_token,
                obj: ExprOrSuper::Expr(box Expr::Ident(self.class_name.clone())),
                prop: box Expr::Ident(quote_ident!("prototype")),
                computed: false,
            }),
        )
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

        let proto_arg = get_prototype_of(
            self.helpers,
            &Expr::Member(MemberExpr {
                span: super_token,
                obj: ExprOrSuper::Expr(box Expr::Ident(self.class_name.clone())),
                prop: box Expr::Ident(quote_ident!("prototype")),
                computed: false,
            }),
        )
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

impl<'a> Fold<Expr> for SuperFieldAccessFolder<'a> {
    fn fold(&mut self, n: Expr) -> Expr {
        let mut callee_folder = SuperCalleeFolder {
            class_name: self.class_name,
            inject_get: false,
            inject_set: false,
            helpers: self.helpers,
        };

        let was_call = match n {
            Expr::Call(..) => true,
            _ => false,
        };

        let n = n.fold_with(&mut callee_folder);

        if callee_folder.inject_get {
            self.helpers.get();

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
            self.helpers.set();
        }

        n
    }
}
