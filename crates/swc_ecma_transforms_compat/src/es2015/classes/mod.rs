use std::iter;

use serde::Deserialize;
use swc_common::{comments::Comments, util::take::Take, BytePos, Mark, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, native::is_native, perf::Check};
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_if_required, contains_this_expr, default_constructor, is_valid_ident,
    is_valid_prop_ident, prepend_stmt, private_ident, prop_name_to_expr, quote_expr, quote_ident,
    quote_str, replace_ident, ExprFactory, IdentExt, IsDirective, ModuleItemLike, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;
use tracing::debug;

use self::{
    constructor::{
        constructor_fn, make_possible_return_value, replace_this_in_constructor, ConstructorFolder,
        ReturningMode, SuperCallFinder, SuperFoldingMode,
    },
    prop_name::{is_pure_prop_name, should_extract_class_prop_key, HashKey},
};

mod constructor;
mod prop_name;

#[tracing::instrument(level = "info", skip_all)]
pub fn classes<C>(comments: Option<C>, config: Config) -> impl Fold + VisitMut
where
    C: Comments,
{
    as_folder(Classes {
        in_strict: false,
        comments,
        config,

        params: Default::default(),
        args: Default::default(),
    })
}

type IndexMap<K, V> = indexmap::IndexMap<K, V, ahash::RandomState>;

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
struct Classes<C>
where
    C: Comments,
{
    in_strict: bool,
    comments: Option<C>,
    config: Config,

    params: Vec<Param>,
    args: Vec<ExprOrSpread>,
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub constant_super: bool,
    #[serde(default)]
    pub no_class_calls: bool,
    #[serde(default)]
    pub set_class_methods: bool,
    #[serde(default)]
    pub super_is_callable_constructor: bool,
}

struct Data {
    key_prop: Box<PropName>,
    method: Option<Box<Expr>>,
    set: Option<Box<Expr>>,
    get: Option<Box<Expr>>,
}

#[swc_trace]
impl<C> Classes<C>
where
    C: Comments,
{
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self> + Take,
    {
        let mut buf = Vec::with_capacity(stmts.len());
        let mut first = true;
        let old = self.in_strict;

        for stmt in stmts.iter_mut() {
            match T::try_into_stmt(stmt.take()) {
                Err(node) => match node.try_into_module_decl() {
                    Ok(mut decl) => {
                        match decl {
                            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                                decl: DefaultDecl::Class(ClassExpr { ident, class }),
                                ..
                            }) => {
                                let ident = ident.unwrap_or_else(|| quote_ident!("_default"));

                                let mut decl = self.fold_class_as_var_decl(ident.clone(), class);
                                decl.visit_mut_children_with(self);
                                buf.push(T::from_stmt(decl.into()));

                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportNamed(
                                        NamedExport {
                                            span: DUMMY_SP,
                                            specifiers: vec![ExportNamedSpecifier {
                                                span: DUMMY_SP,
                                                orig: ModuleExportName::Ident(ident),
                                                exported: Some(ModuleExportName::Ident(
                                                    quote_ident!("default"),
                                                )),
                                                is_type_only: false,
                                            }
                                            .into()],
                                            src: None,
                                            type_only: false,
                                            asserts: None,
                                        },
                                    )) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                            }
                            ModuleDecl::ExportDecl(ExportDecl {
                                span,
                                decl:
                                    Decl::Class(ClassDecl {
                                        ident,
                                        declare: false,
                                        class,
                                    }),
                                ..
                            }) => {
                                let mut decl = self.fold_class_as_var_decl(ident, class);
                                decl.visit_mut_children_with(self);
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportDecl(
                                        ExportDecl {
                                            span,
                                            decl: decl.into(),
                                        },
                                    )) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                            }
                            _ => buf.push({
                                decl.visit_mut_children_with(self);
                                match T::try_from_module_decl(decl) {
                                    Ok(t) => t,
                                    Err(..) => unreachable!(),
                                }
                            }),
                        };
                    }
                    Err(..) => unreachable!(),
                },
                Ok(mut stmt) => {
                    if first {
                        self.in_strict |= stmt.is_use_strict();
                    }

                    stmt.visit_mut_children_with(self);
                    buf.push(T::from_stmt(stmt));
                }
            }
            first = false;
        }

        self.in_strict = old;
        *stmts = buf;
    }
}

