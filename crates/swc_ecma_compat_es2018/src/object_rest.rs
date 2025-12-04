use std::{collections::VecDeque, mem};

use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, helper_expr, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{alias_if_required, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use super::object_rest_spread::Config;

/// Pending rest pattern to be processed at consumption point.
struct PendingRest {
    /// For nested rest: the temp identifier that replaced the pattern.
    /// For top-level rest: None (caller provides source).
    temp: Option<Ident>,
    /// The object pattern with rest removed.
    props_pat: ObjectPat,
    /// Keys to exclude in _objectWithoutProperties call.
    keys: Vec<PropName>,
    /// The rest binding pattern.
    rest_pat: Pat,
}

/// Deferred array pattern to be destructured after object rest is processed.
/// This ensures correct evaluation order when array elements reference
/// variables defined by earlier object rest patterns.
struct DeferredArrayPat {
    /// The temp identifier that captured the remaining elements via `..._rest`.
    temp: Ident,
    /// The array pattern to destructure from temp.
    pat: ArrayPat,
}

/// Object rest pattern transformer.
///
/// Uses post-order traversal: children bubble up data to parents via
/// pending_rest. Consumption points (VarDecl, Function, etc.) flush
/// pending_rest to generate the final output.
#[derive(Default)]
pub(super) struct ObjectRest {
    pub config: Config,
    /// Pending variable declarations to insert after statement.
    vars: Vec<VarDeclarator>,
    /// Pending rest patterns to process.
    pending_rest: Vec<PendingRest>,
    /// Computed key declarations to insert before destructuring.
    computed_key_decls: Vec<VarDeclarator>,
    /// Deferred array patterns to process after object rest.
    /// Used to ensure correct evaluation order for patterns
    /// like `[{ ...a }, b = a]`.
    deferred_array_pats: VecDeque<DeferredArrayPat>,
}

impl ObjectRest {
    pub fn new(config: Config) -> Self {
        ObjectRest {
            config,
            ..Default::default()
        }
    }
}

/// Fast-path visitor to check if a node contains object rest patterns.
#[derive(Default)]
struct RestVisitor {
    found: bool,
}

impl Visit for RestVisitor {
    noop_visit_type!(fail);

    fn visit_object_pat_prop(&mut self, prop: &ObjectPatProp) {
        match prop {
            ObjectPatProp::Rest(..) => self.found = true,
            _ => prop.visit_children_with(self),
        }
    }
}

impl Check for RestVisitor {
    fn should_handle(&self) -> bool {
        self.found
    }
}

#[fast_path(RestVisitor)]
impl VisitMut for ObjectRest {
    noop_visit_mut_type!(fail);

    // ========================================
    // Pattern handlers - add to pending_rest
    // ========================================

    fn visit_mut_object_pat(&mut self, obj: &mut ObjectPat) {
        // Post-order: visit children first
        obj.visit_mut_children_with(self);

        // Check and extract rest element (JS requires rest to be the last element)
        let arg = match obj.props.pop() {
            Some(ObjectPatProp::Rest(RestPat { arg, .. })) => arg,
            Some(prop) => {
                obj.props.push(prop);
                return;
            }
            None => return,
        };

        // Pre-evaluate impure computed keys into temp variables
        for prop in &mut obj.props {
            if let ObjectPatProp::KeyValue(kv) = prop {
                if let PropName::Computed(computed) = &mut kv.key {
                    if !is_pure_expr(&computed.expr) {
                        let temp = private_ident!("_key");
                        self.computed_key_decls.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: temp.clone().into(),
                            init: Some(computed.expr.take()),
                            definite: false,
                        });
                        computed.expr = Box::new(temp.into());
                    }
                }
            }
        }

        // Collect keys to exclude
        let keys: Vec<PropName> = obj
            .props
            .iter()
            .filter_map(|p| match p {
                ObjectPatProp::KeyValue(kv) => Some(kv.key.clone()),
                ObjectPatProp::Assign(a) => Some(PropName::Ident(a.key.clone().into())),
                ObjectPatProp::Rest(_) => None,
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            })
            .collect();

        // Push to pending_rest (temp will be set by parent if nested)
        self.pending_rest.push(PendingRest {
            temp: None,
            props_pat: obj.clone(),
            keys,
            rest_pat: *arg,
        });
    }

    fn visit_mut_key_value_pat_prop(&mut self, kv: &mut KeyValuePatProp) {
        // Visit computed key expression (may contain arrow functions or assignments)
        if let PropName::Computed(computed) = &mut kv.key {
            computed.expr.visit_mut_with(self);
        }

        let prev_len = self.pending_rest.len();

        // Visit value pattern
        kv.value.visit_mut_with(self);

        // If new pending_rest was added, replace value with temp
        if self.pending_rest.len() > prev_len {
            if let Some(pending) = self.pending_rest.last_mut() {
                if pending.temp.is_none() {
                    let temp = private_ident!("_ref");
                    pending.temp = Some(temp.clone());

                    // If value has a default (Pat::Assign), preserve it
                    // e.g., { x: { a, ...b } = d } -> { x: _ref = d }
                    if let Pat::Assign(assign_pat) = kv.value.as_mut() {
                        assign_pat.left = Box::new(temp.into());
                    } else {
                        *kv.value = temp.into();
                    }
                }
            }
        }
    }

    fn visit_mut_array_pat(&mut self, arr: &mut ArrayPat) {
        let mut i = 0;
        while i < arr.elems.len() {
            let Some(pat) = arr.elems[i].as_mut() else {
                i += 1;
                continue;
            };

            let prev_len = self.pending_rest.len();
            pat.visit_mut_with(self);

            // If new pending_rest was added (element contains object rest)
            if self.pending_rest.len() > prev_len {
                if let Some(pending) = self.pending_rest.last_mut() {
                    if pending.temp.is_none() {
                        let temp = private_ident!("_ref");
                        pending.temp = Some(temp.clone());

                        // If element has a default (Pat::Assign), preserve it
                        // e.g., [{ a, ...b } = d] -> [_ref = d]
                        if let Some(Pat::Assign(assign_pat)) = arr.elems[i].as_mut() {
                            assign_pat.left = Box::new(temp.into());
                        } else {
                            arr.elems[i] = Some(temp.into());
                        }
                    }
                }

                // If there are subsequent elements, capture them with array rest
                // to ensure correct evaluation order.
                // e.g., [{ ...a }, b = a] -> [_ref, ..._rest], then [b = a] = _rest
                if i + 1 < arr.elems.len() {
                    let tail_ref = private_ident!("_rest");

                    // Collect remaining elements
                    let remaining: Vec<_> = arr.elems.drain(i + 1..).collect();

                    // Add array rest pattern to capture them
                    arr.elems.push(Some(Pat::Rest(RestPat {
                        span: DUMMY_SP,
                        arg: Box::new(tail_ref.clone().into()),
                        dot3_token: DUMMY_SP,
                        type_ann: None,
                    })));

                    // Store deferred pattern to be processed after object rest
                    self.deferred_array_pats.push_back(DeferredArrayPat {
                        temp: tail_ref,
                        pat: ArrayPat {
                            span: DUMMY_SP,
                            elems: remaining,
                            optional: false,
                            type_ann: None,
                        },
                    });
                }

                // After splitting, we're done with this array
                return;
            }

            i += 1;
        }
    }

    // ========================================
    // Consumption points - flush pending_rest
    // ========================================

    fn visit_mut_var_decl(&mut self, decl: &mut VarDecl) {
        let mut new_decls = Vec::with_capacity(decl.decls.len());

        for mut declarator in decl.decls.take() {
            // 1. Visit init first (RHS before LHS semantics)
            if let Some(init) = &mut declarator.init {
                init.visit_mut_with(self);
            }

            // 2. Take init for processing
            let Some(init) = declarator.init.take() else {
                new_decls.push(declarator);
                continue;
            };

            // 3. Visit pattern (adds to pending_rest if has rest)
            declarator.name.visit_mut_with(self);

            // 4. Check if pattern has rest
            if self.pending_rest.is_empty() {
                declarator.init = Some(init);
                new_decls.push(declarator);
                self.computed_key_decls.clear();
                continue;
            }

            // 5. Has rest - create temp for init if needed
            let (ref_ident, aliased) = alias_if_required(&init, "_ref");

            let destructure_init = if aliased {
                // Need temp variable for complex expression
                new_decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ref_ident.clone().into(),
                    init: Some(init),
                    definite: false,
                });
                Box::new(ref_ident.clone().into())
            } else {
                init
            };

            // 6. Insert computed key declarations (after source temp)
            new_decls.append(&mut self.computed_key_decls);

            // 7. Destructure the prepared pattern
            new_decls.push(VarDeclarator {
                span: declarator.span,
                name: declarator.name,
                init: Some(destructure_init),
                definite: false,
            });

            // 8. Flush pending rest
            self.flush_pending_rest_decls(&mut new_decls, &ref_ident);
        }

        decl.decls = new_decls;
    }

    fn visit_mut_function(&mut self, func: &mut Function) {
        let Some(body) = &mut func.body else {
            return;
        };

        // Visit children
        body.visit_mut_with(self);

        let mut decls = Vec::new();

        for mut param in func.params.take() {
            // Visit pattern
            param.pat.visit_mut_with(self);

            if self.pending_rest.is_empty() {
                func.params.push(param);
                self.computed_key_decls.clear();
                continue;
            }

            // Has rest - replace param with temp
            let ref_ident = private_ident!("_param");

            // Extract default value if param is AssignPat
            // e.g., `{ a, ...b } = defaultValue` -> keep defaultValue on temp param
            //
            // NOTE: In the SWC AST, both function parameter defaults (`function f(x = 1)`)
            // and destructuring defaults (`let {a = 1} = obj`) use `Pat::Assign`.
            // TypeScript's AST distinguishes these, which could simplify this logic.
            let (destructure_pat, default_value) = match param.pat {
                Pat::Assign(AssignPat { left, right, .. }) => (*left, Some(right)),
                pat => (pat, None),
            };

            // Insert computed key declarations first
            decls.append(&mut self.computed_key_decls);

            // Destructure the prepared pattern (without default value)
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: destructure_pat,
                init: Some(Box::new(ref_ident.clone().into())),
                definite: false,
            });

            // Flush pending rest
            self.flush_pending_rest_decls(&mut decls, &ref_ident);

            // Build new param with default value if present
            let new_param_pat = if let Some(default_expr) = default_value {
                Pat::Assign(AssignPat {
                    span: DUMMY_SP,
                    left: Box::new(ref_ident.into()),
                    right: default_expr,
                })
            } else {
                ref_ident.into()
            };

            func.params.push(Param {
                pat: new_param_pat,
                ..param
            });
        }

        // Insert declarations at start of body
        if !decls.is_empty() {
            let stmt: Stmt = VarDecl {
                decls,
                ..Default::default()
            }
            .into();
            body.stmts.insert(0, stmt);
        }
    }

    fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
        // Visit children
        arrow.body.visit_mut_with(self);

        let mut decls = Vec::new();
        for mut param in arrow.params.take() {
            // Visit pattern
            param.visit_mut_with(self);

            if self.pending_rest.is_empty() {
                arrow.params.push(param);
                self.computed_key_decls.clear();
                continue;
            }

            // Has rest - replace param with temp
            let ref_ident = private_ident!("_param");

            // Extract default value if param is AssignPat
            let (destructure_pat, default_value) = match param {
                Pat::Assign(AssignPat { left, right, .. }) => (*left, Some(right)),
                pat => (pat, None),
            };

            // Insert computed key declarations first
            decls.append(&mut self.computed_key_decls);

            // Destructure the prepared pattern (without default value)
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: destructure_pat,
                init: Some(Box::new(ref_ident.clone().into())),
                definite: false,
            });

            // Flush pending rest
            self.flush_pending_rest_decls(&mut decls, &ref_ident);

            // Build new param with default value if present
            let new_param_pat: Pat = if let Some(default_expr) = default_value {
                Pat::Assign(AssignPat {
                    span: DUMMY_SP,
                    left: Box::new(ref_ident.into()),
                    right: default_expr,
                })
            } else {
                ref_ident.into()
            };

            arrow.params.push(new_param_pat);
        }

        // Insert declarations into body
        if !decls.is_empty() {
            let stmt: Stmt = VarDecl {
                decls,
                ..Default::default()
            }
            .into();

            match &mut *arrow.body {
                BlockStmtOrExpr::BlockStmt(block) => {
                    block.stmts.insert(0, stmt);
                }
                BlockStmtOrExpr::Expr(expr) => {
                    arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                        stmts: vec![
                            stmt,
                            ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(expr.take()),
                            }
                            .into(),
                        ],
                        ..Default::default()
                    }));
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            }
        }
    }

    fn visit_mut_constructor(&mut self, cons: &mut Constructor) {
        // Visit children
        cons.body.visit_mut_children_with(self);

        let mut decls = Vec::new();
        for param in cons.params.take() {
            match param {
                ParamOrTsParamProp::Param(mut param) => {
                    // Visit pattern
                    param.pat.visit_mut_with(self);

                    if self.pending_rest.is_empty() {
                        cons.params.push(ParamOrTsParamProp::Param(param));
                        self.computed_key_decls.clear();
                        continue;
                    }

                    // Has rest - replace param with temp
                    let ref_ident = private_ident!("_param");

                    // Extract default value if param is AssignPat
                    let (destructure_pat, default_value) = match param.pat {
                        Pat::Assign(AssignPat { left, right, .. }) => (*left, Some(right)),
                        pat => (pat, None),
                    };

                    // Insert computed key declarations first
                    decls.append(&mut self.computed_key_decls);

                    // Destructure the prepared pattern (without default value)
                    decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: destructure_pat,
                        init: Some(Box::new(ref_ident.clone().into())),
                        definite: false,
                    });

                    // Flush pending rest
                    self.flush_pending_rest_decls(&mut decls, &ref_ident);

                    // Build new param with default value if present
                    let new_param_pat = if let Some(default_expr) = default_value {
                        Pat::Assign(AssignPat {
                            span: DUMMY_SP,
                            left: Box::new(ref_ident.into()),
                            right: default_expr,
                        })
                    } else {
                        ref_ident.into()
                    };

                    cons.params.push(ParamOrTsParamProp::Param(Param {
                        pat: new_param_pat,
                        ..param
                    }));
                }
                ParamOrTsParamProp::TsParamProp(ts_param) => {
                    cons.params.push(ParamOrTsParamProp::TsParamProp(ts_param));
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            }
        }

        // Insert declarations at start of body
        if let Some(body) = &mut cons.body {
            if !decls.is_empty() {
                let stmt: Stmt = VarDecl {
                    decls,
                    ..Default::default()
                }
                .into();
                body.stmts.insert(0, stmt);
            }
        }
    }

    fn visit_mut_catch_clause(&mut self, clause: &mut CatchClause) {
        // Visit body first
        clause.body.visit_mut_with(self);

        let Some(ref mut param) = clause.param else {
            return;
        };

        // Visit pattern
        param.visit_mut_with(self);

        if self.pending_rest.is_empty() {
            self.computed_key_decls.clear();
            return;
        }

        // Has rest - replace param with temp
        let ref_ident = private_ident!("_param");
        let pat = clause.param.take().unwrap();

        clause.param = Some(ref_ident.clone().into());

        // Create declarations
        let mut decls = mem::take(&mut self.computed_key_decls);
        decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: pat,
            init: Some(Box::new(ref_ident.clone().into())),
            definite: false,
        });
        self.flush_pending_rest_decls(&mut decls, &ref_ident);

        // Insert at start of body
        let stmt: Stmt = VarDecl {
            kind: VarDeclKind::Let,
            decls,
            ..Default::default()
        }
        .into();

        clause.body.stmts.insert(0, stmt);
    }

    fn visit_mut_for_in_stmt(&mut self, stmt: &mut ForInStmt) {
        stmt.right.visit_mut_with(self);
        stmt.body.visit_mut_with(self);

        self.transform_for_loop(&mut stmt.left, &mut stmt.body);
    }

    fn visit_mut_for_of_stmt(&mut self, stmt: &mut ForOfStmt) {
        stmt.right.visit_mut_with(self);
        stmt.body.visit_mut_with(self);

        self.transform_for_loop(&mut stmt.left, &mut stmt.body);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        // Check if this is an assignment expression with pattern
        let Expr::Assign(AssignExpr {
            span,
            left: AssignTarget::Pat(pat),
            op: op!("="),
            right,
        }) = expr
        else {
            // Not a pattern assignment, visit children normally
            expr.visit_mut_children_with(self);
            return;
        };

        // 1. Visit RHS first (RHS before LHS semantics)
        right.visit_mut_with(self);

        // 2. Visit LHS pattern
        let mut inner_pat: Pat = pat.take().into();
        inner_pat.visit_mut_with(self);

        // 3. Check if has rest
        if self.pending_rest.is_empty() {
            *pat = pat_to_assign_target_pat(inner_pat);
            self.computed_key_decls.clear();
            return;
        }

        // 4. Has rest - create temp for RHS if needed
        let (ref_ident, aliased) = alias_if_required(right, "_ref");

        // 5. Build sequence expression
        let mut exprs: Vec<Box<Expr>> = Vec::new();

        if aliased {
            // Declare the temp var
            self.vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: ref_ident.clone().into(),
                init: None,
                definite: false,
            });

            // _ref = source
            exprs.push(Box::new(
                AssignExpr {
                    span: DUMMY_SP,
                    left: ref_ident.clone().into(),
                    op: op!("="),
                    right: right.take(),
                }
                .into(),
            ));
        }

        // Insert computed key assignments
        for decl in self.computed_key_decls.drain(..) {
            if let Some(init) = decl.init {
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: decl.name.clone(),
                    init: None,
                    definite: false,
                });
                if let Pat::Ident(ident) = decl.name {
                    exprs.push(Box::new(
                        AssignExpr {
                            span: DUMMY_SP,
                            left: ident.id.into(),
                            op: op!("="),
                            right: init,
                        }
                        .into(),
                    ));
                }
            }
        }

        // Destructure the prepared pattern
        exprs.push(Box::new(
            AssignExpr {
                span: DUMMY_SP,
                left: AssignTarget::Pat(pat_to_assign_target_pat(inner_pat)),
                op: op!("="),
                right: Box::new(ref_ident.clone().into()),
            }
            .into(),
        ));

        // Flush pending rest as expressions
        self.flush_pending_rest_exprs(&mut exprs, &ref_ident);

        // Return original value
        exprs.push(Box::new(ref_ident.into()));

        *expr = SeqExpr { span: *span, exprs }.into();
    }

    // ========================================
    // Statement/module item handlers
    // ========================================

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let mut new_stmts = Vec::with_capacity(stmts.len());

        for stmt in stmts.drain(..) {
            let mut stmt = stmt;
            stmt.visit_mut_with(self);
            new_stmts.push(stmt);

            // Insert var declarations after current
            if !self.vars.is_empty() {
                new_stmts.push(
                    VarDecl {
                        decls: mem::take(&mut self.vars),
                        ..Default::default()
                    }
                    .into(),
                );
            }
        }

        *stmts = new_stmts;
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let mut new_items = Vec::with_capacity(items.len());

        for item in items.drain(..) {
            match item {
                ModuleItem::Stmt(stmt) => {
                    let mut stmt = stmt;
                    stmt.visit_mut_with(self);
                    new_items.push(ModuleItem::Stmt(stmt));

                    if !self.vars.is_empty() {
                        new_items.push(ModuleItem::Stmt(
                            VarDecl {
                                decls: mem::take(&mut self.vars),
                                ..Default::default()
                            }
                            .into(),
                        ));
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span,
                    decl: Decl::Var(mut var_decl),
                })) => {
                    // Collect names before transformation (these are the actual exports)
                    let mut exported_names = Vec::new();
                    for decl in &var_decl.decls {
                        collect_idents_from_pat(&decl.name, &mut exported_names);
                    }

                    let var_decl_lens = var_decl.decls.len();

                    var_decl.visit_mut_with(self);

                    // Check if transformation happened
                    if var_decl.decls.len() == var_decl_lens && self.vars.is_empty() {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                            ExportDecl {
                                span,
                                decl: Decl::Var(var_decl),
                            },
                        )));
                        continue;
                    }

                    // Insert var declaration
                    new_items.push(ModuleItem::Stmt((*var_decl).into()));

                    // Insert additional var declarations
                    if !self.vars.is_empty() {
                        new_items.push(ModuleItem::Stmt(
                            VarDecl {
                                decls: mem::take(&mut self.vars),
                                ..Default::default()
                            }
                            .into(),
                        ));
                    }

                    // Export the names
                    if !exported_names.is_empty() {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                            NamedExport {
                                span,
                                specifiers: exported_names
                                    .into_iter()
                                    .map(|id| {
                                        ExportSpecifier::Named(ExportNamedSpecifier {
                                            span: DUMMY_SP,
                                            orig: ModuleExportName::Ident(id),
                                            exported: None,
                                            is_type_only: false,
                                        })
                                    })
                                    .collect(),
                                src: None,
                                type_only: false,
                                with: None,
                            },
                        )));
                    }
                }
                _ => {
                    let mut item = item;
                    item.visit_mut_with(self);
                    new_items.push(item);
                }
            }
        }

        *items = new_items;
    }
}

