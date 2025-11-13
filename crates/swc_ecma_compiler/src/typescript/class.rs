use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use super::TypeScript;
use crate::context::TraverseCtx;

impl<'a> TypeScript<'a, '_> {
    /// Transform class fields, and constructor parameters that includes
    /// modifiers into `this` assignments.
    ///
    /// This transformation is doing 2 things:
    ///
    /// 1. Convert constructor parameters that include modifier to `this`
    ///    assignments and insert them after the super call in the constructor
    ///    body.
    ///
    /// Same as `Self::convert_constructor_params` does, the reason why we still
    /// need that method because this method only calls when
    /// `set_public_class_fields` is `true` and `class_properties` plugin is
    /// disabled, otherwise the `convert_constructor_params` method will be
    /// called. Merging them together will increase unnecessary check when
    /// only transform constructor parameters.
    ///
    /// 2. Convert class fields to `this` assignments in the constructor body.
    ///
    /// > This transformation only works when `set_public_class_fields` is
    /// > `true`,
    /// > and the fields have initializers, which is to align with the behavior
    /// > of TypeScript's
    /// > `useDefineForClassFields: false` option.
    ///
    /// Input:
    /// ```ts
    /// class C {
    ///   x = 1;
    ///   [y] = 2;
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let _y;
    /// class C {
    ///   static {
    ///     _y = y;
    ///   }
    ///   constructor() {
    ///     this.x = 1;
    ///     this[_y] = 2;
    ///   }
    /// }
    /// ```
    ///
    /// The computed key transformation behavior is the same as `TypeScript`.
    /// Computed key assignments are inserted into a static block, unlike Babel
    /// which inserts them before class. We follow `TypeScript` just for
    /// simplicity, because `Babel` handles class expressions and class
    /// declarations differently, which is quite troublesome to implement.
    /// Anyway, `TypeScript` is the source of truth for the typescript
    /// transformation.
    ///
    /// For static properties, we convert them to static blocks.
    ///
    /// Input:
    /// ```ts
    /// class C {
    ///   static x = 1;
    ///   static [y] = 2;
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let _y;
    /// class C {
    ///   static {
    ///     this.x = 1;
    ///   }
    ///   static {
    ///     this[_y] = 2;
    ///   }
    /// }
    /// ```
    ///
    /// The transformation way is also the same as `TypeScript`, the advantage
    /// from the implementation is that we don't need extra transformation
    /// for static properties, the output is the same as instance properties
    /// transformation, and the greatest advantage is we don't need to care
    /// about `this` usage in static block.
    pub(super) fn transform_class_fields(&self, class: &mut Class, ctx: &mut TraverseCtx<'a>) {
        let mut constructor = None;
        let mut property_assignments = Vec::new();
        let mut computed_key_assignments = Vec::new();

        for (idx, element) in class.body.iter_mut().enumerate() {
            match element {
                // `set_public_class_fields: true` only needs to transform non-private class fields.
                // Note: Private fields are separate ClassMember::PrivateProp, not ClassProp with
                // PrivateName key
                ClassMember::ClassProp(prop) => {
                    if let Some(value) = prop.value.take() {
                        let assignment = self.convert_property_definition(
                            &mut prop.key,
                            *value,
                            &mut computed_key_assignments,
                            ctx,
                        );
                        if prop.is_static {
                            // Convert static property to static block
                            // `class C { static x = 1; }` -> `class C { static { this.x = 1; } }`
                            // `class C { static [x] = 1; }` -> `let _x; class C { static { this[_x]
                            // = 1; } }`
                            let body = vec![assignment];
                            *element = Self::create_class_static_block(body);
                        } else {
                            property_assignments.push(assignment);
                        }
                    } else if self.remove_class_fields_without_initializer {
                        // `TypeScript` uses `isSimpleInlineableExpression` to check if the key
                        // needs to be kept. There is a little difference
                        // that we treat `BigIntLiteral` and `RegExpLiteral` can be kept, and
                        // `IdentifierReference` without symbol is not kept.
                        // https://github.com/microsoft/TypeScript/blob/8c62e08448e0ec76203bd519dd39608dbcb31705/src/compiler/transformers/classFields.ts#L2720
                        if let PropName::Computed(computed) = &mut prop.key {
                            if self.key_needs_temp_var(&computed.expr, ctx) {
                                // When `remove_class_fields_without_initializer` is true, the
                                // property without initializer would be removed in
                                // the `transform_class_on_exit`. We need to make sure the computed
                                // key keeps and is evaluated in the same order as the original
                                // class field in static block.
                                computed_key_assignments.push(*computed.expr.take());
                            }
                        }
                    }
                }
                ClassMember::Method(method) => {
                    if method.kind == MethodKind::Method && Self::is_constructor_key(&method.key) {
                        constructor = Some(idx);
                    } else {
                        Self::convert_computed_key(&mut method.key, &mut computed_key_assignments);
                    }
                }
                ClassMember::Constructor(ctor) => {
                    constructor = Some(idx);
                }
                ClassMember::AutoAccessor(accessor) => {
                    if let Key::Public(ref mut prop_name) = accessor.key {
                        Self::convert_computed_key(prop_name, &mut computed_key_assignments);
                    }
                }
                _ => (),
            }
        }

        let computed_key_assignment_static_block =
            (!computed_key_assignments.is_empty()).then(|| {
                let sequence_expression = if computed_key_assignments.len() == 1 {
                    computed_key_assignments.pop().unwrap()
                } else {
                    Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: computed_key_assignments.into_iter().map(Box::new).collect(),
                    })
                };
                let statement = Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(sequence_expression),
                });
                Self::create_class_static_block(vec![statement])
            });

        if let Some(constructor_idx) = constructor {
            let constructor_body_statements = match &mut class.body[constructor_idx] {
                ClassMember::Constructor(ctor) => {
                    let params = &ctor.params;
                    let params_assignment = Self::convert_constructor_params(params, ctx);
                    property_assignments.splice(0..0, params_assignment);

                    ctor.body.as_mut().map(|b| &mut b.stmts)
                }
                ClassMember::Method(method) => {
                    let params = &method.function.params;
                    let params_assignment =
                        Self::convert_constructor_params_from_function_params(params, ctx);
                    property_assignments.splice(0..0, params_assignment);

                    method.function.body.as_mut().map(|b| &mut b.stmts)
                }
                _ => None,
            };

            // Exit if there are no property and parameter assignments
            if !property_assignments.is_empty() {
                if let Some(constructor_body_statements) = constructor_body_statements {
                    let super_call_position =
                        Self::get_super_call_position(constructor_body_statements);

                    // Insert the assignments after the `super()` call
                    constructor_body_statements.splice(
                        super_call_position..super_call_position,
                        property_assignments,
                    );
                }
            }

            // Insert the static block after the constructor if there is a constructor
            if let Some(element) = computed_key_assignment_static_block {
                class.body.insert(0, element);
            }
        } else if !property_assignments.is_empty() {
            // If there is no constructor, we need to create a default constructor
            // that initializes the public fields
            let ctor = Self::create_class_constructor(
                property_assignments,
                class.super_class.is_some(),
                ctx,
            );

            // Insert the static block at the beginning of the class body if there is no
            // constructor
            if let Some(element) = computed_key_assignment_static_block {
                class.body.splice(0..0, [ctor, element]);
            } else {
                // TODO(improve-on-babel): Could push constructor onto end of elements, instead
                // of inserting as first
                class.body.insert(0, ctor);
            }
        } else if let Some(element) = computed_key_assignment_static_block {
            class.body.insert(0, element);
        }
    }

    pub(super) fn transform_class_on_exit(&self, class: &mut Class, _ctx: &mut TraverseCtx<'a>) {
        if !self.remove_class_fields_without_initializer {
            return;
        }

        class.body.retain(|element| {
            if let ClassMember::ClassProp(prop) = element {
                // Note: Private fields are separate ClassMember::PrivateProp, not ClassProp
                if prop.value.is_none() {
                    return false;
                }
            }
            true
        });
    }

    /// Transform constructor parameters that include modifier to `this`
    /// assignments and insert them after the super call in the constructor
    /// body.
    ///
    /// Input:
    /// ```ts
    /// class C {
    ///   constructor(public x, private y) {}
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// class C {
    ///  constructor(x, y) {
    ///   this.x = x;
    ///   this.y = y;
    /// }
    /// ```
    pub(super) fn transform_class_constructor(method: &mut ClassMethod, ctx: &mut TraverseCtx<'a>) {
        if method.kind != MethodKind::Method || !Self::is_constructor_key(&method.key) {
            return;
        }

        if method.function.body.is_none() {
            return;
        }

        let params = &method.function.params;
        let assignments =
            Self::convert_constructor_params_from_function_params(params, ctx).collect::<Vec<_>>();

        let constructor_body_statements = &mut method.function.body.as_mut().unwrap().stmts;
        let super_call_position = Self::get_super_call_position(constructor_body_statements);

        // Insert the assignments after the `super()` call
        constructor_body_statements.splice(super_call_position..super_call_position, assignments);
    }

    /// Check if a property key is the constructor identifier
    fn is_constructor_key(key: &PropName) -> bool {
        matches!(key, PropName::Ident(ident) if &*ident.sym == "constructor")
    }

    /// Convert property definition to `this` assignment in constructor.
    ///
    /// * Computed key: `class C { [x()] = 1; }` -> `let _x; class C { static {
    ///   _x = x(); } constructor() { this[_x] = 1; } }`
    /// * Static key: `class C { x = 1; }` -> `class C { constructor() { this.x
    ///   = 1; } }`
    ///
    /// Returns an assignment statement which would be inserted in the
    /// constructor body.
    fn convert_property_definition(
        &self,
        key: &mut PropName,
        value: Expr,
        computed_key_assignments: &mut Vec<Expr>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Stmt {
        let member = match key {
            PropName::Ident(ident) => Self::create_this_property_access(ident.sym.clone()),
            PropName::Computed(computed) => {
                let key_expr = &mut computed.expr;
                // Note: Key can also be static `StringLiteral` or `NumericLiteral`.
                // `class C { 'x' = true; 123 = false; }`
                // No temp var is created for these.
                let new_key = if self.key_needs_temp_var(key_expr, ctx) {
                    let (assignment, ident) =
                        self.create_computed_key_temp_var(*key_expr.take(), ctx);
                    computed_key_assignments.push(assignment);
                    ident
                } else {
                    *key_expr.take()
                };

                MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                    prop: MemberProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: Box::new(new_key),
                    }),
                }
            }
            PropName::Str(str_lit) => MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                prop: MemberProp::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Lit(Lit::Str(str_lit.clone()))),
                }),
            },
            PropName::Num(num_lit) => MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                prop: MemberProp::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Lit(Lit::Num(num_lit.clone()))),
                }),
            },
            PropName::BigInt(bigint_lit) => MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                prop: MemberProp::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Lit(Lit::BigInt(bigint_lit.clone()))),
                }),
            },
        };

        let target = SimpleAssignTarget::Member(MemberExpr::from(member));
        Self::create_assignment(target, value)
    }

    /// Find the position of the `super()` call in the constructor body,
    /// otherwise return 0.
    ///
    /// Don't need to handle nested `super()` call because `TypeScript` doesn't
    /// allow it.
    pub fn get_super_call_position(statements: &[Stmt]) -> usize {
        // Find the position of the `super()` call in the constructor body.
        // Don't need to handle nested `super()` call because `TypeScript` doesn't allow
        // it.
        statements
            .iter()
            .position(|stmt| {
                matches!(stmt, Stmt::Expr(ExprStmt { expr, .. })
                        if matches!(&**expr, Expr::Call(CallExpr { callee: Callee::Super(_), .. })))
            })
            .map_or(0, |pos| pos + 1)
    }

    /// Convert computed key to sequence expression if there are assignments.
    ///
    /// Input:
    /// ```ts
    /// class C {
    ///   [x()] = 1;
    ///   [y()]() {}
    ///   [x()] = 2;
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let _x, _x2;
    /// class C {
    ///   constructor() {
    ///     this[_x] = 1;
    ///     this[_x2] = 2;
    ///   }
    ///   static {
    ///     _x2 = x();
    ///   }
    ///   [(_x = x(), y())]() {}
    /// }
    /// ```
    ///
    /// So that computed key keeps running in the same order as the original
    /// class field.
    #[inline]
    fn convert_computed_key(key: &mut PropName, assignments: &mut Vec<Expr>) {
        if assignments.is_empty() {
            return;
        }
        if let PropName::Computed(computed) = key {
            // If the key is already an expression, we need to create a new expression
            // sequence to insert the assignments into.
            let original_key = computed.expr.take();
            let mut exprs = assignments.drain(..).map(Box::new).collect::<Vec<_>>();
            exprs.push(original_key);
            let new_key = Expr::Seq(SeqExpr {
                span: DUMMY_SP,
                exprs,
            });
            computed.expr = Box::new(new_key);
        }
    }

    /// Convert constructor parameters that include modifier to `this`
    /// assignments
    pub(super) fn convert_constructor_params(
        params: &'a [ParamOrTsParamProp],
        _ctx: &mut TraverseCtx<'a>,
    ) -> impl Iterator<Item = Stmt> + 'a {
        params
            .iter()
            .filter_map(|param| {
                if let ParamOrTsParamProp::TsParamProp(ts_param) = param {
                    // TypeScript parameter property
                    match &ts_param.param {
                        TsParamPropParam::Ident(ident) => Some(&ident.id),
                        TsParamPropParam::Assign(assign) => {
                            if let Pat::Ident(ident) = assign.left.as_ref() {
                                Some(&ident.id)
                            } else {
                                None
                            }
                        }
                    }
                } else {
                    None
                }
            })
            .map(|id| {
                let target = Self::create_this_property_assignment(id.sym.clone());
                let value = Expr::Ident(id.clone());
                Self::create_assignment(target, value)
            })
    }

    /// Convert constructor parameters from function params that include
    /// modifier to `this` assignments (for use with ClassMethod constructor)
    fn convert_constructor_params_from_function_params(
        _params: &[Param],
        _ctx: &mut TraverseCtx<'a>,
    ) -> impl Iterator<Item = Stmt> + 'a {
        // In SWC, ClassMethod constructors don't have TypeScript parameter properties
        // in their params. Those are only in Constructor nodes via ParamOrTsParamProp.
        // So this method returns an empty iterator.
        std::iter::empty()
    }

    /// Create `a.b = value`
    fn create_assignment(target: SimpleAssignTarget, value: Expr) -> Stmt {
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left: AssignTarget::Simple(target),
                right: Box::new(value),
            })),
        })
    }

    /// Create `static { body }`
    #[inline]
    fn create_class_static_block(body: Vec<Stmt>) -> ClassMember {
        ClassMember::StaticBlock(StaticBlock {
            span: DUMMY_SP,
            body: BlockStmt {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                stmts: body,
            },
        })
    }

    /// Create `this.property`
    fn create_this_property_access(property: swc_atoms::Atom) -> MemberExpr {
        MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
            prop: MemberProp::Ident(IdentName::new(property, DUMMY_SP)),
        }
    }

    /// Create `this.property` as assignment target
    fn create_this_property_assignment(property: swc_atoms::Atom) -> SimpleAssignTarget {
        SimpleAssignTarget::Member(MemberExpr::from(Self::create_this_property_access(
            property,
        )))
    }

    /// Create a default constructor for the class
    /// * With super class: `constructor(..._args) { super(..._args); statements
    ///   }`
    /// * Without super class: `constructor() { statements }`
    fn create_class_constructor(
        statements: Vec<Stmt>,
        has_super_class: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> ClassMember {
        let (params, body_stmts) = if has_super_class {
            // TODO: Generate unique identifier for args
            // For now, use a simple implementation without proper uid generation
            let rest_pat = Pat::Rest(RestPat {
                span: DUMMY_SP,
                dot3_token: DUMMY_SP,
                arg: Box::new(Pat::Ident(BindingIdent {
                    id: Ident::new("_args".into(), DUMMY_SP, SyntaxContext::empty()),
                    type_ann: None,
                })),
                type_ann: None,
            });

            let params = vec![ParamOrTsParamProp::Param(Param {
                span: DUMMY_SP,
                decorators: vec![],
                pat: rest_pat,
            })];

            let super_call = Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    callee: Callee::Super(Super { span: DUMMY_SP }),
                    args: vec![ExprOrSpread {
                        spread: Some(DUMMY_SP),
                        expr: Box::new(Expr::Ident(Ident::new(
                            "_args".into(),
                            DUMMY_SP,
                            SyntaxContext::empty(),
                        ))),
                    }],
                    type_args: None,
                })),
            });

            let mut body_stmts = vec![super_call];
            body_stmts.extend(statements);
            (params, body_stmts)
        } else {
            (vec![], statements)
        };

        ClassMember::Constructor(Constructor {
            span: DUMMY_SP,
            ctxt: Default::default(),
            key: PropName::Ident(IdentName::new("constructor".into(), DUMMY_SP)),
            params,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                stmts: body_stmts,
            }),
            accessibility: None,
            is_optional: false,
        })
    }

    /// Check if temp var is required for `key`.
    ///
    /// `this` does not have side effects, but in this context, it needs a temp
    /// var anyway, because `this` in computed key and `this` within class
    /// constructor resolve to different `this` bindings. So we need to
    /// create a temp var outside of the class to get the correct `this`.
    /// `class C { [this] = 1; }`
    /// -> `let _this; _this = this; class C { constructor() { this[_this] = 1;
    /// } }`
    fn key_needs_temp_var(&self, key: &Expr, _ctx: &TraverseCtx) -> bool {
        match key {
            // Literals cannot have side effects.
            Expr::Lit(_) => false,
            // Template literal cannot have side effects if it has no expressions.
            Expr::Tpl(tpl) => !tpl.exprs.is_empty(),
            // Identifiers can have side effects if unbound or mutated
            // For now, assume they need temp vars (conservative approach)
            // TODO: Implement proper scoping analysis
            Expr::Ident(_) => true,
            // Treat any other expression as possibly having side effects
            _ => true,
        }
    }

    /// Create `let _x;` statement and insert it.
    /// Return `_x = x()` assignment, and `_x` identifier referencing same temp
    /// var.
    fn create_computed_key_temp_var(&self, key: Expr, ctx: &mut TraverseCtx<'a>) -> (Expr, Expr) {
        // TODO: Generate unique identifier properly
        // For now, use a simple implementation
        let temp_name = swc_atoms::Atom::from("_key");
        let temp_ident = Ident::new(temp_name.clone(), DUMMY_SP, SyntaxContext::empty());

        // Create assignment expression: _key = key
        let assignment = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: temp_ident.clone(),
                type_ann: None,
            })),
            right: Box::new(key),
        });

        let ident = Expr::Ident(temp_ident);

        (assignment, ident)
    }
}