#[swc_trace]
#[fast_path(ClassFinder)]
impl<C> VisitMut for Classes<C>
where
    C: Comments,
{
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(items)
    }

    fn visit_mut_stmts(&mut self, items: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(items)
    }

    fn visit_mut_decl(&mut self, n: &mut Decl) {
        if let Decl::Class(decl) = n {
            *n = self
                .fold_class_as_var_decl(decl.ident.take(), decl.class.take())
                .into()
        };

        n.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Class(e) => {
                let class = self.fold_class(e.ident.take(), e.class.take());
                if let Expr::Call(call) = &class {
                    self.add_pure_comments(call.span.lo)
                }
                *n = class;
                n.visit_mut_children_with(self)
            }

            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_mut_var_declarator(&mut self, d: &mut VarDeclarator) {
        // will there be anything else in var name at this point?
        if let VarDeclarator {
            name: Pat::Ident(i),
            init: Some(init),
            ..
        } = d
        {
            if let Expr::Class(c @ ClassExpr { ident: None, .. }) = &mut **init {
                c.ident = Some(i.id.clone().private())
            }
        }

        d.visit_mut_children_with(self)
    }

    /// `let { f = class /* f */ {} } = {};`
    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        if let Some(value) = &mut n.value {
            if let Expr::Class(c @ ClassExpr { ident: None, .. }) = &mut **value {
                c.ident = Some(n.key.clone().private());
            }
        }

        n.visit_mut_children_with(self);
    }

    /// `let [c = class /* c */ {}] = [];`
    /// `function foo(bar = class /* bar */ {}) {}`
    fn visit_mut_assign_pat(&mut self, n: &mut AssignPat) {
        if let (
            Pat::Ident(BindingIdent { id, .. }),
            Expr::Class(c @ ClassExpr { ident: None, .. }),
        ) = (&*n.left, &mut *n.right)
        {
            c.ident = Some(id.clone().private())
        }

        n.visit_mut_children_with(self);
    }

    /// {
    ///     hello: class {},
    ///     "foo": class {},
    ///     ["x"]: class {}
    /// }
    fn visit_mut_key_value_prop(&mut self, n: &mut KeyValueProp) {
        if let Expr::Class(c @ ClassExpr { ident: None, .. }) = &mut *n.value {
            match &n.key {
                PropName::Ident(ident) => {
                    c.ident = Some(ident.clone().private());
                }
                PropName::Str(Str { value, span, .. }) => {
                    if is_valid_prop_ident(value) {
                        c.ident = Some(private_ident!(*span, value));
                    }
                }
                PropName::Computed(ComputedPropName { expr, .. }) => {
                    if let Expr::Lit(Lit::Str(Str { value, span, .. })) = &**expr {
                        if is_valid_prop_ident(value) {
                            c.ident = Some(private_ident!(*span, value));
                        }
                    }
                }
                _ => {}
            }
        }

        n.visit_mut_children_with(self)
    }

    fn visit_mut_assign_expr(&mut self, a: &mut AssignExpr) {
        if let AssignExpr {
            op: op!("=") | op!("||=") | op!("??="),
            left,
            right,
            ..
        } = a
        {
            if let Expr::Class(c @ ClassExpr { ident: None, .. }) = &mut **right {
                match left {
                    PatOrExpr::Pat(pat) => {
                        if let Pat::Ident(i) = &**pat {
                            c.ident = Some(i.id.clone().private())
                        }
                    }
                    PatOrExpr::Expr(expr) => {
                        if let Expr::Ident(ident) = &**expr {
                            c.ident = Some(ident.clone().private())
                        }
                    }
                }
            }
        }

        a.visit_mut_children_with(self)
    }
}