// ========================================
// Helper methods
// ========================================

impl ObjectRest {
    /// Flush pending rest operations as var declarations.
    fn flush_pending_rest_decls(&mut self, out: &mut Vec<VarDeclarator>, source: &Ident) {
        let mut current_source = source.clone();

        loop {
            // 1. Flush pending_rest
            let pending_items: Vec<_> = self.pending_rest.drain(..).collect();
            for pending in pending_items {
                let temp = pending.temp.as_ref().unwrap_or(&current_source);

                // When temp.is_some(), this is a nested pattern (e.g., `{ x: { a, ...b } }`).
                // The outer pattern assigned the nested value to temp, so we need to
                // destructure the non-rest properties (`{ a }`) from temp before
                // generating the rest call (`...b`).
                // When temp.is_none(), this is a top-level pattern and the non-rest
                // properties are destructured directly by the parent declarator.
                if pending.temp.is_some() {
                    out.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: pending.props_pat.into(),
                        init: Some(Box::new(temp.clone().into())),
                        definite: false,
                    });
                }

                // Generate the rest call
                let rest_call = self.make_rest_call(temp.clone(), &pending.keys);
                out.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: pending.rest_pat,
                    init: Some(Box::new(rest_call)),
                    definite: false,
                });
            }

            // 2. Take one deferred pattern and visit it
            let Some(deferred) = self.deferred_array_pats.pop_front() else {
                break;
            };

            let mut pat: Pat = deferred.pat.into();
            pat.visit_mut_with(self);

            // 3. Output computed keys
            out.append(&mut self.computed_key_decls);

            // 4. Output the declarator
            out.push(VarDeclarator {
                span: DUMMY_SP,
                name: pat,
                init: Some(Box::new(deferred.temp.clone().into())),
                definite: false,
            });

            // 5. Update source for next iteration
            current_source = deferred.temp;
        }
    }

    /// Flush pending rest operations as expressions.
    fn flush_pending_rest_exprs(&mut self, exprs: &mut Vec<Box<Expr>>, source: &Ident) {
        let mut current_source = source.clone();

        loop {
            // 1. Flush pending_rest
            let pending_items: Vec<_> = self.pending_rest.drain(..).collect();
            for pending in pending_items {
                let temp = pending.temp.as_ref().unwrap_or(&current_source);

                // For nested rest, declare temp and destructure the non-rest properties
                if let Some(ref temp_ident) = pending.temp {
                    // Declare the temp variable
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: temp_ident.clone().into(),
                        init: None,
                        definite: false,
                    });

                    exprs.push(Box::new(
                        AssignExpr {
                            span: DUMMY_SP,
                            left: AssignTarget::Pat(AssignTargetPat::Object(pending.props_pat)),
                            op: op!("="),
                            right: Box::new(temp.clone().into()),
                        }
                        .into(),
                    ));
                }

                // Generate the rest call
                let rest_call = self.make_rest_call(temp.clone(), &pending.keys);
                if let Ok(target) = pending.rest_pat.try_into() {
                    exprs.push(Box::new(
                        AssignExpr {
                            span: DUMMY_SP,
                            left: target,
                            op: op!("="),
                            right: Box::new(rest_call),
                        }
                        .into(),
                    ));
                }
            }

            // 2. Take one deferred pattern and visit it
            let Some(deferred) = self.deferred_array_pats.pop_front() else {
                break;
            };

            let mut pat: Pat = deferred.pat.into();
            pat.visit_mut_with(self);

            // 3. Insert computed key assignments
            for decl in self.computed_key_decls.drain(..) {
                if let Some(init) = decl.init {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: decl.name.clone(),
                        init: None,
                        definite: false,
                    });
                    if let Pat::Ident(ident) = decl.name {
                        exprs.push(Box::new(
                            AssignExpr {
                                span: DUMMY_SP,
                                left: ident.id.into(),
                                op: op!("="),
                                right: init,
                            }
                            .into(),
                        ));
                    }
                }
            }

            // 4. Output the assignment expression
            if let Ok(target) = pat.try_into() {
                exprs.push(Box::new(
                    AssignExpr {
                        span: DUMMY_SP,
                        left: target,
                        op: op!("="),
                        right: Box::new(deferred.temp.clone().into()),
                    }
                    .into(),
                ));
            }

            // 5. Update source for next iteration
            current_source = deferred.temp;
        }
    }

    /// Generate rest call: _extends({}, source) if no exclusions,
    /// otherwise _objectWithoutProperties(source, [...keys]).
    fn make_rest_call(&self, source: Ident, excluded: &[PropName]) -> Expr {
        // If no keys to exclude, use _extends({}, source) for efficiency
        if excluded.is_empty() {
            return CallExpr {
                callee: helper!(extends),
                args: vec![ObjectLit::default().as_arg(), source.as_arg()],
                ..Default::default()
            }
            .into();
        }

        let helper = if self.config.no_symbol {
            helper!(object_without_properties_loose)
        } else {
            helper!(object_without_properties)
        };

        let impure_count = excluded
            .iter()
            .filter(|k| matches!(k, PropName::Computed(expr) if !is_lit_str(&expr.expr)))
            .count();

        let keys: Vec<Option<ExprOrSpread>> = excluded
            .iter()
            .map(|key| {
                let key_expr = match key {
                    PropName::Ident(id) => Expr::Lit(Lit::Str(id.sym.clone().into())),
                    PropName::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                    PropName::Num(n) => Expr::Lit(Lit::Str(Str {
                        span: n.span,
                        value: n.value.to_string().into(),
                        raw: None,
                    })),
                    PropName::Computed(c) if impure_count == 1 && !is_lit_str(&c.expr) => {
                        CallExpr {
                            callee: helper!(to_property_key),
                            args: vec![(*c.expr).clone().as_arg()],
                            ..Default::default()
                        }
                        .into()
                    }
                    PropName::Computed(c) => (*c.expr).clone(),
                    PropName::BigInt(b) => Expr::Lit(Lit::Str(Str {
                        span: b.span,
                        value: b.value.to_string().into(),
                        raw: None,
                    })),
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                };
                Some(key_expr.as_arg())
            })
            .collect();

        let mut expr: Expr = ArrayLit {
            elems: keys,
            ..Default::default()
        }
        .into();

        // Optimization: If there is exactly one impure computed key, we can
        // directly call to_property_key on it here, rather than mapping over
        // the array later. This avoids unnecessary array creation and mapping.
        if impure_count > 1 {
            // [].map(to_property_key)
            expr = expr
                .make_member(quote_ident!("map"))
                .as_call(DUMMY_SP, vec![helper_expr!(to_property_key).as_arg()]);
        }

        CallExpr {
            callee: helper,
            args: vec![source.as_arg(), expr.as_arg()],
            ..Default::default()
        }
        .into()
    }

    /// Transform for-in/for-of loop head.
    fn transform_for_loop(&mut self, left: &mut ForHead, body: &mut Box<Stmt>) {
        match left {
            ForHead::VarDecl(var_decl) => {
                debug_assert!(
                    var_decl.decls.len() == 1,
                    "for-in/of loop variable declaration must have exactly one declarator"
                );

                // Visit pattern
                var_decl.decls[0].name.visit_mut_with(self);

                if self.pending_rest.is_empty() {
                    self.computed_key_decls.clear();
                    return;
                }

                let ref_ident = private_ident!("_ref");
                let pat = var_decl.decls[0].name.take();

                var_decl.decls[0].name = ref_ident.clone().into();

                // Create declarations
                let mut decls = mem::take(&mut self.computed_key_decls);
                decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: pat,
                    init: Some(Box::new(ref_ident.clone().into())),
                    definite: false,
                });
                self.flush_pending_rest_decls(&mut decls, &ref_ident);

                // Insert at start of body
                let stmt: Stmt = VarDecl {
                    kind: VarDeclKind::Let,
                    decls,
                    ..Default::default()
                }
                .into();

                match &mut **body {
                    Stmt::Block(block) => {
                        block.stmts.insert(0, stmt);
                    }
                    _ => {
                        *body = Box::new(
                            BlockStmt {
                                stmts: vec![stmt, (**body).take()],
                                ..Default::default()
                            }
                            .into(),
                        );
                    }
                }
            }
            ForHead::Pat(pat) => {
                // Visit pattern
                pat.visit_mut_with(self);

                if self.pending_rest.is_empty() {
                    self.computed_key_decls.clear();
                    return;
                }

                let ref_ident = private_ident!("_ref");

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ref_ident.clone().into(),
                    init: None,
                    definite: false,
                });

                let old_pat = *pat.take();
                **pat = ref_ident.clone().into();

                // Build assignment expressions
                let mut exprs: Vec<Box<Expr>> = Vec::new();

                // Insert computed key assignments
                for decl in self.computed_key_decls.drain(..) {
                    if let Some(init) = decl.init {
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: decl.name.clone(),
                            init: None,
                            definite: false,
                        });
                        if let Pat::Ident(ident) = decl.name {
                            exprs.push(Box::new(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: ident.id.into(),
                                    op: op!("="),
                                    right: init,
                                }
                                .into(),
                            ));
                        }
                    }
                }

                // Destructure the prepared pattern
                if let Ok(target) = old_pat.try_into() {
                    exprs.push(Box::new(
                        AssignExpr {
                            span: DUMMY_SP,
                            left: target,
                            op: op!("="),
                            right: Box::new(ref_ident.clone().into()),
                        }
                        .into(),
                    ));
                }

                // Flush pending rest
                self.flush_pending_rest_exprs(&mut exprs, &ref_ident);

                exprs.push(Box::new(ref_ident.into()));

                let assign_stmt: Stmt = SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                }
                .into_stmt();

                match &mut **body {
                    Stmt::Block(block) => {
                        block.stmts.insert(0, assign_stmt);
                    }
                    _ => {
                        *body = Box::new(
                            BlockStmt {
                                stmts: vec![assign_stmt, (**body).take()],
                                ..Default::default()
                            }
                            .into(),
                        );
                    }
                }
            }
            _ => {}
        }
    }
}