#[swc_trace]
impl<C> Classes<C>
where
    C: Comments,
{
    fn add_pure_comments(&mut self, start: BytePos) {
        if let Some(comments) = &self.comments {
            comments.add_pure_comment(start);
        }
    }

    fn fold_class_as_var_decl(&mut self, ident: Ident, class: Box<Class>) -> VarDecl {
        let span = class.span;
        let mut rhs = self.fold_class(Some(ident.clone()), class);

        let mut new_name = ident.clone();
        new_name.span = new_name.span.apply_mark(Mark::new());
        replace_ident(&mut rhs, ident.to_id(), &new_name);

        // let VarDecl take every comments except pure
        if let Expr::Call(call) = &mut rhs {
            let span = Span {
                // after class
                lo: span.hi + BytePos(5),
                ..span
            };
            self.add_pure_comments(span.lo);
            call.span = span;
        }

        VarDecl {
            span,
            kind: VarDeclKind::Let,
            decls: vec![VarDeclarator {
                span,
                init: Some(Box::new(rhs)),
                // Foo in var Foo =
                name: ident.into(),
                definite: false,
            }],
            declare: false,
        }
    }

    /// Turns class expression into iife.
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
    fn fold_class(&mut self, class_name: Option<Ident>, class: Box<Class>) -> Expr {
        let span = class.span;

        // Ident of the super class *inside* function.
        let super_ident = class
            .super_class
            .as_ref()
            .map(|e| alias_if_required(e, "_superClass").0);
        let has_super = super_ident.is_some();
        let (mut params, mut args, super_ident) = if let Some(ref super_ident) = super_ident {
            // Param should have a separate syntax context from arg.
            let super_param = private_ident!(super_ident.sym.clone());
            let params = vec![Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: super_param.clone().into(),
            }];

            let super_class = class.super_class.clone().unwrap();
            let is_super_native = match *super_class {
                Expr::Ident(Ident { ref sym, .. }) => is_native(sym),
                _ => false,
            };
            if is_super_native {
                (
                    params,
                    vec![CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(wrap_native_super, "wrapNativeSuper"),
                        args: vec![super_class.as_arg()],
                        type_args: Default::default(),
                    }
                    .as_arg()],
                    Some(super_param),
                )
            } else {
                (params, vec![super_class.as_arg()], Some(super_param))
            }
        } else {
            (vec![], vec![], None)
        };

        let mut stmts = self.class_to_stmts(class_name, super_ident, class);
        params.extend(self.params.take());
        args.extend(self.args.take());

        let cnt_of_non_directive = stmts
            .iter()
            .filter(|stmt| match stmt {
                Stmt::Expr(ExprStmt { expr, .. }) => !matches!(&**expr, Expr::Lit(Lit::Str(..))),
                _ => true,
            })
            .count();
        if !has_super && cnt_of_non_directive == 1 {
            //    class Foo {}
            //
            // should be
            //
            //    var Foo = function Foo() {
            //        _classCallCheck(this, Foo);
            //    };
            //
            // instead of
            //
            //    var Foo = function(){
            //      function Foo() {
            //          _classCallCheck(this, Foo);
            //      }
            //
            //      return Foo;
            //    }();

            let stmt = stmts.pop().unwrap();
            match stmt {
                Stmt::Decl(Decl::Fn(FnDecl {
                    ident,
                    mut function,
                    ..
                })) => {
                    if let Some(use_strict) = stmts.pop() {
                        prepend_stmt(&mut function.body.as_mut().unwrap().stmts, use_strict);
                    }
                    function.span = span;
                    return Expr::Fn(FnExpr {
                        ident: Some(ident),
                        function,
                    });
                }
                _ => unreachable!(),
            }
        }

        let body = BlockStmt {
            span: DUMMY_SP,
            stmts,
        };

        let call = CallExpr {
            span,
            callee: Function {
                span,
                is_async: false,
                is_generator: false,
                params,
                body: Some(body),
                decorators: Default::default(),
                type_params: Default::default(),
                return_type: Default::default(),
            }
            .as_callee(),
            args,
            type_args: Default::default(),
        };

        Expr::Call(call)
    }

    /// Returned `stmts` contains `return Foo`
    fn class_to_stmts(
        &mut self,
        class_name: Option<Ident>,
        super_class_ident: Option<Ident>,
        class: Box<Class>,
    ) -> Vec<Stmt> {
        let class_name = class_name.unwrap_or_else(|| quote_ident!("_class"));
        let mut stmts = vec![];

        let mut methods = vec![];
        let mut constructor = None;
        for member in class.body {
            match member {
                ClassMember::Constructor(c) => {
                    if constructor.is_some() {
                        unimplemented!("multiple constructor")
                    } else {
                        constructor = Some(c)
                    }
                }
                ClassMember::PrivateMethod(_) => unreachable!(
                    "classes pass: private method\nclass_properties pass should remove this"
                ),
                ClassMember::Method(m) => methods.push(m),

                ClassMember::ClassProp(..) => {
                    unreachable!("classes pass: property\nclass_properties pass should remove this")
                }
                ClassMember::PrivateProp(..) => unreachable!(
                    "classes pass: private property\nclass_properties pass should remove this"
                ),
                ClassMember::TsIndexSignature(..) => {
                    // We just strip this.
                }
                ClassMember::Empty(..) => {}
                ClassMember::StaticBlock(..) => unreachable!(
                    "classes pass: static blocks\nstatic_blocks pass should remove this"
                ),
            }
        }

        if let Some(ref super_class_ident) = super_class_ident {
            // inject helper methods

            let mut class_name_sym = class_name.clone();
            class_name_sym.span = DUMMY_SP;
            class_name_sym.span.ctxt = class_name.span.ctxt;

            let mut super_class_name_sym = super_class_ident.clone();
            super_class_name_sym.span = DUMMY_SP;
            super_class_name_sym.span.ctxt = super_class_ident.span.ctxt;

            stmts.push(
                CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(inherits, "inherits"),
                    args: vec![class_name_sym.as_arg(), super_class_name_sym.as_arg()],
                    type_args: Default::default(),
                }
                .into_stmt(),
            );
        }

        let super_var = super_class_ident.as_ref().map(|super_class| {
            let var = private_ident!("_super");
            let mut class_name_sym = class_name.clone();
            class_name_sym.span = DUMMY_SP;
            class_name_sym.span.ctxt = class_name.span.ctxt;

            if !self.config.super_is_callable_constructor {
                stmts.push(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: var.clone().into(),
                            init: Some(Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(create_super, "createSuper"),
                                args: vec![class_name_sym.as_arg()],
                                type_args: Default::default(),
                            }))),
                            definite: Default::default(),
                        }],
                    }
                    .into(),
                );
                var
            } else {
                super_class.clone()
            }
        });

        // Marker for `_this`
        let this_mark = Mark::fresh(Mark::root());

        {
            // Process constructor

            let mut constructor =
                constructor.unwrap_or_else(|| default_constructor(super_class_ident.is_some()));

            // Rename variables to avoid conflicting with class name
            // TODO: bring it back once we have a proper private ident
            // constructor.body.visit_mut_with(&mut VarRenamer {
            //     mark: Mark::fresh(Mark::root()),
            //     class_name: &class_name.sym,
            // });

            // Black magic to detect injected constructor.
            let is_constructor_default = constructor.span.is_dummy();
            if is_constructor_default {
                debug!("Dropping constructor parameters because the constructor is injected");
                constructor.params = vec![];
            }

            let mut insert_this = false;

            if super_class_ident.is_some() {
                let inserted_this = replace_this_in_constructor(this_mark, &mut constructor);

                insert_this |= inserted_this;
            }

            let mut vars = vec![];
            let mut body = constructor.body.unwrap().stmts;
            // should we insert `var _this`?

            let is_always_initialized = is_always_initialized(&body);

            // We should handle branching
            if !is_always_initialized {
                insert_this = true;
            }

            // inject possibleReturnCheck
            let found_mode = SuperCallFinder::find(&body);
            let mode = match found_mode {
                None => None,
                _ => {
                    if insert_this {
                        Some(SuperFoldingMode::Assign)
                    } else {
                        found_mode
                    }
                }
            };

            if super_class_ident.is_some() {
                let this = quote_ident!(DUMMY_SP.apply_mark(this_mark), "_this");

                // We should fold body instead of constructor itself.
                // Handle `super()`
                body.visit_mut_with(&mut ConstructorFolder {
                    class_name: &class_name,
                    mode: if insert_this {
                        Some(SuperFoldingMode::Assign)
                    } else {
                        mode
                    },
                    mark: this_mark,
                    is_constructor_default,
                    super_var,
                    ignore_return: false,
                    super_is_callable_constructor: self.config.super_is_callable_constructor,
                });

                insert_this |= (mode.is_none() && !is_always_initialized)
                    || mode == Some(SuperFoldingMode::Assign);

                if insert_this {
                    vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: this.clone().into(),
                        init: None,
                        definite: false,
                    });
                }
                if !vars.is_empty() {
                    prepend_stmt(
                        &mut body,
                        VarDecl {
                            span: DUMMY_SP,
                            declare: false,
                            kind: VarDeclKind::Var,
                            decls: vars,
                        }
                        .into(),
                    );
                }

                let is_last_return = matches!(body.last(), Some(Stmt::Return(..)));
                if !is_last_return {
                    if is_always_initialized {
                        body.push(Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(Box::new(Expr::Ident(this))),
                        }));
                    } else {
                        let possible_return_value =
                            Box::new(make_possible_return_value(ReturningMode::Returning {
                                mark: this_mark,
                                arg: None,
                            }));
                        body.push(Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(possible_return_value),
                        }));
                    }
                }
            }

            let is_this_declared = (insert_this && super_class_ident.is_some())
                || (mode == Some(SuperFoldingMode::Var));

            // Handle `super.XX`
            body = self.handle_super_access(
                &class_name,
                &super_class_ident,
                body,
                if is_this_declared {
                    Some(this_mark)
                } else {
                    None
                },
            );

            // inject _classCallCheck(this, Bar);
            if !self.config.no_class_calls {
                inject_class_call_check(&mut body, class_name.clone());
            }

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
        }

        // convert class methods
        stmts.extend(self.fold_class_methods(&class_name, &super_class_ident, methods));

        if stmts.first().map(|v| !v.is_use_strict()).unwrap_or(false) && !self.in_strict {
            prepend_stmt(
                &mut stmts,
                Lit::Str(Str {
                    span: DUMMY_SP,
                    value: "use strict".into(),
                    raw: Some("\"use strict\"".into()),
                })
                .into_stmt(),
            );

            if stmts.len() == 2 {
                return stmts;
            }
        }

        if super_class_ident.is_none()
            && stmts
                .iter()
                .filter(|stmt| match stmt {
                    Stmt::Expr(ExprStmt { expr, .. }) => {
                        !matches!(&**expr, Expr::Lit(Lit::Str(..)))
                    }
                    _ => true,
                })
                .count()
                == 1
        {
            return stmts;
        }

        let mut class_name_sym = class_name.clone();
        class_name_sym.span = DUMMY_SP;
        class_name_sym.span.ctxt = class_name.span.ctxt;

        // `return Foo`
        stmts.push(Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(Expr::Ident(class_name_sym))),
        }));

        stmts
    }

    ///
    /// - `this_mark`: `Some(mark)` if we injected `var _this;`; otherwise
    ///   `None`
    fn handle_super_access(
        &mut self,
        class_name: &Ident,
        super_class_ident: &Option<Ident>,
        mut body: Vec<Stmt>,
        this_mark: Option<Mark>,
    ) -> Vec<Stmt> {
        let mut vars = vec![];
        let mut folder = SuperFieldAccessFolder {
            class_name,
            vars: &mut vars,
            constructor_this_mark: this_mark,
            // constructor cannot be static
            is_static: false,
            folding_constructor: true,
            in_nested_scope: false,
            in_injected_define_property_call: false,
            this_alias_mark: None,
            constant_super: self.config.constant_super,
            super_class: super_class_ident,
            in_pat: false,
        };

        body.visit_mut_with(&mut folder);

        if let Some(mark) = folder.this_alias_mark {
            prepend_stmt(
                &mut body,
                VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: quote_ident!(DUMMY_SP.apply_mark(mark), "_this").into(),
                        init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                        definite: false,
                    }],
                }
                .into(),
            );
        }

        if !vars.is_empty() {
            prepend_stmt(
                &mut body,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vars,
                }
                .into(),
            );
        }

        body
    }

    fn fold_class_methods(
        &mut self,
        class_name: &Ident,
        super_class_ident: &Option<Ident>,
        methods: Vec<ClassMethod>,
    ) -> Vec<Stmt> {
        if methods.is_empty() {
            return vec![];
        }

        /// { key: "prop" }
        fn mk_key_prop(key: PropName) -> Box<Prop> {
            Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!(key.span(), "key")),
                value: match key {
                    PropName::Ident(i) => Box::new(Expr::Lit(Lit::Str(quote_str!(i.span, i.sym)))),
                    PropName::Str(s) => Box::new(Expr::from(s)),
                    PropName::Num(n) => Box::new(Expr::from(n)),
                    PropName::BigInt(b) => Box::new(Expr::Lit(
                        Str {
                            span: b.span,
                            raw: None,
                            value: b.value.to_string().into(),
                        }
                        .into(),
                    )),
                    PropName::Computed(c) => c.expr,
                },
            }))
        }

        fn mk_key_prop_member(key: PropName) -> MemberProp {
            match key {
                PropName::Ident(i) => MemberProp::Ident(i),
                PropName::Str(s) => MemberProp::Computed(ComputedPropName {
                    span: s.span,
                    expr: Box::new(Expr::Lit(Lit::Str(s))),
                }),
                PropName::Num(n) => MemberProp::Computed(ComputedPropName {
                    span: n.span,
                    expr: Box::new(Expr::Lit(Lit::Num(n))),
                }),
                PropName::BigInt(b) => MemberProp::Computed(ComputedPropName {
                    span: b.span,
                    expr: Box::new(Expr::Lit(
                        Str {
                            span: b.span,
                            raw: None,
                            value: b.value.to_string().into(),
                        }
                        .into(),
                    )),
                }),
                PropName::Computed(c) => MemberProp::Computed(c),
            }
        }

        fn mk_arg_obj_for_create_class(props: IndexMap<HashKey, Data>) -> ExprOrSpread {
            if props.is_empty() {
                return quote_expr!(DUMMY_SP, null).as_arg();
            }
            Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: props
                    .into_iter()
                    .map(|(_, data)| {
                        let mut props = vec![PropOrSpread::Prop(mk_key_prop(*data.key_prop))];

                        macro_rules! add {
                            ($field:expr, $kind:expr, $s:literal) => {{
                                if let Some(value) = $field {
                                    let value = escape_keywords(value);
                                    props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                        KeyValueProp {
                                            key: PropName::Ident(quote_ident!($s)),
                                            value,
                                        },
                                    ))));
                                }
                            }};
                        }

                        add!(data.get, MethodKind::Getter, "get");
                        add!(data.set, MethodKind::Setter, "set");
                        add!(data.method, MethodKind::Method, "value");

                        ObjectLit {
                            span: DUMMY_SP,
                            props,
                        }
                        .as_arg()
                    })
                    .map(Some)
                    .collect(),
            })
            .as_arg()
        }

        /// _createClass(Foo, [{}], [{}]);
        fn mk_create_class_call(
            class_name: Ident,
            methods: ExprOrSpread,
            static_methods: Option<ExprOrSpread>,
        ) -> Stmt {
            let mut class_name_sym = class_name.clone();
            class_name_sym.span = DUMMY_SP;
            class_name_sym.span.ctxt = class_name.span.ctxt;

            CallExpr {
                span: DUMMY_SP,
                callee: helper!(create_class, "createClass"),
                args: iter::once(class_name_sym.as_arg())
                    .chain(iter::once(methods))
                    .chain(static_methods)
                    .collect(),
                type_args: Default::default(),
            }
            .into_stmt()
        }

        let (mut props, mut static_props) = (IndexMap::default(), IndexMap::default());

        let should_extract = should_extract_class_prop_key(&methods);

        for mut m in methods {
            let key = HashKey::from(&m.key);
            let key_is_pure = is_pure_prop_name(&m.key);
            // class is always strict, however computed key is not part of class
            let key_contain_this = !self.in_strict && contains_this_expr(&m.key);
            let key_prop = Box::new(m.key.clone());
            let computed = matches!(m.key, PropName::Computed(..));
            let prop_name = prop_name_to_expr(m.key);

            let key_prop = if should_extract && !key_is_pure || key_contain_this {
                let ident = private_ident!("_prop");

                self.params.push(ident.clone().into());
                self.args.push(prop_name.clone().into());

                Box::new(PropName::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: Box::new(ident.into()),
                }))
            } else {
                key_prop
            };

            let append_to: &mut IndexMap<_, _> = if m.is_static {
                &mut static_props
            } else {
                &mut props
            };

            let mut vars = vec![];
            let mut folder = SuperFieldAccessFolder {
                class_name,
                vars: &mut vars,
                constructor_this_mark: None,
                is_static: m.is_static,
                folding_constructor: false,
                in_nested_scope: false,
                in_injected_define_property_call: false,
                this_alias_mark: None,
                constant_super: self.config.constant_super,
                super_class: super_class_ident,
                in_pat: false,
            };
            m.function.visit_mut_with(&mut folder);

            if let Some(mark) = folder.this_alias_mark {
                prepend_stmt(
                    &mut m.function.body.as_mut().unwrap().stmts,
                    VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: quote_ident!(DUMMY_SP.apply_mark(mark), "_this").into(),
                            init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                            definite: false,
                        }],
                    }
                    .into(),
                );
            }

            if !vars.is_empty() {
                prepend_stmt(
                    &mut m.function.body.as_mut().unwrap().stmts,
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vars,
                    }
                    .into(),
                );
            }

            let value = Box::new(Expr::Fn(FnExpr {
                ident: if m.kind == MethodKind::Method && !computed {
                    match prop_name {
                        Expr::Ident(ident) => Some(private_ident!(ident.span, ident.sym)),
                        Expr::Lit(Lit::Str(Str { span, value, .. })) if is_valid_ident(&value) => {
                            Some(Ident::new(value, span.private()))
                        }
                        _ => None,
                    }
                } else {
                    None
                },
                function: m.function,
            }));

            let data = append_to.entry(key).or_insert_with(|| Data {
                key_prop,
                get: None,
                set: None,
                method: None,
            });
            match m.kind {
                // https://github.com/swc-project/swc/issues/5029
                MethodKind::Getter => {
                    data.method = None;
                    data.get = Some(value)
                }
                MethodKind::Setter => {
                    data.method = None;
                    data.set = Some(value)
                }
                MethodKind::Method => {
                    data.get = None;
                    data.set = None;
                    data.method = Some(value)
                }
            }
        }

        let mut res = Vec::new();

        if self.config.set_class_methods {
            let proto = private_ident!("_proto");
            props.retain(|_, v| {
                if let Some(method) = v.method.take() {
                    if res.is_empty() {
                        res.push(
                            VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                declare: false,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: proto.clone().into(),
                                    init: Some(Box::new(
                                        class_name.clone().make_member(quote_ident!("prototype")),
                                    )),
                                    definite: false,
                                }],
                            }
                            .into(),
                        );
                    }
                    let span = method.span();
                    let prop = *v.key_prop.clone();
                    res.push(Stmt::Expr(ExprStmt {
                        span,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span,
                            op: op!("="),
                            left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                span,
                                obj: Box::new(proto.clone().into()),
                                prop: mk_key_prop_member(prop),
                            }))),
                            right: escape_keywords(method),
                        })),
                    }));
                    !(v.get.is_none() && v.set.is_none())
                } else {
                    true
                }
            });

            static_props.retain(|_, v| {
                if let Some(method) = v.method.take() {
                    let span = method.span();
                    let prop = *v.key_prop.clone();
                    res.push(Stmt::Expr(ExprStmt {
                        span,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span,
                            op: op!("="),
                            left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                span,
                                obj: Box::new(class_name.clone().into()),
                                prop: mk_key_prop_member(prop),
                            }))),
                            right: escape_keywords(method),
                        })),
                    }));
                    !(v.get.is_none() && v.set.is_none())
                } else {
                    true
                }
            })
        }

        if props.is_empty() && static_props.is_empty() {
            return res;
        }

        res.push(mk_create_class_call(
            class_name.clone(),
            mk_arg_obj_for_create_class(props),
            if static_props.is_empty() {
                None
            } else {
                Some(mk_arg_obj_for_create_class(static_props))
            },
        ));

        res
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn inject_class_call_check(c: &mut Vec<Stmt>, name: Ident) {
    let mut class_name_sym = name.clone();
    class_name_sym.span = DUMMY_SP;
    class_name_sym.span.ctxt = name.span.ctxt;

    let class_call_check = CallExpr {
        span: DUMMY_SP,
        callee: helper!(class_call_check, "classCallCheck"),
        args: vec![
            Expr::This(ThisExpr { span: DUMMY_SP }).as_arg(),
            class_name_sym.as_arg(),
        ],
        type_args: Default::default(),
    }
    .into_stmt();

    prepend_stmt(c, class_call_check)
}