// ========================================
// Utility functions
// ========================================

fn collect_idents_from_pat(pat: &Pat, out: &mut Vec<Ident>) {
    match pat {
        Pat::Ident(id) => out.push(id.id.clone()),
        Pat::Object(obj) => {
            for prop in &obj.props {
                match prop {
                    ObjectPatProp::KeyValue(kv) => collect_idents_from_pat(&kv.value, out),
                    ObjectPatProp::Assign(a) => out.push(a.key.id.clone()),
                    ObjectPatProp::Rest(r) => collect_idents_from_pat(&r.arg, out),
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                }
            }
        }
        Pat::Array(arr) => {
            for elem in arr.elems.iter().flatten() {
                collect_idents_from_pat(elem, out);
            }
        }
        Pat::Rest(r) => collect_idents_from_pat(&r.arg, out),
        Pat::Assign(a) => collect_idents_from_pat(&a.left, out),
        _ => {}
    }
}

fn pat_to_assign_target_pat(pat: Pat) -> AssignTargetPat {
    pat.try_into()
        .unwrap_or_else(|p: Pat| AssignTargetPat::Invalid(Invalid { span: p.span() }))
}

fn is_lit_str(expr: &Expr) -> bool {
    match expr {
        Expr::Lit(Lit::Str(_)) => true,
        Expr::Tpl(tpl) => tpl.exprs.is_empty(),
        _ => false,
    }
}

/// Check if an expression is "pure" (has no side effects).
fn is_pure_expr(expr: &Expr) -> bool {
    match expr {
        Expr::Ident(_) | Expr::Lit(_) => true,
        Expr::Tpl(tpl) => tpl.exprs.is_empty(),
        // Symbol.iterator, Symbol.toStringTag, etc.
        Expr::Member(MemberExpr {
            obj,
            prop: MemberProp::Ident(_),
            ..
        }) => matches!(&**obj, Expr::Ident(i) if &*i.sym == "Symbol"),
        _ => false,
    }
}