/// Returns true if no `super` is used before `super()` call.
#[tracing::instrument(level = "info", skip_all)]
fn is_always_initialized(body: &[Stmt]) -> bool {
    struct SuperFinder {
        found: bool,
    }

    impl Visit for SuperFinder {
        noop_visit_type!();

        fn visit_callee(&mut self, node: &Callee) {
            match *node {
                Callee::Super(..) => self.found = true,
                _ => node.visit_children_with(self),
            }
        }

        fn visit_super_prop_expr(&mut self, _: &SuperPropExpr) {
            self.found = true
        }
    }

    let pos = match body.iter().position(|s| match s {
        Stmt::Expr(ExprStmt { expr, .. }) => matches!(
            &**expr,
            Expr::Call(CallExpr {
                callee: Callee::Super(..),
                ..
            })
        ),
        _ => false,
    }) {
        Some(pos) => pos,
        _ => return false,
    };

    let mut v = SuperFinder { found: false };
    let body = &body[..pos];
    v.visit_stmts(body);

    !v.found
}

fn escape_keywords(mut e: Box<Expr>) -> Box<Expr> {
    if let Expr::Fn(f) = &mut *e {
        if let Some(i) = &mut f.ident {
            let sym = Ident::verify_symbol(&i.sym);

            if let Err(new) = sym {
                i.sym = new.into();
            }
        }
    }

    e
}

#[derive(Default)]
struct ClassFinder {
    found: bool,
}

impl Visit for ClassFinder {
    noop_visit_type!();

    fn visit_class(&mut self, _: &Class) {
        self.found = true
    }
}

impl Check for ClassFinder {
    fn should_handle(&self) -> bool {
        self.found
    }
}
